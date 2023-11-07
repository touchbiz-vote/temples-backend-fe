<!--用户选择框-->
<template>
  <div>
    <BasicModal :showCancelBtn="false" :showOkBtn="false" v-bind="$attrs" @register="register" title="预定详情" width="1200px" destroyOnClose>
      <a-spin :spinning="loading">
        <a-descriptions :column="3">
          <a-descriptions-item label="法会名称">{{ product?.name }}</a-descriptions-item>
          <a-descriptions-item label="日期">{{ product.startDate }} - {{ product.endDate }}</a-descriptions-item>
          <a-descriptions-item label="预定数">{{ product.reserveNumber }}</a-descriptions-item>
        </a-descriptions>
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
  import { TableAction, BasicTable } from '/@/components/Table';
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from '../schedule.data';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { getList as getOrderList } from '../../order/order.api';

  export default defineComponent({
    name: 'PujaDetailModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
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
          title: '法会预约人列表',
          api: getOrderList,
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
          useSearchForm: false,
          showTableSetting: true,
          bordered: true,
          showIndexColumn: false,
          pagination: false,
          tableSetting: { fullScreen: false },
          rowKey: 'id',
          showActionColumn: false,
          // actionColumn: {
          //   width: 80,
          //   title: '操作',
          //   slots: { customRender: 'action' },
          // },
          beforeFetch: initFilter,
        },
      });

      function initFilter(params) {
        if (params.column === 'createTime') {
          params.column = 'gmt_create';
        }
        params.order_status = 1;
        params.product_id = product.value.id;
      }

      const [registerTable] = tableContext;

      const loading = ref<boolean>(false);

      const product = ref<Object>({ scheduleName: '', date: '' });

      //注册弹框
      const [register] = useModalInner(({ record }) => {
        console.log('record', record);
        product.value = record;
      });
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
      /**
       * 编辑
       */
      function getTableAction(record) {
        return [];
      }

      return {
        getTableAction,
        registerTable,
        register,
        formConfig,
        columns,
        loading,
        product,
        // schedule,
      };
    },
  });
</script>
