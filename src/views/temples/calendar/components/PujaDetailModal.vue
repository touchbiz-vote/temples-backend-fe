<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="40%">
    <BasicForm @register="registerForm" />
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button preIcon="ant-design:plus-outlined" type="primary" @click="handleAdd">新增</a-button>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup name="PujaDetailModal">
  //显示法会详情, 包含法会的信息以及参与人的信息等
  import { ref } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formPujaSchema, pujaColumns } from '../schedule.data';
  import { getList as getOrderList } from '../../order/order.api';
  import { getById as getProductById } from '../../product/product.api';
  import { useListPage } from '/@/hooks/system/useListPage';

  const productId = ref(null);
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      title: '法会报名列表',
      api: getOrderList,
      columns: pujaColumns,
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
        width: 180,
        title: '操作',
        slots: { customRender: 'action' },
      },
    },
  });

  function initFilter(params) {
    //TODO这个要填充传进来的法会产品id
    params.productId = productId.value;
    params.status = 2;
  }

  const [registerTable] = tableContext;

  // 声明Emits
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formPujaSchema,
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    //获取详情
    productId.value = data.record.id;
    data.record = await getProductById(data.record.id);
    //表单赋值
    await setFieldsValue({
      ...data.record,
    });
  });
  //设置标题
  const title = '法会详情';
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      // await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      // //刷新列表
      // emit('success', values);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
