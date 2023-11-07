<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="40%">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup name="ProductModal">
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../tablets.data';
  import { saveOrUpdate, getById } from '../tablets.api';
  // 声明Emits
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
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
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //获取详情
      const id = data.record.id;
      data.record = await getById(data.record.id);
      data.record.title = data.location.title;
      data.record.jeecg_row_key = id;
      data.record.id = id;
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    } else {
      console.log(data.location);
      await setFieldsValue({
        title: data.location.title,
        location_id: data.location.id,
      });
    }
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增牌位' : '编辑牌位'));
  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success', values);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
