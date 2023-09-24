<template>
  <div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:import-outlined" @click="handleAdd">添加评委</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <AccountSelectModal rowKey="id" @register="registerModal" @getSelectResult="bindAccount" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getColumns, getList } from '/@/api/common/api';
  import { bindAccount as bind, deleteMonitor } from '../vote.api';
  const [registerModal, { openModal }] = useModal();
  const tableId = '4028f8c98ab5cd05018ab5cd1d740004';
  import AccountSelectModal from './AccountSelectModal.vue';

  const props = defineProps({
    activityId: { type: Number },
  });

  loadColumn();

  const columns = ref<[]>([]);

  const [registerTable, { reload }] = useTable({
    api: loadData,
    columns,
    size: 'small',
    formConfig: {
      showAdvancedButton: false,
      labelWidth: 80,
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
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function initFilter(params) {
    console.log(props.activityId);
    params.activity_id = props.activityId;
  }
  function loadData(params) {
    return getList(tableId, params);
  }

  function handleDelete(record) {
    return deleteMonitor(record.id, reload);
  }

  function bindAccount(options) {
    console.log(options);
    var idArray = options.map(function (item) {
      return item.value;
    });

    // 使用join方法将id数组合并成以逗号分隔的字符串
    var ids = idArray.join(',');
    console.log(ids);
    bind(props.activityId, ids, reload);
  }

  /**
   * 编辑
   */
  function getTableAction(record) {
    return [
      {
        label: '删除',
        disabled: record.status === '完成',
        popConfirm: {
          title: '是否确认删除该评委，删除评委不会影响已有的结果',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }

  function handleAdd() {
    openModal(true);
  }

  function loadColumn() {
    getColumns(tableId).then((res) => {
      columns.value = res.columns;
      console.log(res.columns);
      columns.value.forEach((column) => {
        const { dataIndex } = column;
        if (dataIndex == 'activity_id' || dataIndex == 'account_id') {
          console.log(dataIndex);
          // column.width = 0;
        }
      });
      columns.value = columns.value.concat();
    });
  }
</script>
