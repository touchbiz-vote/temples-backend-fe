<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <PrintTemplateModal @register="registerModal" @success="reload" :isDisabled="isDisabled" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import PrintTemplateModal from './PrintTemplateModal.vue';
  import { getList, deleteTemplate } from './print.api';
  import { columns, searchFormSchema } from './print.data';
  import { useListPage } from '/@/hooks/system/useListPage';

  const [registerModal, { openModal }] = useModal();
  const isDisabled = ref(false);

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '打印模版列表',
      api: getList,
      columns: columns,
      size: 'default',
      formConfig: {
        autoSubmitOnEnter: true,
        showAdvancedButton: false,
        schemas: searchFormSchema,
        labelWidth: 80,
      },
      striped: true,
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      tableSetting: { fullScreen: true },
      rowKey: 'id',
      actionColumn: {
        width: 160,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      },
    },
  });

  const [registerTable, { reload }] = tableContext;

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
        label: '删除',
        popConfirm: {
          title: '是否确认进行删除操作，删除以后将无法进行恢复',
          confirm: handleDelete.bind(null, record),
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
      //   disabled: record.enabled == 1,
      //   popConfirm: {
      //     title: '是否确认删除',
      //     confirm: handleDelete.bind(null, record),
      //   },
      // },
      {
        label: '复制',
        onClick: handleClone.bind(null, record),
      },
    ];
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

  function handleClone(record) {
    isDisabled.value = false;
    openModal(true, {
      record,
      isClone: true,
    });
  }


  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteTemplate(record, reload);
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
