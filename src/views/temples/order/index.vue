<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
       
      <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls">导出</a-button> -->
    
      </template>
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
  
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, toRaw, watch, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import DemoModal from './OrderModal.vue';
  import { useMethods } from '/@/hooks/system/useMethods';
  import { getList, deleteProduct, enable, disable, getImportUrl } from './order.api';
  import { columns, searchFormSchema } from './order.data';
  import { useRoute } from 'vue-router';
  import { filterObj } from '/@/utils/common/compUtils';
  import { fetchDataWithCache } from '/@/utils/dict';
  const checkedKeys = ref<Array<string | number>>([]);
  const [registerModal, { openModal }] = useModal();
  const { handleExportXls } = useMethods();
  const isDisabled = ref(false);

  const tableId = '4028f8c98a844d8c018a844d8ca40000';
  const url = {
    importExcel: 'api/biz/activity/case/import/',
    list: '/online/cgform/api/getData/',
    update: '/online/cgform/api/form/',
    columns: '/online/cgform/api/getColumns/',
    exportXlsUrl: 'api/biz/activity/case/export/',
  };

  url.update = url.update + tableId;
  url.columns = url.columns + tableId;
  const route = useRoute();
  url.importExcel = url.importExcel + route.query.id;

  const [registerTable, { reload, setProps }] = useTable({
    title: '订单列表',
    api: getList,
    columns,
    afterFetch: fillData,
    formConfig: {
      //labelWidth: 120,
      schemas: searchFormSchema,
      // autoAdvancedCol: 3,
    },
    // striped: true,
    useSearchForm: true,
    // showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: true },
    canResize: false,
    rowKey: 'id',
    pagination: { pageSize: 20 },
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
        label: '订单确认',
        ifShow: record.enabled == 2,
        popConfirm: {
          title: '是否确认该订单',
          confirm: handleEnable.bind(null, record),
        },
      },
      {
        label: '订单取消',
        ifShow: record.enabled == 1,
        popConfirm: {
          title: '是否确认取消该订单,取消以后将无法进行恢复',
          confirm: handleDisable.bind(null, record),
        },
      },
    ];
  }

  function getDropDownAction(record) {
    return [
      // {
      //   label: '编辑',
      //   onClick: handleEdit.bind(null, record),
      // },
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
      // {
      //   label: '复制',
      //   onClick: handleClone.bind(null, record),
      // },
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

