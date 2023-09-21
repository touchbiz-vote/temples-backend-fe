<template>
  <a-card :bordered="false">
    <a-spin :spinning="false">
      <a-card :bordered="true">
        <a-form :model="model" :labelCol="{ span: 3, offset: 3 }">
          <a-form-item label="活动名称/id">{{ model.act_name }}({{ model.id }})</a-form-item>
          <a-form-item label="活动时间">{{ model.act_start_time }} ～ {{ model.act_end_time }}</a-form-item>
          <a-form-item label="活动状态">{{ filterDictTextByCache('activity_status', model.status) }}</a-form-item>
        </a-form>
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


  const model = ref({
    act_name: '',
    id: '',
    act_start_time: '',
    act_end_time: '',
    status: '',
  });

  getActivityDetail(route.query.tableId, route.query.id).then((res) => {
    model.value = res;
  });
</script>
