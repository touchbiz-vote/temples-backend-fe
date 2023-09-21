<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getColumns, getList } from '/@/api/common/api';
  const tableId = '4028f8c98ab5cd05018ab5cd1d740004';

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
  });

  function initFilter(params) {
    console.log(props.activityId);
    params.activity_id = props.activityId;
  }
  function loadData(params) {
    return getList(tableId, params);
  }

  function loadColumn() {
    getColumns(tableId).then((res) => {
      columns.value = res.columns;
    });
  }
</script>
