<template>
  <div class="md:flex md:flex-col">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card size="small" :loading="loading" :title="item.title" :canExpan="false">
        <template #extra>
          <Tag :color="item.color">{{ item.action }}</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between">
          <CountTo :startVal="1" :endVal="item.value" class="text-2xl" />
          <!-- <CountTo prefix="$" :startVal="1" :endVal="item.value" class="text-2xl" /> -->
          <!-- <Icon :icon="item.icon" :size="40" /> -->
        </div>

        <div v-if="false" class="p-2 px-4 flex justify-between">
          <span>总{{ item.title }}</span>
          <CountTo prefix="$" :startVal="1" :endVal="item.total" />
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { Tag, Card } from 'ant-design-vue';
  import { CountTo } from '/@/components/CountTo/index';
  import { Icon } from '/@/components/Icon';
  import { growCardList } from '../data';

  defineProps({
    loading: {
      type: Boolean,
    },
  });
</script>
