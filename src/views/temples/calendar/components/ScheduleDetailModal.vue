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
    <ScheduleEditModal rowKey="id" @register="registerModal" />
  </a-spin>
</template>

<script lang="ts" setup>
  //显示具体某一个佛事的详情
  import { useModal } from '/@/components/Modal';
  import ScheduleEditModal from './ScheduleDetailModal.vue';
  import { watch, ref, unref, onMounted } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { getList, deleteTable, assign } from '../schedule.api';
  import { columns } from '../schedule.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal, { openModal }] = useModal();
  // const { prefixCls } = useDesign('j-depart-form-content');
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
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
        label: '启用',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '停用',
        ifShow: record.status == 0,
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '详情',
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
</script>
