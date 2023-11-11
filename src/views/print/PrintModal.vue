<!--
 * @Description: 使用 — 打印篇;
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-16 11:52:50
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-04-11 13:43:49
-->
<template>
  <BasicModal @register="registerModal" title="打印" width="800px">
    <a-form name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
      <a-form-item v-if="currentTemplate == null" label="打印模版" name="templateId" :model="formState">
        <a-select placeholder="请选择打印模版" @change="templateChange" v-model:value="formState.templateId">
          <a-select-option :value="null">请选择…</a-select-option>
          <template v-for="item in dictOptions" :key="`${item.value}`">
            <a-select-option :value="item.id">
              <span style="display: inline-block; width: 100%" :title="item.template_name">
                {{ item.template_name }}
              </span>
            </a-select-option>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item v-if="showPrintType" label="打印方式" name="printType">
        <a-radio-group button-style="solid" v-model:value="formState.printType" @change="printTypeChange">
          <a-radio-button value="web">浏览器打印</a-radio-button>
          <a-radio-button value="direct">直接打印</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formState.printType === 'direct'" label="打印机列表" name="print">
        <a-select placeholder="请选择打印机" v-model:value="formState.print">
          <a-select-option :value="null">请选择…</a-select-option>
          <template v-for="item in dictPrintList" :key="item.name">
            <a-select-option :value="item.name">
              <span style="display: inline-block; width: 100%" :title="item.name">
                {{ item.name }}
              </span>
            </a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item name="模版">
        <div
          class="hiprint-printTemplate"
          id="hiprint-printTemplate"
          :style="{ '--paperBackground': `url('${background}')`, width: `${width}mm`, height: `${height}mm` }"
        ></div>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="handleOk">打印</a-button>
      <!-- <a-button type="primary" @click="getHtml">打印预览</a-button> -->
      <a-button type="primary" @click="closeModal">取消</a-button>
    </template>
    <!-- <start-preview ref="preview" /> -->
  </BasicModal>
</template>

<script>
  export default {
    name: 'PrintModal',
    components: { BasicModal },
  };
</script>

<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { onMounted, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { hiprint } from 'vue-plugin-hiprint';
  import providers from './providers';

  // import startPreview from './components/preview.vue';
  import { Modal } from 'ant-design-vue';

  import { getList, getPrintHost, getTemplateContent } from './print.api';
  //按钮权限问题
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  //提示弹窗
  const $message = useMessage();
  const preview = ref(null);

  const dictOptions = ref([]);
  const dictPrintList = ref([]);
  const currentTemplate = ref(null);
  const showPrintType = ref(false);
  const width = ref();
  const height = ref();
  const formState = ref({
    printType: 'direct',
    printHost: '',
  });
  const scaleValue = ref(1);
  const printData = ref([]);

  // const attrs = useAttrs();
  const [registerModal, { closeModal }] = useModalInner((data) => {
    console.log(data);
    currentTemplate.value = data.template;
    const state = formState.value;
    state.templateId = data.template.id;
    templateChange(state.templateId);
    showPrintType.value = hasPermission('system:print:printType');
    printData.value = data.printData;
  });

  function printTypeChange(e) {
    console.log(e);
  }

  function handleOk() {
    const state = formState.value;
    if (!state.templateId) {
      $message.createWarningModal({
        title: '错误',
        content: '请选择一个打印模版',
      });
      return;
    }
    if (state.printType === 'direct' && !state.print) {
      $message.createWarningModal({
        title: '错误',
        content: '请选择一个本地打印机',
      });
      return;
    }

    console.log(state);

    const json = hiprintTemplate.getJson();
    console.log(json);
    if (!json) {
      $message.createWarningModal({
        title: '错误',
        content: '打印模版尚未进行具体设置，无法进行打印处理',
      });
      return;
    }
    const panel = json.panels[0];
    if (!panel || panel.printElements === null || Object.keys(panel.printElements).length === 0) {
      $message.createWarningModal({
        title: '错误',
        content: '打印模版尚未进行具体设置，无法进行打印处理',
      });
      return;
    }

    console.log(props.printData);

    Modal.confirm({
      title: '确认打印',
      content: '是否确认使用[' + currentTemplate.value.template_name + ']进行打印操作,共打印' + printData.value.length + '条数据',
      okText: '打印',
      cancelText: '取消',
      onOk: () => {
        if (state.printType === 'web') {
          printList();
        } else {
          print2List();
        }
      },
    });

    // //根据选择的打印方式选择对象的打印方法
    // closeModal();
  }
  /**
   * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  onMounted(() => {
    // buildDesigner();
    getList({ pageSize: 100, enabled: 1 }).then((res) => {
      dictOptions.value = res.records;
    });
    templateChange();
    getPrintHost({
      key: 'print_host',
    }).then((res) => {
      formState.value.printHost = res.configValue;
      connect(formState.value.printHost);
    });
  });

  function connect(host) {
    console.log(host);
    hiprint.hiwebSocket.setHost(host);
    // 这是异步的
    hiprint.refreshPrinterList((list) => {
      console.log(list);
      // hiprint对象获取
      dictPrintList.value = list;
    });
  }
  /**
   * 构建设计器
   * 注意: 必须要在 onMounted 中去构建
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  let hiprintTemplate;

  /**
   * 获取打印html
   */
  const getHtml = () => {
    let html = hiprintTemplate.getHtml(printData.value);
    preview.value.showModal(html);
  };
  const background = ref('');
  const templateChange = (e) => {
    if (!e) {
      return;
    }
    getTemplateContent(e).then((res) => {
      // let provider = providers[0];
      background.value = res.background;
      hiprint.init({
        providers: [providers[0].f],
      });
      // $('#hiprint-printTemplate').empty();

      hiprintTemplate = new hiprint.PrintTemplate({
        template: JSON.parse(res.template),
        dataMode: 1,
        // 字体添加
        fontList: [
          { title: '微软雅黑', value: 'Microsoft YaHei' },
          { title: '黑体', value: 'STHeitiSC-Light' },
          // { title: '思源黑体', value: 'SourceHanSansCN-Normal' },
          { title: '宋体', value: 'SimSun' },
          { title: '华文行楷', value: 'STXingkai' },
          { title: '华文新魏', value: 'STXinwei' },
          // { title: '王羲之书法体', value: '王羲之书法体' },
        ],
        // paginationContainer: '.hiprint-printPagination',
      });
      width.value = hiprintTemplate.printPanels[0].width;
      height.value = hiprintTemplate.printPanels[0].height;
      $('.hiprint-printTemplate').html(hiprintTemplate.getHtml(printData.value));
      // hiprintTemplate.design('#hiprint-printTemplate');
      //  console.log(hiprintTemplate);
      // 获取当前放大比例, 当zoom时传true 才会有
      // scaleValue.value = hiprintTemplate.editingPanel.scale || 1;
    });
  };

  const printList = () => {
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
    hiprintTemplate.print(props.printData, options, ext);
  };
  const print2List = () => {
    if (hiprint.hiwebSocket.opened) {
      const panel = hiprintTemplate.getJson().panels[0];
      console.log(props.printData);
      //从模版中获取打印尺寸
      const params = {
        printer: formState.value.print, // 打印机 名称
        title: '打印任务名称',
        color: false, // 是否打印颜色 默认 true
        copies: 1, // 打印份数 默认 1
        // deviceName: formState.value.print,
        pageSize: { height: panel.height * 1000, width: panel.width * 1000 },
      };
      console.log(params);
      hiprintTemplate.print2(props.printData, params);
      hiprintTemplate.on('printSuccess', function (data) {
        $message.createSuccessModal({ content: '打印完成' });
      });
      hiprintTemplate.on('printError', function (data) {
        $message.createErrorModal({ content: '打印失败' });
        console.log(data);
      });
    } else {
      alert('请先连接客户端(刷新网页), 然后再点击「直接打印」');
    }
  };
</script>
<style lang="less" scoped>
  ::v-deep .hiprint-printPaper {
    background-image: var(--paperBackground);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: left top;
  }

  @media print {
    ::v-deep .hiprint-printPaper {
      background-image: none;
    }
  }
</style>
