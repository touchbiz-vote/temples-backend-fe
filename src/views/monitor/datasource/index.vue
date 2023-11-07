<template>
  <div>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleAdd" style="margin-right: 5px">新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getActions(record)" />
      </template>
    </BasicTable>
    <DataSourceModal @register="registerModal" @success="reload" />
  </div>
</template>
<script lang="ts" name="monitor-datasource" setup>
  import { BasicTable } from '/@/components/Table';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { getDataSourceList, getExportUrl, getImportUrl } from './datasource.api';
  import { columns, searchFormSchema } from './datasource.data';
  import DataSourceModal from './DataSourceModal.vue';
  import { useListPage } from '/@/hooks/system/useListPage';
  const [registerModal] = useModal();

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'quartz-template',
    tableProps: {
      title: '任务列表',
      api: getDataSourceList,
      columns: columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        fieldMapToTime: [['fieldTime', ['beginDate', 'endDate'], 'YYYY-MM-DD HH:mm:ss']],
      },
    },
    exportConfig: {
      name: '数据源列表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
    },
  });

  const [registerTable, { reload }, { selectedRowKeys }] = tableContext;
</script>
