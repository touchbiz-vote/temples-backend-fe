<template>
  <div class="p-4">
    <div class="md:flex">
      <GrowCard :loading="loading" class="md:w-2/12 enter-y" />
      <SiteAnalysis class="md:w-10/12 enter-y" :loading="loading" />
    </div>
    <Calendar />
    <!-- <div v-if="false" class="md:flex enter-y">
      <VisitRadar class="md:w-1/3 w-full" :loading="loading" />
      <VisitSource class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" :loading="loading" />
      <SalesProductPie class="md:w-1/3 w-full" :loading="loading" />
    </div> -->
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import GrowCard from '../components/GrowCard.vue';
  import SiteAnalysis from '../components/SiteAnalysis.vue';
  import Calendar from '../components/Calendar/index.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 500);
</script>
