var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => (x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected));
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { defineComponent, resolveComponent, openBlock, createBlock, withCtx, createVNode, nextTick } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form';
import { useMessage } from '/@/hooks/web/useMessage';
import { a as useExtendConfigFormSchemas } from './useSchemas.js';
import { _ as _export_sfc } from './index.js';
import 'ant-design-vue';
import '@ant-design/icons-vue';
import '/@/utils/common/compUtils';
import '/@/hooks/web/usePermission';
import '/@/utils/helper/validator';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
var ExtendConfigModal_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = defineComponent({
  name: 'CgformExtConfigModel',
  components: { BasicModal, BasicForm },
  props: {
    parentForm: {
      type: Object,
      required: true,
    },
  },
  emits: ['register', 'ok'],
  setup(props, { emit }) {
    const { createMessage: $message } = useMessage();
    const { formSchemas } = useExtendConfigFormSchemas(props, {
      onIsDesformChange,
      onJoinQueryChange,
      onReportPrintShowChange,
    });
    const [registerForm, { resetFields, setFieldsValue, getFieldsValue, clearValidate, validate }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: 'right',
    });
    const [registerModal, { closeModal }] = useModalInner((data) =>
      __async(this, null, function* () {
        yield resetFields();
        yield setFieldsValue(data.extConfigJson);
      })
    );
    function handleOk() {
      return __async(this, null, function* () {
        yield clearValidate();
        yield nextTick();
        try {
          const values = yield validate();
          emit('ok', values);
          closeModal();
        } catch (e) {}
      });
    }
    function handleCancel() {
      closeModal();
    }
    function onIsDesformChange(value) {
      if (value === 'Y') {
        let { themeTemplate } = props.parentForm.getFieldsValue(['themeTemplate']);
        if ('erp' === themeTemplate) {
          props.parentForm.setFieldsValue({ themeTemplate: 'normal' });
          $message.warning(
            '\u8BF7\u6CE8\u610F\uFF1Aerp\u98CE\u683C\u4E0D\u652F\u6301\u5BF9\u63A5\u8868\u5355\u8BBE\u8BA1\uFF0C\u5DF2\u81EA\u52A8\u6539\u4E3A\u9ED8\u8BA4\u98CE\u683C\uFF01'
          );
        }
      } else {
        clearValidate('desFormCode');
      }
    }
    const defaultReportPrintUrl = `{{ window._CONFIG['domianURL'] }}/jmreport/view/{\u79EF\u6728\u62A5\u8868ID}`;
    function onReportPrintShowChange(value) {
      return __async(this, null, function* () {
        let reportPrintUrl = getFieldsValue()['reportPrintUrl'];
        if (value === 0) {
          if (reportPrintUrl === defaultReportPrintUrl) {
            yield setFieldsValue({ reportPrintUrl: '' });
          }
        } else if (value === 1) {
          if (reportPrintUrl === '') {
            yield setFieldsValue({ reportPrintUrl: defaultReportPrintUrl });
          }
        }
        clearValidate('reportPrintUrl');
      });
    }
    function onJoinQueryChange(value) {
      if (value === 1) {
        let { themeTemplate, isTree, tableType } = props.parentForm.getFieldsValue(['themeTemplate', 'isTree', 'tableType']);
        if ('erp' === themeTemplate) {
          $message.warning('\u8BF7\u6CE8\u610F\uFF1Aerp\u98CE\u683C\u4E0D\u652F\u6301\u8054\u5408\u67E5\u8BE2\uFF0C\u914D\u7F6E\u65E0\u6548!');
          setFieldsValue({ joinQuery: 0 });
        }
        if ('innerTable' === themeTemplate) {
          $message.warning(
            '\u8BF7\u6CE8\u610F\uFF1A\u5185\u5D4C\u98CE\u683C\u4E0D\u652F\u6301\u8054\u5408\u67E5\u8BE2\uFF0C\u914D\u7F6E\u65E0\u6548!'
          );
          setFieldsValue({ joinQuery: 0 });
        }
        if (1 === tableType) {
          $message.warning('\u8BF7\u6CE8\u610F\uFF1A\u5355\u8868\u4E0D\u652F\u6301\u8054\u5408\u67E5\u8BE2\uFF0C\u914D\u7F6E\u65E0\u6548!');
          setFieldsValue({ joinQuery: 0 });
        } else if (3 === tableType) {
          $message.warning('\u8BF7\u6CE8\u610F\uFF1A\u5F53\u524D\u8868\u4E3A\u9644\u8868\uFF0C\u8BF7\u5728\u5BF9\u5E94\u4E3B\u8868\u914D\u7F6E!');
          setFieldsValue({ joinQuery: 0 });
        } else if ('Y' === isTree) {
          $message.warning(
            '\u8BF7\u6CE8\u610F\uFF1A\u6811\u5F62\u5217\u8868\u4E0D\u652F\u6301\u8054\u5408\u67E5\u8BE2\uFF0C\u914D\u7F6E\u65E0\u6548!'
          );
          setFieldsValue({ joinQuery: 0 });
        }
      }
    }
    return {
      handleOk,
      handleCancel,
      registerModal,
      registerForm,
    };
  },
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent('BasicForm');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      {
        onRegister: _ctx.registerModal,
        title: '\u6269\u5C55\u914D\u7F6E',
        width: 1e3,
        onOk: _ctx.handleOk,
        onCancel: _ctx.handleCancel,
      },
      {
        default: withCtx(() => [createVNode(_component_BasicForm, { onRegister: _ctx.registerForm }, null, 8, ['onRegister'])]),
        _: 1,
      },
      8,
      ['onRegister', 'onOk', 'onCancel']
    )
  );
}
var ExtendConfigModal = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-1eeac864'],
]);
export { ExtendConfigModal as default };
