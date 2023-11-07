<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="角色详情" width="500px" destroyOnClose>
    <Description :column="1" :data="roleData" :schema="formDescSchema" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { formDescSchema } from '../role.data';
  const roleData = ref({});
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    roleData.value = data.record;
  });
</script>
