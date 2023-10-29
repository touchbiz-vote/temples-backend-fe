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
      <a-form-item label="打印模版" name="templateId" :model="formState">
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

      <a-form-item label="打印方式" name="printType">
        <a-radio-group button-style="solid" v-model:value="formState.printType" @change="printTypeChange">
          <a-radio-button value="web">浏览器打印</a-radio-button>
          <a-radio-button value="direct">直接打印</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formState.printType === 'direct'" label="打印客户端访问地址" name="printHost">
        <a-input v-model:value="formState.printHost" />
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
        <div class="hiprint-printTemplate" id="hiprint-printTemplate"></div>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="handleOk">打印</a-button>
      <a-button type="primary" @click="getHtml">打印预览</a-button>
      <a-button type="primary" @click="closeModal">取消</a-button>
    </template>
    <start-preview ref="preview" />
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
  import startPreview from './components/preview.vue';

  import printData2 from './printData2';
  import { getList, getPrintHost, getTemplateContent } from './print.api';
  //提示弹窗
  const $message = useMessage();
  const preview = ref(null);

  const dictOptions = ref([]);
  const dictPrintList = ref([]);
  const formState = ref({
    printType: 'web',
    printHost: '',
  });
  const scaleValue = ref(1);

  //自定义接受参数
  const props = defineProps({
    //是否禁用页面
    printData: {
      type: Object,
    },
  });
  // const attrs = useAttrs();
  const [registerModal, { closeModal }] = useModalInner();

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
        content: '请选择一个选择打印机',
      });
      return;
    }
    console.log(state);

    console.log(props.printData);
    if (state.printType === 'web') {
      printList();
    } else {
      print2List();
    }
    // //根据选择的打印方式选择对象的打印方法
    // closeModal();
  }
  /**
   * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  onMounted(() => {
    // buildDesigner();
    getList({ pageSize: 100 }).then((res) => {
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
    let html = hiprintTemplate.getHtml(printData);
    preview.value.showModal(html);
  };

  const templateChange = (e) => {
    if (!e) {
      return;
    }
    getTemplateContent(e).then((res) => {
      // let provider = providers[0];
      hiprint.init({
        //providers: [provider.f],
      });
      $('#hiprint-printTemplate').empty();

      hiprintTemplate = new hiprint.PrintTemplate({
        template: JSON.parse(res.template),
        // paginationContainer: '.hiprint-printPagination',
      });
      hiprintTemplate.design('#hiprint-printTemplate');
      console.log(hiprintTemplate);
      // 获取当前放大比例, 当zoom时传true 才会有
      scaleValue.value = hiprintTemplate.editingPanel.scale || 1;
    });
  };

  // const getHtmlList = () => {
  //   let html = hiprintTemplate.getHtml([printData, printData2]);
  //   preview.value.showModal(html);
  // };

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
    hiprintTemplate.print([ printData2], options, ext);
  };
  const print2List = () => {
    if (hiprint.hiwebSocket.opened) {
      hiprintTemplate.print2([printData2]);
    } else {
      alert('请先连接客户端(刷新网页), 然后再点击「直接打印」');
    }
  };
</script>
