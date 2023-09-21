<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>

<script lang="ts" setup name="ActivityMonitorModal">
  import { watch, ref, unref, onMounted } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getColumns, getList } from '/@/api/common/api';
  // const { prefixCls } = useDesign('j-depart-form-content');
  const tableId = '4028f8c98ab5cd05018ab5cd1d740004';

  const props = defineProps({
    activityId: { type: Number },
  });

  loadColumn();

  const columns = ref<[]>([]);

  const [registerTable, { reload }] = useTable({
    api: loadData,
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
      columns.value.forEach((column) => {
        // column.scopedSlots = { customRender: column.dataIndex };
        // column.slots = column.scopedSlots;
      });
      // columns.value = columns.value.concat();
    });
  }

  onMounted(() => {
    // data 变化，重填表单
    watch(
      () => props.activityId,
      async () => {
        reload();
      },
      { deep: true, immediate: true }
    );
  });
</script>
