<!--用户选择框-->
<template>
  <div>
    <BasicModal :showCancelBtn="false" :showOkBtn="false" v-bind="$attrs" @register="register" title="选择待分配的订单" width="900px" destroyOnClose>
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
  import { BasicColumn, TableAction, BasicTable, useTable} from '/@/components/Table';
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { searchOrder } from '../tablets.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';


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
      modalTitle: {
        type: String,
        default: '选择待分配的订单',
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
          width: 120,
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
      ];
      const [registerTable] = useTable({
        title: '订单列表',
        api: searchOrder,
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
      });

      const loading = ref<boolean>(false);
      //注册弹框
      const [register, { closeModal }] = useModalInner(() => {});
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
      //定义表格列
      //已选择的table信息
      // const selectedTable = {
      //   pagination: false,
      //   showIndexColumn: false,
      //   scroll: { y: 390 },
      //   size: 'small',
      //   canResize: false,
      //   bordered: true,
      //   rowKey: 'id',
      //   columns: [
      //     {
      //       title: '用户姓名',
      //       dataIndex: 'realname',
      //       width: 40,
      //     },
      //     {
      //       title: '操作',
      //       dataIndex: 'action',
      //       align: 'center',
      //       width: 40,
      //       slots: { customRender: 'action' },
      //     },
      //   ],
      // };
      /**
       * 确定选择
       */
      function handleEdit(record) {
        //   //回传选项和已选择的值
        emit('getSelectResult', record);
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
        BasicTable,
        getTableAction,
        // searchInfo,
        registerTable,
        register,
        // indexColumnProps,
        // getBindValue,
        searchOrder,
        formConfig,
        columns,
        // rowSelection,
        // selectRows,
        loading,
        TableAction,
        // selectedTable,
        // handleDeleteSelected,
        // tableScroll,
        // tableRef,
      };
    },
  });
</script>
