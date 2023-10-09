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
import { BasicForm, useForm } from '/@/components/Form/index';
import {
  ref,
  reactive,
  watch,
  toRaw,
  resolveComponent,
  openBlock,
  createElementBlock,
  createVNode,
  withCtx,
  createElementVNode,
  createTextVNode,
  toDisplayString,
  createCommentVNode,
  pushScopeId,
  popScopeId,
} from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import {
  u as useExtendComponent,
  g as getRefPromise,
  i as FORM_VIEW_TO_QUERY_VIEW,
  j as loadOneFieldDefVal,
  F as FormSchemaFactory,
  k as LINK_DOWN,
  m as handleLinkDown,
  n as getFieldIndex,
} from './useExtendComponent.js';
import { _ as _export_sfc } from './index.js';
import '/@/components/Form/src/componentMap';
import '/@/utils/propTypes';
import '@ant-design/icons-vue';
import '/@/components/Modal';
import '/@/components/Form/src/jeecg/components/JUpload';
import '/@/views/system/user/user.api';
import './_commonjsHelpers.js';
import '/@/store/modules/user';
import '/@/utils';
import '/@/utils/desform/customExpression';
import '/@/store/modules/permission';
import '/@/utils/dict/JDictSelectUtil';
import '/@/utils/common/compUtils';
import './pick.js';
import './_flatRest.js';
import './isArray.js';
import './toString.js';
import './_arrayPush.js';
import '/@/components/Table';
import '/@/hooks/system/useListPage';
import 'vue-router';
import '/@/components/Form/src/utils/Area';
import '/@/components/Preview/index';
import './LinkTableListPiece.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import './OnlineSelectCascade.js';
import '/@/components/Loading';
import '/@/utils/auth';
import './JModalTip.js';
import 'ant-design-vue';
import '@vueuse/core';
var OnlineQueryForm_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = {
  name: 'OnlineQueryForm',
  components: {
    BasicForm,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  emits: ['search', 'loaded'],
  setup(props, { emit }) {
    const LOAD_URL = '/online/cgform/api/getQueryInfoVue3/';
    const onlineQueryFormRef = ref(null);
    const formSchemas = ref([]);
    const baseColProps = ref({ xs: 24, sm: 24, md: 12, lg: 6, xl: 6 });
    const toggleButtonShow = ref(false);
    const toggleSearchStatus = ref(false);
    const queryParams = ref({});
    const hideList = ref([]);
    const { createMessage: $message } = useMessage();
    const { linkTableCard2Select } = useExtendComponent();
    const defaultValues = reactive({
      config: {},
      cache: {},
      param: {},
      status: false,
    });
    watch(
      () => defaultValues.status,
      (val) =>
        __async(this, null, function* () {
          console.log('-------------defaultValues\u53D1\u751F\u6539\u53D8,\u9700\u8981\u91CD\u7F6E\u8868\u5355---------------');
          const { config, cache, param } = toRaw(defaultValues);
          let rawValues = Object.assign({}, config, cache, param);
          yield customSetFieldsValue(rawValues);
        }),
      { immediate: true, deep: true }
    );
    function initDefaultValues(cache, param) {
      return __async(this, null, function* () {
        defaultValues.cache = __spreadValues({}, cache);
        defaultValues.param = __spreadValues({}, param);
        defaultValues.status = !defaultValues.status;
      });
    }
    watch(
      () => props.id,
      (val) => {
        if (val) {
          resetForm();
        } else {
          formSchemas.value = [];
        }
      },
      { immediate: true }
    );
    function initSchemas(formProperties) {
      return __async(this, null, function* () {
        let arr = [];
        let configValue = {};
        let keys = Object.keys(formProperties);
        for (let key of keys) {
          const item = formProperties[key];
          if (key === 'sys_org_code') {
            if (!item.fieldExtendJson) {
              item.fieldExtendJson = '{"store":"orgCode"}';
            }
          }
          let view = item.view;
          if (FORM_VIEW_TO_QUERY_VIEW[view]) {
            item.view = FORM_VIEW_TO_QUERY_VIEW[view];
          }
          yield loadOneFieldDefVal(key, item, configValue);
          if (item.mode == 'group' && ('date' == view || 'datetime' == view || 'number' == view)) {
            let temp = FormSchemaFactory.createSlotFormSchema(key, item);
            arr.push(temp);
          } else {
            if (item.view === LINK_DOWN) {
              let array = handleLinkDown(item, key);
              for (let linkDownItem of array) {
                let temp = FormSchemaFactory.createFormSchema(linkDownItem.key, linkDownItem);
                let tempIndex = getFieldIndex(arr, linkDownItem.key);
                if (tempIndex == -1) {
                  arr.push(temp);
                } else {
                  arr[tempIndex] = temp;
                }
              }
            } else {
              let tempIndex = getFieldIndex(arr, key);
              if (tempIndex == -1) {
                let temp = FormSchemaFactory.createFormSchema(key, item);
                arr.push(temp);
              }
            }
          }
        }
        arr.sort(function (a, b) {
          return a.order - b.order;
        });
        let schemaArray = [];
        if (arr.length > 2) {
          toggleButtonShow.value = true;
        }
        let hideFieldName = [];
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          item.setFormRef(onlineQueryFormRef);
          item.noChange();
          item.asSearchForm();
          if (i > 1) {
            hideFieldName.push(item.field);
            item.isHidden();
          }
          let tempSchema = item.getFormItemSchema();
          if (item.slot == 'groupDatetime') {
            tempSchema['colProps'] = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 };
          }
          linkTableCard2Select(tempSchema);
          schemaArray.push(tempSchema);
        }
        hideList.value = hideFieldName;
        formSchemas.value = schemaArray;
        defaultValues.config = __spreadValues({}, configValue);
        defaultValues.status = !defaultValues.status;
      });
    }
    function resetForm() {
      return __async(this, null, function* () {
        let json = yield loadQueryInfo();
        let allFields = getAllFields(json);
        emit('loaded', json);
        let { formProperties, hasField } = getQueryFormProperties(allFields, json);
        if (hasField == false) {
          formSchemas.value = [];
          return;
        }
        yield initSchemas(formProperties);
      });
    }
    function customSetFieldsValue(rawValues) {
      return __async(this, null, function* () {
        yield getRefPromise(onlineQueryFormRef);
        console.log('rawValues', rawValues);
        yield setFieldsValue(rawValues);
        if (Object.keys(rawValues).length > 0) {
          doSearch();
        }
      });
    }
    function getQueryFormProperties(allFields, json) {
      const { searchFieldList, joinQuery, table } = json;
      let hasField = false;
      let formProperties = {};
      if (allFields) {
        Object.keys(allFields).map((field) => {
          if (searchFieldList.indexOf(field) >= 0) {
            if (joinQuery == true) {
              if (field.indexOf('@') < 0) {
                formProperties[table + '@' + field] = allFields[field];
                hasField = true;
              } else {
                formProperties[field] = allFields[field];
                hasField = true;
              }
            } else {
              if (field.indexOf('@') < 0) {
                formProperties[field] = allFields[field];
                hasField = true;
              }
            }
          }
        });
      }
      return {
        formProperties,
        hasField,
      };
    }
    function getAllFields(json) {
      const { properties, searchFieldList, joinQuery, table } = json;
      let allFields = {};
      let order = 1;
      Object.keys(properties).map((field) => {
        let item = properties[field];
        if (item.view == 'table') {
          let subProps = item['properties'];
          let subTableOrder = order * 100;
          Object.keys(subProps).map((subField) => {
            let subItem = subProps[subField];
            subItem['order'] = subTableOrder + Number(subItem['order']);
            let subFieldKey = field + '@' + subField;
            allFields[subFieldKey] = subItem;
          });
          order++;
        } else {
          item['order'] = Number(item['order']);
          allFields[field] = item;
        }
      });
      return allFields;
    }
    function loadQueryInfo() {
      let url = `${LOAD_URL}${props.id}`;
      return new Promise((resolve) => {
        defHttp
          .get({ url }, { isTransformResponse: false })
          .then((res) => {
            if (res.success) {
              resolve(res.result);
            } else {
              resolve(false);
              $message.warning(res.message);
            }
          })
          .catch(() => {
            $message.warning('\u83B7\u53D6\u67E5\u8BE2\u6761\u4EF6\u5931\u8D25!');
            resolve(false);
          });
      });
    }
    const [registerForm, { resetFields, setFieldsValue, updateSchema, getFieldsValue }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      baseColProps,
      autoSubmitOnEnter: true,
      submitFunc() {
        doSearch();
      },
    });
    function doSearch() {
      let formValues = getFieldsValue();
      let data = Object.assign({}, toRaw(defaultValues.param), changeDataIfArray2String(formValues));
      emit('search', data, true);
    }
    function resetSearch() {
      return __async(this, null, function* () {
        yield resetFields();
        const { config, param } = toRaw(defaultValues);
        let rawValues = Object.assign({}, config, param);
        if (Object.keys(rawValues).length > 0) {
          yield setFieldsValue(rawValues);
        }
        emit('search', rawValues, false);
      });
    }
    function changeDataIfArray2String(data) {
      Object.keys(data).map((k) => {
        if (data[k]) {
          if (data[k] instanceof Array) {
            data[k] = data[k].join(',');
          }
        }
      });
      return data;
    }
    watch(
      () => toggleSearchStatus.value,
      (status) => {
        let names = hideList.value;
        if (names && names.length > 0) {
          let arr = [];
          for (let name of names) {
            arr.push({
              field: name,
              show: status,
            });
          }
          updateSchema(arr);
        }
      },
      { immediate: false }
    );
    return {
      onlineQueryFormRef,
      registerForm,
      initDefaultValues,
      toggleButtonShow,
      toggleSearchStatus,
      doSearch,
      resetSearch,
      queryParams,
      formSchemas,
    };
  },
};
const _withScopeId = (n) => (pushScopeId('data-v-4b8f6d7a'), (n = n()), popScopeId(), n);
const _hoisted_1 = {
  key: 0,
  class: 'jeecg-basic-table-form-container p-0',
};
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode('span', { class: 'group-query-string' }, '~', -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode('span', { class: 'group-query-string' }, '~', -1));
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode('span', { class: 'group-query-string' }, '~', -1));
const _hoisted_5 = {
  style: { float: 'left', overflow: 'hidden', 'margin-left': '10px' },
  class: 'table-page-search-submitButtons',
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_date_picker = resolveComponent('a-date-picker');
  const _component_a_input_number = resolveComponent('a-input-number');
  const _component_a_button = resolveComponent('a-button');
  const _component_a_icon = resolveComponent('a-icon');
  const _component_a_col = resolveComponent('a-col');
  const _component_BasicForm = resolveComponent('BasicForm');
  return $setup.formSchemas && $setup.formSchemas.length > 0
    ? (openBlock(),
      createElementBlock('div', _hoisted_1, [
        createVNode(
          _component_BasicForm,
          {
            ref: 'onlineQueryFormRef',
            onRegister: $setup.registerForm,
          },
          {
            groupDate: withCtx(({ model, field }) => [
              createVNode(
                _component_a_date_picker,
                {
                  showTime: false,
                  valueFormat: 'YYYY-MM-DD',
                  placeholder: '\u5F00\u59CB\u65E5\u671F',
                  value: model[field + '_begin'],
                  'onUpdate:value': ($event) => (model[field + '_begin'] = $event),
                  style: { width: 'calc(50% - 15px)', 'min-width': '100px' },
                },
                null,
                8,
                ['value', 'onUpdate:value']
              ),
              _hoisted_2,
              createVNode(
                _component_a_date_picker,
                {
                  showTime: false,
                  valueFormat: 'YYYY-MM-DD',
                  placeholder: '\u7ED3\u675F\u65E5\u671F',
                  value: model[field + '_end'],
                  'onUpdate:value': ($event) => (model[field + '_end'] = $event),
                  style: { width: 'calc(50% - 15px)', 'min-width': '100px' },
                },
                null,
                8,
                ['value', 'onUpdate:value']
              ),
            ]),
            groupDatetime: withCtx(({ model, field }) => [
              createVNode(
                _component_a_date_picker,
                {
                  showTime: true,
                  valueFormat: 'YYYY-MM-DD HH:mm:ss',
                  placeholder: '\u5F00\u59CB\u65F6\u95F4',
                  value: model[field + '_begin'],
                  'onUpdate:value': ($event) => (model[field + '_begin'] = $event),
                  style: { 'min-width': '100px', width: 'calc(50% - 15px)' },
                },
                null,
                8,
                ['value', 'onUpdate:value']
              ),
              _hoisted_3,
              createVNode(
                _component_a_date_picker,
                {
                  showTime: true,
                  valueFormat: 'YYYY-MM-DD HH:mm:ss',
                  placeholder: '\u7ED3\u675F\u65F6\u95F4',
                  value: model[field + '_end'],
                  'onUpdate:value': ($event) => (model[field + '_end'] = $event),
                  style: { 'min-width': '100px', width: 'calc(50% - 15px)' },
                },
                null,
                8,
                ['value', 'onUpdate:value']
              ),
            ]),
            groupNumber: withCtx(({ model, field }) => [
              createVNode(
                _component_a_input_number,
                {
                  placeholder: '\u5F00\u59CB\u503C',
                  value: model[field + '_begin'],
                  'onUpdate:value': ($event) => (model[field + '_begin'] = $event),
                  style: { width: 'calc(50% - 15px)' },
                },
                null,
                8,
                ['value', 'onUpdate:value']
              ),
              _hoisted_4,
              createVNode(
                _component_a_input_number,
                {
                  placeholder: '\u7ED3\u675F\u503C',
                  value: model[field + '_end'],
                  'onUpdate:value': ($event) => (model[field + '_end'] = $event),
                  style: { width: 'calc(50% - 15px)' },
                },
                null,
                8,
                ['value', 'onUpdate:value']
              ),
            ]),
            formFooter: withCtx(() => [
              createVNode(
                _component_a_col,
                {
                  md: 6,
                  sm: 8,
                },
                {
                  default: withCtx(() => [
                    createElementVNode('span', _hoisted_5, [
                      createVNode(
                        _component_a_button,
                        {
                          preIcon: 'ant-design:search',
                          type: 'primary',
                          onClick: $setup.doSearch,
                        },
                        {
                          default: withCtx(() => [createTextVNode('\u67E5\u8BE2')]),
                          _: 1,
                        },
                        8,
                        ['onClick']
                      ),
                      createVNode(
                        _component_a_button,
                        {
                          preIcon: 'ant-design:reload',
                          type: 'primary',
                          onClick: $setup.resetSearch,
                          style: { 'margin-left': '8px' },
                        },
                        {
                          default: withCtx(() => [createTextVNode('\u91CD\u7F6E')]),
                          _: 1,
                        },
                        8,
                        ['onClick']
                      ),
                      $setup.toggleButtonShow
                        ? (openBlock(),
                          createElementBlock(
                            'a',
                            {
                              key: 0,
                              onClick: _cache[0] || (_cache[0] = ($event) => ($setup.toggleSearchStatus = !$setup.toggleSearchStatus)),
                              style: { 'margin-left': '8px' },
                            },
                            [
                              createTextVNode(toDisplayString($setup.toggleSearchStatus ? '\u6536\u8D77' : '\u5C55\u5F00') + ' ', 1),
                              createVNode(
                                _component_a_icon,
                                {
                                  type: $setup.toggleSearchStatus ? 'up' : 'down',
                                },
                                null,
                                8,
                                ['type']
                              ),
                            ]
                          ))
                        : createCommentVNode('', true),
                    ]),
                  ]),
                  _: 1,
                }
              ),
            ]),
            _: 1,
          },
          8,
          ['onRegister']
        ),
      ]))
    : createCommentVNode('', true);
}
var OnlineQueryForm = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-4b8f6d7a'],
]);
export { OnlineQueryForm as default };
