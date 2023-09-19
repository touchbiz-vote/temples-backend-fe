<!--用户选择框-->
<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      @register="register"
      title="选择待分配的订单"
      width="800px"
      @ok="handleOk"
      destroyOnClose
      @visible-change="visibleChange"
    >
      <a-spin :spinning="loading">
        <BasicTable @register="registerTable">
          <!--操作栏-->
          <template #action="{ record }">
            <!-- <TableAction :actions="getTableAction(record)" /> -->
          </template>
        </BasicTable>
      </a-spin>

      <!-- <a-row>
        <a-col :span="showSelected ? 18 : 24">
          <BasicTable
            ref="tableRef"
            :columns="columns"
            :scroll="tableScroll"
            v-bind="getBindValue"
            :useSearchForm="true"
            :formConfig="formConfig"
            :api="searchOrder"
            :searchInfo="searchInfo"
            :rowSelection="rowSelection"
            :indexColumnProps="indexColumnProps"
          >
            <template #tableTitle></template>
          </BasicTable>
        </a-col>
      </a-row>-->
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { FormSchema } from '/@/components/Form';
  import { BasicColumn } from '/@/components/Table';
  import { defineComponent, unref, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { searchOrder } from '../tablets.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  // import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';

  export default defineComponent({
    name: 'OrderSelectModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
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
          component: 'JInput',
        }
      ];
      const columns: BasicColumn[] = [
        {
          title: '联系人',
          dataIndex: 'contactMan',
          width: 120,
          align: 'left',
        },
        {
          title: '联系电话',
          dataIndex: 'contactTel',
          width: 120,
        },
        {
          title: '牌位名称',
          dataIndex: 'productName',
          width: 120,
        },
        {
          title: '下单时间',
          dataIndex: 'sex_dictText',
          width: 50,
        },
        {
          title: '订单编号',
          dataIndex: 'phone',
          width: 120,
        },
        {
          title: '状态',
          dataIndex: 'status_dictText',
          width: 80,
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
        tableSetting: { fullScreen: false },
        rowKey: 'id',
        actionColumn: {
          width: 200,
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
        //update-begin-author:taoyan date:2022-5-24 for: VUEN-1086 【移动端】用户选择 查询按钮 效果不好 列表展示没有滚动条---查询表单按钮的栅格布局和表单的保持一致
        // actionColOptions: {
        //   xs: 24,
        //   sm: 8,
        //   md: 8,
        //   lg: 8,
        //   xl: 8,
        //   xxl: 8,
        // },
        //update-end-author:taoyan date:2022-5-24 for: VUEN-1086 【移动端】用户选择 查询按钮 效果不好 列表展示没有滚动条---查询表单按钮的栅格布局和表单的保持一致
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
      function handleOk() {
        // getSelectResult((options, values) => {
        //   //回传选项和已选择的值
        //   emit('getSelectResult', options, values);
        //   //关闭弹窗
        //   closeModal();
        // });
      }

      return {
        //config,
        handleOk,
        // searchInfo,
        registerTable,
        register,
        // indexColumnProps,
        // visibleChange,
        // getBindValue,
        searchOrder,
        formConfig,
        columns,
        // rowSelection,
        // selectRows,
        loading,
        // selectedTable,
        // handleDeleteSelected,
        // tableScroll,
        // tableRef,
      };
    },
  });
</script>
