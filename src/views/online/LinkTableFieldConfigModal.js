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
import { BasicModal, useModalInner } from '/@/components/Modal';
import { ref, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { _ as _export_sfc } from './index.js';
import { o as omit } from './omit.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
import './toString.js';
import './isArray.js';
import './_baseClone.js';
import './_arrayPush.js';
import './_flatRest.js';
import './_baseSlice.js';
const _sfc_main = {
  name: 'LinkTableFieldConfigModal',
  emits: ['success', 'register'],
  components: {
    BasicModal,
    BasicForm,
  },
  setup(_p, { emit }) {
    const spinningLoading = ref(false);
    const linkTableOptions = ref([]);
    const fieldOptions = ref([]);
    let tableAndFieldsMap = {};
    let oldValue = {};
    const { createMessage: $message } = useMessage();
    const [registerModal, { closeModal }] = useModalInner((data) =>
      __async(this, null, function* () {
        console.log('data', data);
        oldValue = __spreadValues({}, data.record);
        tableAndFieldsMap = data.tableAndFieldsMap;
        yield initLinkTableOptions();
        yield setFieldsValue({ dictTable: data.record.dictTable });
        setTimeout(
          () =>
            __async(this, null, function* () {
              let otherValue = omit(data.record, 'dictTable');
              yield setFieldsValue(otherValue);
              yield clearValidate();
            }),
          200
        );
      })
    );
    function initLinkTableOptions() {
      return __async(this, null, function* () {
        let fieldNames = Object.keys(tableAndFieldsMap);
        if (!fieldNames || fieldNames.length == 0) {
          linkTableOptions.value = [];
        } else {
          let arr = [];
          for (let name of fieldNames) {
            arr.push({
              text: tableAndFieldsMap[name].title,
              value: name,
            });
          }
          linkTableOptions.value = arr;
        }
      });
    }
    function handleChange(fieldName) {
      return __async(this, null, function* () {
        if (fieldName) {
          const { table, fields } = tableAndFieldsMap[fieldName];
          if (!table) {
            $message.warning('\u8BF7\u5148\u5B8C\u5584\u5B57\u6BB5[' + fieldName + ']\u5173\u8054\u8BB0\u5F55\u7684\u914D\u7F6E');
            return;
          }
          const url = '/online/cgform/field/listByHeadCode';
          const dataList = yield defHttp.get({ url, params: { headCode: table } });
          if (dataList && dataList.length > 0) {
            let arr = dataList.map((item) => {
              return {
                text: item.dbFieldTxt,
                value: item.dbFieldName,
              };
            });
            console.log('\u5B57\u6BB5\u5B57\u5178', arr);
            let fieldArray = fields.split(',');
            fieldOptions.value = arr.filter((item) => fieldArray.indexOf(item.value) > 0);
          } else {
            fieldOptions.value = [];
          }
        }
      });
    }
    const formSchemas = [
      {
        label: 'rowKey',
        field: 'rowKey',
        component: 'Input',
        show: false,
      },
      {
        label: '\u5B57\u6BB5\u63CF\u8FF0',
        field: 'dbFieldTxt',
        component: 'Input',
        required: true,
      },
      {
        label: '\u5173\u8054\u8BB0\u5F55',
        field: 'dictTable',
        component: 'JSearchSelect',
        required: true,
        componentProps: ({ formActionType }) => {
          let tempOptions = linkTableOptions.value;
          return {
            async: false,
            popContainer: '.link-table-field-config-modal',
            dictOptions: tempOptions,
            immediateChange: true,
            onChange: (name) =>
              __async(this, null, function* () {
                if (oldValue.dictText) {
                  yield formActionType.setFieldsValue({
                    dictText: '',
                  });
                  yield formActionType.clearValidate();
                }
                handleChange(name);
              }),
          };
        },
      },
      {
        label: '\u663E\u793A\u5B57\u6BB5',
        field: 'dictText',
        component: 'JSearchSelect',
        required: true,
        componentProps: {
          async: false,
          popContainer: '.link-table-field-config-modal',
          dictOptions: fieldOptions,
          onChange: (value) => {
            oldValue['dictText'] = value;
          },
        },
      },
    ];
    const [registerForm, { validate, setFieldsValue, clearValidate }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: 'right',
    });
    function handleSubmit() {
      return __async(this, null, function* () {
        const data = yield validate();
        console.log('handlesub', data);
        emit('success', data);
        closeModal();
      });
    }
    return {
      registerModal,
      spinningLoading,
      registerForm,
      handleSubmit,
    };
  },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent('BasicForm');
  const _component_a_spin = resolveComponent('a-spin');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      mergeProps({ wrapClassName: 'link-table-field-config-modal' }, _ctx.$attrs, {
        title: '\u4ED6\u8868\u5B57\u6BB5\u914D\u7F6E',
        onRegister: $setup.registerModal,
        keyboard: '',
        canFullscreen: false,
        cancelText: '\u5173\u95ED',
        onOk: $setup.handleSubmit,
      }),
      {
        default: withCtx(() => [
          createVNode(
            _component_a_spin,
            { spinning: $setup.spinningLoading },
            {
              default: withCtx(() => [createVNode(_component_BasicForm, { onRegister: $setup.registerForm }, null, 8, ['onRegister'])]),
              _: 1,
            },
            8,
            ['spinning']
          ),
        ]),
        _: 1,
      },
      16,
      ['onRegister', 'onOk']
    )
  );
}
var LinkTableFieldConfigModal = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { LinkTableFieldConfigModal as default };
