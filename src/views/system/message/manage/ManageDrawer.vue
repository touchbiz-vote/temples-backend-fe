<template>
  <BasicDrawer @register="registerModal" title="详情" :width="600" v-bind="$attrs" @ok="closeDrawer">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { formSchemas } from './manage.data';

  // 声明 emits
  defineEmits(['register']);
  // 注册 form
  const [registerForm, { resetFields, setFieldsValue }] = useForm({
    schemas: formSchemas,
    showActionButtonGroup: false,
  });
  // 注册 modal
  const [registerModal, { closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    await setFieldsValue({ ...data.record });
  });
</script>
