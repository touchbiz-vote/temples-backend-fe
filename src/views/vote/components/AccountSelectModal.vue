<!--用户选择框-->
<template>
  <div>
    <BasicModal v-bind="$attrs" @register="register" title="选择活动评委" width="400px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
      <BasicTable :columns="columns" :rowSelection="rowSelection" :api="searchAccount" :indexColumnProps="indexColumnProps" />
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { searchAccount } from '../vote.api';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'AccountSelectModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      //注册弹框
      const [register, { closeModal }] = useModalInner();
      const attrs = useAttrs();
      //表格配置
      const config = {
        canResize: false,
        bordered: true,
        size: 'small',
        rowKey: unref(props).rowKey,
      };
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(searchAccount, getBindValue);

      //定义表格列
      const columns = [
        {
          title: '评委名称',
          dataIndex: 'name',
          width: 200,
          align: 'left',
        },
      ];

      /**
       * 确定选择
       */
      function handleOk() {
        getSelectResult((options, values) => {
          //回传选项和已选择的值
          emit('getSelectResult', options, values);
          //关闭弹窗
          closeModal();
        });
      }
      return {
        searchAccount,
        handleOk,
        register,
        indexColumnProps,
        visibleChange,
        getBindValue,
        columns,
        rowSelection,
      };
    },
  });
</script>
