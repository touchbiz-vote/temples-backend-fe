import { useDebounceFn } from '@vueuse/core';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import {
  ref,
  watch,
  resolveComponent,
  openBlock,
  createBlock,
  withCtx,
  createElementBlock,
  Fragment,
  renderList,
  createTextVNode,
  toDisplayString,
} from 'vue';
import { _ as _export_sfc } from './index.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
const { createMessage: $message } = useMessage();
const _sfc_main = {
  name: 'JOnlineSearchSelect',
  props: {
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    sql: {
      type: String,
      required: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    let selected = ref('');
    let selectOptions = ref([]);
    watch(
      () => props.value,
      (newVal) => {
        if (!newVal) {
          selected.value = void 0;
        } else {
          selected.value = newVal;
        }
      },
      { immediate: true }
    );
    watch(
      () => props.sql,
      () => {
        resetOptions();
      },
      { immediate: true }
    );
    const handleSearch = useDebounceFn(searchByKeyword, 800);
    function searchByKeyword(keyword = '') {
      let params = {
        keyword,
      };
      let url = '/online/cgreport/api/getReportDictList?sql=' + props.sql;
      defHttp.get({ url, params }, { isTransformResponse: false }).then((res) => {
        if (res.success) {
          if (res.result && res.result.length > 0) {
            selectOptions.value = res.result;
          } else {
            selectOptions.value = [];
          }
        } else {
          $message.warning(res.message);
        }
      });
    }
    function handleChange(value) {
      emit('update:value', value);
      if (!value || value == '') {
        resetOptions();
      }
    }
    function resetOptions() {
      selectOptions.value = [];
      searchByKeyword();
    }
    return {
      selectOptions,
      handleSearch,
      handleChange,
      selected,
    };
  },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_select_option = resolveComponent('a-select-option');
  const _component_a_select = resolveComponent('a-select');
  return (
    openBlock(),
    createBlock(
      _component_a_select,
      {
        value: $setup.selected,
        placeholder: $props.placeholder,
        'show-search': '',
        'default-active-first-option': false,
        'show-arrow': true,
        'filter-option': false,
        'not-found-content': null,
        onSearch: $setup.handleSearch,
        onChange: $setup.handleChange,
        allowClear: '',
      },
      {
        default: withCtx(() => [
          (openBlock(true),
          createElementBlock(
            Fragment,
            null,
            renderList($setup.selectOptions, (d) => {
              return (
                openBlock(),
                createBlock(
                  _component_a_select_option,
                  {
                    key: d.value,
                  },
                  {
                    default: withCtx(() => [createTextVNode(toDisplayString(d.text), 1)]),
                    _: 2,
                  },
                  1024
                )
              );
            }),
            128
          )),
        ]),
        _: 1,
      },
      8,
      ['value', 'placeholder', 'onSearch', 'onChange']
    )
  );
}
var JOnlineSearchSelect = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { JOnlineSearchSelect as default };
