var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
import { formatToDate } from '/@/utils/dateUtil';
import {
  defineComponent,
  ref,
  nextTick,
  resolveComponent,
  openBlock,
  createBlock,
  withCtx,
  createVNode,
  createTextVNode,
  normalizeClass,
  createElementVNode,
  toDisplayString,
} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { JCodeEditor } from '/@/components/Form';
import '/@/store';
import { defineStore } from 'pinia';
import { createLocalStorage } from '/@/utils/cache';
import { _ as _export_sfc } from './index.js';
const ls = createLocalStorage();
const ENHANCE_PRE = 'enhance_';
const useEnhanceStore = defineStore({
  id: 'online-cgform-enhance',
  state: () => ({
    enhanceJs: {},
  }),
  getters: {},
  actions: {
    getEnhanceJs(code) {
      this.enhanceJs[code] = ls.get(ENHANCE_PRE + code);
      return this.enhanceJs[code];
    },
    addEnhanceJs(record) {
      if (!this.enhanceJs[record.code]) {
        this.enhanceJs[record.code] = [__spreadValues({}, record)];
      } else {
        this.enhanceJs[record.code].push(__spreadValues({}, record));
      }
      let enhanceJsArray = this.enhanceJs[record.code];
      while (enhanceJsArray.length > 16) {
        enhanceJsArray.shift();
      }
      ls.set(ENHANCE_PRE + record.code, enhanceJsArray);
    },
  },
});
var EnhanceJsHistory_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = defineComponent({
  name: 'EnhanceJsHistory',
  components: { BasicModal, JCodeEditor },
  setup() {
    const enhanceStore = useEnhanceStore();
    const codeEditorRef = ref();
    const confirmLoading = ref(false);
    const dataList = ref([]);
    const jsStr = ref('');
    const activeIndex = ref(0);
    const [registerModal, { closeModal }] = useModalInner((data) =>
      __async(this, null, function* () {
        show(data.code, data.type);
      })
    );
    function show(code, type) {
      jsStr.value = '';
      dataList.value = [];
      let arr = enhanceStore.getEnhanceJs(code);
      let ls2 = [];
      let index = 0;
      for (let item of arr) {
        if (item.type === type) {
          index++;
          ls2.push(Object.assign({}, item, { index }));
        }
      }
      if (ls2 && ls2.length > 0) {
        ls2.sort((a, b) => {
          return b.date - a.date;
        });
      }
      dataList.value = [...ls2];
      nextTick(() => fullCode(ls2[0]));
    }
    function onCancel() {
      closeModal();
    }
    function getFormatDate(date) {
      return formatToDate(date, 'yyyy-MM-DD HH:mm:ss');
    }
    function fullCode(item) {
      activeIndex.value = item.index;
      codeEditorRef.value.setValue(item.str);
    }
    return {
      codeEditorRef,
      fullCode,
      registerModal,
      getFormatDate,
      onCancel,
      confirmLoading,
      dataList,
      jsStr,
      activeIndex,
    };
  },
});
const _hoisted_1 = ['onClick'];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_divider = resolveComponent('a-divider');
  const _component_a_list_item = resolveComponent('a-list-item');
  const _component_a_list = resolveComponent('a-list');
  const _component_a_layout_sider = resolveComponent('a-layout-sider');
  const _component_JCodeEditor = resolveComponent('JCodeEditor');
  const _component_a_layout_content = resolveComponent('a-layout-content');
  const _component_a_layout = resolveComponent('a-layout');
  const _component_a_spin = resolveComponent('a-spin');
  const _component_a_button = resolveComponent('a-button');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      {
        onRegister: _ctx.registerModal,
        title: 'JS\u589E\u5F3A\u5386\u53F2\u8BB0\u5F55',
        width: 1200,
        maskClosable: false,
        confirmLoading: _ctx.confirmLoading,
        defaultFullscreen: '',
        onCancel: _ctx.onCancel,
      },
      {
        footer: withCtx(() => [
          createVNode(
            _component_a_button,
            { onClick: _ctx.onCancel },
            {
              default: withCtx(() => [createTextVNode('\u5173\u95ED')]),
              _: 1,
            },
            8,
            ['onClick']
          ),
        ]),
        default: withCtx(() => [
          createVNode(
            _component_a_spin,
            { spinning: _ctx.confirmLoading },
            {
              default: withCtx(() => [
                createVNode(_component_a_layout, null, {
                  default: withCtx(() => [
                    createVNode(
                      _component_a_layout_sider,
                      { theme: 'light' },
                      {
                        default: withCtx(() => [
                          createVNode(
                            _component_a_list,
                            {
                              bordered: '',
                              dataSource: _ctx.dataList,
                              class: normalizeClass('enhance-list'),
                            },
                            {
                              header: withCtx(() => [
                                createElementVNode('div', null, [
                                  createVNode(
                                    _component_a_divider,
                                    { style: { margin: '0' } },
                                    {
                                      default: withCtx(() => [createTextVNode('\u4FDD\u5B58\u65F6\u95F4')]),
                                      _: 1,
                                    }
                                  ),
                                ]),
                              ]),
                              renderItem: withCtx(({ item }) => [
                                createVNode(
                                  _component_a_list_item,
                                  {
                                    class: normalizeClass(_ctx.activeIndex === item.index ? 'bg-blue' : ''),
                                  },
                                  {
                                    default: withCtx(() => [
                                      createElementVNode(
                                        'a',
                                        {
                                          onClick: ($event) => _ctx.fullCode(item),
                                        },
                                        toDisplayString(_ctx.getFormatDate(item.date)),
                                        9,
                                        _hoisted_1
                                      ),
                                    ]),
                                    _: 2,
                                  },
                                  1032,
                                  ['class']
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ['dataSource']
                          ),
                        ]),
                        _: 1,
                      }
                    ),
                    createVNode(_component_a_layout, null, {
                      default: withCtx(() => [
                        createVNode(
                          _component_a_layout_content,
                          { style: { margin: '8px 8px', padding: '8px', background: '#fff', minHeight: '280px' } },
                          {
                            default: withCtx(() => [
                              createVNode(
                                _component_JCodeEditor,
                                {
                                  ref: 'codeEditorRef',
                                  language: 'javascript',
                                  fullScreen: true,
                                  lineNumbers: false,
                                  'language-change': false,
                                },
                                null,
                                512
                              ),
                            ]),
                            _: 1,
                          }
                        ),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
            8,
            ['spinning']
          ),
        ]),
        _: 1,
      },
      8,
      ['onRegister', 'confirmLoading', 'onCancel']
    )
  );
}
var EnhanceJsHistory = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-8964b74c'],
]);
var EnhanceJsHistory$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: EnhanceJsHistory,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
export { EnhanceJsHistory as E, EnhanceJsHistory$1 as a, useEnhanceStore as u };
