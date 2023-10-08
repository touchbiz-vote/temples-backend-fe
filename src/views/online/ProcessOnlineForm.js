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
import { O as OnlineForm } from './OnlineForm.js';
import {
  defineComponent,
  ref,
  watch,
  nextTick,
  resolveComponent,
  openBlock,
  createElementBlock,
  createVNode,
  withCtx,
  createTextVNode,
  createCommentVNode,
} from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { g as getRefPromise } from './useExtendComponent.js';
import { _ as _export_sfc } from './index.js';
import '/@/hooks/web/useMessage';
import '/@/components/Form/index';
import '/@/utils';
import '/@/components/Loading';
import '/@/components/jeecg/JVxeTable/types';
import '/@/utils/auth';
import '@ant-design/icons-vue';
import '/@/hooks/core/useContext';
import '/@/utils/mitt';
import '/@/components/Modal';
import '/@/utils/cache';
import '/@/utils/common/compUtils';
import '/@/store/modules/user';
import './pick.js';
import './_flatRest.js';
import './isArray.js';
import './toString.js';
import './_arrayPush.js';
import './omit.js';
import './_baseClone.js';
import './_baseSlice.js';
import '/@/components/Form/src/componentMap';
import '/@/utils/propTypes';
import '/@/components/Form/src/jeecg/components/JUpload';
import '/@/views/system/user/user.api';
import './_commonjsHelpers.js';
import '/@/utils/desform/customExpression';
import '/@/store/modules/permission';
import '/@/utils/dict/JDictSelectUtil';
import '/@/components/Table';
import '/@/hooks/system/useListPage';
import 'vue-router';
import '/@/components/Form/src/utils/Area';
import '/@/components/Preview/index';
import './LinkTableListPiece.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import './OnlineSelectCascade.js';
import './JModalTip.js';
import 'ant-design-vue';
import '@vueuse/core';
var ProcessOnlineForm_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = defineComponent({
  name: 'ProcessOnlineForm',
  components: {
    OnlineForm,
  },
  inheritAttrs: false,
  props: {
    dataId: {
      type: String,
      default: '',
    },
    tableName: {
      type: String,
      default: '',
    },
    taskId: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const onlineFormCompRef = ref();
    const formId = ref('');
    const formTemplate = ref(1);
    const isTreeForm = ref(false);
    const pidFieldName = ref('');
    const spinLoading = ref(false);
    watch(
      () => props.tableName,
      (val) => {
        if (!val) {
          return;
        }
        loadFormItems();
      },
      { immediate: true }
    );
    function loadFormItems() {
      return __async(this, null, function* () {
        spinLoading.value = true;
        const url = `/online/cgform/api/getFormItemBytbname/${props.tableName}`;
        const params = { taskId: props.taskId };
        try {
          let result = yield defHttp.get({ url, params });
          console.log('\u52A8\u6001\u8868\u5355\u67E5\u8BE2\u7ED3\u679C\u662F\uFF1A', result);
          formId.value = result.head.id;
          formTemplate.value = Number(result.head.formTemplate || 1);
          isTreeForm.value = result.head.isTree === 'Y';
          pidFieldName.value = result.head.treeParentIdField || '';
          yield nextTick(() =>
            __async(this, null, function* () {
              let myForm = yield getRefPromise(onlineFormCompRef);
              myForm.createRootProperties(result);
            })
          );
        } catch (e) {
          console.error('\u6D41\u7A0B\u8868\u5355\u67E5\u8BE2\u5F02\u5E38', e);
        }
      });
    }
    function renderSuccess() {
      return __async(this, null, function* () {
        let myForm = yield getRefPromise(onlineFormCompRef);
        spinLoading.value = false;
        myForm.show(true, {
          id: props.dataId,
        });
      });
    }
    const buttonLoading = ref(false);
    function handleSubmit() {
      return __async(this, null, function* () {
        buttonLoading.value = true;
        onlineFormCompRef.value.handleSubmit();
      });
    }
    function handleSuccess() {
      buttonLoading.value = false;
    }
    return {
      onlineFormCompRef,
      formId,
      formTemplate,
      isTreeForm,
      pidFieldName,
      renderSuccess,
      handleSuccess,
      handleSubmit,
      buttonLoading,
      spinLoading,
    };
  },
});
const _hoisted_1 = { class: 'cust-onl-form' };
const _hoisted_2 = {
  key: 0,
  style: { width: '100%', 'text-align': 'center', 'margin-top': '5px' },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent('a-button');
  const _component_online_form = resolveComponent('online-form');
  const _component_a_spin = resolveComponent('a-spin');
  return (
    openBlock(),
    createElementBlock('div', _hoisted_1, [
      createVNode(
        _component_a_spin,
        { spinning: _ctx.spinLoading },
        {
          default: withCtx(() => [
            createVNode(
              _component_online_form,
              {
                ref: 'onlineFormCompRef',
                id: _ctx.formId,
                disabled: _ctx.disabled,
                'form-template': _ctx.formTemplate,
                isTree: _ctx.isTreeForm,
                pidField: _ctx.pidFieldName,
                onRendered: _ctx.renderSuccess,
                onSuccess: _ctx.handleSuccess,
              },
              {
                bottom: withCtx(() => [
                  !_ctx.disabled && !_ctx.spinLoading
                    ? (openBlock(),
                      createElementBlock('div', _hoisted_2, [
                        createVNode(
                          _component_a_button,
                          {
                            preIcon: 'ant-design:check',
                            style: { width: '126px' },
                            type: 'primary',
                            onClick: _ctx.handleSubmit,
                            loading: _ctx.buttonLoading,
                          },
                          {
                            default: withCtx(() => [createTextVNode(' \u63D0 \u4EA4 ')]),
                            _: 1,
                          },
                          8,
                          ['onClick', 'loading']
                        ),
                      ]))
                    : createCommentVNode('', true),
                ]),
                _: 1,
              },
              8,
              ['id', 'disabled', 'form-template', 'isTree', 'pidField', 'onRendered', 'onSuccess']
            ),
          ]),
          _: 1,
        },
        8,
        ['spinning']
      ),
    ])
  );
}
var ProcessOnlineForm = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-9b256bc4'],
]);
export { ProcessOnlineForm as default };
