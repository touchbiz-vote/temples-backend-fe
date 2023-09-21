<template>
  <div>
    <!--自定义查询区域-->
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button>
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
    <!-- <JImportModal @register="registerModalJimport" :url="getImportUrl()" @ok="reload" /> -->
  </div>
</template>

<script lang="ts" setup>
  import JImportModal from '/@/components/Form/src/jeecg/components/JImportModal.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getColumns, getList } from '/@/api/common/api';
  import { Api, cleanCase, generateImage } from './vote.api';
  import { useModal } from '/@/components/Modal';
  import { ref } from 'vue';
  const [registerModalJimport, { openModal: openModalJimport }] = useModal();
  const tableId = '4028f8c98ab5cd05018ab5cd154b0003';
  const checkedKeys = ref<Array<string | number>>([]);

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


  /**
   * 操作列定义
   * @param record
   */
  function getTableAction(record) {
    return [
      {
        label: '删除',
        popConfirm: {
          title: '是否确认重新处理，处理完成将覆盖原有结果',
          // confirm: handleGenerateImage.bind(null, record),
        },
      },
      {
        label: '结束活动',
        popConfirm: {
          title: '是否确认进行下架操作',
          // confirm: handleDisable.bind(null, record),
        },
      },
      {
        label: '启动',
        popConfirm: {
          title: '是否确认进行下架操作',
          // confirm: handleDisable.bind(null, record),
        },
      },
      {
        label: '重置',
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

  // function initColumns() {
  //   //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
  //   //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

  //   var key = this.$route.name + ':colsettings';
  //   let colSettings = Vue.ls.get(key);
  //   if (colSettings == null || colSettings == undefined) {
  //     let allSettingColumns = [];
  //     console.log(this.defColumns);
  //     this.defColumns.forEach(function (item, i, array) {
  //       allSettingColumns.push(item.dataIndex);
  //     });
  //     this.settingColumns = allSettingColumns;
  //     console.log(this.defColumns);
  //     this.columns = this.defColumns;
  //   } else {
  //     this.settingColumns = colSettings;
  //     const cols = this.defColumns.filter((item) => {
  //       if (item.key == 'rowIndex' || item.dataIndex == 'action') {
  //         return true;
  //       }
  //       if (colSettings.includes(item.dataIndex)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //     this.columns = cols;
  //   }
  // };
  // function onColSettingsChange(checkedValues) {
  //   var key = this.$route.name + ':colsettings';
  //   Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000);
  //   this.settingColumns = checkedValues;
  //   const cols = this.columns.filter((item) => {
  //     if (item.key == 'rowIndex' || item.dataIndex == 'action') {
  //       return true;
  //     }
  //     if (this.settingColumns.includes(item.dataIndex)) {
  //       return true;
  //     }
  //     return false;
  //   });
  //   this.columns = cols;
  // };
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
</script>
