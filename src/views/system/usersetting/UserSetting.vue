<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="tabBarStyle" @tabClick="componentClick">
        <template v-for="item in settingList" :key="item.key">
          <TabPane>
            <template #tab>
              <span>
                <Icon :icon="item.icon" class="icon-font-color" />
                {{ item.name }}
              </span>
            </template>
            <component :is="item.component" v-if="activeKey === item.key" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { ScrollContainer } from '/@/components/Container';
  import { settingList } from './UserSetting.data';
  import BaseSetting from './BaseSetting.vue';
  import AccountSetting from './AccountSetting.vue';
  export default defineComponent({
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      BaseSetting,
      AccountSetting,
    },
    setup() {
      const activeKey = ref<string>('1');

      /**
       * 组件标题点击事件,解决第二次不加载数据
       * @param key
       */
      function componentClick(key) {
        activeKey.value = key;
      }

      return {
        prefixCls: 'account-setting',
        settingList,
        tabBarStyle: {
          width: '220px',
          marginBottom: '200px',
        },
        componentClick,
        activeKey,
      };
    },
  });
</script>
<style lang="less" scoped>
  .account-setting {
    margin: 12px;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
    //tabs弹窗左边样式
    :deep(.ant-tabs-nav) {
      /*begin 兼容暗夜模式*/
      background-color: @component-background;
      /*end 兼容暗夜模式*/
      height: 260px;
    }
    //tabs弹窗右边边样式
    :deep(.ant-tabs-content-holder) {
      position: relative;
      left: 12px;
      /*begin 兼容暗夜模式*/
      background: @component-background;
      /*end 兼容暗夜模式*/
      height: auto !important;
    }
  }
  //tab点击样式
  :deep(.ant-tabs-tab-active) {
    border-radius: 0 20px 20px 0;
    background-color: #1294f7 !important;
    color: #fff !important;
    .icon-font-color {
      color: #fff;
    }
  }
  :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: white !important;
  }
  :deep(.ant-tabs-ink-bar) {
    visibility: hidden;
  }
  :deep(.ant-tabs-nav-list) {
    padding-top: 14px;
    padding-right: 14px;
  }
  .icon-font-color {
    /*begin 兼容暗夜模式*/
    color: @text-color;
    /*end 兼容暗夜模式*/
  }
</style>
