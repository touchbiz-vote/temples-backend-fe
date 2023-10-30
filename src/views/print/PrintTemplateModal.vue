<!--
 * @Description: 使用 — 入门篇2;
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-07 11:52:50
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-11 15:50:41
-->
<template>
  <BasicModal @register="registerModal" :title="title" :showOkBtn="false" :showCancelBtn="false" width="95%">
    <a-row :gutter="[8, 0]">
      <a-form name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 24 }" autocomplete="off">
        <a-form-item label="模版名称" name="template_name" :model="record" :rules="[{ required: true, message: '请输入模版名称!' }]">
          <a-input style="width: 300px" v-model:value="record.template_name" />
        </a-form-item>
      </a-form>
    </a-row>
    <a-row :gutter="[8, 0]" style="margin-bottom: 10px">
      <a-col :span="24">
        <a-space>
          <!-- 纸张设置 -->
          <a-button-group>
            <template v-for="(value, type) in paperTypes" :key="type">
              <a-button :type="curPaperType === type ? 'primary' : 'info'" @click="setPaper(type, value)">
                {{ type }}
              </a-button>
            </template>
            <a-popover v-model="paperPopVisible" title="设置纸张宽高(mm)" trigger="click">
              <template #content>
                <a-input-group compact>
                  <a-input-number v-model:value="paperWidth" style="width: 100px; text-align: center" placeholder="宽(mm)" />
                  <a-input style="width: 30px; border-left: 0; pointer-events: none; backgroundcolor: #fff" placeholder="~" disabled />
                  <a-input-number v-model:value="paperHeight" style="width: 100px; text-align: center; border-left: 0" placeholder="高(mm)" />
                </a-input-group>
                <a-button type="primary" style="width: 100%" @click="otherPaper">确定</a-button>
              </template>
              <a-button :type="'other' == curPaperType ? 'primary' : ''">自定义纸张</a-button>
            </a-popover>
          </a-button-group>
          <a-button type="text" preIcon="ant-design:zoom-out" @click="changeScale(false)" />
          <a-input-number
            :value="scaleValue"
            :min="scaleMin"
            :max="scaleMax"
            :step="0.1"
            disabled
            style="width: 70px"
            :formatter="(value) => `${(value * 100).toFixed(0)}%`"
            :parser="(value) => value.replace('%', '')"
          />
          <a-button type="text" preIcon="ant-design:zoom-in" @click="changeScale(true)" />
          <!-- 预览/打印 -->
          <a-button-group>
            <a-button type="primary" preIcon="ant-design:eye" @click="preView"> 预览 </a-button>
          </a-button-group>
          <!-- 保存/清空 -->
          <a-button-group>
            <a-button type="primary" preIcon="ant-design:save" @click="save"> 保存 </a-button>
            <a-popconfirm title="是否确认清空?" okType="danger" okText="确定清空" @confirm="clearPaper">
              <a-icon type="question-circle-o" style="color: red" />
              <a-button type="danger">
                清空
                <a-icon type="close" />
              </a-button>
            </a-popconfirm>
          </a-button-group>
          <json-view :template="template" />
        </a-space>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 0]">
      <a-col :span="4">
        <a-card style="height: 100vh">
          <a-row>
            <a-col :span="24" class="rect-printElement-types hiprintEpContainer" />
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </a-card>
      </a-col>
      <a-col :span="6" class="params_setting_container">
        <a-card>
          <a-row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting"></div>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <!-- 预览 -->
    <print-preview ref="previewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { hiprint } from 'vue-plugin-hiprint';
  import printPreview from './preview.vue';
  import jsonView from './json-view.vue';
  import { getById, saveOrUpdate } from './print.api';
  import { ref, computed, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import $ from 'jquery';
  import providers from './providers';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const { createMessage } = useMessage();
  const template = ref(null);
  const previewRef = ref(null);

  // 模板选择
  // const mode = ref(0);
  // const modeList = ref([]);
  // 当前纸张
  const curPaper = ref({
    type: 'other',
    width: 220,
    height: 80,
  });

  // 纸张类型
  const paperTypes = ref({
    A3: {
      width: 420,
      height: 296.6,
    },
    A4: {
      width: 210,
      height: 296.6,
    },
    A5: {
      width: 210,
      height: 147.6,
    },
    B3: {
      width: 500,
      height: 352.6,
    },
    B4: {
      width: 250,
      height: 352.6,
    },
    B5: {
      width: 250,
      height: 175.6,
    },
  });
  const scaleValue = ref(1);
  const scaleMax = ref(5);
  const scaleMin = ref(0.5);
  const record = ref<Object>({
    id: null,
    template_name: '',
    template: '',
  });
  // 自定义纸张
  const paperPopVisible = ref(false);
  const paperWidth = ref('220');
  const paperHeight = ref('80');
  const curPaperType = computed(() => {
    let type = 'other';
    for (const key in paperTypes.value) {
      let item = paperTypes.value[key];
      let { width, height } = curPaper.value;
      if (item.width === width && item.height === height) {
        type = key;
      }
    }
    return type;
  });
  let hiprintTemplate;

  const isUpdate = ref(true);
  const isClone = ref(false);
  const [registerModal, { closeModal }] = useModalInner((data) => {
    isUpdate.value = !!data?.isUpdate;
    isClone.value = !!data?.isClone;
    record.value = {
      id: null,
      template_name: '',
      template: '',
    };
    if (isUpdate.value) {
      getById(data.record.id).then((res) => {
        record.value = res;
        init();
        otherPaper();
      });
    } else {
      init();
      otherPaper();
    }
    //查询数据
  });
  const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(isClone) ? '编辑' : '复制'));
  function init() {
    let provider = providers[0];
    hiprint.init({
      providers: [provider.f],
    });
    $('#hiprint-printTemplate').empty();
    $('.hiprintEpContainer').empty();
    hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
    // let templates = JSON.parse(window.localStorage.getItem('KEY_TEMPLATES') || '{}');
    template.value = hiprintTemplate = new hiprint.PrintTemplate({
      template: record.value.template ? JSON.parse(record.value.template) : {},
      dataMode: 1, // 1:getJson 其他：getJsonTid 默认1
      history: false, // 是否需要 撤销重做功能
      onDataChanged: (type, json) => {
        console.log(type); // 新增、移动、删除、修改(参数调整)、大小、旋转
        console.log(json); // 返回 template
        // 更新模板
        // hiprintTemplate.update(json)
        // console.log(hiprintTemplate.historyList)
      },
      settingContainer: '#PrintElementOptionSetting',
      // paginationContainer: '.hiprint-printPagination',
    });
    hiprintTemplate.design('#hiprint-printTemplate');
    // 获取当前放大比例, 当zoom时传true 才会有
    scaleValue.value = hiprintTemplate.editingPanel.scale || 1;

    if(record.value.template){
      const template = JSON.parse(record.value.template);
      const value = { width: template.panels[0].width, height: template.panels[0].height };
      setPaper('other', value);
    }
  }

  /**
   * 设置纸张大小
   * @param type [A3, A4, A5, B3, B4, B5, other]
   * @param value {width,height} mm
   */
  function setPaper(type, value) {
    try {
      if (Object.keys(paperTypes.value).includes(type)) {
        curPaper.value = { type: type, width: value.width, height: value.height };
        hiprintTemplate.setPaper(value.width, value.height);
      } else {
        curPaper.value = { type: 'other', width: value.width, height: value.height };
        hiprintTemplate.setPaper(value.width, value.height);
      }
    } catch (error) {
      createMessage.error(`操作失败: ${error}`);
    }
  }
  function changeScale(big) {
    let curScaleValue = scaleValue.value;
    if (big) {
      curScaleValue += 0.1;
      if (curScaleValue > scaleMax.value) curScaleValue = 5;
    } else {
      curScaleValue -= 0.1;
      if (curScaleValue < scaleMin.value) curScaleValue = 0.5;
    }
    if (hiprintTemplate) {
      // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
      hiprintTemplate.zoom(curScaleValue, true);
      scaleValue.value = curScaleValue;
    }
  }
  function otherPaper() {
    const value = { width: paperWidth.value, height: paperHeight.value };
    paperPopVisible.value = false;
    setPaper('other', value);
  }
  function preView() {
    let { width } = curPaper.value;
    previewRef.value.show(hiprintTemplate, null, width);
  }
  function save() {
    if(!record.value.template_name){
      createMessage.error('清输入模版名称');
      return;
    }
    record.value.template = JSON.stringify(hiprintTemplate.getJson());
    saveOrUpdate(record.value, isUpdate.value).then(() => {
      //刷新列表
      emit('success');
      closeModal();
    });
  }

  function clearPaper() {
    try {
      hiprintTemplate.clear();
    } catch (error) {
      createMessage.error(`操作失败: ${error}`);
    }
  }
</script>

<style lang="less" scoped>
  // build 拖拽
  /deep/ .hiprint-printElement-type > li > ul > li > a {
    padding: 4px 4px;
    color: #1296db;
    line-height: 1;
    height: auto;
    text-overflow: ellipsis;
  }

  // 默认图片
  /deep/ .hiprint-printElement-image-content {
    img {
      content: url('~@/assets/logo.png');
    }
  }

  // 设计容器
  .card-design {
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }

  /* 区域 */
  .left {
    background: white;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    padding: 10px 0;
    box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
    overflow: auto;
  }
  .center {
    margin: 0 10px;
    background: white;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    padding: 20px;
    box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
    overflow: auto;
  }
  .right {
    background: white;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    padding: 10px 0;
    box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
    overflow: auto;
  }
  /* 左侧拖拽元素样式 */
  .title {
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    margin: 10px 0 0 24px;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 4px 10px;
    margin: 10px 8px 4px 8px;
    width: 38%;
    min-height: 60px;
    border-radius: 4px;
    box-shadow: 2px 2px 2px 2px rgba(171, 171, 171, 0.2);
  }
  .item .iconfont {
    font-size: 1.5rem;
  }
  .item span {
    font-size: 14px;
  }
</style>
