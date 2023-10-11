<template>
  <a-spin :spinning="loading">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <TableFormModal @register="registerModal" @success="reload" />
    <OrderSelectModal rowKey="id" @register="registerOrderModal" @getSelectResult="bindTablets" />
  </a-spin>
</template>

<script lang="ts" setup>
  //显示具体某一个佛事的详情
  import { useModal } from '/@/components/Modal';
  import TableFormModal from './TableFormModal.vue';
  import OrderSelectModal from './OrderSelectModal.vue';
  import { watch, ref, unref, onMounted } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { getList, deleteTable, assign } from '../schedule.api';
  import { columns } from '../schedule.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();
  const [registerOrderModal, { openModal: openOrderModal }] = useModal();
  // const { prefixCls } = useDesign('j-depart-form-content');
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
  });
  const loading = ref<boolean>(false);
  // 当前的弹窗数据
  const location = ref<object>({});
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '牌位列表',
      api: getList,
      columns,
      // afterFetch: fillData,
      size: 'small',
      formConfig: {
        showAdvancedButton: false,
        labelWidth: 80,
        // autoAdvancedCol: 3,
      },
      striped: true,
      useSearchForm: false,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      tableSetting: { fullScreen: false },
      rowKey: 'id',
      beforeFetch: initFilter,
      actionColumn: {
        width: 180,
        title: '操作',
        slots: { customRender: 'action' },
      },
    },
  });

  const [registerTable, { reload }] = tableContext;

  function initFilter(params) {
    if (location.value && location.value.id) {
      params.location_id = location.value.id;
    }
  }

  function bindTablets(record, tabletsId) {
    console.log(record);
    assign({ tabletsId: tabletsId, orderId: record.id }, reload);
  }

  /**
   * 编辑事件
   */
  function handleEdit(record) {
    openModal(true, {
      record,
      location: location.value,
      isUpdate: true,
    });
  }

  /**
   * 分配订单到牌位的事件
   */
  function handleSign(record) {
    openOrderModal(true, {
      record,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteTable(record, reload);
  }

  /**
   * 操作列定义
   * @param record
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '分配',
        ifShow: record.status == 0,
        onClick: handleSign.bind(null, record),
      },
      {
        label: '删除',
        ifShow: record.status == 0,
        popConfirm: {
          title: '是否确认删除,删除后将不可恢复',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      location: location.value,
      isUpdate: false,
    });
  }

  onMounted(() => {
    // data 变化，重填表单
    watch(
      () => props.data,
      async () => {
        let record = unref(props.data);
        if (typeof record !== 'object') {
          record = {};
        }
        console.log(record);
        location.value = record;
        reload();
      },
      { deep: true, immediate: true }
    );
    // 更新 父部门 选项
    watch(
      () => props.rootTreeData,
      async () => {
        console.log(props.rootTreeData);
      },
      { deep: true, immediate: true }
    );
  });
</script>
