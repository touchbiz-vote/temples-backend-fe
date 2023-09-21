<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="80%">
    <BasicForm @register="registerForm" :disabled="isDisabled" />
  </BasicModal>
</template>
<script lang="ts" setup name="ProductModal">
  import { convertKeysToCamelCase } from '../../../utils/convert/convert';
  import { ref, computed, unref, defineProps } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './product.data';
  import { saveOrUpdate, getById } from './product.api';
  // 声明Emits
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isClone = ref(false);
  //自定义接受参数
  const props = defineProps({
    //是否禁用页面
    isDisabled: {
      type: Boolean,
      default: false,
    },
  });

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showOkBtn: !props.isDisabled });
    isUpdate.value = !!data?.isUpdate;
    isClone.value = !!data?.isClone;
    if (unref(isUpdate) || unref(isClone)) {
      //获取详情
      data.record = await getById(data.record.id);
      if (data.record) {
        if (data.record.start_date && data.record.end_date) {
          data.record.avaliabDate = data.record.start_date + ',' + data.record.end_date;
        }
      }
      if (isClone.value) {
        data.record.id = null;
      }
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(isClone) ? '编辑' : '复制'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      console.log(values);
      if (values.avaliabDate) {
        const dates = values.avaliabDate.split(',');
        values.start_date = dates[0];
        values.end_date = dates[1];
      }

      //提交表单
      await saveOrUpdate(convertKeysToCamelCase(values), isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success', values);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
../../../utils/convert/convert
