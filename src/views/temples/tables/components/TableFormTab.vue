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
    <TableFormModal @register="registerModal" @success="reload" />
  </a-spin>
</template>

<script lang="ts" setup>
  import { useModal } from '/@/components/Modal';
  import TableFormModal from './TableFormModal.vue';
  import { watch, ref, unref, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList, deleteTable } from '../table.api';
  import { columns } from '../table.data';
  import { useDesign } from '/@/hooks/web/useDesign';
  const [registerModal, { openModal }] = useModal();
  const { prefixCls } = useDesign('j-depart-form-content');
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
  });
  const loading = ref<boolean>(false);
  // 当前的弹窗数据
  const location = ref<object>({});

  const [registerTable, { reload }] = useTable({
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
      width: 200,
      title: '操作',
      slots: { customRender: 'action' },
    },
  });

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
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '分配',
        // popConfirm: {
        //   title: '是否确认上架',
        //   confirm: handleEnable.bind(null, record),
        // },
      },
      {
        label: '删除',
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

  onMounted(() => {
    // data 变化，重填表单
    watch(
      () => props.data,
      async () => {
        let record = unref(props.data);
        if (typeof record !== 'object') {
          record = {};
        }
        console.log(record);
        location.value = record;
        reload();
      },
      { deep: true, immediate: true }
    );
    // 更新 父部门 选项
    watch(
      () => props.rootTreeData,
      async () => {
        console.log(props.rootTreeData);
      },
      { deep: true, immediate: true }
    );
  });
</script>
<style lang="less">
  // update-begin-author:liusq date:20230625 for: [issues/563]暗色主题部分失效

  @prefix-cls: ~'@{namespace}-j-depart-form-content';
  /*begin 兼容暗夜模式*/
  .@{prefix-cls} {
    background: @component-background;
    border-top: 1px solid @border-color-base;
  }
  /*end 兼容暗夜模式*/
  // update-end-author:liusq date:20230625 for: [issues/563]暗色主题部分失效
</style>
