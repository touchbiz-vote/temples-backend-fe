<!--用户选择框-->
<template>
  <BasicModal :showCancelBtn="false" :showOkBtn="false" v-bind="$attrs" @register="registerModal" title="预定详情" destroyOnClose>
    <a-descriptions :column="1">
      <a-descriptions-item label="佛事名称">{{ schedule.orderName }}</a-descriptions-item>
      <a-descriptions-item label="联系人">{{ schedule.contactMan }}</a-descriptions-item>
      <a-descriptions-item label="联系电话">{{ schedule.contactTel }}</a-descriptions-item>
      <a-descriptions-item label="备注">{{ schedule.remark }}</a-descriptions-item>
    </a-descriptions>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';

  export default defineComponent({
    name: 'ScheduleDetailModal',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
    },
    props: {
      ...selectProps,
    },
    emits: ['register', 'success'],
    setup() {
      const schedule = ref<Object>({ scheduleName: '', date: '' });

      //注册弹框
      const [registerModal, { closeModal }] = useModalInner(({ record }) => {
        schedule.value = record;
      });

      return {
        registerModal,
        schedule,
      };
    },
  });
</script>
