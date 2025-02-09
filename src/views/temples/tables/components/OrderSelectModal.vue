<!--用户选择框-->
<template>
  <div>
    <BasicModal :showCancelBtn="false" :showOkBtn="false" v-bind="$attrs" @register="register" title="选择待分配的订单" width="1200px" destroyOnClose>
      <a-spin :spinning="loading">
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
  import { FormSchema } from '/@/components/Form';
  import { TableAction, BasicColumn } from '/@/components/Table';
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { searchOrder } from '../tablets.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useListPage } from '/@/hooks/system/useListPage';

  export default defineComponent({
    name: 'OrderSelectModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
      TableAction,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
      //选择框标题
      tablets: {
        type: Object,
      },
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      const searchFormSchema: FormSchema[] = [
        {
          label: '订单关键字',
          labelWidth: 160,
          field: 'keyword',
          component: 'Input',
        },
      ];
      const columns: BasicColumn[] = [
        {
          title: '联系方式',
          dataIndex: 'contactMan',
          width: 180,
          align: 'left',
          resizable: true,
          customRender: ({ record }) => {
            return record.contactMan + '/' + record.contactTel;
          },
        },
        {
          title: '牌位名称',
          dataIndex: 'productName',
          width: 120,
          resizable: true,
        },
        {
          title: '下单时间',
          dataIndex: 'gmtCreate',
          width: 150,
          resizable: true,
        },
        {
          title: '订单编号',
          dataIndex: 'orderCode',
          width: 120,
          resizable: true,
        },
        {
          title: '状态',
          dataIndex: 'orderStatusDesc',
          width: 60,
        },
        {
          title: '牌位姓名',
          dataIndex: 'name',
          width: 120,
          resizable: true,
        },
        {
          title: '阳上姓名',
          dataIndex: 'name2',
          width: 120,
          resizable: true,
        },
      ];

      // 列表页面公共参数、方法
      const { tableContext } = useListPage({
        tableProps: {
          title: '订单列表',
          api: searchOrder,
          afterFetch: fillData,
          columns,
          size: 'small',
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
          pagination: false,
          tableSetting: { fullScreen: false },
          rowKey: 'id',
          actionColumn: {
            width: 80,
            title: '操作',
            slots: { customRender: 'action' },
          },
        },
      });

      const [registerTable] = tableContext;

      const loading = ref<boolean>(false);

      const tablets = ref<Object>({});
      //注册弹框
      const [register, { closeModal }] = useModalInner(({ record }) => {
        tablets.value = record;
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
        emit('getSelectResult', record, tablets.value.id);
        //关闭弹窗
        closeModal();
      }

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
        searchOrder,
        formConfig,
        columns,
        loading,
      };
    },
  });
</script>
