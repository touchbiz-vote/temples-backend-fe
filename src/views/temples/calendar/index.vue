<template>
  <FullCalendar :options="calendarOptions" />
  <PujaDetailModal @register="registerPujaModal" />
  <ScheduleDetailModal @register="registerScheduleDetailModal" />
  <ScheduleEditModal @register="registerScheduleEditModal" @success="reload" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import zhLocale from '@fullcalendar/core/locales/zh-cn';
  import { useModal } from '/@/components/Modal';
  import PujaDetailModal from './components/PujaDetailModal.vue';
  import ScheduleDetailModal from './components/ScheduleDetailModal.vue';
  import ScheduleEditModal from './components/ScheduleEditModal.vue';

  //传递开始结束时间查询法schedule信息
  import { getScheduleList } from './schedule.api';

  const [registerPujaModal, { openPujaModal }] = useModal();
  const [registerScheduleDetailModal, { openScheduleDetailModal }] = useModal();
  const [registerScheduleEditModal, { openScheduleEditModal }] = useModal();

  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: zhLocale,
    weekends: false,
    events: [
      {
        title: 'Meeting',
        start: new Date(),
      },
    ],
  });

  //传递开始结束时间查询法会列表
  function queryScheduleList(startDate, endDate) {
    getScheduleList({ startDate, endDate }).then((res) => {
    });
  }

  function reload() {}

  /**
   * 详情法会页面
   */
  function handlePujaDetail(record) {
    openPujaModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 详情法会页面
   */
  function handleScheduleDetail(record) {
    openScheduleDetailModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * 详情法会页面
   */
  function handleScheduleEdit(record) {
    openScheduleEditModal(true, {
      record,
      isUpdate: true,
    });
  }
</script>
