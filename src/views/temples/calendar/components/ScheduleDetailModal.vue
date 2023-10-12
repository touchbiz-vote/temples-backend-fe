<!--用户选择框-->
<template>
  <div>
    <BasicModal :showCancelBtn="false" :showOkBtn="false" v-bind="$attrs" @register="register" title="预定详情" width="1200px" destroyOnClose>
      <a-spin :spinning="loading">
        <div> <b>日期:</b>{{ schedule.date }} <b>活动场次:</b> {{ schedule.scheduleName }}</div>
        <div><b>可预定总数:</b> {{ schedule.totalNumber }} <b> 可预定数:</b> {{ schedule.avaliableNumber }}</div>
        <div>
          <Button type="primary" v-if="showDisable" @click="handleDisable"> 禁用</Button>
          <Button type="primary" v-if="showEnabled" @click="handleEnabled"> 启用</Button>
        </div>
        <BasicTable @register="registerTable">
          <!--操作栏-->
          <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template>
        </BasicTable>
      </a-spin>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { BasicColumn, TableAction, BasicTable, useTable } from '/@/components/Table';
  import { defineComponent, ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from '../schedule.data';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { disable, enabled } from '../schedule.api';
  import { Button } from '/@/components/Button';
  import { getList as getOrderList } from '../../order/order.api';

  export default defineComponent({
    name: 'ScheduleDetailModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
      Button,
      TableAction,
      BasicTable,
    },
    props: {
      ...selectProps,
    },
    emits: ['register', 'success'],
    setup(props, { emit, refs }) {
      // 列表页面公共参数、方法
      const { tableContext } = useListPage({
        tableProps: {
          title: '预定列表',
          api: getOrderList,
          afterFetch: fillData,
          columns,
          size: 'small',
          formConfig: {
            autoSubmitOnEnter: true,
            showAdvancedButton: false,
            showSubmitButton: false,
            showResetButton: false,
            // schemas: searchFormSchema,
            size: 'small',
            labelWidth: 80,
          },
          striped: true,
          useSearchForm: true,
          showTableSetting: true,
          bordered: true,
          showIndexColumn: false,
          pagination: false,
          tableSetting: { fullScreen: false },
          rowKey: 'id',
          actionColumn: {
            width: 80,
            title: '操作',
            slots: { customRender: 'action' },
          },
          beforeFetch: initFilter,
        },
      });

      function initFilter(params) {
        if (params.column === 'createTime') {
          params.column = 'gmt_create';
        }
        params.order_status = 1;
        params.schedule_id = schedule.value.scheduleId;
      }

      const [registerTable] = tableContext;

      const loading = ref<boolean>(false);

      const schedule = ref<Object>({ scheduleName: '', date: '' });

      const showDisable = ref<boolean>(false);

      const showEnabled = ref<boolean>(false);

      //注册弹框
      const [register, { closeModal }] = useModalInner(({ record }) => {
        schedule.value = record;
      });
      const attrs = useAttrs();

      //查询form
      const formConfig = {
        baseColProps: {
          xs: 36,
          sm: 16,
          md: 16,
          lg: 16,
          xl: 12,
          xxl: 12,
        },
      };

      async function fillData(list) {
        for (const order of list) {
          const orderInfo = JSON.parse(order.orderInfo);
          console.log(orderInfo);
          for (const item of orderInfo) {
            if (item.name === 'name') {
              order.name = item.value;
            }
            if (item.name === 'name2') {
              order.name2 = item.value;
            }
          }
        }
      }

      /**
       * 确定选择
       */
      function handleEdit(record) {
        //   //回传选项和已选择的值
        console.log(props);
        emit('success');
        //关闭弹窗
        closeModal();
      }

      function handleDisable() {
        console.log(props);
        emit('success');
        disable(schedule.value.scheduleId, () => {
          console.log('handleDisable');
          emit('success');
          schedule.value.status = 2;
        });
      }

      function handleEnabled() {
        //   //回传选项和已选择的值
        console.log(props);
        enabled(schedule.value.scheduleId, () => {
          console.log('handleEnabled');
          emit('success');
          schedule.value.status = 1;
        });
      }

      watch(
        () => schedule.value.status,
        () => {
          console.log(schedule);
          showDisable.value = schedule.value.status === 1;
          showEnabled.value = schedule.value.status === 2;
        },
        {
          immediate: true,
        }
      );

      /**
       * 编辑
       */
      function getTableAction(record) {
        return [{ label: '选择', onClick: handleEdit.bind(null, record) }];
      }

      return {
        getTableAction,
        registerTable,
        register,
        formConfig,
        columns,
        loading,
        schedule,
        showDisable,
        showEnabled,
        handleDisable,
        handleEnabled,
      };
    },
  });
</script>
