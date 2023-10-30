<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-popconfirm title="是否要删除所有作品，删除后将无法进行恢复？" @confirm="handleClickClean">
          <a-button type="warning" preIcon="ant-design:clear-outlined">清除所有作品</a-button>
        </a-popconfirm>
        <!-- <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button> -->
        <a-button type="primary" preIcon="ant-design:import-outlined" @click="handleImport">导入</a-button>
        <a-button type="second" preIcon="ant-design:export-outlined" @click="onExportXls">结果导出</a-button>
        <a-button type="second" preIcon="ant-design:export-outlined" @click="onExportXlsFull">全字段导出</a-button>
        <a-dropdown v-if="checkedKeys.length > 0">
          <template #overlay>
            <a-menu>
              <!-- <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:export-outlined" />
                <span>批量图片导出</span>
              </a-menu-item> -->
            </a-menu>
          </template>
          <a-button>
            <span>批量操作</span>
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
        <a type="primary" preIcon="ant-design:export-outlined" href="https://jiangyan-static.oss-cn-beijing.aliyuncs.com/product_import_template.xlsx"
          >下载导入文件模版</a
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'file_url' && record.file_url">
          <a-image :preview="true" :src="record.file_url" style="width: 80px; height: 80px" />
        </template>
        <template v-if="column.dataIndex == 'target_url' && record.target_url">
          <a-image :preview="true" :src="record.target_url" style="width: 120px; height: 120px" />
        </template>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <JImportModal @register="registerModalJimport" :url="getImportUrl()" @ok="reload" />
  </div>
</template>

<script lang="ts" setup>
  import JImportModal from '/@/components/Form/src/jeecg/components/JImportModal.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getColumns, getList } from '/@/api/common/api';
  import { Api, cleanCase, generateImage } from '../vote.api';
  import { useModal } from '/@/components/Modal';
  import { ref } from 'vue';
  import { useMethods } from '/@/hooks/system/useMethods';
  const [registerModalJimport, { openModal: openModalJimport }] = useModal();
  const tableId = '4028f8c98ab5cd05018ab5cd154b0003';
  const checkedKeys = ref<Array<string | number>>([]);

  const { handleExportXls } = useMethods();

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
    console.log(params);
    params.activity_id = props.activityId;
    if (!params.column) {
      params.column = 'sequence';
      params.order = 'asc';
    }
  }

  function onExportXls() {
    handleExportXls('投票结果导出', '/api/biz/activity/exportXls?activityId=' + props.activityId + '&all=false');
  }

  function onExportXlsFull() {
    handleExportXls('全量导出', '/api/biz/activity/exportXls?activityId=' + props.activityId + '&all=true');
  }

  /**
   * 选择列配置
   */
  const rowSelection = {
    type: 'checkbox',
    columnWidth: 30,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
  };

  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }

  /**
   * 批量删除事件
   */
  function batchHandleDelete() {
    // createConfirm({
    //   iconType: 'warning',
    //   title: '删除',
    //   content: '确定要永久删除吗？删除后将不可恢复！',
    //   onOk: () => batchDelete(toRaw(unref(checkedKeys)).join(','), reload),
    //   onCancel() {},
    // });
  }

  function loadData(params) {
    return getList(tableId, params);
  }

  function handleImport() {
    openModalJimport(true);
  }

  function getImportUrl() {
    return Api.importExcel + props.activityId;
  }

  function handleGenerateImage(record) {
    generateImage(record.id, reload);
  }

  /**
   * 操作列定义
   * @param record
   */
  function getTableAction(record) {
    return [
      {
        label: '图片处理',
        popConfirm: {
          title: '是否确认重新处理，处理完成将覆盖原有结果',
          confirm: handleGenerateImage.bind(null, record),
        },
      },
      {
        label: '编辑',
        popConfirm: {
          title: '是否确认进行下架操作',
          // confirm: handleDisable.bind(null, record),
        },
      },
    ];
  }

  function getDropDownAction(record) {
    return [];
  }

  function loadColumn() {
    getColumns(tableId).then((res) => {
      columns.value = res.columns;
      columns.value.forEach((column) => {
        const { dataIndex } = column;
        column.width = 120;
        if (dataIndex == 'activity_id') {
          column.width = 0;
        } else if (dataIndex == 'sequence') {
          column.width = 70;
        } else if (dataIndex == 'photo_time' || dataIndex == 'city' || column.title.indexOf('推荐') > -1) {
          column.width = 80;
        } else if (dataIndex == 'code') {
          column.width = 90;
        }
      });
      columns.value = columns.value.concat();
    });
  }

  function handleClickClean() {
    cleanCase(props.activityId).then(reload);
  }
</script>
