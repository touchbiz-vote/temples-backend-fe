// eslint-disable-next-line vue/multi-word-component-names
<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'file_url' && record.file_url">
          <a-button key="1" type="primary" :ghost="ghost" size="small" preIcon="ant-design:download" @click="download(record)">下载导入模版</a-button>
        </template>
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
  import { ref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import PrintTemplateModal from './PrintTemplateModal.vue';
  import { getList, deleteTemplate, disable, enabled } from './print.api';
  import { columns, searchFormSchema } from './print.data';
  import { useListPage } from '/@/hooks/system/useListPage';
  //按钮权限问题
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();
  const isDisabled = ref(false);
  const ghost = ref(true);

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

  function download(record) {
    console.log(record.file_url);
    window.open(record.file_url);
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
        ifShow: () => hasPermission('system:print:edit'),
      },
    ];
  }

  function getDropDownAction(record) {
    return [
      {
        label: '启用',
        popConfirm: {
          title: '是否确认进行启用操作，启用后就可以用该模版进行打印操作',
          confirm: handleEnabled.bind(null, record),
        },
        ifShow: () => hasPermission('system:print:enabled'),
      },
      {
        label: '停用',
        popConfirm: {
          title: '是否确认进行停用操作，停用后就无法用该模版进行打印操作',
          confirm: handleDisable.bind(null, record),
        },
        ifShow: () => hasPermission('system:print:disable'),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认进行删除操作，删除以后将无法进行恢复',
          confirm: handleDelete.bind(null, record),
        },
        ifShow: () => hasPermission('system:print:delete'),
      },
      {
        label: '复制',
        onClick: handleClone.bind(null, record),
        ifShow: () => hasPermission('system:print:clone'),
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

  function handleEnabled(record) {
    enabled(record.id).then(() => {
      reload();
    });
  }

  function handleDisable(record) {
    disable(record.id).then(() => {
      reload();
    });
  }
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
