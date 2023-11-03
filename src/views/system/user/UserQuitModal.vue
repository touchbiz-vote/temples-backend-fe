<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="离职人员信息" :showOkBtn="false" width="1000px" destroyOnClose>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleRevert">
                <Icon icon="ant-design:redo-outlined" />
                批量取消
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="ant-design:down-outlined" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup name="user-quit-modal">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { recycleColumns } from './user.data';
  import { getQuitList } from './user.api';
  import { useListPage } from '/@/hooks/system/useListPage';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);
  const checkedKeys = ref<Array<string | number>>([]);
  const [registerModal] = useModalInner(() => {
    checkedKeys.value = [];
  });
  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      api: getQuitList,
      columns: recycleColumns,
      rowKey: 'id',
      canResize: false,
      useSearchForm: false,
      actionColumn: {
        width: 120,
      },
    },
  });
  //注册table数据
  const [registerTable, { reload }, { selectedRowKeys, selectedRows }] = tableContext;

  //获取操作栏事件
</script>

<style scoped lang="less">
  :deep(.ant-popover-inner-content) {
    width: 185px !important;
  }
</style>
