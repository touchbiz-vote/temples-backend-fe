import { computed, openBlock, createElementBlock, createElementVNode, createCommentVNode, pushScopeId, popScopeId } from 'vue';
import { _ as _export_sfc } from './index.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import '/@/hooks/web/useMessage';
import 'vue-router';
var JModalTip_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = {
  name: 'JModalTip',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['save', 'cancel'],
  setup(props) {
    const flag = computed(() => {
      return props.visible;
    });
    return {
      flag,
    };
  },
};
const _withScopeId = (n) => (pushScopeId('data-v-c18755ca'), (n = n()), popScopeId(), n);
const _hoisted_1 = {
  key: 0,
  class: 'jeecg-update-tip-bar',
};
const _hoisted_2 = { class: 'container' };
const _hoisted_3 = { class: 'outer' };
const _hoisted_4 = { class: 'inner' };
const _hoisted_5 = /* @__PURE__ */ _withScopeId(() =>
  /* @__PURE__ */ createElementVNode('span', { class: 'tip' }, '\u6B63\u5728\u4FEE\u6539\u8868\u5355\u6570\u636E \xB7\xB7\xB7', -1)
);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $setup.flag
    ? (openBlock(),
      createElementBlock('div', _hoisted_1, [
        createElementVNode('div', _hoisted_2, [
          createElementVNode('div', _hoisted_3, [
            createElementVNode('div', _hoisted_4, [
              _hoisted_5,
              createElementVNode(
                'div',
                {
                  class: 'cancel',
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit('cancel')),
                },
                '\u53D6\u6D88'
              ),
              createElementVNode(
                'div',
                {
                  class: 'save',
                  onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit('save')),
                },
                '\u4FDD\u5B58'
              ),
            ]),
          ]),
        ]),
      ]))
    : createCommentVNode('', true);
}
var JModalTip = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-c18755ca'],
]);
export { JModalTip as default };
