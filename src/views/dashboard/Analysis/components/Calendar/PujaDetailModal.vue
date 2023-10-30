<!--用户选择框-->
<template>
  <BasicModal :showCancelBtn="false" :showOkBtn="false" v-bind="$attrs" @register="register" title="预定详情" width="1200px" destroyOnClose>
    <a-spin :spinning="loading">
      <a-descriptions :column="3">
        <a-descriptions-item label="法会名称">{{ product?.name }}</a-descriptions-item>
        <a-descriptions-item label="日期">{{ product.startDate }} - {{ product.endDate }}</a-descriptions-item>
        <a-descriptions-item label="预定数">{{ product.reserveNumber }}</a-descriptions-item>
      </a-descriptions>
      <BasicTable @register="registerTable">
        <!--插槽:table标题-->
        <template #tableTitle>
          <a-button type="primary" preIcon="ant-design:printer-outlined" @click="handlePrint">打印</a-button>
        </template>
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </BasicTable>
    </a-spin>
    <PrintModal @register="registerModal" :printData="printData" />
  </BasicModal>
</template>
<script lang="ts">
  import { TableAction, BasicTable } from '/@/components/Table';
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from './schedule.data';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { getList as getOrderList } from '../../../../temples/order/order.api';
  import { useModal } from '/@/components/Modal';
  import PrintModal from '/@/views/print/PrintModal.vue';

  export default defineComponent({
    name: 'PujaDetailModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
      TableAction,
      BasicTable,
      PrintModal,
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
          afterFetch: fillData,
          tableSetting: { fullScreen: false },
          rowKey: 'id',
          showActionColumn: false,
          beforeFetch: initFilter,
        },
      });

      function fillData(list) {
        // for (const order of list) {
        //   const orderInfo = JSON.parse(order.orderInfo);
        //   console.log(orderInfo);
        //   // for (const item of orderInfo) {
        //   //   if (item.name === 'name') {
        //   //     order.name = item.value;
        //   //   }
        //   //   if (item.name === 'name2') {
        //   //     order.name2 = item.value;
        //   //   }
        //   // }
        //   // printData.value.push(order);
        // }
        printData.value = list;
      }

      const printData = ref<Array<object>>([]);

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

      const [registerModal, { openModal }] = useModal();
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

      function handlePrint() {
        openModal(true, {
          printData: printData.value,
        });
      }

      /**
       * 编辑
       */
      function getTableAction() {
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
        handlePrint,
        openModal,
        registerModal,
        printData,
      };
    },
  });
</script>
