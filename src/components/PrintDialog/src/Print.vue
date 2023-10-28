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
    <a-select placeholder="请选择打印模版" />
    <a-switch placeholder="请选择打印方式" />
    <div class="flex-col">
      <div class="flex-row" style="height: 87vh">
        <div class="flex-4 center">
          <!-- 设计器的 容器1 -->
          <div id="hiprint-printTemplate"></div>
        </div>
        <div class="flex-2 right">
          <!-- 元素参数的 容器 -->
          <div id="PrintElementOptionSetting"></div>
        </div>
      </div>
      <start-preview ref="preview" />
    </div>
    <template #footer>
      <a-button type="primary" @click="handleOk">打印</a-button>
      <a-button type="primary" @click="getHtml">打印预览</a-button>
      <a-button type="primary" @click="closeModal">取消</a-button>
    </template>
  </BasicModal>
</template>

<script>
  export default {
    name: 'PrintDialog',
    components: { BasicModal },
  };
</script>

<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { onMounted, ref } from 'vue';
  import { hiprint } from 'vue-plugin-hiprint';
  import startPreview from '../components/preview.vue';
  import template from './template';
  import printData from './printData';
  import printData2 from './printData2';

  const preview = ref(null);

  // const attrs = useAttrs();
  const [registerModal, { closeModal }] = useModalInner();

  function handleOk() {
    //根据选择的打印方式选择对象的打印方法
    closeModal();
  }
  /**
   * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  onMounted(() => {
    buildDesigner();
  });
  /**
   * 构建设计器
   * 注意: 必须要在 onMounted 中去构建
   * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
   */
  let hiprintTemplate;
  const buildDesigner = () => {
    // eslint-disable-next-line no-undef
    $('#hiprint-printTemplate').empty(); // 先清空, 避免重复构建
    hiprintTemplate = new hiprint.PrintTemplate({
      template: template, // 模板json(object)
      settingContainer: '#PrintElementOptionSetting', // 元素参数容器
    });
    // 构建 并填充到 容器中
    hiprintTemplate.design('#hiprint-printTemplate', { grid: true }); // 0.0.46版本新增, 是否显示网格
  };

  /**
   * 获取打印html
   */
  const getHtml = () => {
    let html = hiprintTemplate.getHtml(printData);
    preview.value.showModal(html);
  };
  // const getHtmlList = () => {
  //   let html = hiprintTemplate.getHtml([printData, printData2]);
  //   preview.value.showModal(html);
  // };

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
    hiprintTemplate.print([printData, printData2], options, ext);
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
  const print2List = () => {
    if (hiprint.hiwebSocket.opened) {
      hiprintTemplate.print2([printData, printData2]);
    } else {
      alert('请先连接客户端(刷新网页), 然后再点击「直接打印」');
    }
  };
</script>

<style scoped>
  /* api按钮 */
  .api {
    background: #00acc1;
  }
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
