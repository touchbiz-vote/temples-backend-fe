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
import {
  defineComponent,
  ref,
  watch,
  resolveComponent,
  openBlock,
  createBlock,
  withCtx,
  createElementBlock,
  Fragment,
  renderList,
  createElementVNode,
  toDisplayString,
} from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { _ as _export_sfc } from './index.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
const SELECT_OPTIONS_URL = '/online/cgform/api/querySelectOptions';
const _sfc_main = defineComponent({
  name: 'OnlineSelectCascade',
  props: {
    table: { type: String, default: '' },
    txt: { type: String, default: '' },
    store: { type: String, default: '' },
    idField: { type: String, default: '' },
    pidField: { type: String, default: '' },
    pidValue: { type: String, default: '-1' },
    origin: { type: Boolean, default: false },
    condition: { type: String, default: '' },
    value: { type: String, default: '' },
    isNumber: { type: Boolean, default: false },
    placeholder: { type: String, default: '\u8BF7\u9009\u62E9' },
  },
  emits: ['change', 'next'],
  setup(props, { emit }) {
    const { createMessage: $message } = useMessage();
    const selectedValue = ref('');
    const dictOptions = ref([]);
    const optionsLoad = ref(true);
    function handleChange(value) {
      console.log('handleChange', value);
      let temp = value || '';
      emit('change', temp);
      valueChangeThenEmitNext(temp);
    }
    watch(
      () => props.condition,
      (val) => {
        optionsLoad.value = true;
        if (val) {
          loadOptions();
        }
      },
      { immediate: true }
    );
    watch(
      () => props.pidValue,
      (val) => {
        if (val === '-1') {
          dictOptions.value = [];
        } else {
          loadOptions();
        }
      }
    );
    watch(
      () => props.value,
      (newVal, oldVal) => {
        console.log('\u503C\u6539\u53D8\u4E8B\u4EF6', newVal, oldVal);
        if (!newVal) {
          selectedValue.value = [];
          if (oldVal) {
            emit('change', '');
            emit('next', '-1');
          }
        } else {
          selectedValue.value = newVal;
        }
        if (newVal && !oldVal) {
          handleFirstValueSetting(newVal);
        }
      },
      { immediate: true }
    );
    function handleFirstValueSetting(value) {
      return __async(this, null, function* () {
        if (props.idField === props.store) {
          emit('next', value);
        } else {
          if (props.origin === true) {
            yield getSelfOptions();
            valueChangeThenEmitNext(value);
          } else {
            let arr = yield loadValueText();
            valueChangeThenEmitNext(value, arr);
          }
        }
      });
    }
    function loadOptions() {
      let params = getQueryParams();
      if (props.origin === true) {
        params['condition'] = props.condition;
      } else {
        params['pidValue'] = props.pidValue;
      }
      console.log('\u8BF7\u6C42\u53C2\u6570', params);
      dictOptions.value = [];
      defHttp.get({ url: SELECT_OPTIONS_URL, params }, { isTransformResponse: false }).then((res) => {
        if (res.success) {
          dictOptions.value = [...res.result];
          console.log('\u8BF7\u6C42\u7ED3\u679C', res.result, dictOptions);
        } else {
          $message.warning('\u8054\u52A8\u7EC4\u4EF6\u6570\u636E\u52A0\u8F7D\u5931\u8D25,\u8BF7\u68C0\u67E5\u914D\u7F6E!');
        }
      });
    }
    function getQueryParams() {
      let params = {
        table: props.table,
        txt: props.txt,
        key: props.store,
        idField: props.idField,
        pidField: props.pidField,
      };
      return params;
    }
    function loadValueText() {
      return new Promise((resolve) => {
        if (!props.value) {
          selectedValue.value = [];
          resolve([]);
        } else {
          let params = getQueryParams();
          if (props.isNumber === true) {
            params['condition'] = `${props.store} = ${props.value}`;
          } else {
            params['condition'] = `${props.store} = '${props.value}'`;
          }
          defHttp.get({ url: SELECT_OPTIONS_URL, params }, { isTransformResponse: false }).then((res) => {
            if (res.success) {
              resolve(res.result);
            } else {
              $message.warning('\u8054\u52A8\u7EC4\u4EF6\u6570\u636E\u52A0\u8F7D\u5931\u8D25,\u8BF7\u68C0\u67E5\u914D\u7F6E!');
              resolve([]);
            }
          });
        }
      });
    }
    function getSelfOptions() {
      return new Promise((resolve) => {
        let index = 0;
        (function next(index2) {
          if (index2 > 10) {
            resolve([]);
          }
          let arr = dictOptions.value;
          if (arr && arr.length > 0) {
            resolve(arr);
          } else {
            setTimeout(() => {
              next(index2++);
            }, 300);
          }
        })(index);
      });
    }
    function valueChangeThenEmitNext(value, arr = []) {
      if (value && value.length > 0) {
        if (!arr || arr.length == 0) {
          arr = dictOptions.value;
        }
        let selected = arr.filter((item) => item.store === value);
        if (selected && selected.length > 0) {
          let id = selected[0].id;
          emit('next', id);
        }
      }
    }
    return {
      selectedValue,
      dictOptions,
      handleChange,
    };
  },
});
const _hoisted_1 = ['title'];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_select_option = resolveComponent('a-select-option');
  const _component_a_select = resolveComponent('a-select');
  return (
    openBlock(),
    createBlock(
      _component_a_select,
      {
        placeholder: _ctx.placeholder,
        value: _ctx.selectedValue,
        onChange: _ctx.handleChange,
        allowClear: '',
        style: { width: '100%' },
      },
      {
        default: withCtx(() => [
          (openBlock(true),
          createElementBlock(
            Fragment,
            null,
            renderList(_ctx.dictOptions, (item, index) => {
              return (
                openBlock(),
                createBlock(
                  _component_a_select_option,
                  {
                    key: index,
                    value: item.store,
                  },
                  {
                    default: withCtx(() => [
                      createElementVNode(
                        'span',
                        {
                          style: { display: 'inline-block', width: '100%' },
                          title: item.label,
                        },
                        toDisplayString(item.label),
                        9,
                        _hoisted_1
                      ),
                    ]),
                    _: 2,
                  },
                  1032,
                  ['value']
                )
              );
            }),
            128
          )),
        ]),
        _: 1,
      },
      8,
      ['placeholder', 'value', 'onChange']
    )
  );
}
var OnlineSelectCascade = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { OnlineSelectCascade as default };
