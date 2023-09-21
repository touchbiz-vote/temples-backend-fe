<template>
  <a-card :bordered="false">
    <a-spin :spinning="false">
      <a-card :bordered="true">
        活动名称/id: {{ model.act_name }}({{ model.id }}) 活动时间 {{ model.act_start_time }} ～ {{ model.act_end_time }} 活动状态:
        <a-tag>{{ filterDictTextByCache('activity_status', model.status) }}</a-tag>
      </a-card>

      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="作品列表" key="1" forceRender>
          <ActivityCase :activityId="convertToNumber(route.query.id)" />
        </a-tab-pane>
        <a-tab-pane tab="进展监控列表" key="2" forceRender>
          <ActivityMonitor :activityId="convertToNumber(route.query.id)" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { convertToNumber } from '../../utils/convert/convert';
  import ActivityMonitor from './components/ActivityMonitor.vue';
  import ActivityCase from './components/ActivityCase.vue';
  import { filterDictTextByCache } from '/@/utils/dict/JDictSelectUtil';
  import { getActivityDetail } from './vote.api';
  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  const route = currentRoute.value;

  const tableId = '4028f8c98ab5cd05018ab5cd0ac90001';
  const model = ref({
    act_name: '',
    id: '',
    act_start_time: '',
    act_end_time: '',
    status: '',
  });

  getActivityDetail(tableId, route.query.id).then((res) => {
    model.value = res;
  });
</script>
