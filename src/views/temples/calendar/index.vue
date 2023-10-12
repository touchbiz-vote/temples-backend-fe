<template>
  <FullCalendar :options="calendarOptions" ref="calendarRef" />
  <!-- <PujaDetailModal @register="registerPujaModal" /> -->
  <ScheduleDetailModal @register="registerScheduleDetailModal" />
</template>
<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import zhLocale from '@fullcalendar/core/locales/zh-cn';
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  // import PujaDetailModal from './components/PujaDetailModal.vue';
  import ScheduleDetailModal from './components/ScheduleDetailModal.vue';

  //传递开始结束时间查询法schedule信息
  import { getScheduleList, disable, enabled } from './schedule.api';
  import calendar from '/@/router/routes/modules/calendar';

  // const [registerPujaModal, { openModal: openPujaModal }] = useModal();
  const [registerScheduleDetailModal, { openModal: openScheduleDetailModal }] = useModal();

  function handleEventClick(info) {
    console.log(info.event.extendedProps);
    handleScheduleDetail(info.event.extendedProps.details);
  }

  function handleDateClick(info) {
    alert(info.toString());
  }

  const calendarRef = ref();
  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: zhLocale,
    weekends: false,
    events: [{ title: 'Meeting', start: new Date() }],
    // eventClick: handleEventClick,
    eventClick: handleEventClick,
    dateClick: handleDateClick,
  });

  const currentDate = ref();
  currentDate.value = dayjs().format('YYYY-MM-DD');

  //传递开始结束时间查询法会列表
  function queryScheduleList() {
    const startDate = dayjs(currentDate.value).subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs(currentDate.value).add(1, 'month').endOf('month').format('YYYY-MM-DD');
    getScheduleList({ startDate, endDate }).then((res) => {
      const events: Recordable[] = [];
      calendarOptions.value.events = res.map((item) => {
        if (item.details && item.details.length) {
          item.details.forEach((v) => {
            events.push({
              title: v.scheduleName,
              start: item.date,
              end: item.date,
              details: { ...v, date: item.date },
            });
          });
        }
      });
      console.log('events', events);
      calendarOptions.value.events = events;
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

  function handlePrevMonthClick() {
    currentDate.value = dayjs(currentDate.value).subtract(1, 'month');
    queryScheduleList();
  }

  function handleNextMonthClick() {
    currentDate.value = dayjs(currentDate.value).add(1, 'month');
    queryScheduleList();
  }

  onMounted(() => {
    document.body.querySelector('.fc-toolbar .fc-prev-button')?.addEventListener('click', handlePrevMonthClick);
    document.body.querySelector('.fc-toolbar .fc-next-button')?.addEventListener('click', handleNextMonthClick);
    queryScheduleList();
  });
  onBeforeUnmount(() => {
    document.body.querySelector('.fc-toolbar .fc-prev-button')?.removeEventListener('click', handlePrevMonthClick);
    document.body.querySelector('.fc-toolbar .fc-next-button')?.removeEventListener('click', handleNextMonthClick);
  });
</script>
