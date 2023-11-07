<template>
  <FullCalendar :options="calendarOptions" ref="calendarRef">
    <template #eventContent="arg">
      <template v-if="arg.event.extendedProps.details.type == 1">
        <div class="event-item rituals-event-item">
          <span class="event-item--title" :disabled="arg.event.extendedProps?.details.status == 2">{{ arg.event.title }}</span>
          <div class="event-item--inventory">可用数: {{ arg.event.extendedProps.details.avaliableNumber }}</div>
          <!-- <div class="event-item--sold"> -->
          <!-- 预定数: {{ arg.event.extendedProps.details.totalNumber - arg.event.extendedProps.details.avaliableNumber }} -->
          <!-- </div> -->
        </div>
      </template>
      <template v-else-if="arg.event.extendedProps.details.type == 2">
        <div class="event-item puja-event-item">
          <span class="event-item--title" :disabled="arg.event.extendedProps?.details.status == 2">{{ arg.event.title }}</span>
          <div class="event-item--inventory">可用数量: {{ arg.event.extendedProps.details.inventory }}</div>
          <div class="event-item--sold">预定数量: {{ arg.event.extendedProps.details.reserveNumber }}</div>
        </div>
      </template>
    </template>
  </FullCalendar>
  <PujaDetailModal @register="registerPujaModal" />
  <ScheduleDetailModal @register="registerScheduleDetailModal" />
</template>
<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import zhLocale from '@fullcalendar/core/locales/zh-cn';
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  import PujaDetailModal from './components/PujaDetailModal.vue';
  import ScheduleDetailModal from './components/ScheduleDetailModal.vue';

  //传递开始结束时间查询法schedule信息
  import { getScheduleList } from './schedule.api';

  const [registerPujaModal, { openModal: openPujaModal }] = useModal();
  const [registerScheduleDetailModal, { openModal: openScheduleDetailModal }] = useModal();

  function handleEventClick(info) {
    if (info.event.extendedProps.details.type == 2) {
      openPujaModal(true, {
        record: info.event.extendedProps.details,
        isUpdate: true,
      });
    } else if (info.event.extendedProps.details.type == 1) {
      openScheduleDetailModal(true, {
        record: info.event.extendedProps.details,
      });
    }
  }

  function handleDateClick(info) {
    // alert(info.toString());
  }

  const calendarRef = ref();
  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: zhLocale,
    contentHeight: 1200,
    // weekends: false,
    events: [],
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
        if (item.puja) {
          events.push({
            title: item.puja.name,
            start: item.puja.startDate,
            end: item.puja.endDate,
            classNames: ['puja-event'],
            details: {
              ...item.puja,
              type: 2,
            },
          });
        }
        if (item.details && item.details.length) {
          item.details.forEach((v) => {
            events.push({
              title: v.scheduleName,
              start: item.date,
              end: item.date,
              className: ['rituals-event'],
              details: { ...v, date: item.date, type: 1 },
            });
          });
        }
      });
      calendarOptions.value.events = events;
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
<style lang="less" scoped>
  .fc {
    padding: 15px;
    :deep(.fc-h-event) {
      border: 0;
      color: #ffffff;
      margin-top: 5px;
      // background: transparent;
      &.rituals-event {
        color: #3788d8;
        background: transparent;
        border: 1px solid #3788d8;
        display: flex;
      }

      // &.puja-event {
      //   color: #ffffff;
      // }

      .fc-event-main {
        color: inherit;
        width: 100%;
      }
    }
    :deep(.fc-daygrid-day-number),
    :deep(.fc-col-header-cell-cushion) {
      color: #000000;
    }
    :deep(.fc-day-today) {
      background: #e6f4ff;
      border-top: 3px solid #1677ff;
    }
    // :deep(.fc-button) {
    //   background: transparent;
    //   border: 1px solid #1677ff;
    //   color: #1677ff;
    // }
  }
  .event-item {
    padding: 3px 5px;
    border-radius: 4px;
    user-select: none;

    &.rituals-event-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
