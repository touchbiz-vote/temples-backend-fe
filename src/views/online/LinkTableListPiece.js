import { propTypes } from '/@/utils/propTypes';
import { openBlock, createElementBlock, createElementVNode, toDisplayString } from 'vue';
import { _ as _export_sfc } from './index.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import '/@/hooks/web/useMessage';
import 'vue-router';
var LinkTableListPiece_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = {
  name: 'LinkTableListPiece',
  props: {
    text: propTypes.string.def(''),
    id: propTypes.string.def(''),
  },
  emits: ['tab'],
  setup(props, { emit }) {
    function handleClick(e) {
      e == null ? void 0 : e.stopPropagation();
      e == null ? void 0 : e.preventDefault();
      console.log(props.id);
      emit('tab', props.id);
    }
    return {
      handleClick,
    };
  },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createElementBlock(
      'div',
      {
        class: 'link-table-piece',
        onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleClick && $setup.handleClick(...args)),
      },
      [createElementVNode('span', null, toDisplayString($props.text), 1)]
    )
  );
}
var LinkTableListPiece = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-33745cde'],
]);
export { LinkTableListPiece as default };
