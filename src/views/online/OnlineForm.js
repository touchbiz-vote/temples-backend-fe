var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
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
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import * as HOOK_MESSAGE from "/@/hooks/web/useMessage";
import { useMessage } from "/@/hooks/web/useMessage";
import * as vue from "vue";
import { ref, reactive, computed, resolveComponent, openBlock, createElementBlock, createVNode, createCommentVNode, createBlock, withCtx, Fragment, renderList, normalizeStyle, renderSlot, unref, nextTick, toRaw } from "vue";
import { BasicForm, useForm } from "/@/components/Form/index";
import { O as OnlineSubForm, a as OnlinePopModal, b as useOnlineFormContext, c as useFormItems, d as useEnhance, l as loadFormFieldsDefVal, g as getRefPromise, V as VALIDATE_FAILED, S as SUBMIT_FLOW_KEY, e as SUBMIT_FLOW_ID, f as ONL_FORM_TABLE_NAME } from "./useExtendComponent.js";
import * as UTIL_AXIOS from "/@/utils/http/axios";
import { defHttp } from "/@/utils/http/axios";
import { sleep, goJmReportViewPage } from "/@/utils";
import { Loading } from "/@/components/Loading";
import "/@/components/jeecg/JVxeTable/types";
import { getToken } from "/@/utils/auth";
import { PrinterOutlined, DiffOutlined, FormOutlined } from "@ant-design/icons-vue";
import "/@/hooks/core/useContext";
import "/@/utils/mitt";
import { useModal } from "/@/components/Modal";
import * as UTIL_CACHE from "/@/utils/cache";
import { randomString } from "/@/utils/common/compUtils";
import * as HOOK_USERINFO from "/@/store/modules/user";
import { _ as _export_sfc } from "./index.js";
import { p as pick } from "./pick.js";
import { o as omit } from "./omit.js";
const $exports = {
  vue,
  "@": {
    hooks: {
      useMessage: HOOK_MESSAGE,
      useUserStore: HOOK_USERINFO
    },
    utils: {
      axios: UTIL_AXIOS,
      cache: UTIL_CACHE
    }
  }
};
function useCustomHook(otherExports, context) {
  const assignExports = Object.assign({}, $exports, otherExports);
  function doImport(path) {
    if (path != null && path != "") {
      let paths = path.toString().split("/");
      let result = assignExports[paths[0]];
      for (let i = 1; i < paths.length; i++) {
        result = result[paths[i]];
      }
      return result;
    }
    return null;
  }
  function doExport() {
  }
  function executeJsEnhanced(code, row) {
    let randomKey = randomString(6);
    let exportKey = "__export_" + randomKey;
    if (row) {
      const executeCode = `return function (row, customImport, ${exportKey}) {"use strict"; ${code}}`;
      console.group("executeJsEnhanced");
      console.log(executeCode);
      console.groupEnd();
      const fun = new Function(executeCode)();
      fun.call(context, row, doImport, doExport);
    } else {
      const executeCode = `return function (customImport, ${exportKey}) {"use strict"; ${code}}`;
      console.group("executeJsEnhanced");
      console.log(executeCode);
      console.groupEnd();
      const fun = new Function(executeCode)();
      fun.call(context, doImport, doExport);
    }
  }
  return {
    executeJsEnhanced
  };
}
const GET_FUN_BODY_REG = /(?:\/\*[\s\S]*?\*\/|\/\/.*?\r?\n|[^{])+\{([\s\S]*)\}$/;
const urlObject = {
  optPre: "/online/cgform/api/form/",
  urlButtonAction: "/online/cgform/api/doButton"
};
const _sfc_main = {
  name: "OnlineForm",
  components: {
    BasicForm,
    Loading,
    OnlineSubForm,
    PrinterOutlined,
    DiffOutlined,
    FormOutlined,
    OnlinePopModal
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    formTemplate: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    },
    pidField: {
      type: String,
      default: ""
    },
    submitTip: {
      type: Boolean,
      default: true
    },
    modalClass: {
      type: String,
      default: ""
    }
  },
  emits: ["success", "rendered"],
  setup(props, { emit }) {
    console.log("onlineForm-setup\u300B\u300B");
    const { createMessage: $message } = useMessage();
    const onlineFormRef = ref(null);
    const single = ref(true);
    const loading = ref(false);
    const tableType = ref(1);
    const customEditSubmitUrl = ref('');
    const submitFlowFlag = ref(false);
    const isUpdate = ref(false);
    const onlineExtConfigJson = reactive({
      reportPrintShow: 0,
      reportPrintUrl: "",
      joinQuery: 0,
      modelFullscreen: 0,
      modalMinWidth: "",
      commentStatus: 0
    });
    const { onlineFormContext, resetContext } = useOnlineFormContext();
    const {
      formSchemas,
      defaultValueFields,
      changeDataIfArray2String,
      tableName,
      dbData,
      checkOnlyFieldValue,
      hasSubTable,
      subTabInfo,
      refMap,
      subDataSource,
      baseColProps,
      createFormSchemas,
      fieldDisplayStatus
    } = useFormItems(props, onlineFormRef);
    let { EnhanceJS, initCgEnhanceJs } = useEnhance(onlineFormContext, false);
    const { executeJsEnhanced } = useCustomHook({}, onlineFormContext);
    const [registerForm, { setProps, validate, resetFields, setFieldsValue, updateSchema, getFieldsValue, scrollToField }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      baseColProps
    });
    const onlineFormDisabled = ref(false);
    function handleFormDisabled() {
      let flag = props.disabled;
      onlineFormDisabled.value = flag;
      setProps({ disabled: flag });
    }
    function show(status, record, param) {
      return __async(this, null, function* () {
        console.log("\u65B0\u589E\u7F16\u8F91\u8FDB\u5165\u8868\u5355\u300B\u300Bform", record);
        yield updatePidFieldDict();
        customEditSubmitUrl.value = '';
        yield resetFields();
        dbData.value = '';
        let flag = unref(status);
        isUpdate.value = flag;
        if (flag) {
          yield edit(record);
        } else {
          editSubVxeTableData();
        }
        nextTick(() => {
          if (!flag && param) {
            setFieldsValue(param);
          }
          handleDefaultValue();
          handleCgButtonClick("js", "loaded");
          handleFormDisabled();
        });
      });
    }
    function updatePidFieldDict() {
      return __async(this, null, function* () {
        if (props.isTree === true) {
          let pidFieldName = props.pidField;
          let arr = formSchemas.value;
          if (arr && arr.length > 0) {
            let temp = arr.filter((item) => item.field === pidFieldName);
            if (temp.length > 0) {
              yield updateSchema({
                field: pidFieldName,
                componentProps: {
                  reload: new Date().getTime()
                }
              });
            }
          } else {
            console.log("\u6CA1\u6709\u62FF\u5230\u8868\u5355\u914D\u7F6E\u4FE1\u606F\uFF0C\u53EF\u80FD\u662F\u7B2C\u4E00\u6B21\u6253\u5F00\u65B0\u589E\u9875\u9762");
          }
        }
      });
    }
    function handleDefaultValue() {
      if (unref(isUpdate) === false) {
        let fieldProperties = toRaw(defaultValueFields[tableName.value]);
        loadFormFieldsDefVal(fieldProperties, (values) => {
          setFieldsValue(values);
        });
      }
    }
    function handleSubTableDefaultValue(sub, $event) {
      let subFieldProperties = toRaw(defaultValueFields[sub.key]);
      loadFormFieldsDefVal(subFieldProperties, (values) => {
        const { row, target } = $event;
        let v = [{ rowKey: row.id, values: __spreadValues({}, values) }];
        target.setValues(v);
      });
    }
    function edit(record) {
      return __async(this, null, function* () {
        let formData = yield getFormData(record.id);
        dbData.value = Object.assign({}, record, formData);
        let arr = realFormFieldNames.value;
        let values = pick(formData, ...arr);
        if (props.disabled) {
          Object.keys(values).map((k) => {
            if (!values[k] && values[k] !== 0 && values[k] !== "0") {
              delete values[k];
            }
          });
        }
        yield setFieldsValue(values);
        editSubVxeTableData(formData);
      });
    }
    function editSubVxeTableData(record) {
      if (!record) {
        record = {};
      }
      let keys = Object.keys(subDataSource.value);
      if (keys && keys.length > 0) {
        let obj = {};
        for (let key of keys) {
          obj[key] = record[key] || [];
        }
        subDataSource.value = obj;
      }
    }
    let realFormFieldNames = computed(() => {
      let arr = formSchemas.value;
      let names = [];
      for (let a of arr) {
        names.push(a.field);
      }
      return names;
    });
    function getFormData(dataId) {
      let url = `${urlObject.optPre}${props.id}/${dataId}`;
      return new Promise((resolve, reject) => {
        defHttp.get({ url }, { isTransformResponse: false }).then((res) => {
          if (res.success) {
            resolve(res.result);
          } else {
            reject();
            $message.warning(res.message);
          }
        }).catch(() => {
          reject();
        });
      });
    }
    function createRootProperties(data) {
      return __async(this, null, function* () {
        tableType.value = data.head.tableType;
        tableName.value = data.head.tableName;
        single.value = data.head.tableType == 1;
        handleExtConfigJson(data.head.extConfigJson);
        createFormSchemas(data.schema.properties, data.schema.required, checkOnlyFieldValue);
        EnhanceJS = initCgEnhanceJs(data.enhanceJs);
        emit("rendered", onlineExtConfigJson);
        let formRefObject = yield getRefPromise(onlineFormRef);
        formRefObject.$formValueChange = (field, value, changeFormData) => {
          onValuesChange(field, value);
          if (changeFormData) {
            setFieldsValue(changeFormData);
          }
          onChangeEvent(field, value, changeFormData);
        };
        if (EnhanceJS && EnhanceJS["setup"]) {
          executeEnhanceFormJsHook(EnhanceJS["setup"]);
        }
      });
    }
    function onChangeEvent(field, value, changeFormData) {
      onlineFormContext.changEvent(field, value, changeFormData);
    }
    function onlineFormValueChange(callback) {
      onlineFormContext.addObject2Context("changEvent", callback);
    }
    function handleExtConfigJson(jsonStr) {
      let extConfigJson = { reportPrintShow: 0, reportPrintUrl: "", joinQuery: 0, modelFullscreen: 0, modalMinWidth: "", commentStatus: 0 };
      if (jsonStr) {
        extConfigJson = JSON.parse(jsonStr);
      }
      Object.keys(extConfigJson).map((k) => {
        onlineExtConfigJson[k] = extConfigJson[k];
      });
    }
    function handleSubmit() {
      if (single.value === true) {
        handleSingleSubmit();
      } else {
        handleOne2ManySubmit();
      }
    }
    function handleOne2ManySubmit() {
      validateAll().then((formData) => {
        handleApplyRequest(formData);
      });
    }
    function validateAll() {
      let temp = {};
      return new Promise((resolve, reject) => {
        validate().then(
          (values) => resolve(values),
          ({ errorFields }) => {
            if (errorFields && errorFields.length > 0) {
              scrollToField(errorFields[0][0]);
            }
            reject(VALIDATE_FAILED);
          }
        );
      }).then((result) => {
        Object.assign(temp, changeDataIfArray2String(result));
        return validateSubTableFields();
      }).then((allTableData) => {
        Object.assign(temp, allTableData);
        return Promise.resolve(temp);
      }).catch((e) => {
        if (e === VALIDATE_FAILED || (e == null ? void 0 : e.code) === VALIDATE_FAILED) {
          $message.warning("\u6821\u9A8C\u672A\u901A\u8FC7");
          if (e.key) {
            changeTab(e.key);
          }
        } else {
          console.error(e);
        }
        return Promise.reject(null);
      });
    }
    function changeTab(key) {
      let arr = subTabInfo.value;
      for (let i = 0; i < arr.length; i++) {
        if (key == arr[i].key) {
          let activeKey = i + "";
          if (subActiveKey.value === activeKey) {
            break;
          }
          subActiveKey.value = activeKey;
          if (arr[i].relationType === 0) {
            let instance = getSubTableInstance(key);
            sleep(300, () => instance == null ? void 0 : instance.validateTable());
          }
          break;
        }
      }
    }
    function validateSubTableFields() {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        let subData = {};
        try {
          let arr = subTabInfo.value;
          for (let i = 0; i < arr.length; i++) {
            let key = arr[i].key;
            let instance = getSubTableInstance(key);
            if (arr[i].relationType == 1) {
              try {
                let subFormData = yield instance.getAll();
                subData[key] = [];
                subData[key].push(subFormData);
              } catch (e) {
                throw { code: VALIDATE_FAILED, key };
              }
            } else {
              let errMap = yield instance.fullValidateTable();
              if (errMap) {
                throw { code: VALIDATE_FAILED, key };
              }
              subData[key] = instance.getTableData();
            }
          }
        } catch (e) {
          reject(e);
        }
        resolve(subData);
      }));
    }
    function handleSingleSubmit() {
      return __async(this, null, function* () {
        try {
          let values = yield validate();
          values = Object.assign({}, dbData.value, values);
          values = changeDataIfArray2String(values);
          loading.value = true;
          handleApplyRequest(values);
        } finally {
          loading.value = false;
        }
      });
    }
    function handleApplyRequest(formData) {
      customBeforeSubmit(context, formData).then(() => {
        doApplyRequest(formData);
      }).catch((msg) => {
        $message.warning(msg);
      });
    }
    function doApplyRequest(formData) {
      Object.keys(formData).map((key) => {
        if (Array.isArray(formData[key])) {
          if (formData[key].length == 0) {
            formData[key] = '';
          }
        }
      });
      console.log('\u63D0\u4EA4\u8868\u5355\u6570\u636E\u300B\u300B\u300Bform:', formData);
      let customUrl = customEditSubmitUrl.value;
      //针对文章分类album的提交处理
      if (props.id === 'ff8080818a27ef16018a27ef162a0000') {
        customUrl = '/api/temples/album';
      } else if (props.id === 'c37247320d744855bf85fac76f0cebfa') {
        customUrl = '/api/temples/product';
      }
      let url = `${urlObject.optPre}${props.id}?tabletype=${tableType.value}`;
      if (customUrl) {
        url = `${customUrl}?tabletype=${tableType.value}`;
      }
      if (submitFlowFlag.value === true) {
        formData[SUBMIT_FLOW_KEY] = 1;
      }
      let method = isUpdate.value === true ? 'put' : 'post';
      defHttp.request({ url, method, params: formData }, { isTransformResponse: false }).then((res) => {
        if (res.success) {
          if (res.result) {
            formData[SUBMIT_FLOW_ID] = res.result;
          }
          emit("success", formData);
          if (props.submitTip === true) {
            $message.success(res.message);
          }
        } else {
          $message.warning(res.message);
        }
      }).finally(() => {
        loading.value = false;
      });
    }
    function triggleChangeValues(values, id, target) {
      if (id && target) {
        if (target.vxeProps) {
          target.setValues([
            {
              rowKey: id,
              values
            }
          ]);
        } else {
          target.setValues(values);
        }
      } else {
        setFieldsValue(values);
      }
    }
    function triggleChangeValue(field, value) {
      let obj = {};
      obj[field] = value;
      setFieldsValue(obj);
    }
    const subActiveKey = ref("0");
    const subFormHeight = ref(300);
    const subTableHeight = ref(340);
    function getSubTableForeignKeyValue(key) {
      if (isUpdate.value === true) {
        let formData = dbData.value;
        return getValueIgnoreCase(formData, key);
      }
      return "";
    }
    function getValueIgnoreCase(data, key) {
      if (data) {
        let temp = data[key];
        if (!temp && temp !== 0) {
          temp = data[key.toLowerCase()];
          if (!temp && temp !== 0) {
            temp = data[key.toUpperCase()];
          }
        }
        return temp;
      }
      return "";
    }
    function handleSubFormChange(valueObj, tableKey) {
      if (EnhanceJS && EnhanceJS[tableKey + "_onlChange"]) {
        let tableChangeObj = EnhanceJS[tableKey + "_onlChange"]();
        let columnKey = Object.keys(valueObj)[0];
        if (tableChangeObj[columnKey]) {
          let subRef = getSubTableInstance(tableKey);
          let formEvent = subRef.getFormEvent();
          let event = __spreadValues({
            column: { key: columnKey },
            value: valueObj[columnKey]
          }, formEvent);
          tableChangeObj[columnKey].call(onlineFormContext, onlineFormContext, event);
        }
      }
    }
    function handleValueChange(event, tableKey) {
      if (EnhanceJS && EnhanceJS[tableKey + "_onlChange"]) {
        let tableChangeObj = EnhanceJS[tableKey + "_onlChange"](onlineFormContext);
        if (event.column === "all") {
          let keys = Object.keys(tableChangeObj);
          if (keys.length > 0) {
            for (let key of keys) {
              tableChangeObj[key].call(onlineFormContext, onlineFormContext, event);
            }
          }
        } else {
          let columnKey = event.column.key || event.col.key;
          if (tableChangeObj[columnKey]) {
            if (event.row && event.row.id) {
              tableChangeObj[columnKey].call(onlineFormContext, onlineFormContext, event);
            }
          }
        }
      }
    }
    function handleAdded(sub, event) {
      console.log("handleAdded", sub, event);
      if (!event.isModalData) {
        handleSubTableDefaultValue(sub, event);
      }
    }
    function getSubTableAuthPre(table) {
      return "online_" + table + ":";
    }
    function onValuesChange(columnKey, value) {
      return __async(this, null, function* () {
        if (!EnhanceJS || !EnhanceJS["onlChange"]) {
          return false;
        }
        if (!columnKey) {
          return false;
        }
        let tableChangeObj = EnhanceJS["onlChange"]();
        if (tableChangeObj[columnKey]) {
          let formData = yield getFieldsValue();
          let event = {
            row: formData,
            column: { key: columnKey },
            value
          };
          tableChangeObj[columnKey].call(onlineFormContext, onlineFormContext, event);
        }
      });
    }
    function executeEnhanceFormJsHook(funStr) {
      let str = funStr.toLocaleString();
      let arr = str.match(GET_FUN_BODY_REG);
      if (arr.length > 1) {
        let temp = arr[1];
        executeJsEnhanced(temp);
      }
    }
    function handleCgButtonClick(optType, buttonCode) {
      if ("js" == optType) {
        let hookFunName = buttonCode + "_hook";
        if (EnhanceJS && EnhanceJS[buttonCode]) {
          EnhanceJS[buttonCode].call(onlineFormContext, onlineFormContext);
        } else if (EnhanceJS && EnhanceJS[hookFunName]) {
          executeEnhanceFormJsHook(EnhanceJS[hookFunName]);
        }
      } else if ("action" == optType) {
        let formData = dbData.value;
        let params = {
          formId: props.id,
          buttonCode,
          dataId: formData.id,
          uiFormData: Object.assign({}, formData)
        };
        defHttp.post(
          {
            url: `${urlObject.urlButtonAction}`,
            params
          },
          { isTransformResponse: false }
        ).then((res) => {
          if (res.success) {
            $message.success("\u5904\u7406\u5B8C\u6210!");
          } else {
            $message.warning("\u5904\u7406\u5931\u8D25!");
          }
        });
      }
    }
    function clearSubRows(tbname) {
      let instance = getSubTableInstance(tbname);
      let rows = [...instance.getNewDataWithId(), ...subDataSource.value[tbname]];
      if (!rows || rows.length == 0) {
        return false;
      }
      let ids = [];
      for (let i of rows) {
        ids.push(i.id);
      }
      instance.removeRowsById(ids);
    }
    function addSubRows(tbname, rows) {
      if (!rows) {
        return false;
      }
      let instance = getSubTableInstance(tbname);
      if (typeof rows == "object") {
        instance.addRows(rows, true);
      } else {
        this.$message.error("\u6DFB\u52A0\u5B50\u8868\u6570\u636E,\u53C2\u6570\u4E0D\u8BC6\u522B!");
      }
    }
    function clearThenAddRows(tbname, rows) {
      clearSubRows(tbname);
      addSubRows(tbname, rows);
    }
    function changeOptions(field, options) {
      if (!options && options.length <= 0) {
        options = [];
      }
      options.map((item) => {
        if (!item.hasOwnProperty("label")) {
          item["label"] = item.text;
        }
      });
      updateSchema({
        field,
        componentProps: {
          options
        }
      });
    }
    function customBeforeSubmit(that, formData) {
      if (EnhanceJS && EnhanceJS["beforeSubmit"]) {
        return EnhanceJS["beforeSubmit"](that, formData);
      } else {
        return Promise.resolve();
      }
    }
    function handleCustomFormSh(show2, hide) {
      let plain = toRaw(fieldDisplayStatus);
      if (show2 && show2.length > 0) {
        Object.keys(plain).map((k) => {
          if (!k.endsWith("_load") && show2.indexOf(k) < 0) {
            fieldDisplayStatus[k] = false;
          }
        });
      } else if (hide && hide.length > 0) {
        Object.keys(plain).map((k) => {
          if (hide.indexOf(k) >= 0) {
            fieldDisplayStatus[k] = false;
          }
        });
      }
    }
    function handleCustomFormEdit(record, editSubmitUrl) {
      console.log('handleCustomFormEdit');
      return __async(this, null, function* () {
        console.log('\u81EA\u5B9A\u4E49\u5F39\u7A97\u6253\u5F00online\u8868\u5355\u300B\u300Bform', record);
        customEditSubmitUrl.value = editSubmitUrl;
        yield resetFields();
        dbData.value = '';
        isUpdate.value = true;
        yield edit(record);
        yield nextTick(() => {
          handleCgButtonClick('js', 'loaded');
        });
      });
    }
    function getSubTableInstance(tableName2) {
      let instance = refMap[tableName2].value;
      if (instance instanceof Array) {
        instance = instance[0];
      }
      if (!instance) {
        $message.warning("\u5B50\u8868ref\u627E\u4E0D\u5230:" + tableName2);
        return;
      }
      return instance;
    }
    function onOpenReportPrint() {
      let url = onlineExtConfigJson.reportPrintUrl;
      let id = dbData.value.id;
      let token = getToken();
      goJmReportViewPage(url, id, token);
    }
    const [registerPopModal, { openModal: openPopModal }] = useModal();
    const popTableName = ref("");
    const popModalRequest = ref(true);
    function openSubFormModalForAdd(sub) {
      console.log("openSubFormModalForAdd", sub);
      popTableName.value = sub.id;
      popModalRequest.value = false;
      openPopModal(true, { isUpdate: false, tableType: "3" });
    }
    function openSubFormModalForEdit(sub) {
      let ref2 = getSubTableInstance(sub.key);
      let arr = ref2.getSelectedData();
      if (arr.length != 1) {
        $message.warning("\u8BF7\u9009\u62E9\u4E00\u6761\u6570\u636E");
        return;
      }
      popTableName.value = sub.id;
      popModalRequest.value = false;
      openPopModal(true, { isUpdate: true, record: arr[0] });
    }
    function getPopFormData(data) {
      const tableName2 = data[ONL_FORM_TABLE_NAME];
      let record = omit(data, [ONL_FORM_TABLE_NAME]);
      if (record.id) {
        let values = omit(__spreadValues({}, record), "id");
        let arr = [{ rowKey: record.id, values }];
        let instance = getSubTableInstance(tableName2);
        instance.setValues(arr);
      } else {
        let instance = getSubTableInstance(tableName2);
        instance.addRows(record, { isOnlineJS: false, setActive: false, emitChange: true, isModalData: true });
      }
    }
    function onCloseModal() {
      let arr = subTabInfo.value;
      if (arr && arr.length > 0) {
        for (let item of arr) {
          if (item.relationType == 1)
            ;
          else {
            let inst = getSubTableInstance(item.key);
            if (inst) {
              inst.clearSelection();
            }
          }
        }
      }
    }
    function executeMainFillRule() {
      let formData = getFieldsValue();
      let fieldProperties = toRaw(defaultValueFields[tableName.value]);
      loadFormFieldsDefVal(fieldProperties, (values) => {
        setFieldsValue(values);
      }, formData);
    }
    function executeSubFillRule(subKey, $event) {
      let subList = subTabInfo.value;
      if (subList && subList.length > 0) {
        let arr = subList.filter((sub) => sub.key === subKey);
        if (arr.length == 0) {
          console.error("\u6CA1\u627E\u5230\u4E0E\u4E4B\u5339\u914D\u7684\u5B50\u8868", subKey);
          return;
        }
        if (arr[0].relationType == 1) {
          let subInstance = getSubTableInstance(subKey);
          subInstance.executeFillRule();
        } else {
          let subFieldProperties = toRaw(defaultValueFields[subKey]);
          let row = toRaw($event.row);
          loadFormFieldsDefVal(subFieldProperties, (values) => {
            const { row: row2, target } = $event;
            let v = [{ rowKey: row2.id, values: __spreadValues({}, values) }];
            target.setValues(v);
          }, row);
        }
      }
    }
    let context = {
      tableName,
      loading,
      subActiveKey,
      onlineFormRef,
      getFieldsValue,
      setFieldsValue,
      submitFlowFlag,
      subFormHeight,
      subTableHeight,
      refMap,
      triggleChangeValues,
      triggleChangeValue,
      sh: fieldDisplayStatus,
      clearSubRows,
      addSubRows,
      clearThenAddRows,
      changeOptions,
      isUpdate,
      getSubTableInstance,
      updateSchema,
      executeMainFillRule,
      executeSubFillRule,
      changEvent: () => {
      },
      onlineFormValueChange
    };
    resetContext(context);
    return {
      tableName,
      onlineFormRef,
      registerForm,
      loading,
      subActiveKey,
      hasSubTable,
      subTabInfo,
      refMap,
      subFormHeight,
      getSubTableForeignKeyValue,
      isUpdate,
      handleSubFormChange,
      subTableHeight,
      onlineFormDisabled,
      subDataSource,
      getSubTableAuthPre,
      handleAdded,
      handleSubTableDefaultValue,
      handleValueChange,
      openSubFormModalForAdd,
      openSubFormModalForEdit,
      show,
      createRootProperties,
      handleSubmit,
      sh: fieldDisplayStatus,
      handleCgButtonClick,
      handleCustomFormSh,
      handleCustomFormEdit,
      dbData,
      onOpenReportPrint,
      onlineExtConfigJson,
      registerPopModal,
      popTableName,
      getPopFormData,
      popModalRequest,
      onCloseModal
    };
  }
};
const _hoisted_1 = ["id"];
const _hoisted_2 = {
  key: 0,
  style: { "text-align": "right", "position": "absolute", "top": "6px", "right": "20px", "z-index": "999" }
};
const _hoisted_3 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PrinterOutlined = resolveComponent("PrinterOutlined");
  const _component_BasicForm = resolveComponent("BasicForm");
  const _component_online_sub_form = resolveComponent("online-sub-form");
  const _component_diff_outlined = resolveComponent("diff-outlined");
  const _component_a_button = resolveComponent("a-button");
  const _component_form_outlined = resolveComponent("form-outlined");
  const _component_JVxeTable = resolveComponent("JVxeTable");
  const _component_a_tab_pane = resolveComponent("a-tab-pane");
  const _component_a_tabs = resolveComponent("a-tabs");
  const _component_Loading = resolveComponent("Loading");
  const _component_online_pop_modal = resolveComponent("online-pop-modal");
  return openBlock(), createElementBlock("div", {
    id: $setup.tableName + "_form"
  }, [
    !!$setup.dbData.id && !!$setup.onlineExtConfigJson.reportPrintShow ? (openBlock(), createElementBlock("div", _hoisted_2, [
      createVNode(_component_PrinterOutlined, {
        title: "\u6253\u5370",
        onClick: $setup.onOpenReportPrint,
        style: { "font-size": "16px" }
      }, null, 8, ["onClick"])
    ])) : createCommentVNode("", true),
    createVNode(_component_BasicForm, {
      ref: "onlineFormRef",
      onRegister: $setup.registerForm
    }, null, 8, ["onRegister"]),
    $setup.hasSubTable ? (openBlock(), createBlock(_component_a_tabs, {
      key: 1,
      activeKey: $setup.subActiveKey,
      "onUpdate:activeKey": _cache[0] || (_cache[0] = ($event) => $setup.subActiveKey = $event)
    }, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.subTabInfo, (sub, index) => {
          return openBlock(), createBlock(_component_a_tab_pane, {
            tab: sub.describe,
            key: index + "",
            forceRender: true
          }, {
            default: withCtx(() => [
              sub.relationType == 1 ? (openBlock(), createElementBlock("div", {
                key: 0,
                style: normalizeStyle({ "overflow-y": "auto", "overflow-x": "hidden", "max-height": $setup.subFormHeight + "px" })
              }, [
                createVNode(_component_online_sub_form, {
                  ref_for: true,
                  ref: $setup.refMap[sub.key],
                  table: sub.key,
                  disabled: $setup.onlineFormDisabled,
                  "form-template": $props.formTemplate,
                  "main-id": $setup.getSubTableForeignKeyValue(sub.foreignKey),
                  properties: sub.properties,
                  "required-fields": sub.requiredFields,
                  "is-update": $setup.isUpdate,
                  onFormChange: (arg) => $setup.handleSubFormChange(arg, sub.key)
                }, null, 8, ["table", "disabled", "form-template", "main-id", "properties", "required-fields", "is-update", "onFormChange"])
              ], 4)) : (openBlock(), createElementBlock("div", _hoisted_3, [
                createVNode(_component_JVxeTable, {
                  ref_for: true,
                  ref: $setup.refMap[sub.key],
                  toolbar: "",
                  "keep-source": "",
                  "row-number": "",
                  "row-selection": "",
                  height: $setup.subTableHeight,
                  disabled: $setup.onlineFormDisabled,
                  columns: sub.columns,
                  dataSource: $setup.subDataSource[sub.key],
                  onValueChange: (event) => $setup.handleValueChange(event, sub.key),
                  authPre: $setup.getSubTableAuthPre(sub.key),
                  onAdded: ($event) => $setup.handleAdded(sub, $event),
                  onExecuteFillRule: ($event) => $setup.handleSubTableDefaultValue(sub, $event)
                }, {
                  toolbarSuffix: withCtx(() => [
                    createVNode(_component_a_button, {
                      type: "primary",
                      onClick: ($event) => $setup.openSubFormModalForAdd(sub)
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_diff_outlined)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_a_button, {
                      type: "primary",
                      onClick: ($event) => $setup.openSubFormModalForEdit(sub)
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_form_outlined)
                      ]),
                      _: 2
                    }, 1032, ["onClick"])
                  ]),
                  _: 2
                }, 1032, ["height", "disabled", "columns", "dataSource", "onValueChange", "authPre", "onAdded", "onExecuteFillRule"])
              ]))
            ]),
            _: 2
          }, 1032, ["tab"]);
        }), 128))
      ]),
      _: 1
    }, 8, ["activeKey"])) : createCommentVNode("", true),
    createVNode(_component_Loading, {
      loading: $setup.loading,
      absolute: false
    }, null, 8, ["loading"]),
    renderSlot(_ctx.$slots, "bottom"),
    createVNode(_component_online_pop_modal, {
      formTableType: "3",
      request: $setup.popModalRequest,
      id: $setup.popTableName,
      onRegister: $setup.registerPopModal,
      onSuccess: $setup.getPopFormData,
      topTip: "",
      isVxeTableData: ""
    }, null, 8, ["request", "id", "onRegister", "onSuccess"])
  ], 8, _hoisted_1);
}
var OnlineForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
var OnlineForm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": OnlineForm
}, Symbol.toStringTag, { value: "Module" }));
export { GET_FUN_BODY_REG as G, OnlineForm as O, OnlineForm$1 as a, useCustomHook as u };
