<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="95%">
    <BasicForm @register="registerForm" :disabled="isDisabled">
      <template #template="{ model, field }">
        <div class="flex-col">
          <div class="flex-row justify-center" style="margin-bottom: 10px">
            <!-- 纸张大小 A3、A4 等 -->
            <div class="paper">
              <template v-for="(value, type) in paperTypes" :key="type">
                <Button  @click="setPaper(type, value)">
                  {{ type }}
                </Button>
              </template>
              <!-- 自定义纸张 -->
              <Button class="auto" @click="showPaperPop">自定义纸张</Button>
              <div class="popover">
                <div class="popover-content flex-col" v-show="paperPopVisible">
                  <div style="font-size: 16px; font-weight: bold">设置纸张宽高(mm)</div>
                  <div class="flex-row mt-10">
                    <input class="input" :value="paperWidth" type="number" placeholder="宽(mm)" />
                    <span class="ml-10 mr-10">x</span>
                    <input class="input" :value="paperHeight" type="number" placeholder="高(mm)" />
                  </div>
                  <Button type="primary" @click.stop="setPaperOther">确定</Button>
                </div>
              </div>
            </div>
            <!-- 缩放 -->
            <div class="flex-row align-center ml-10">
              <Button class="info circle-10" @click="changeScale(false)"><i class="iconfont sv-zoom-out"></i></Button>
              <div style="margin: 0 4px; width: 40px">{{ (scaleValue * 100).toFixed(0) }}%</div>
              <Button class="info circle-10" @click="changeScale(true)"><i class="iconfont sv-zoom-in"></i></Button>
            </div>
            <Button type="primary" @click.stop="rotatePaper"> 旋转纸张(宽高互换) </Button>
            <Button @click.stop="clearPaper">
              <ClearOutlined />
              清空纸张
            </Button>
            <Button @click.stop="print">
              <PrinterOutlined />
              浏览器打印
            </Button>
            <Button @click.stop="print2">
              <PrinterOutlined />
              直接打印(需要连接客户端)
            </Button>
          </div>
          <div class="flex-row" style="height: 87vh">
            <div class="flex-2 left">
              <div class="flex-row justify-center flex-wrap">
                <div class="title">基础元素</div>
                <div class="ep-draggable-item item" tid="defaultModule.text">
                  <i class="iconfont sv-text"></i>
                  <span>文本</span>
                </div>
                <div class="ep-draggable-item item" tid="defaultModule.image">
                  <i class="iconfont sv-image"></i>
                  <span>图片</span>
                </div>
                <div class="ep-draggable-item item" tid="defaultModule.longText">
                  <i class="iconfont sv-longText"></i>
                  <span>长文</span>
                </div>

                <div class="ep-draggable-item item" tid="defaultModule.customText">
                  <i class="iconfont sv-text"></i>
                  <span>自定义</span>
                </div>
                <div class="title">辅助元素</div>
                <div class="ep-draggable-item item" tid="defaultModule.hline">
                  <i class="iconfont sv-hline"></i>
                  <span>横线</span>
                </div>
                <div class="ep-draggable-item item" tid="defaultModule.vline">
                  <i class="iconfont sv-vline"></i>
                  <span>竖线</span>
                </div>
                <div class="ep-draggable-item item" tid="defaultModule.rect">
                  <i class="iconfont sv-rect"></i>
                  <span>矩形</span>
                </div>
                <div class="ep-draggable-item item" tid="defaultModule.oval">
                  <i class="iconfont sv-oval"></i>
                  <span>圆形</span>
                </div>
              </div>
            </div>
            <div class="flex-5 center">
              <!-- 设计器的 容器 -->
              <div id="hiprint-printTemplate"></div>
            </div>
            <div class="flex-2 right">
              <!-- 元素参数的 容器 -->
              <div id="PrintElementOptionSetting"></div>
            </div>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup name="PrintTemplateModal">
  import { ref, computed, unref, defineProps, onMounted, getCurrentInstance } from 'vue';
  import { PrinterOutlined, ClearOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Button } from '/@/components/Button';
  import { hiprint } from 'vue-plugin-hiprint';
  import { formSchema } from './print.data';
  import { saveOrUpdate, getById } from './print.api';
  import { provider2 } from './provider2';
  import template from './template';
  import printData from './printData';
  // 组合式函数 hooks
  import { usePaper } from './hooks/use-paper';
  import { useZoom } from './hooks/use-zoom';
  // 工具
  import { newHiprintPrintTemplate } from './utils/template-helper';

  const TEMPLATE_KEY = getCurrentInstance().type.name; // 存储模板对象的 key
  const { paperTypes, curPaperType, paperPopVisible, paperWidth, paperHeight, showPaperPop, setPaper, setPaperOther } = usePaper(TEMPLATE_KEY);
  const { scaleValue, changeScale } = useZoom(TEMPLATE_KEY);

  // 声明Emits
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isClone = ref(false);
  const printTemplate = ref<HTMLDivElement | null>(null);

  // 自定义传入 provider 的参数
  let options = {
    config: {
      tid: 'providerModule1.config',
      title: '参数provider示例',
      type: 'text',
      options: {
        testData: '单据表头',
        height: 30,
        fontSize: 16,
      },
    },
  };
  // 初始化 provider
  hiprint.init({
    providers: [provider2(options)],
  });
  /**
   * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  onMounted(() => {
    buildLeftElement();
    buildDesigner();
  });
  /**
   * 构建左侧可拖拽元素
   * 注意: 可拖拽元素必须在 hiprint.init() 之后调用
   * 调用之前 可以先 console.log($("#hiprint-printTemplate")) 看看是否有该 dom
   */
  const buildLeftElement = () => {
    // ----- providerModule1 -----
    // eslint-disable-next-line no-undef
    $('#provider-container1').empty(); // 先清空, 避免重复构建
    // eslint-disable-next-line no-undef
    hiprint.PrintElementTypeManager.build($('#provider-container1'), 'providerModule1');
    // ----- providerModule2 -----
    // eslint-disable-next-line no-undef
    $('#provider-container2').empty(); // 先清空, 避免重复构建
    // eslint-disable-next-line no-undef
    hiprint.PrintElementTypeManager.build($('#provider-container2'), 'providerModule2');
  };
  /**
   * 构建设计器
   * 注意: 必须要在 onMounted 中去构建
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  let hiprintTemplate;
  // ref 创建的模板json
  const templateRef = ref(template);
  console.log('templateRef 数据格式:');
  console.log('templateRef', templateRef);
  console.log('templateRef.value', templateRef.value);
  const buildDesigner = () => {
    // eslint-disable-next-line no-undef
    $('#hiprint-printTemplate').empty(); // 先清空, 避免重复构建
    // 注意事项: 模板json(object)
    // 如果使用 vue ref创建的模板json, 需要使用 .value 获取 (确保内部能够使用 object.key 拿到对应数据就行)
    hiprintTemplate = newHiprintPrintTemplate(TEMPLATE_KEY, {
      template: templateRef.value, // 模板json(object)
      settingContainer: '#PrintElementOptionSetting', // 元素参数容器
    });
    // 构建 并填充到 容器中
    hiprintTemplate.design('#hiprint-printTemplate');
    console.log(hiprintTemplate);
  };

  /**
   * 浏览器打印
   */
  const print = () => {
    // 参数: 打印时设置 左偏移量，上偏移量
    let options = { leftOffset: -1, topOffset: -1 };
    // 扩展
    let ext = {
      callback: () => {
        console.log('浏览器打印窗口已打开');
      },
      styleHandler: () => {
        // 重写 文本 打印样式
        return '<style>.hiprint-printElement-text{color:red !important;}</style>';
      },
    };
    // 调用浏览器打印
    hiprintTemplate.print(printData, options, ext);
  };
  /**
   * 直接打印: 借助客户端,静默打印(无弹窗直接打印)
   * 注意: 需要先连接客户端
   */
  const print2 = () => {
    if (hiprint.hiwebSocket.opened) {
      hiprintTemplate.print2(printData);
    } else {
      alert('请先连接客户端(刷新网页), 然后再点击「直接打印」');
    }
  };
  // ----------------- 模板对象 api 部分 -----------------
  /**
   * 旋转纸张
   */
  const rotatePaper = () => {
    hiprintTemplate.rotatePaper();
  };
  /**
   * 清空所有元素
   */
  const clearPaper = () => {
    hiprintTemplate.clear();
  };
  /**
   * 导出模板 json
   * 必须确保 hiprintTemplate 已成功创建
   */
  const exportJson = () => {
    let json = hiprintTemplate.getJson();
    console.log(json);
    alert('导出成功! 请查看控制台输出');
  };

  //自定义接受参数
  const props = defineProps({
    //是否禁用页面
    isDisabled: {
      type: Boolean,
      default: false,
    },
  });

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    //labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showOkBtn: !props.isDisabled });
    isUpdate.value = !!data?.isUpdate;
    isClone.value = !!data?.isClone;
    if (unref(isUpdate) || unref(isClone)) {
      //获取详情
      data.record = await getById(data.record.id);
      if (data.record) {
        if (data.record.start_date && data.record.end_date) {
          data.record.avaliabDate = data.record.start_date + ',' + data.record.end_date;
        }
      }
      if (isClone.value) {
        data.record.id = null;
      }
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(isClone) ? '编辑' : '复制'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      console.log(values);
      if (values.avaliabDate) {
        const dates = values.avaliabDate.split(',');
        values.start_date = dates[0];
        values.end_date = dates[1];
      }

      //提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success', values);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style>
  /* 重写默认的一个样式 */
  .rect-printElement-types .hiprint-printElement-type > li > ul > li > a {
    color: red !important;
  }

  /* 自定义 provider 构建样式 */
  .custom-style-types .hiprint-printElement-type {
    display: block;
  }
  .custom-style-types .hiprint-printElement-type {
    padding: 0 0 0 0;
    list-style: none;
  }
  .custom-style-types .hiprint-printElement-type > li > .title {
    display: block;
    padding: 4px 0px;
    color: rgb(0, 58, 230);
    clear: both;
  }
  .custom-style-types .hiprint-printElement-type > li > ul {
    padding: 0 0 0 0;
    display: block;
    list-style: none;
  }
  .custom-style-types .hiprint-printElement-type > li > ul > li {
    display: block;
    width: 50%;
    float: left;
    max-width: 100px;
  }
  .custom-style-types .hiprint-printElement-type > li > ul > li > a {
    padding: 12px 6px;
    color: #1296db;
    text-decoration: none;
    background: #fff;
    border: 1px solid #ddd;
    margin-right: 5px;
    width: 95%;
    max-width: 100px;
    display: inline-block;
    text-align: center;
    margin-bottom: 7px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
  }
</style>

<style scoped>
  .auto {
    width: auto !important;
  }
  /* 纸张 */
  .paper {
    margin-right: 10px;
  }
  .paper button:not(class*='auto') {
    width: 60px !important;
  }
  /* 多个 button 间距 */
  .paper button + button {
    margin-left: -1px;
  }
  .paper button:first-child:last-child {
    border-radius: 4px;
  }
  /* 两边的 btn 圆角 */
  .paper button:first-child:not(:last-child) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .paper button:last-child:not(:first-child) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .popover {
    position: absolute;
    margin-top: 10px;
    z-index: 10;
  }
  .popover .popover-content {
    background: white;
    border-radius: 4px;
    padding: 10px 14px;
    box-shadow: 2px 2px 2px 4px rgb(128 0 128 / 20%);
  }
  .popover .input {
    height: 24px;
    padding: 2px 4px;
  }
  .popover .input:hover {
    border-color: rgb(245, 155, 241);
    border-radius: 4px;
  }

  /* 区域 */
  .left {
    background: white;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    box-shadow: 2px 2px 2px 0px rgb(128 0 128 / 20%);
    overflow: auto;
  }
  .left .container {
    height: 50%;
    overflow: auto;
    padding: 0 10%;
    background: rgb(245, 155, 241);
  }
  .left .container[id*='provider-container2'] {
    margin-bottom: 10px;
    background: rgb(209, 120, 239);
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
    margin: 4px 0 4px 10px;
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
