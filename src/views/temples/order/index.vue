<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls">导出</a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'image' && record.image">
          <a-image :preview="true" :src="record.image" style="width: 40px; height: 40px" />
        </template>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <OrderModal @register="registerModal" @success="reload" :isDisabled="isDisabled" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { useListPage } from '/@/hooks/system/useListPage';

  import { useModal } from '/@/components/Modal';
  import { getList, cancel, confirmOrder } from './order.api';
  import { columns, searchFormSchema } from './order.data';
  import { useRoute } from 'vue-router';
  import { fetchDataWithCache } from '/@/utils/dict';
  const checkedKeys = ref<Array<string | number>>([]);
  const [registerModal, { openModal }] = useModal();
  const isDisabled = ref(false);

  const tableId = '4028f8c98a844d8c018a844d8ca40000';
  const url = {
    importExcel: 'api/biz/activity/case/import/',
    list: '/api/online/cgform/api/getData/',
    update: '/online/cgform/api/form/',
    columns: '/online/cgform/api/getColumns/',
    exportXlsUrl: 'api/biz/activity/case/export/',
  };

  url.update = url.update + tableId;
  url.columns = url.columns + tableId;
  const route = useRoute();
  url.importExcel = url.importExcel + route.query.id;

  function initFilter(params) {
    if (params.column === 'createTime') {
      params.column = 'gmt_create';
    }
    console.log(params);
    console.log(route.query);
    if (route.query && route.query.productId) {
      params.product_id = route.query.productId;
    }
    // console.log(useRoute.arguments);
    // return params; //Object.assign(params, { column: "orderNum", order: "asc" });
  }

  const {
    tableContext: [registerTable, { reload, setProps }],
  } = useListPage({
    tableProps: {
      title: '订单列表',
      api: getList,
      columns,
      size: 'small',
      afterFetch: fillData,
      beforeFetch: initFilter,
      formConfig: {
        labelWidth: 80,
        showAdvancedButton: false,
        schemas: searchFormSchema,
        // autoAdvancedCol: 3,
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
      pagination: { pageSize: 20 },
      actionColumn: {
        width: 240,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
      },
    },
  });

  function sort(e) {
    console.log(e);
  }

  async function fillData(list) {
    for (const item of list) {
      const res = await fetchDataWithCache('t_biz_type', item.biz_type_id);
      if (res) item.bizTypeName = res.biz_name;
      const category = await fetchDataWithCache('t_product_category', item.category_id);
      if (category) item.category_name = category.category_name;
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

  /**
   * 操作列定义
   * @param record
   */
  function getTableAction(record) {
    return [
      {
        label: '订单确认',
        ifShow: record.order_status == 0,
        popConfirm: {
          title: '是否确认该订单',
          confirm: handleConfirm.bind(null, record),
        },
      },
      {
        label: '订单取消',
        ifShow: record.order_status == 0,
        popConfirm: {
          title: '是否确认取消该订单,取消以后将无法进行恢复',
          confirm: handleCancel.bind(null, record),
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
      // {
      //   label: '详情',
      //   onClick: handleDetail.bind(null, record),
      // },
      // {
      //   label: '删除',
      //   popConfirm: {
      //     title: '是否确认删除',
      //     confirm: handleDelete.bind(null, record),
      //   },
      // },
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

  async function handleCancel(record) {
    await cancel(record, reload);
  }

  async function handleConfirm(record) {
    await confirmOrder(record, reload);
  }

  const customSearch = ref(false);
  watch(customSearch, () => {
    setProps({ useSearchForm: !unref(customSearch) });
  });
</script>
