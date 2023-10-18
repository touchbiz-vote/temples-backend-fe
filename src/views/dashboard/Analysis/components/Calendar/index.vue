<template>
  <FullCalendar :options="calendarOptions" ref="calendarRef">
    <template #dayCellContent="arg">
      {{ arg.dayNumberText }}
    </template>
    <template #eventContent="arg">
      <template v-if="arg.event.extendedProps.details.type == 1">
        <div class="event-item rituals-event-item border-0">
          <span class="event-item--title" :disabled="arg.event.extendedProps?.details.status == 2">{{ arg.event.title }}</span>
        </div>
      </template>
      <template v-else-if="arg.event.extendedProps.details.type == 2">
        <div class="event-item puja-event-item bg-transparent border-0">
          <span class="event-item--title" :disabled="arg.event.extendedProps?.details.status == 2">{{ arg.event.title }}</span>
          <!-- <div class="event-item--inventory">可用数: {{ arg.event.extendedProps.details.inventory }}</div> -->
          <!-- <div class="event-item--sold">预定数: {{ arg.event.extendedProps.details.reserveNumber }}</div> -->
        </div>
      </template>
    </template>
  </FullCalendar>
  <PujaDetailModal @register="registerPujaModal" />
  <ScheduleDetailModal @register="registerScheduleDetailModal" />
</template>
<script setup lang="ts">
  //TODO 这个页面只显示相关预定的信息。
  //针对佛事的点击是查看该佛事预定相关的信息，包括预定人/预定电话/备注/参与人数/佛事类型等等。
  //法会弹框显示法会的基本信息以及法会的具体报名人员信息列表。
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import zhLocale from '@fullcalendar/core/locales/zh-cn';
  import dayjs from 'dayjs';

  //传递开始结束时间查询法schedule信息
  import { getOrdrList } from '/@/views/temples/calendar/schedule.api';
  import PujaDetailModal from './PujaDetailModal.vue';
  import ScheduleDetailModal from './ScheduleDetailModal.vue';
  import { useModal } from '/@/components/Modal';

  const [registerPujaModal, { openModal: openPujaModal }] = useModal();
  const [registerScheduleDetailModal, { openModal: openScheduleDetailModal }] = useModal();

  function handleEventClick(info) {
    console.log('info', info);
    if (info.event.extendedProps.details.type == 2) {
      openPujaModal(true, {
        record: info.event.extendedProps.details,
        isUpdate: true,
      });
    } else if (info.event.extendedProps.details.type == 1) {
      openScheduleDetailModal(true, {
        record: info.event.extendedProps.details,
        isUpdate: true,
      });
    }
  }

  const calendarRef = ref();
  const calendarOptions = ref({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: zhLocale,
    events: [],
    customButtons: {
      puja: {
        text: '本月法会场次: 0',
      },
      rituals: {
        text: '佛事场次: 0',
      },
    },
    headerToolbar: {
      left: 'title',
      center: 'puja,rituals',
      right: 'prev,next',
    },
    eventClick: handleEventClick,
  });

  const currentDate = ref();
  currentDate.value = dayjs().format('YYYY-MM-DD');

  //传递开始结束时间查询法会列表
  function queryScheduleList() {
    const startDate = dayjs(currentDate.value).startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs(currentDate.value).endOf('month').format('YYYY-MM-DD');
    getOrdrList({ startDate, endDate }).then((res) => {
      const events: Recordable[] = [];
      if (res.pujaList && res.pujaList.length) {
        res.pujaList.forEach((v) => {
          events.push({
            title: v.name,
            start: v.startDate,
            end: v.endDate,
            classNames: ['puja-event'],
            details: { ...v, type: 2 },
          });
        });
        calendarOptions.value.customButtons.puja.text = `本月法会场次：${res.pujaList.length}`;
      }
      if (res.scheduleList && res.scheduleList.length) {
        res.scheduleList.forEach((v) => {
          if (v.orderList && v.orderList.length) {
            v.orderList.forEach((o) => {
              events.push({
                title: o.orderName,
                start: v.date,
                end: v.date,
                className: ['rituals-event'],
                details: {
                  ...o,
                  ...v,
                  type: 1,
                },
              });
            });
          }
        });

        calendarOptions.value.customButtons.rituals.text = `佛事场次：${res.scheduleList.reduce(
          (total, item) => (total += item.orderList.length),
          0
        )}`;
      }
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
      white-space: nowrap;
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
  }
  .event-item {
    // padding: 5px 10px;
    border-radius: 4px;
  }
</style>
