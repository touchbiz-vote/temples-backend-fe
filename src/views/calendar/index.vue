<template>
  <FullCalendar :options="calendarOptions" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import zhLocale from '@fullcalendar/core/locales/zh-cn';

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
</script>
