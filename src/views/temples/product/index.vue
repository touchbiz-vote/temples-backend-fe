<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle> </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'cover'">
          <a-image :preview="true" :src="record.cover" style="width: 40px; height: 40px" />
        </template>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <DemoModal @register="registerModal" @success="reload" :isDisabled="isDisabled" />
    <JImportModal @register="registerModalJimport" :url="getImportUrl" online />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, toRaw, watch, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import DemoModal from './ProductModal.vue';
  import JImportModal from '/@/components/Form/src/jeecg/components/JImportModal.vue';
  import { useMethods } from '/@/hooks/system/useMethods';
  import { getList, deleteProduct, enable, disable, getImportUrl } from './product.api';
  import { columns, searchFormSchema } from './product.data';
  import { useRoute } from 'vue-router';
  import { filterObj } from '/@/utils/common/compUtils';
  import { fetchDataWithCache } from '/@/utils/dict';
  const checkedKeys = ref<Array<string | number>>([]);
  const [registerModal, { openModal }] = useModal();
  const [registerModalJimport, { openModal: openModalJimport }] = useModal();
  const { handleExportXls, handleImportXls } = useMethods();
  const isDisabled = ref(false);

  const tableId = '768afa9fde41486cb24d852ea96893d8';
  const url = {
    importExcel: 'api/biz/activity/case/import/',
    list: '/online/cgform/api/getData/',
    update: '/online/cgform/api/form/',
    columns: '/online/cgform/api/getColumns/',
    clean: '/api/biz/activity/case/clean/',
    exportXlsUrl: 'api/biz/activity/case/export/',
  };

  url.update = url.update + tableId;
  url.columns = url.columns + tableId;
  const route = useRoute();
  url.importExcel = url.importExcel + route.query.id;

  const [registerTable, { reload, setProps }] = useTable({
    title: '商品列表',
    api: getList,
    columns,
    afterFetch: fillData,
    formConfig: {
      //labelWidth: 120,
      schemas: searchFormSchema,
      // fieldMapToTime: [['birthday', ['birthday_begin', 'birthday_end'], 'YYYY-MM-DD']],
      // fieldMapToNumber: [['age', ['age_begin', 'age_end']]],
      // autoAdvancedCol: 2,
      actionColOptions: {
        style: { textAlign: 'left' },
      },
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: true },
    canResize: false,
    rowKey: 'id',
    actionColumn: {
      width: 240,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  async function fillData(list) {
    for (const item of list) {
      const res = await fetchDataWithCache('t_biz_type', item.biz_type_id);
      item.bizTypeName = res.biz_name;
      const category = await fetchDataWithCache('t_product_category', item.category_id);
      item.category_name = category.category_name;
    }
    console.log(list); // This will be executed after all the Promises are resolved.
  }
  /**
   * 选择列配置
   */
  const rowSelection = {
    type: 'checkbox',
    columnWidth: 40,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
  };

  function handleImport() {
    openModalJimport(true);
  }

  const exportParams = computed(() => {
    let paramsForm = {};
    if (checkedKeys.value && checkedKeys.value.length > 0) {
      paramsForm['selections'] = checkedKeys.value.join(',');
    }
    return filterObj(paramsForm);
  });
  /**
   * 操作列定义
   * @param record
   */
  function getTableAction(record) {
    return [
      {
        label: '上架',
        ifShow: record.enabled == 2,
        popConfirm: {
          title: '是否确认上架',
          confirm: handleEnable.bind(null, record),
        },
      },
      {
        label: '下架',
        ifShow: record.enabled == 1,
        popConfirm: {
          title: '是否确认进行下架操作',
          confirm: handleDisable.bind(null, record),
        },
      },
    ];
  }

  function getDropDownAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
      {
        label: '复制',
      },
    ];
  }

  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    console.log('checkedKeys------>', checkedKeys);
    checkedKeys.value = selectedRowKeys;
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    isDisabled.value = false;
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * 编辑事件
   */
  function handleEdit(record) {
    isDisabled.value = false;
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 详情页面
   */
  function handleDetail(record) {
    isDisabled.value = true;
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteProduct(record, reload);
  }

  async function handleEnable(record) {
    await enable(record, reload);
  }

  async function handleDisable(record) {
    await disable(record, reload);
  }

  const customSearch = ref(false);
  watch(customSearch, () => {
    setProps({ useSearchForm: !unref(customSearch) });
  });
</script>
<style lang="less" scoped>
  .jeecg-basic-table-form-container {
    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 24px;
      white-space: nowrap;
    }
  }
</style>
