var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
import { add } from '/@/components/Form/src/componentMap';
import { propTypes } from '/@/utils/propTypes';
import {
  ref,
  reactive,
  watch,
  toRaw,
  computed,
  nextTick,
  resolveComponent,
  openBlock,
  createBlock,
  unref,
  createElementBlock,
  createVNode,
  defineComponent,
  h,
  mergeProps,
  withCtx,
  createTextVNode,
  toDisplayString,
  createCommentVNode,
  watchEffect,
  createElementVNode,
  Fragment,
  renderList,
  markRaw,
  defineAsyncComponent,
  normalizeClass,
} from 'vue';
import { PrinterOutlined, DiffOutlined, FormOutlined, PlusOutlined, EditOutlined, MinusCircleFilled } from '@ant-design/icons-vue';
import { useModal, useModalInner, BasicModal } from '/@/components/Modal';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicForm, useForm } from '/@/components/Form/index';
import { defHttp } from '/@/utils/http/axios';
import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload';
import { duplicateCheck } from '/@/views/system/user/user.api';
import { c as commonjsGlobal } from './_commonjsHelpers.js';
import { useUserStore } from '/@/store/modules/user';
import { replaceAll, goJmReportViewPage, importViewsFile } from '/@/utils';
import * as CustomExpression from '/@/utils/desform/customExpression';
import { usePermissionStore } from '/@/store/modules/permission';
import { filterMultiDictText } from '/@/utils/dict/JDictSelectUtil';
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import { p as pick } from './pick.js';
import { BasicTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { useRouter } from 'vue-router';
import { getAreaTextByCode } from '/@/components/Form/src/utils/Area';
import { createImgPreview } from '/@/components/Preview/index';
import LinkTableListPiece from './LinkTableListPiece.js';
import { _ as _export_sfc } from './index.js';
import OnlineSelectCascade from './OnlineSelectCascade.js';
import { Loading } from '/@/components/Loading';
import { getToken } from '/@/utils/auth';
import JModalTip from './JModalTip.js';
import { Button } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/core';
const SUBMIT_FLOW_KEY = 'jeecg_submit_form_and_flow';
const SUBMIT_FLOW_ID = 'flow_submit_id';
const ONL_FORM_TABLE_NAME = 'online_form_table_name';
const VALIDATE_FAILED = 'validate-failed';
const SETUP = 'setup';
const ENHANCEJS = 'EnhanceJS';
const FORM_VIEW_TO_QUERY_VIEW = {
  password: 'text',
  file: 'text',
  image: 'text',
  textarea: 'text',
  umeditor: 'text',
  markdown: 'text',
  checkbox: 'list_multi',
  radio: 'list',
};
const POP_CONTAINER = '.jeecg-online-modal .ant-modal-content';
const ONL_AUTH_PRE = 'online_';
class IFormSchema {
  constructor(key, data) {
    this._data = data;
    this.field = key;
    this.label = data.title;
    this.hidden = false;
    this.order = data.order || 999;
    this.required = false;
    this.onlyValidator = '';
    this.setFieldsValue = '';
    this.hasChange = true;
    if (key.indexOf('@') > 0) {
      this.pre = key.substring(0, key.indexOf('@') + 1);
    } else {
      this.pre = '';
    }
    this.schemaProp = {};
    this.searchForm = false;
    this.disabled = false;
    this.popContainer = '';
    this.handleWidgetAttr(data);
    this.inPopover = false;
    this.labelLength = 4;
    this.initLabelLength();
  }
  getFormItemSchema() {
    let schema = this.getItem();
    this.addDefaultChangeEvent(schema);
    return schema;
  }
  getItem() {
    let fs = {
      field: this.field,
      label: this.label,
      labelLength: this.labelLength,
      component: 'Input',
      itemProps: {
        labelCol: {
          class: 'online-form-label',
        },
      },
    };
    let rules = this.getRule();
    if (rules.length > 0 && this.onlyValidator) {
      fs['rules'] = rules;
    }
    if (this.hidden === true) {
      fs['show'] = false;
    }
    return fs;
  }
  setFormRef(ref2) {
    this.formRef = ref2;
  }
  isHidden() {
    this.hidden = true;
    return this;
  }
  isRequired(array) {
    if (array && array.length > 0) {
      if (array.indexOf(this.field) >= 0) {
        this.required = true;
      }
    }
    return this;
  }
  initLabelLength() {
    let obj = this.getExtendData();
    if (obj && obj.labelLength) {
      this.labelLength = obj.labelLength;
    }
  }
  getExtendData() {
    let extend = {};
    let { fieldExtendJson } = this._data;
    if (fieldExtendJson) {
      if (typeof fieldExtendJson == 'string') {
        try {
          let json = JSON.parse(fieldExtendJson);
          extend = __spreadValues({}, json);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return extend;
  }
  getRelatedHideFields() {
    return [];
  }
  getPlaceholder() {
    return '\u8BF7\u8F93\u5165' + this.label;
  }
  setOnlyValidateFun(validateFun) {
    if (validateFun) {
      this.onlyValidator = (rule, value) =>
        __async(this, null, function* () {
          let error = yield validateFun(rule, value);
          if (!error) {
            return Promise.resolve();
          } else {
            return Promise.reject(error);
          }
        });
    }
  }
  getRule() {
    let rules = [];
    const { view, errorInfo, pattern, type } = this._data;
    if (this.required === true) {
      let msg = this.getPlaceholder();
      if (errorInfo) {
        msg = errorInfo;
      }
      if (view == 'sel_depart' || view == 'sel_user') {
        this.schemaProp['required'] = true;
      } else {
        rules.push({ required: true, message: msg });
      }
    }
    if ('sel_user' == view) {
      if (pattern === 'only' && this.onlyValidator) {
        rules.push({ validator: this.onlyValidator });
      }
    }
    if ('list' === view || 'radio' === view || 'markdown' === view || 'pca' === view || view.indexOf('sel') >= 0 || 'time' === view) {
      return rules;
    }
    if (view.indexOf('upload') >= 0 || view.indexOf('file') >= 0 || view.indexOf('image') >= 0) {
      return rules;
    }
    if (pattern) {
      if (pattern === 'only') {
        if (this.onlyValidator) {
          rules.push({ validator: this.onlyValidator });
        }
      } else if (pattern === 'z') {
        if (type == 'number' || type == 'integer');
        else {
          rules.push({ pattern: /^-?\d+$/, message: '\u8BF7\u8F93\u5165\u6574\u6570' });
        }
      } else {
        let msg = errorInfo || '\u6B63\u5219\u8868\u8FBE\u5F0F\u4E0D\u6B63\u786E';
        rules.push({ pattern, message: msg });
      }
    }
    return rules;
  }
  addDefaultChangeEvent(schema) {
    if (this.hasChange) {
      if (!schema.componentProps) {
        schema.componentProps = {};
      }
      if (this.disabled == true) {
        schema.componentProps.disabled = true;
      }
      if (!schema.componentProps.hasOwnProperty('onChange')) {
        schema.componentProps['onChange'] = (value, formData) => {
          if (value instanceof Event) {
            value = value.target.value;
          }
          if (value instanceof Array) {
            value = value.join(',');
          }
          if (!this.formRef || !this.formRef.value || !this.formRef.value.$formValueChange) {
            console.log('\u5F53\u524D\u8868\u5355\u65E0\u6CD5\u89E6\u53D1change\u4E8B\u4EF6,field\uFF1A' + this.field);
          } else {
            this.formRef.value.$formValueChange(this.field, value, formData);
          }
        };
      }
    }
    Object.keys(this.schemaProp).map((k) => {
      schema[k] = this.schemaProp[k];
    });
  }
  noChange() {
    this.hasChange = false;
  }
  updateField(field2) {
    this.field = field2;
  }
  setFunctionForFieldValue(func) {
    if (func) {
      this.setFieldsValue = func;
    }
  }
  asSearchForm() {
    this.searchForm = true;
  }
  getModalAsContainer() {
    let ele = this.getPopContainer();
    return document.querySelector(ele);
  }
  getPopContainer() {
    if (this.searchForm === true) {
      return 'body';
    } else if (this.inPopover === true) {
      return `.${this.popContainer}`;
    } else if (this.popContainer) {
      return `.${this.popContainer} .ant-modal-content`;
    } else {
      return POP_CONTAINER;
    }
  }
  handleWidgetAttr(data) {
    if (data.ui) {
      if (data.ui.widgetattrs) {
        if (data.ui.widgetattrs.disabled == true) {
          this.disabled = true;
        }
      }
    }
  }
  setCustomPopContainer(modalClass) {
    this.popContainer = modalClass;
  }
  getLinkFieldInfo() {
    return '';
  }
  setOtherInfo(_arg) {}
  isInPopover() {
    this.inPopover = true;
  }
}
class InputWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    if (this.hidden === true) {
      item['show'] = false;
    }
    return item;
  }
}
var DateFormat = /* @__PURE__ */ ((DateFormat2) => {
  DateFormat2['datetime'] = 'YYYY-MM-DD HH:mm:ss';
  DateFormat2['date'] = 'YYYY-MM-DD';
  return DateFormat2;
})(DateFormat || {});
class DateWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.format = DateFormat[data.view];
    this.showTime = data.view == 'date' ? false : true;
  }
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'DatePicker',
      componentProps: {
        placeholder: `\u8BF7\u9009\u62E9${this.label}`,
        showTime: this.showTime,
        valueFormat: this.format,
        style: {
          width: '100%',
        },
        getPopupContainer: (_node) => {
          return this.getModalAsContainer();
        },
      },
    });
  }
}
class SelectWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.options = this.getOptions(data['enum'], data.type);
    this.dictTable = data['dictTable'];
    this.dictText = data['dictText'];
    this.dictCode = data['dictCode'];
    this.multi = data['multi'] || false;
  }
  getItem() {
    let item = super.getItem();
    let component = this.getFormComponent();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component,
      componentProps,
    });
  }
  getFormComponent() {
    if (this.options.length > 0) {
      return 'Select';
    } else {
      return 'JDictSelectTag';
    }
  }
  getComponentProps() {
    let mode = this.multi === true ? 'multiple' : 'combobox';
    let props = {
      allowClear: true,
      mode,
      style: {
        width: '100%',
      },
      getPopupContainer: (_node) => {
        return this.getModalAsContainer();
      },
    };
    if (this.options.length > 0) {
      props['options'] = this.options;
    } else {
      if (!this.dictTable) {
        props['dictCode'] = this.dictCode;
      } else {
        let temp = `${this.dictTable},${this.dictText},${this.dictCode}`;
        props['dictCode'] = encodeURI(temp);
      }
    }
    return props;
  }
  getOptions(array, type) {
    if (!array || array.length == 0) {
      return [];
    }
    let isNum = 'number' == type;
    let arr = [];
    for (let item of array) {
      let value = item.value;
      if (isNum) {
        value = parseInt(value);
      }
      arr.push({
        value,
        label: item.title,
      });
    }
    return arr;
  }
}
class PasswordWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'InputPassword',
    });
  }
}
class FileWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JUpload',
      componentProps,
    });
  }
  getComponentProps() {
    let json = this.getExtendData();
    if (json) {
      return {
        maxCount: json.uploadnum ? Number(0) : Number(json.uploadnum),
        sizeLimit: json.sizeLimit ? Number(0) : Number(json.sizeLimit),
      };
    }
    return {};
  }
}
class ImageWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JUpload',
      componentProps,
    });
  }
  getComponentProps() {
    let props = {
      fileType: UploadTypeEnum.image,
    };
    let json = this.getExtendData();
    if (json && json.uploadnum) {
      props['maxCount'] = Number(json.uploadnum);
    }
    if (json && json.sizeLimit) {
      props['sizeLimit'] = Number(json.sizeLimit);
    }
    return props;
  }
}
class TextAreaWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'InputTextArea',
      componentProps: {
        autoSize: {
          minRows: 4,
          maxRows: 20,
        },
      },
    });
  }
}
class SelectMultiWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dictTable = data['dictTable'];
    this.dictText = data['dictText'];
    this.dictCode = data['dictCode'];
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JSelectMultiple',
      componentProps,
    });
  }
  getComponentProps() {
    if (!this.dictTable && !this.dictCode) {
      return {};
    } else {
      let props = {};
      if (!this.dictTable) {
        props['dictCode'] = this.dictCode;
      } else {
        let temp = `${this.dictTable},${this.dictText},${this.dictCode}`;
        props['dictCode'] = encodeURI(temp);
      }
      props['triggerChange'] = true;
      props['popContainer'] = this.getPopContainer();
      return props;
    }
  }
}
class SelectSearchWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dict = encodeURI(`${data.dictTable},${data.dictText},${data.dictCode}`);
  }
  getItem() {
    let item = super.getItem();
    let popContainer = this.getPopContainer();
    return Object.assign({}, item, {
      component: 'JSearchSelect',
      componentProps: {
        dict: this.dict,
        pageSize: 6,
        async: true,
        popContainer,
      },
    });
  }
}
class PopupWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.code = data['code'];
    this.multi = data['popupMulti'];
    this.fieldConfig = this.getFieldConfig(data);
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JPopup',
      componentProps,
    });
  }
  getComponentProps() {
    let props = {
      code: this.code,
      multi: this.multi,
      fieldConfig: this.fieldConfig,
    };
    if (this.formRef) {
      props['formElRef'] = this.formRef;
    } else {
      props['setFieldsValue'] = this.setFieldsValue;
    }
    if (this.inPopover === true) {
      props['getContainer'] = () => {
        return this.getModalAsContainer();
      };
    }
    return props;
  }
  getFieldConfig(data) {
    let { destFields, orgFields } = data;
    if (!destFields || destFields.length == 0) {
      return [];
    }
    let arr1 = destFields.split(',');
    let arr2 = orgFields.split(',');
    let config = [];
    const pre = this.pre;
    for (let i = 0; i < arr1.length; i++) {
      config.push({
        target: pre + arr1[i],
        source: arr2[i],
      });
    }
    return config;
  }
}
class TreeCategoryWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.multi = false;
    this.pid = data['pidValue'];
    this.pcode = data['pcode'];
    this.textField = data['textField'];
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      componentProps,
      component: 'JCategorySelect',
    });
  }
  getComponentProps() {
    let param = {
      placeholder: '\u8BF7\u9009\u62E9' + this.label,
    };
    if (this.pcode) {
      param['pcode'] = this.pcode;
    } else {
      let pidValue = this.pid || 'EMPTY_PID';
      param['pid'] = pidValue;
    }
    if (!this.textField) {
      return __spreadValues(
        {
          multiple: this.multi,
        },
        param
      );
    } else {
      return __spreadProps(
        __spreadValues(
          {
            loadTriggleChange: true,
            multiple: this.multi,
          },
          param
        ),
        {
          back: this.textField,
          onChange: (val, backVal) => {
            if (this.formRef) {
              this.formRef.value.setFieldsValue(backVal);
              this.formRef.value.$formValueChange(this.field, val);
            }
          },
        }
      );
    }
  }
  getRelatedHideFields() {
    let arr = [];
    if (this.textField) {
      arr.push(this.textField);
    }
    return arr;
  }
}
class SelectDepartWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JSelectDept',
      componentProps,
    });
  }
  getComponentProps() {
    let extend = this.getExtendData();
    let props = {
      checkStrictly: true,
      showButton: false,
    };
    if (extend.text) {
      props['labelKey'] = extend.text;
    }
    if (extend.store) {
      props['rowKey'] = extend.store;
    }
    if (extend.multiSelect === false) {
      props['multiple'] = false;
    }
    if (this.inPopover === true) {
      props['getContainer'] = () => {
        return this.getModalAsContainer();
      };
    }
    return props;
  }
}
class SelectUserWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.showButton = data.showButton === false ? false : true;
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JSelectUser',
      componentProps,
    });
  }
  getComponentProps() {
    let extend = this.getExtendData();
    let props = {
      showSelected: false,
      allowClear: true,
      isRadioSelection: false,
      showButton: this.showButton,
    };
    if (extend.text) {
      props['labelKey'] = extend.text;
    }
    if (extend.store) {
      props['rowKey'] = extend.store;
    }
    if (extend.multiSelect === false) {
      props['isRadioSelection'] = true;
    }
    if (this.inPopover === true) {
      props['getContainer'] = () => {
        return this.getModalAsContainer();
      };
    }
    return props;
  }
}
class EditorWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'JEditor',
      componentProps: {
        options: {
          auto_focus: false,
        },
      },
    });
  }
}
class MarkdownWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'JMarkdownEditor',
      componentProps: {},
    });
  }
}
class PcaWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'JAreaSelect',
    });
  }
}
class TreeSelectWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dict = data['dict'];
    this.pidField = data['pidField'];
    this.pidValue = data['pidValue'];
  }
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'JTreeSelect',
      componentProps: {
        dict: this.dict,
        pidField: this.pidField,
        pidValue: this.pidValue,
      },
    });
  }
}
class RadioWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dictTable = data['dictTable'];
    this.dictText = data['dictText'];
    this.dictCode = data['dictCode'];
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JDictSelectTag',
      componentProps,
    });
  }
  getComponentProps() {
    if (!this.dictTable && !this.dictCode) {
      return {};
    } else {
      if (!this.dictTable) {
        return {
          dictCode: this.dictCode,
          type: 'radio',
        };
      } else {
        let temp = `${this.dictTable},${this.dictText},${this.dictCode}`;
        return {
          dictCode: encodeURI(temp),
          type: 'radio',
        };
      }
    }
  }
}
class CheckboxWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.options = this.getOptions(data['enum']);
  }
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'JCheckbox',
      componentProps: {
        options: this.options,
        triggerChange: true,
      },
    });
  }
  getOptions(array) {
    if (!array || array.length == 0) {
      return [];
    }
    let arr = [];
    for (let item of array) {
      arr.push({
        value: item.value,
        label: item.title,
      });
    }
    return arr;
  }
}
class SwitchWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.hasChange = false;
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'JSwitch',
      componentProps,
    });
  }
  getComponentProps() {
    let { fieldExtendJson } = this._data;
    let options = ['Y', 'N'];
    if (fieldExtendJson) {
      if (typeof fieldExtendJson == 'string') {
        let arr = JSON.parse(fieldExtendJson);
        if (arr.length == 2) {
          options = arr;
        }
      }
    }
    return {
      options,
    };
  }
}
class TimeWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'TimePicker',
      componentProps: {
        placeholder: `\u8BF7\u9009\u62E9${this.label}`,
        valueFormat: 'HH:mm:ss',
        getPopupContainer: (_node) => {
          return this.getModalAsContainer();
        },
        style: {
          width: '100%',
        },
      },
    });
  }
}
class LinkDownWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    const { dictTable, dictText, dictCode, pidField, idField, origin: origin2, condition } = data;
    this.table = dictTable;
    this.txt = dictText;
    this.store = dictCode;
    this.idField = idField;
    this.pidField = pidField;
    this.origin = origin2;
    this.condition = condition;
    this.options = [];
    this.next = data.next || '';
    this.type = data.type;
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'OnlineSelectCascade',
      componentProps,
    });
  }
  getComponentProps() {
    let baseProp = {
      table: this.table,
      txt: this.txt,
      store: this.store,
      pidField: this.pidField,
      idField: this.idField,
      origin: this.origin,
      pidValue: '-1',
      style: {
        width: '100%',
      },
      onChange: (value) => {
        console.log('\u7EA7\u8054\u7EC4\u4EF6-onChange', value);
        this.valueChange(value);
      },
      onNext: (pidValue) => {
        console.log('\u7EA7\u8054\u7EC4\u4EF6-onNext', pidValue);
        this.nextOptionsChange(pidValue);
      },
    };
    if (this._data.origin === true) {
      baseProp['condition'] = this.condition;
    }
    return baseProp;
  }
  nextOptionsChange(pidValue) {
    return __async(this, null, function* () {
      if (!this.formRef) {
        console.error('\u8868\u5355\u5F15\u7528\u627E\u4E0D\u5230');
        return;
      }
      if (!this.next) {
        return;
      }
      let ref2 = this.formRef.value;
      yield ref2.updateSchema({
        field: this.next,
        componentProps: {
          pidValue,
        },
      });
    });
  }
  valueChange(value) {
    return __async(this, null, function* () {
      if (!this.formRef) {
        console.error('\u8868\u5355\u5F15\u7528\u627E\u4E0D\u5230');
        return;
      }
      if (!this.next) {
        return;
      }
      let ref2 = this.formRef.value;
      ref2.$formValueChange(this.field, value);
      yield ref2.setFieldsValue({ [this.next]: '' });
    });
  }
}
class SlotWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.slot = '';
  }
  getItem() {
    let item = super.getItem();
    let slot = this.slot;
    return Object.assign({}, item, { slot });
  }
  groupDate() {
    this.slot = 'groupDate';
    return this;
  }
  groupDatetime() {
    this.slot = 'groupDatetime';
    return this;
  }
  groupNumber() {
    this.slot = 'groupNumber';
    return this;
  }
}
class NumberWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dbPointLength = data.dbPointLength;
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'InputNumber',
      componentProps,
    });
  }
  getComponentProps() {
    const props = {
      style: {
        width: '100%',
      },
    };
    if (this.dbPointLength >= 0) {
      props['precision'] = this.dbPointLength;
    }
    return props;
  }
}
class LinkTableWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dictTable = data.dictTable;
    this.dictText = data.dictText;
    this.dictCode = data.dictCode;
    this.view = data.view;
    this.componentString = '';
    this.linkFields = [];
  }
  getItem() {
    let item = super.getItem();
    const componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: this.componentString,
      componentProps,
    });
  }
  getComponentProps() {
    let props = {
      textField: this.dictText,
      tableName: this.dictTable,
      valueField: this.dictCode,
    };
    let extend = this.getExtendData();
    if (extend.multiSelect) {
      props['multi'] = true;
    } else {
      props['multi'] = false;
    }
    if (extend.imageField) {
      props['imageField'] = extend.imageField;
    } else {
      props['imageField'] = '';
    }
    if (extend.showType == 'select') {
      this.componentString = 'LinkTableSelect';
      let popContainer = this.getPopContainer();
      props['popContainer'] = popContainer;
    } else {
      this.componentString = 'LinkTableCard';
    }
    if (this.linkFields.length > 0) {
      props['linkFields'] = this.linkFields;
    }
    return props;
  }
  setOtherInfo(arr) {
    this.linkFields = arr;
  }
}
class LinkTableFieldWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.dictTable = data['dictTable'];
    this.dictText = data['dictText'];
  }
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      componentProps: {
        readOnly: true,
        allowClear: false,
        disabled: true,
        style: {
          background: 'none',
          color: 'rgba(0, 0, 0, 0.85)',
          border: 'none',
        },
      },
    });
  }
  getLinkFieldInfo() {
    let arr = [this.dictTable, `${this.field},${this.dictText}`];
    return arr;
  }
}
class LinkTableForQueryWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.code = data['code'];
    this.titleField = data['titleField'];
    this.multi = data['multi'] || false;
  }
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'LinkTableForQuery',
      componentProps: {
        code: this.code,
        multi: this.multi,
        field: this.titleField,
        style: {
          width: '100%',
        },
      },
    });
  }
}
class CascaderPcaForQueryWidget extends IFormSchema {
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: 'CascaderPcaForQuery',
      componentProps: {
        style: {
          width: '100%',
        },
      },
    });
  }
}
class SelectUser2Widget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    this.multi = data.multi === true ? true : false;
    this.store = data.store || '';
    this.query = data.query || false;
  }
  getItem() {
    let item = super.getItem();
    let componentProps = this.getComponentProps();
    return Object.assign({}, item, {
      component: 'UserSelect',
      componentProps,
    });
  }
  getComponentProps() {
    let props = {
      multi: this.multi,
      store: this.store,
      query: this.query,
    };
    if (this.inPopover === true) {
      props['getContainer'] = () => {
        return this.getModalAsContainer();
      };
    }
    return props;
  }
}
class RangeWidget extends IFormSchema {
  constructor(key, data) {
    super(key, data);
    let view = data.view;
    this.format = data.format;
    this.datetime = false;
    if ('rangeNumber' === view) {
      this.componentType = 'JRangeNumber';
    } else if ('rangeTime' === view) {
      this.componentType = 'RangeTime';
    } else {
      this.componentType = 'RangeDate';
      if (data.datetime === true) {
        this.datetime = true;
      }
    }
  }
  getItem() {
    let item = super.getItem();
    return Object.assign({}, item, {
      component: this.componentType,
      componentProps: {
        datetime: this.datetime,
        format: this.format,
        getPopupContainer: (_node) => {
          return this.getModalAsContainer();
        },
      },
    });
  }
}
class FormSchemaFactory {
  static createFormSchema(key, data) {
    let view = data.view;
    switch (view) {
      case 'password':
        return new PasswordWidget(key, data);
      case 'list':
        return new SelectWidget(key, data);
      case 'radio':
        return new RadioWidget(key, data);
      case 'checkbox':
        return new CheckboxWidget(key, data);
      case 'date':
      case 'datetime':
        return new DateWidget(key, data);
      case 'time':
        return new TimeWidget(key, data);
      case 'file':
        return new FileWidget(key, data);
      case 'image':
        return new ImageWidget(key, data);
      case 'textarea':
        return new TextAreaWidget(key, data);
      case 'list_multi':
        return new SelectMultiWidget(key, data);
      case 'sel_search':
        return new SelectSearchWidget(key, data);
      case 'popup':
        return new PopupWidget(key, data);
      case 'cat_tree':
        return new TreeCategoryWidget(key, data);
      case 'sel_depart':
        return new SelectDepartWidget(key, data);
      case 'sel_user':
        return new SelectUserWidget(key, data);
      case 'umeditor':
        return new EditorWidget(key, data);
      case 'markdown':
        return new MarkdownWidget(key, data);
      case 'pca':
        return new PcaWidget(key, data);
      case 'link_down':
        return new LinkDownWidget(key, data);
      case 'sel_tree':
        return new TreeSelectWidget(key, data);
      case 'switch':
        return new SwitchWidget(key, data);
      case 'link_table':
        return new LinkTableWidget(key, data);
      case 'link_table_field':
        return new LinkTableFieldWidget(key, data);
      case 'slot':
        return new SlotWidget(key, data);
      case 'LinkTableForQuery':
        return new LinkTableForQueryWidget(key, data);
      case 'CascaderPcaForQuery':
        return new CascaderPcaForQueryWidget(key, data);
      case 'select_user2':
        return new SelectUser2Widget(key, data);
      case 'rangeDate':
      case 'rangeTime':
      case 'rangeNumber':
        return new RangeWidget(key, data);
      case 'hidden':
        return new InputWidget(key, data).isHidden();
      default:
        if (data.type == 'number') {
          return new NumberWidget(key, data);
        } else {
          return new InputWidget(key, data);
        }
    }
  }
  static createSlotFormSchema(key, data) {
    let slotFs = new SlotWidget(key, data);
    let view = data.view;
    if ('date' == view) {
      slotFs.groupDate();
    } else if ('datetime' == view) {
      slotFs.groupDatetime();
    } else {
      let type = data.type;
      if (type == 'number' || type == 'integer') {
        slotFs.groupNumber();
      }
    }
    return slotFs;
  }
  static createIdField() {
    return {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    };
  }
}
var dayjs_min = { exports: {} };
(function (module, exports) {
  !(function (t, e) {
    module.exports = e();
  })(commonjsGlobal, function () {
    var t = 1e3,
      e = 6e4,
      n = 36e5,
      r = 'millisecond',
      i = 'second',
      s = 'minute',
      u = 'hour',
      a = 'day',
      o = 'week',
      f = 'month',
      h2 = 'quarter',
      c = 'year',
      d = 'date',
      l = 'Invalid Date',
      $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
      y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
      M = {
        name: 'en',
        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        ordinal: function (t2) {
          var e2 = ['th', 'st', 'nd', 'rd'],
            n2 = t2 % 100;
          return '[' + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + ']';
        },
      },
      m = function (t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : '' + Array(e2 + 1 - r2.length).join(n2) + t2;
      },
      v = {
        s: m,
        z: function (t2) {
          var e2 = -t2.utcOffset(),
            n2 = Math.abs(e2),
            r2 = Math.floor(n2 / 60),
            i2 = n2 % 60;
          return (e2 <= 0 ? '+' : '-') + m(r2, 2, '0') + ':' + m(i2, 2, '0');
        },
        m: function t2(e2, n2) {
          if (e2.date() < n2.date()) return -t2(n2, e2);
          var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()),
            i2 = e2.clone().add(r2, f),
            s2 = n2 - i2 < 0,
            u2 = e2.clone().add(r2 + (s2 ? -1 : 1), f);
          return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
        },
        a: function (t2) {
          return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
        },
        p: function (t2) {
          return (
            { M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: h2 }[t2] ||
            String(t2 || '')
              .toLowerCase()
              .replace(/s$/, '')
          );
        },
        u: function (t2) {
          return void 0 === t2;
        },
      },
      g = 'en',
      D = {};
    D[g] = M;
    var p = function (t2) {
        return t2 instanceof _;
      },
      S = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ('string' == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && ((D[s2] = n2), (i2 = s2));
          var u2 = e2.split('-');
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          (D[a2] = e2), (i2 = a2);
        }
        return !r2 && i2 && (g = i2), i2 || (!r2 && g);
      },
      w = function (t2, e2) {
        if (p(t2)) return t2.clone();
        var n2 = 'object' == typeof e2 ? e2 : {};
        return (n2.date = t2), (n2.args = arguments), new _(n2);
      },
      O = v;
    (O.l = S),
      (O.i = p),
      (O.w = function (t2, e2) {
        return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      });
    var _ = (function () {
        function M2(t2) {
          (this.$L = S(t2.locale, null, true)), this.parse(t2);
        }
        var m2 = M2.prototype;
        return (
          (m2.parse = function (t2) {
            (this.$d = (function (t3) {
              var e2 = t3.date,
                n2 = t3.utc;
              if (null === e2) return new Date(NaN);
              if (O.u(e2)) return new Date();
              if (e2 instanceof Date) return new Date(e2);
              if ('string' == typeof e2 && !/Z$/i.test(e2)) {
                var r2 = e2.match($);
                if (r2) {
                  var i2 = r2[2] - 1 || 0,
                    s2 = (r2[7] || '0').substring(0, 3);
                  return n2
                    ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2))
                    : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
                }
              }
              return new Date(e2);
            })(t2)),
              (this.$x = t2.x || {}),
              this.init();
          }),
          (m2.init = function () {
            var t2 = this.$d;
            (this.$y = t2.getFullYear()),
              (this.$M = t2.getMonth()),
              (this.$D = t2.getDate()),
              (this.$W = t2.getDay()),
              (this.$H = t2.getHours()),
              (this.$m = t2.getMinutes()),
              (this.$s = t2.getSeconds()),
              (this.$ms = t2.getMilliseconds());
          }),
          (m2.$utils = function () {
            return O;
          }),
          (m2.isValid = function () {
            return !(this.$d.toString() === l);
          }),
          (m2.isSame = function (t2, e2) {
            var n2 = w(t2);
            return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
          }),
          (m2.isAfter = function (t2, e2) {
            return w(t2) < this.startOf(e2);
          }),
          (m2.isBefore = function (t2, e2) {
            return this.endOf(e2) < w(t2);
          }),
          (m2.$g = function (t2, e2, n2) {
            return O.u(t2) ? this[e2] : this.set(n2, t2);
          }),
          (m2.unix = function () {
            return Math.floor(this.valueOf() / 1e3);
          }),
          (m2.valueOf = function () {
            return this.$d.getTime();
          }),
          (m2.startOf = function (t2, e2) {
            var n2 = this,
              r2 = !!O.u(e2) || e2,
              h3 = O.p(t2),
              l2 = function (t3, e3) {
                var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
                return r2 ? i2 : i2.endOf(a);
              },
              $2 = function (t3, e3) {
                return O.w(n2.toDate()[t3].apply(n2.toDate('s'), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
              },
              y2 = this.$W,
              M3 = this.$M,
              m3 = this.$D,
              v2 = 'set' + (this.$u ? 'UTC' : '');
            switch (h3) {
              case c:
                return r2 ? l2(1, 0) : l2(31, 11);
              case f:
                return r2 ? l2(1, M3) : l2(0, M3 + 1);
              case o:
                var g2 = this.$locale().weekStart || 0,
                  D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
                return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
              case a:
              case d:
                return $2(v2 + 'Hours', 0);
              case u:
                return $2(v2 + 'Minutes', 1);
              case s:
                return $2(v2 + 'Seconds', 2);
              case i:
                return $2(v2 + 'Milliseconds', 3);
              default:
                return this.clone();
            }
          }),
          (m2.endOf = function (t2) {
            return this.startOf(t2, false);
          }),
          (m2.$set = function (t2, e2) {
            var n2,
              o2 = O.p(t2),
              h3 = 'set' + (this.$u ? 'UTC' : ''),
              l2 = ((n2 = {}),
              (n2[a] = h3 + 'Date'),
              (n2[d] = h3 + 'Date'),
              (n2[f] = h3 + 'Month'),
              (n2[c] = h3 + 'FullYear'),
              (n2[u] = h3 + 'Hours'),
              (n2[s] = h3 + 'Minutes'),
              (n2[i] = h3 + 'Seconds'),
              (n2[r] = h3 + 'Milliseconds'),
              n2)[o2],
              $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
            if (o2 === f || o2 === c) {
              var y2 = this.clone().set(d, 1);
              y2.$d[l2]($2), y2.init(), (this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d);
            } else l2 && this.$d[l2]($2);
            return this.init(), this;
          }),
          (m2.set = function (t2, e2) {
            return this.clone().$set(t2, e2);
          }),
          (m2.get = function (t2) {
            return this[O.p(t2)]();
          }),
          (m2.add = function (r2, h3) {
            var d2,
              l2 = this;
            r2 = Number(r2);
            var $2 = O.p(h3),
              y2 = function (t2) {
                var e2 = w(l2);
                return O.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
              };
            if ($2 === f) return this.set(f, this.$M + r2);
            if ($2 === c) return this.set(c, this.$y + r2);
            if ($2 === a) return y2(1);
            if ($2 === o) return y2(7);
            var M3 = ((d2 = {}), (d2[s] = e), (d2[u] = n), (d2[i] = t), d2)[$2] || 1,
              m3 = this.$d.getTime() + r2 * M3;
            return O.w(m3, this);
          }),
          (m2.subtract = function (t2, e2) {
            return this.add(-1 * t2, e2);
          }),
          (m2.format = function (t2) {
            var e2 = this,
              n2 = this.$locale();
            if (!this.isValid()) return n2.invalidDate || l;
            var r2 = t2 || 'YYYY-MM-DDTHH:mm:ssZ',
              i2 = O.z(this),
              s2 = this.$H,
              u2 = this.$m,
              a2 = this.$M,
              o2 = n2.weekdays,
              f2 = n2.months,
              h3 = function (t3, n3, i3, s3) {
                return (t3 && (t3[n3] || t3(e2, r2))) || i3[n3].slice(0, s3);
              },
              c2 = function (t3) {
                return O.s(s2 % 12 || 12, t3, '0');
              },
              d2 =
                n2.meridiem ||
                function (t3, e3, n3) {
                  var r3 = t3 < 12 ? 'AM' : 'PM';
                  return n3 ? r3.toLowerCase() : r3;
                },
              $2 = {
                YY: String(this.$y).slice(-2),
                YYYY: this.$y,
                M: a2 + 1,
                MM: O.s(a2 + 1, 2, '0'),
                MMM: h3(n2.monthsShort, a2, f2, 3),
                MMMM: h3(f2, a2),
                D: this.$D,
                DD: O.s(this.$D, 2, '0'),
                d: String(this.$W),
                dd: h3(n2.weekdaysMin, this.$W, o2, 2),
                ddd: h3(n2.weekdaysShort, this.$W, o2, 3),
                dddd: o2[this.$W],
                H: String(s2),
                HH: O.s(s2, 2, '0'),
                h: c2(1),
                hh: c2(2),
                a: d2(s2, u2, true),
                A: d2(s2, u2, false),
                m: String(u2),
                mm: O.s(u2, 2, '0'),
                s: String(this.$s),
                ss: O.s(this.$s, 2, '0'),
                SSS: O.s(this.$ms, 3, '0'),
                Z: i2,
              };
            return r2.replace(y, function (t3, e3) {
              return e3 || $2[t3] || i2.replace(':', '');
            });
          }),
          (m2.utcOffset = function () {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }),
          (m2.diff = function (r2, d2, l2) {
            var $2,
              y2 = O.p(d2),
              M3 = w(r2),
              m3 = (M3.utcOffset() - this.utcOffset()) * e,
              v2 = this - M3,
              g2 = O.m(this, M3);
            return (
              (g2 =
                (($2 = {}),
                ($2[c] = g2 / 12),
                ($2[f] = g2),
                ($2[h2] = g2 / 3),
                ($2[o] = (v2 - m3) / 6048e5),
                ($2[a] = (v2 - m3) / 864e5),
                ($2[u] = v2 / n),
                ($2[s] = v2 / e),
                ($2[i] = v2 / t),
                $2)[y2] || v2),
              l2 ? g2 : O.a(g2)
            );
          }),
          (m2.daysInMonth = function () {
            return this.endOf(f).$D;
          }),
          (m2.$locale = function () {
            return D[this.$L];
          }),
          (m2.locale = function (t2, e2) {
            if (!t2) return this.$L;
            var n2 = this.clone(),
              r2 = S(t2, e2, true);
            return r2 && (n2.$L = r2), n2;
          }),
          (m2.clone = function () {
            return O.w(this.$d, this);
          }),
          (m2.toDate = function () {
            return new Date(this.valueOf());
          }),
          (m2.toJSON = function () {
            return this.isValid() ? this.toISOString() : null;
          }),
          (m2.toISOString = function () {
            return this.$d.toISOString();
          }),
          (m2.toString = function () {
            return this.$d.toUTCString();
          }),
          M2
        );
      })(),
      T = _.prototype;
    return (
      (w.prototype = T),
      [
        ['$ms', r],
        ['$s', i],
        ['$m', s],
        ['$H', u],
        ['$W', a],
        ['$M', f],
        ['$y', c],
        ['$D', d],
      ].forEach(function (t2) {
        T[t2[1]] = function (e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }),
      (w.extend = function (t2, e2) {
        return t2.$i || (t2(e2, _, w), (t2.$i = true)), w;
      }),
      (w.locale = S),
      (w.isDayjs = p),
      (w.unix = function (t2) {
        return w(1e3 * t2);
      }),
      (w.en = D[g]),
      (w.Ls = D),
      (w.p = {}),
      w
    );
  });
})(dayjs_min);
var dayjs = dayjs_min.exports;
const ceKeys = Object.keys(CustomExpression);
const ceJoin = ceKeys.join(',');
const $CE$ = ceKeys.map((key) => CustomExpression[key]);
const normalRegExp = /#{([^}]+)?}/g;
const customRegExp = /{{([^}]+)?}}/g;
const fillRuleRegExp = /\${([^}]+)?}/g;
const ACTION_TYPES = { ADD: 'add', EDIT: 'edit', DETAIL: 'detail', RELOAD: 'reload' };
function initDefValueConfig(field2, item, config) {
  if (hasEffectiveValue(item.defVal)) {
    config.push({ field: field2, type: item.type, value: item.defVal });
  }
}
function initSubTableDefValueConfig(item, config) {
  if (hasEffectiveValue(item.fieldDefaultValue)) {
    config.push({ field: item.key, type: item.type, value: item.fieldDefaultValue });
  }
}
function loadFormFieldsDefVal(properties, callback, formData) {
  return __async(this, null, function* () {
    if (Array.isArray(properties) && properties.length > 0) {
      let formValues = {};
      for (let prop of properties) {
        let { value, type, field: field2 } = prop;
        value = yield handleDefaultValue(value, ACTION_TYPES.ADD, formData || {});
        if ('number' === type && value) {
          value = Number.parseFloat(value);
        }
        formValues[field2] = value;
      }
      callback(formValues);
    }
  });
}
function loadOneFieldDefVal(field2, item, formValues) {
  return __async(this, null, function* () {
    let { defVal, type } = item;
    if (hasEffectiveValue(defVal)) {
      let value = yield handleDefaultValue(defVal, ACTION_TYPES.ADD, {});
      if ('number' === type && value) {
        value = Number.parseFloat(value);
      }
      formValues[field2] = value;
    }
  });
}
function hasEffectiveValue(val) {
  if (val || val === 0) {
    return true;
  }
  return false;
}
function handleDefaultValue(defVal, action, getFormData) {
  return __async(this, null, function* () {
    if (defVal != null) {
      if (checkExpressionType(defVal)) {
        let value = yield getDefaultValue(defVal, action, getFormData);
        if (value != null) {
          return value;
        }
      }
    }
    return defVal;
  });
}
function checkExpressionType(defVal) {
  let normalCount = 0,
    customCount = 0,
    fillRuleCount = 0;
  defVal.replace(fillRuleRegExp, () => fillRuleCount++);
  if (fillRuleCount > 1) {
    logWarn(
      `\u8868\u8FBE\u5F0F[${defVal}]\u4E0D\u5408\u6CD5\uFF1A\u53EA\u80FD\u540C\u65F6\u586B\u5199\u4E00\u4E2A\u586B\u503C\u89C4\u5219\u8868\u8FBE\u5F0F\uFF01`
    );
    return false;
  }
  defVal.replace(normalRegExp, () => normalCount++);
  defVal.replace(customRegExp, () => customCount++);
  let fillRuleOtherCount = normalCount + customCount;
  if (fillRuleCount > 0 && fillRuleOtherCount > 0) {
    logWarn(
      `\u8868\u8FBE\u5F0F[${defVal}]\u4E0D\u5408\u6CD5\uFF1A\u586B\u503C\u89C4\u5219\u8868\u8FBE\u5F0F\u4E0D\u80FD\u548C\u5176\u4ED6\u8868\u8FBE\u5F0F\u6DF7\u7528\uFF01`
    );
    return false;
  }
  return true;
}
function getRegExpMap(text2, exp) {
  let map = /* @__PURE__ */ new Map();
  text2.replace(exp, function (match, param) {
    map.set(match, param.trim());
    return match;
  });
  return map;
}
function getDefaultValue(defVal, action, getFormData) {
  return __async(this, null, function* () {
    if (action === ACTION_TYPES.ADD || action === ACTION_TYPES.RELOAD) {
      if (fillRuleRegExp.test(defVal)) {
        let arr = [getFormData];
        return yield executeRegExp(defVal, fillRuleRegExp, executeFillRuleExpression, arr);
      }
    }
    if (action === ACTION_TYPES.ADD) {
      defVal = yield executeRegExp(defVal, normalRegExp, executeNormalExpression);
      defVal = yield executeRegExp(defVal, customRegExp, executeCustomExpression);
      return defVal;
    }
    return null;
  });
}
function executeRegExp(_0, _1, _2) {
  return __async(this, arguments, function* (defVal, regExp, execFun, otherParams = []) {
    let map = getRegExpMap(defVal, regExp);
    for (let origin2 of map.keys()) {
      let exp = map.get(origin2);
      let result = yield execFun.apply(null, [exp, origin2, ...otherParams]);
      if (origin2 === defVal) {
        return result;
      }
      defVal = replaceAll(defVal, origin2, result);
    }
    return defVal;
  });
}
function executeNormalExpression(expression2, origin2) {
  return __async(this, null, function* () {
    switch (expression2) {
      case 'date':
        return dayjs().format('YYYY-MM-DD');
      case 'time':
        return dayjs().format('HH:mm:ss');
      case 'datetime':
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
      default:
        let result = getUserInfoByExpression(expression2);
        if (result != null) {
          return result;
        }
        return origin2;
    }
  });
}
function getUserInfoByExpression(expression2) {
  const userStore = useUserStore();
  let userInfo = userStore.getUserInfo;
  if (userInfo) {
    switch (expression2) {
      case 'sysUserId':
        return userInfo.id;
      case 'sysUserCode':
      case 'sys_user_code':
        return userInfo.username;
      case 'sysUserName':
        return userInfo.realname;
      case 'sysOrgCode':
      case 'sys_org_code':
        return userInfo.orgCode;
    }
  }
  return null;
}
function executeCustomExpression(expression, origin) {
  return __async(this, null, function* () {
    let fn = eval(`(function (${ceJoin}){ return ${expression} })`);
    try {
      return fn.apply(null, $CE$);
    } catch (e) {
      logError(e);
      return origin;
    }
  });
}
function executeFillRuleExpression(expression2, origin2, getFormData) {
  return __async(this, null, function* () {
    let url = `/sys/fillRule/executeRuleByCode/${expression2}`;
    let formData = {};
    if (typeof getFormData === 'function') {
      formData = getFormData();
    } else if (getFormData) {
      formData = __spreadValues({}, getFormData);
    }
    let { success, message, result } = yield defHttp.put({ url, params: formData }, { isTransformResponse: false });
    if (success) {
      return result;
    } else {
      logError(`\u586B\u503C\u89C4\u5219\uFF08${expression2}\uFF09\u6267\u884C\u5931\u8D25\uFF1A${message}`);
      return origin2;
    }
  });
}
function logWarn(message) {
  console.warn('[loadFieldDefVal]:', message);
}
function logError(message) {
  console.error('[loadFieldDefVal]:', message);
}
const LINK_DOWN = 'link_down';
const LINK_TABLE_FIELD = 'link_table_field';
const LINK_TABLE = 'link_table';
function useFormItems(props, onlineFormRef) {
  useExtendComponent();
  const modalClass = props.modalClass;
  const formSchemas = ref([]);
  const tableName = ref('');
  const dbData = ref({});
  const fieldDisplayStatus = reactive({});
  const hasSubTable = ref(false);
  const subTabInfo = ref([]);
  const subDataSource = ref({});
  const refMap = {};
  const linkDownList = ref([]);
  const defaultValueFields = reactive({});
  const baseColProps = ref('');
  baseColProps.value = { sm: 24, xs: 24, md: 12, lg: 12, xl: 12, xxl: 12 };
  function createFormSchemas(properties, required, checkOnlyFieldValue2) {
    clearObj(defaultValueFields);
    defaultValueFields[tableName.value] = [];
    let subInfo = [];
    let arr = [];
    let hideFields = [];
    let dataSourceObj = {};
    let tableLinkInfo = {};
    Object.keys(properties).map((key) => {
      const item = properties[key];
      if (item.view == 'tab') {
        hasSubTable.value = true;
        defaultValueFields[key] = [];
        let temp = {
          key,
          foreignKey: item['foreignKey'],
          describe: item.describe,
          relationType: item.relationType,
          requiredFields: item.required || [],
          order: item.order,
          id: item.id,
        };
        if (item.relationType == 1) {
          refMap[key] = ref(null);
          temp['properties'] = item.properties;
        } else {
          dealSubProerties(item);
          refMap[key] = ref();
          temp['columns'] = item.columns;
          dataSourceObj[key] = [];
        }
        subInfo.push(temp);
        handleSubTableButtonAuth(key, item);
      } else {
        initDefValueConfig(key, item, defaultValueFields[tableName.value]);
        if (item.view === LINK_DOWN) {
          let array = handleLinkDown(item, key);
          for (let linkDownItem of array) {
            fieldDisplayStatus[linkDownItem.key] = true;
            fieldDisplayStatus[linkDownItem.key + '_load'] = true;
            let temp = FormSchemaFactory.createFormSchema(linkDownItem.key, linkDownItem);
            if (checkOnlyFieldValue2) {
              temp.setOnlyValidateFun(checkOnlyFieldValue2);
            }
            temp.isRequired(required);
            temp.setFormRef(onlineFormRef);
            temp.handleWidgetAttr(item);
            let tempIndex = getFieldIndex(arr, linkDownItem.key);
            if (tempIndex == -1) {
              arr.push(temp);
            } else {
              arr[tempIndex] = temp;
            }
          }
        } else {
          fieldDisplayStatus[key] = true;
          fieldDisplayStatus[key + '_load'] = true;
          let tempIndex = getFieldIndex(arr, key);
          if (tempIndex == -1) {
            let temp = FormSchemaFactory.createFormSchema(key, item);
            if (checkOnlyFieldValue2) {
              temp.setOnlyValidateFun(checkOnlyFieldValue2);
            }
            temp.isRequired(required);
            temp.setFormRef(onlineFormRef);
            arr.push(temp);
            hideFields.push(...temp.getRelatedHideFields());
            if (item.view === LINK_TABLE_FIELD) {
              let tempInfo = temp.getLinkFieldInfo();
              if (tempInfo) {
                if (tableLinkInfo[tempInfo[0]]) {
                  let tableLinkInfoEle = tableLinkInfo[tempInfo[0]];
                  tableLinkInfoEle.push(tempInfo[1]);
                } else {
                  tableLinkInfo[tempInfo[0]] = [tempInfo[1]];
                }
              }
            }
          }
        }
      }
    });
    arr.sort(function (a, b) {
      return a.order - b.order;
    });
    let formSchemaArray = [];
    formSchemaArray.push(FormSchemaFactory.createIdField());
    for (let a of arr) {
      if (a['view'] && a['view'] == LINK_TABLE) {
        if (tableLinkInfo[a.field]) {
          a.setOtherInfo(tableLinkInfo[a.field]);
        }
      }
      if (hideFields.indexOf(a.field) >= 0) {
        a.isHidden();
      }
      if (modalClass) {
        a.setCustomPopContainer(modalClass);
      }
      formSchemaArray.push(a.getFormItemSchema());
    }
    formSchemas.value = formSchemaArray;
    subInfo.sort(function (a, b) {
      return a.order - b.order;
    });
    subTabInfo.value = subInfo;
    subDataSource.value = dataSourceObj;
  }
  watch(
    fieldDisplayStatus,
    (val) => {
      let ref2 = onlineFormRef.value;
      let arr = [];
      let map = toRaw(val);
      Object.keys(map).map((k) => {
        if (k.endsWith('_load'));
        else {
          let item = {
            field: k,
            show: map[k],
          };
          let loadKey = k + '_load';
          if (map.hasOwnProperty(loadKey)) {
            item['ifShow'] = map[loadKey];
          }
          arr.push(item);
        }
      });
      if (ref2) {
        ref2.updateSchema(arr);
      }
    },
    { immediate: false }
  );
  function dealSubProerties(subInfo) {
    useOnlineVxeTableColumns(subInfo, (column) => {
      initSubTableDefValueConfig(column, defaultValueFields[subInfo.key]);
    });
  }
  watch(
    () => props.formTemplate,
    () => {
      baseColProps.value = getFormItemColProps();
    },
    { immediate: true }
  );
  function getFormItemColProps() {
    let temp = props.formTemplate;
    if (temp == 2) {
      return { sm: 24, xs: 24, md: 12, lg: 12, xl: 12, xxl: 12 };
    } else if (temp == 3) {
      return { sm: 24, xs: 24, md: 8, lg: 8, xl: 8, xxl: 8 };
    } else if (temp == 4) {
      return { sm: 24, xs: 24, md: 6, lg: 6, xl: 6, xxl: 6 };
    } else {
      return { sm: 24, xs: 24, md: 24, lg: 24, xl: 24, xxl: 24 };
    }
  }
  function checkOnlyFieldValue(rule, value) {
    return new Promise((resolve) => {
      if (!value) {
        resolve('');
      }
      let realTableName = tableName.value.replace(/\$\d+/, '');
      let param = {
        tableName: realTableName,
        fieldName: rule.field,
        fieldVal: value,
      };
      let formData = dbData.value;
      if (formData.id) {
        param['dataId'] = formData.id;
      }
      duplicateCheck(param)
        .then((res) => {
          if (res.success) {
            resolve('');
          } else {
            resolve(res.message);
          }
        })
        .catch((msg) => {
          resolve(msg);
        });
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
  return {
    formSchemas,
    defaultValueFields,
    tableName,
    dbData,
    checkOnlyFieldValue,
    createFormSchemas,
    fieldDisplayStatus,
    subTabInfo,
    hasSubTable,
    subDataSource,
    baseColProps,
    changeDataIfArray2String,
    linkDownList,
    refMap,
  };
}
function useOnlineVxeTableColumns(subInfo, callback) {
  const vxeTypeMap = {
    inputNumber: 'input-number',
    sel_depart: 'depart-select',
    sel_user: 'user-select',
    list_multi: 'select-multiple',
    input_pop: 'textarea',
    sel_search: 'select-search',
    'select-dict-search': 'selectDictSearch',
  };
  subInfo.columns.forEach((column) => {
    if (column.type === 'radio') {
      column.type = 'select';
    } else if (vxeTypeMap[column.type]) {
      column.type = vxeTypeMap[column.type];
    } else if (column.type === 'popup') {
      handleSubPopup(column);
    }
    if (column.type === 'depart-select') {
      column['checkStrictly'] = true;
    }
    if (column.type === 'user-select') {
      handleSubUserSelect(column);
    }
    if (column.type === 'pca') {
      column.width = '230px';
    }
    if ((column.width == 120 || column.width == '120px') && (column.type == 'image' || column.type == 'file')) {
      column.width = '130px';
    }
    if (!column.width) {
      column.width = '200px';
    }
    if (callback) {
      callback(column);
    }
  });
  function handleSubPopup(column) {
    let { destFields, orgFields } = column;
    let fieldConfig = [];
    if (!destFields || destFields.length == 0);
    else {
      let arr1 = destFields.split(',');
      let arr2 = orgFields.split(',');
      for (let i = 0; i < arr1.length; i++) {
        fieldConfig.push({
          target: arr1[i],
          source: arr2[i],
        });
      }
    }
    column.fieldConfig = fieldConfig;
  }
  function handleSubUserSelect(column) {
    let str2 = column.fieldExtendJson;
    let isRadioSelection = false;
    if (str2) {
      try {
        let json = JSON.parse(str2);
        if (json.multiSelect === false) {
          isRadioSelection = true;
        }
      } catch (e) {
        console.log('\u5B50\u8868\u83B7\u53D6\u7528\u6237\u7EC4\u4EF6\u7684\u6269\u5C55\u914D\u7F6E\u51FA\u73B0\u9519\u8BEF', e);
      }
    }
    column.isRadioSelection = isRadioSelection;
  }
}
function useOnlineFormContext() {
  let that = {};
  const CONTEXT_DESCRIPTION = {
    addSubRows: '<m> \u4E00\u5BF9\u591A\u5B50\u8868\uFF0C\u65B0\u589E\u81EA\u5B9A\u4E49\u884C',
    changeOptions: '<m> \u6539\u53D8\u4E0B\u62C9\u6846\u9009\u9879',
    clearSubRows: '<m> \u6E05\u7A7A\u4E00\u5BF9\u591A\u5B50\u8868\u884C',
    clearThenAddRows: '<m> \u6E05\u7A7A\u4E00\u5BF9\u591A\u5B50\u8868\u884C\uFF0C\u7136\u540E\u65B0\u589E\u81EA\u5B9A\u4E49\u884C',
    executeMainFillRule: '<m> \u5237\u65B0\u4E3B\u8868\u7684\u589E\u503C\u89C4\u5236\u503C',
    executeSubFillRule: '<m> \u5237\u65B0\u5B50\u8868\u7684\u589E\u503C\u89C4\u5236\u503C',
    getFieldsValue: '<m> \u83B7\u53D6\u8868\u5355\u63A7\u4EF6\u7684\u503C',
    getSubTableInstance: '<m> \u83B7\u53D6\u5B50\u8868\u5B9E\u4F8B',
    isUpdate: '<p> \u5224\u65AD\u662F\u5426\u4E3A\u7F16\u8F91\u6A21\u5F0F',
    loading: '<p> \u9875\u9762\u52A0\u8F7D\u72B6\u6001',
    onlineFormRef: '<p> \u5F53\u524D\u8868\u5355ref\u5BF9\u8C61',
    refMap: '<p> \u5B50\u8868ref\u5BF9\u8C61map',
    setFieldsValue: '<m> \u8BBE\u7F6E\u8868\u5355\u63A7\u4EF6\u7684\u503C',
    sh: '<p> \u8868\u5355\u63A7\u4EF6\u7684\u663E\u793A\u9690\u85CF\u72B6\u6001',
    subActiveKey: '<p> \u5B50\u8868\u6FC0\u6D3Btab\uFF0C\u5BF9\u5E94\u5B50\u8868\u8868\u540D',
    subFormHeight: '<p> \u4E00\u5BF9\u4E00\u5B50\u8868\u8868\u5355\u9AD8\u5EA6',
    submitFlowFlag: '<p> \u662F\u5426\u63D0\u4EA4\u6D41\u7A0B\u72B6\u6001',
    subTableHeight: '<p> \u4E00\u5BF9\u591A\u5B50\u8868\u8868\u683C\u9AD8\u5EA6',
    tableName: '<p> \u5F53\u524D\u8868\u540D',
    triggleChangeValues: '<m> \u4FEE\u6539\u591A\u4E2A\u8868\u5355\u503C',
    triggleChangeValue: '<m> \u4FEE\u6539\u8868\u5355\u503C',
    updateSchema: '<m> \u4FEE\u6539\u8868\u5355\u63A7\u4EF6\u914D\u7F6E',
  };
  const onlineFormContext = new Proxy(CONTEXT_DESCRIPTION, {
    get(_target, prop) {
      return Reflect.get(that, prop);
    },
  });
  function addObject2Context(prop, object) {
    that[prop] = object;
  }
  function resetContext(context) {
    Object.keys(context).map((k) => {
      that[k] = context[k];
    });
  }
  addObject2Context('$nextTick', nextTick);
  addObject2Context('addObject2Context', addObject2Context);
  return { onlineFormContext, addObject2Context, resetContext };
}
function handleLinkDown(item, field2) {
  const {
    config: { table, key, txt, linkField, idField, pidField, condition },
    others,
    order,
    title,
  } = item;
  let commonProp = {
    dictTable: table,
    dictText: txt,
    dictCode: key,
    pidField,
    idField,
    view: LINK_DOWN,
    type: item.type,
  };
  let array = [];
  let main = __spreadValues(
    {
      key: field2,
      title,
      order,
      condition,
      origin: true,
    },
    commonProp
  );
  if (linkField && linkField.length > 0) {
    let fields = linkField.split(',');
    main['next'] = fields[0];
    for (let i = 0; i < fields.length; i++) {
      for (let o of others) {
        if (o.field == fields[i]) {
          let temp = __spreadValues(
            {
              key: o.field,
              title: o.title,
              order: o.order,
              origin: false,
            },
            commonProp
          );
          if (i + 1 < fields.length) {
            temp['next'] = fields[i + 1];
          }
          array.push(temp);
        }
      }
    }
  }
  array.push(main);
  return array;
}
function getFieldIndex(arr, key) {
  let index = -1;
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item.field === key) {
      index = i;
      break;
    }
  }
  return index;
}
function getRefPromise(componentRef) {
  return new Promise((resolve) => {
    (function next() {
      let ref2 = componentRef.value;
      if (ref2) {
        resolve(ref2);
      } else {
        setTimeout(() => {
          next();
        }, 100);
      }
    })();
  });
}
function clearObj(obj) {
  Object.keys(obj).map((k) => {
    delete obj[k];
  });
}
const permissionStore = usePermissionStore();
function handleSubTableButtonAuth(tableName, item) {
  let arr = item.hideButtons;
  let code = ONL_AUTH_PRE + tableName + ':';
  if (!arr) {
    arr = [];
  }
  permissionStore.setOnlineSubTableAuth(code, arr);
}
function getDetailFormSchemas(props) {
  const detailFormSchemas = ref([]);
  const refMap = {};
  const showStatus = reactive({});
  const hasSubTable = ref(false);
  const subTabInfo = ref([]);
  const subDataSource = ref({});
  const formSpan = computed(() => {
    let temp = props.formTemplate;
    if (temp == '2') {
      return 12;
    } else if (temp == '3') {
      return 8;
    } else if (temp == '4') {
      return 6;
    } else {
      return 24;
    }
  });
  function createFormSchemas(properties) {
    let subInfo = [];
    console.log('111', properties);
    let arr = [];
    let dataSourceObj = {};
    Object.keys(properties).map((key) => {
      const item = properties[key];
      if (item.view == 'tab') {
        hasSubTable.value = true;
        let temp = {
          key,
          foreignKey: item['foreignKey'],
          describe: item.describe,
          relationType: item.relationType,
          requiredFields: item.required || [],
          order: item.order,
        };
        if (item.relationType == 1) {
          refMap[key] = ref(null);
          temp['properties'] = item.properties;
        } else {
          dealSubProerties(item);
          refMap[key] = ref();
          temp['columns'] = item.columns;
          dataSourceObj[key] = [];
          showStatus[key] = false;
        }
        subInfo.push(temp);
      } else {
        if (item.view === LINK_DOWN) {
          let array = handleLinkDown2(item, key);
          for (let linkDownItem of array) {
            let tempIndex = getFieldIndex2(arr, linkDownItem.key);
            let temp = {
              field: linkDownItem.key,
              label: linkDownItem.title,
              view: linkDownItem.view,
              order: linkDownItem.order,
              dictTable: linkDownItem.dictTable,
              linkField: linkDownItem.linkField || '',
            };
            if (tempIndex == -1) {
              arr.push(temp);
            } else {
              arr[tempIndex] = temp;
            }
          }
        } else if (item.view == 'hidden');
        else {
          let tempIndex = getFieldIndex2(arr, key);
          if (tempIndex == -1) {
            let temp = Object.assign(
              {
                field: key,
                label: item.title,
              },
              pick(item, ['view', 'order', 'fieldExtendJson', 'dictTable', 'dictText', 'dictCode', 'dict'])
            );
            if (item.view == 'file') {
              temp['span'] = 24;
              temp['isFile'] = true;
            }
            if (item.view == 'image') {
              temp['span'] = 24;
              temp['isImage'] = true;
            }
            if (item.view == 'link_table') {
              if (item.fieldExtendJson) {
                try {
                  let json = JSON.parse(item.fieldExtendJson);
                  if (json.showType != 'select') {
                    temp['isCard'] = true;
                  }
                  if (json.multiSelect == true) {
                    temp['multi'] = true;
                  }
                } catch (e) {
                  console.error('\u89E3\u6790json\u5B57\u7B26\u4E32\u51FA\u9519', item.fieldExtendJson);
                }
              }
            }
            if (item.view == 'umeditor' || item.view == 'markdown') {
              temp['isHtml'] = true;
              temp['span'] = 24;
            }
            arr.push(temp);
          }
        }
      }
    });
    arr.sort(function (a, b) {
      return a.order - b.order;
    });
    subInfo.sort(function (a, b) {
      return a.order - b.order;
    });
    subTabInfo.value = subInfo;
    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i];
      if (temp.isFile === true || temp.isImage === true || temp.isHtml === true) {
        if (i > 0) {
          let last = arr[i - 1];
          let span = last.span || formSpan.value;
          last.span = span;
        }
      }
    }
    detailFormSchemas.value = arr;
    subDataSource.value = dataSourceObj;
    console.log('adadad', arr);
  }
  function dealSubProerties(subInfo) {
    useOnlineVxeTableColumns(subInfo);
  }
  function getFieldIndex2(arr, key) {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.field === key) {
        index = i;
        break;
      }
    }
    return index;
  }
  function handleLinkDown2(item, field2) {
    let all = [];
    const {
      config: { table, key, txt, linkField },
      order,
      title,
      others,
    } = item;
    let obj = {
      table,
      key,
      txt,
    };
    let temp = {
      view: 'link_down',
      order,
      title,
      dictTable: JSON.stringify(obj),
    };
    all.push(Object.assign({}, { linkField, key: field2 }, temp));
    if (linkField) {
      let arr = linkField.split(',');
      for (let a of arr) {
        let title2 = '';
        for (let o of others) {
          if (o.field == a) {
            title2 = o.title;
          }
        }
        all.push(Object.assign({}, { key: a }, temp, { title: title2 }));
      }
    }
    return all;
  }
  return {
    detailFormSchemas,
    hasSubTable,
    subTabInfo,
    refMap,
    showStatus,
    createFormSchemas,
    formSpan,
    subDataSource,
  };
}
function useEnhance(onlineTableContext, isList = true) {
  let EnhanceJS = reactive({});
  const getAction = (url, params) => {
    return defHttp.get({ url, params }, { isTransformResponse: false });
  };
  const postAction = (url, params) => {
    return defHttp.post({ url, params }, { isTransformResponse: false });
  };
  const putAction = (url, params) => {
    return defHttp.put({ url, params }, { isTransformResponse: false });
  };
  const deleteAction = (url, params) => {
    return defHttp.delete({ url, params }, { isTransformResponse: false });
  };
  if (isList === true) {
    onlineTableContext['_getAction'] = getAction;
    onlineTableContext['_postAction'] = postAction;
    onlineTableContext['_putAction'] = putAction;
    onlineTableContext['_deleteAction'] = deleteAction;
  } else {
    onlineTableContext.addObject2Context('_getAction', getAction);
    onlineTableContext.addObject2Context('_postAction', postAction);
    onlineTableContext.addObject2Context('_putAction', putAction);
    onlineTableContext.addObject2Context('_deleteAction', deleteAction);
  }
  function initCgEnhanceJs(str) {
    if (str) {
      let Obj = eval('(' + str + ')');
      return new Obj(getAction, postAction, deleteAction);
    } else {
      return {};
    }
  }
  function triggerJsFun(that, buttonCode) {
    if (EnhanceJS && EnhanceJS[buttonCode]) {
      EnhanceJS[buttonCode](that);
    }
  }
  function customBeforeSubmit(that, formData) {
    if (EnhanceJS && EnhanceJS['beforeSubmit']) {
      return EnhanceJS['beforeSubmit'](that, formData);
    } else {
      return Promise.resolve();
    }
  }
  function beforeDelete(that, record2) {
    if (EnhanceJS && EnhanceJS['beforeDelete']) {
      return EnhanceJS['beforeDelete'](that, record2);
    } else {
      return Promise.resolve();
    }
  }
  if (isList === true) {
    if (onlineTableContext) {
      onlineTableContext['beforeDelete'] = (record2) => {
        const onlEnhanceJS = onlineTableContext['EnhanceJS'];
        if (onlEnhanceJS && onlEnhanceJS['beforeDelete']) {
          return onlEnhanceJS['beforeDelete'](onlineTableContext, record2);
        } else {
          return Promise.resolve();
        }
      };
      onlineTableContext['beforeEdit'] = (record2) => {
        const onlEnhanceJS = onlineTableContext['EnhanceJS'];
        if (onlEnhanceJS && onlEnhanceJS['beforeEdit']) {
          return onlEnhanceJS['beforeEdit'](onlineTableContext, record2);
        } else {
          return Promise.resolve();
        }
      };
    }
  }
  return {
    EnhanceJS,
    initCgEnhanceJs,
    customBeforeSubmit,
    beforeDelete,
    triggerJsFun,
  };
}
const baseUrl = '/online/cgform/api/subform';
const _sfc_main$5 = {
  name: 'OnlineSubForm',
  components: {
    BasicForm,
    Loading,
  },
  props: {
    properties: {
      type: Object,
      required: true,
    },
    mainId: {
      type: String,
      default: '',
    },
    table: {
      type: String,
      default: '',
    },
    formTemplate: {
      type: Number,
      default: 1,
    },
    requiredFields: {
      type: Array,
      default: [],
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['formChange'],
  setup(props, { emit }) {
    console.log('\u8FDB\u5165online\u5B50\u8868\u8868\u5355\u9875\u9762\u300B\u300B\u300B\u300B' + props.table);
    const onlineFormRef = ref(null);
    const formRendered = ref(false);
    useMessage();
    const {
      formSchemas,
      defaultValueFields,
      changeDataIfArray2String,
      tableName,
      dbData,
      checkOnlyFieldValue,
      fieldDisplayStatus,
      createFormSchemas,
      baseColProps,
    } = useFormItems(props, onlineFormRef);
    const [registerForm, { setProps, validate, resetFields, setFieldsValue, getFieldsValue }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      baseColProps,
    });
    watch(
      () => props.table,
      () => {
        tableName.value = props.table;
      },
      { immediate: true }
    );
    watch(
      () => props.properties,
      (valueObj) => {
        console.log('\u4E3B\u8868properties\u6539\u53D8', props.properties);
        formRendered.value = false;
        addFormChangeEvent();
        createFormSchemas(props.properties, props.requiredFields, checkOnlyFieldValue);
        formRendered.value = true;
      },
      { deep: true, immediate: true }
    );
    watch(
      () => props.mainId,
      (valueObj) => {
        console.log('\u4E3B\u8868ID\u6539\u53D8', props.mainId);
        setTimeout(() => {
          resetSubForm();
        }, 100);
      },
      { immediate: true }
    );
    watch(
      () => props.disabled,
      (val) => {
        setProps({ disabled: val });
      }
    );
    function addFormChangeEvent() {
      return __async(this, null, function* () {
        let formRefObject = yield getRefPromise(onlineFormRef);
        formRefObject.$formValueChange = (field2, value) => {
          let emitArgument = { [field2]: value };
          emit('formChange', emitArgument);
        };
      });
    }
    function handleDefaultValue2() {
      if (unref(props.isUpdate) === false) {
        let fieldProperties = toRaw(defaultValueFields[tableName.value]);
        loadFormFieldsDefVal(fieldProperties, (values) => {
          setFieldsValue(values);
        });
      }
    }
    function resetSubForm() {
      return __async(this, null, function* () {
        yield getRefPromise(formRendered);
        yield resetFields();
        handleDefaultValue2();
        const { table, mainId } = props;
        if (!table || !mainId) {
          return;
        }
        let values = yield loadData(table, mainId);
        dbData.value = values;
        yield setFieldsValue(values);
      });
    }
    function loadData(table, mainId) {
      let url = `${baseUrl}/${table}/${mainId}`;
      return new Promise((resolve, reject) => {
        defHttp.get({ url }, { isTransformResponse: false }).then((res) => {
          console.log(res);
          if (res.success) {
            resolve(res.result);
          } else {
            console.log(res.message);
            reject();
          }
        });
      }).finally(() => {
        dbData.value = '';
      });
    }
    function getAll() {
      return new Promise((resolve, reject) => {
        validate()
          .then(() => {
            let formData = getFieldsValue();
            formData = changeDataIfArray2String(formData);
            resolve(formData);
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
    function getFormEvent() {
      let row = getFieldsValue();
      if (!row.id) {
        row.id = 'sub-change-temp-id';
      }
      return {
        row,
        target: context,
      };
    }
    function setValues(values) {
      setFieldsValue(values);
    }
    function executeFillRule() {
      let formData = getFieldsValue();
      let fieldProperties = toRaw(defaultValueFields[tableName.value]);
      loadFormFieldsDefVal(
        fieldProperties,
        (values) => {
          setFieldsValue(values);
        },
        formData
      );
    }
    const context = {
      onlineFormRef,
      baseColProps,
      formSchemas,
      registerForm,
      setFieldsValue,
      getFieldsValue,
      getFormEvent,
      setValues,
      getAll,
      executeFillRule,
      sh: fieldDisplayStatus,
    };
    return context;
  },
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent('BasicForm');
  return (
    openBlock(),
    createBlock(
      _component_BasicForm,
      {
        ref: 'onlineFormRef',
        onRegister: _ctx.registerForm,
      },
      null,
      8,
      ['onRegister']
    )
  );
}
var OnlineSubForm = /* @__PURE__ */ _export_sfc(_sfc_main$5, [['render', _sfc_render$5]]);
var OnlineSubForm$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: OnlineSubForm,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
const urlObject = {
  optPre: '/online/cgform/api/form/',
  urlButtonAction: '/online/cgform/api/doButton',
};
const _sfc_main$4 = {
  name: 'OnlinePopForm',
  components: {
    BasicForm,
    Loading,
    OnlineSubForm,
    PrinterOutlined,
    DiffOutlined,
    FormOutlined,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    formTemplate: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isTree: {
      type: Boolean,
      default: false,
    },
    pidField: {
      type: String,
      default: '',
    },
    submitTip: {
      type: Boolean,
      default: true,
    },
    modalClass: {
      type: String,
      default: '',
    },
    request: {
      type: Boolean,
      default: true,
    },
    isVxeTableData: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['success', 'rendered', 'dataChange'],
  setup(props, { emit }) {
    console.log('onlineForm-setup\u300B\u300B');
    const { createMessage: $message } = useMessage();
    const [registerVxeFormModal, { openModal: openVxeFormModal }] = useModal();
    const vxeTableId = ref('');
    const onlineFormRef = ref(null);
    const single = ref(true);
    const loading = ref(false);
    const tableType = ref(1);
    const submitFlowFlag = ref(false);
    const isUpdate = ref(false);
    const onlineExtConfigJson = reactive({
      reportPrintShow: 0,
      reportPrintUrl: '',
      joinQuery: 0,
      modelFullscreen: 0,
      modalMinWidth: '',
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
      fieldDisplayStatus,
    } = useFormItems(props, onlineFormRef);
    let { EnhanceJS: EnhanceJS2, initCgEnhanceJs: initCgEnhanceJs2 } = useEnhance(onlineFormContext, false);
    const [registerForm, { setProps, validate, resetFields, setFieldsValue, updateSchema, getFieldsValue, scrollToField }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      baseColProps,
    });
    const onlineFormDisabled = ref(false);
    function handleFormDisabled() {
      let flag = props.disabled;
      onlineFormDisabled.value = flag;
      setProps({ disabled: flag });
    }
    function show(status, record2, param) {
      return __async(this, null, function* () {
        console.log('onlinepopform\u65B0\u589E\u7F16\u8F91\u8FDB\u5165\u8868\u5355\u300B\u300Bform', record2);
        yield resetFields();
        dbData.value = '';
        let flag = unref(status);
        isUpdate.value = flag;
        if (flag) {
          yield edit(record2);
        }
        yield nextTick(() => {
          if (!flag && param) {
            setFieldsValue(param);
          }
          handleDefaultValue2();
          handleCgButtonClick('js', 'loaded');
          handleFormDisabled();
        });
      });
    }
    function handleDefaultValue2() {
      if (unref(isUpdate) === false) {
        let fieldProperties = toRaw(defaultValueFields[tableName.value]);
        loadFormFieldsDefVal(fieldProperties, (values) => {
          setFieldsValue(values);
        });
      }
    }
    function edit(record2) {
      return __async(this, null, function* () {
        let formData = yield getFormData(record2.id);
        if (!formData || Object.keys(formData).length == 0) {
          formData = __spreadValues({}, toRaw(record2));
        }
        dbData.value = Object.assign({}, formData);
        let arr = realFormFieldNames.value;
        let values = pick(formData, ...arr);
        if (props.isVxeTableData === true) {
          values = Object.assign({}, values, record2);
        }
        yield setFieldsValue(values);
      });
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
        defHttp
          .get({ url }, { isTransformResponse: false })
          .then((res) => {
            if (res.success) {
              resolve(res.result);
            } else {
              reject();
              $message.warning(res.message);
            }
          })
          .catch(() => {
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
        EnhanceJS2 = initCgEnhanceJs2(data.enhanceJs);
        emit('rendered', onlineExtConfigJson);
        let formRefObject = yield getRefPromise(onlineFormRef);
        formRefObject.$formValueChange = (field2, value, changeFormData) => {
          onValuesChange(field2, value);
          if (changeFormData) {
            setFieldsValue(changeFormData);
          }
        };
      });
    }
    function handleExtConfigJson(jsonStr) {
      let extConfigJson2 = { reportPrintShow: 0, reportPrintUrl: '', joinQuery: 0, modelFullscreen: 1, modalMinWidth: '' };
      if (jsonStr) {
        extConfigJson2 = JSON.parse(jsonStr);
      }
      Object.keys(extConfigJson2).map((k) => {
        onlineExtConfigJson[k] = extConfigJson2[k];
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
      })
        .then((result) => {
          Object.assign(temp, changeDataIfArray2String(result));
          return validateSubTableFields();
        })
        .then((allTableData) => {
          Object.assign(temp, allTableData);
          return Promise.resolve(temp);
        })
        .catch((e) => {
          if (e === VALIDATE_FAILED || (e == null ? void 0 : e.code) === VALIDATE_FAILED) {
            $message.warning('\u6821\u9A8C\u672A\u901A\u8FC7');
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
          subActiveKey.value = i + '';
          break;
        }
      }
    }
    function validateSubTableFields() {
      return new Promise((resolve, reject) =>
        __async(this, null, function* () {
          let subData = {};
          try {
            let arr = subTabInfo.value;
            for (let i = 0; i < arr.length; i++) {
              let key = arr[i].key;
              let instance = refMap[key].value;
              if (instance instanceof Array) {
                instance = instance[0];
              }
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
        })
      );
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
      customBeforeSubmit2(context, formData)
        .then(() => {
          doApplyRequest(formData);
        })
        .catch((msg) => {
          $message.warning(msg);
        });
    }
    function triggleChangeValues(values, id, target) {
      if (id && target) {
        if (target.setValues) {
          target.setValues(values);
        } else {
          target.setValues([
            {
              rowKey: id,
              values,
            },
          ]);
        }
      } else {
        setFieldsValue(values);
      }
    }
    function triggleChangeValue(field2, value) {
      let obj = {};
      obj[field2] = value;
      setFieldsValue(obj);
    }
    const subActiveKey = ref('0');
    const subFormHeight = ref(300);
    const subTableHeight = ref(340);
    function getSubTableForeignKeyValue(key) {
      if (isUpdate.value === true) {
        let formData = dbData.value;
        return getValueIgnoreCase(formData, key);
      }
      return '';
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
      return '';
    }
    function handleSubFormChange(valueObj, tableKey) {
      if (EnhanceJS2 && EnhanceJS2[tableKey + '_onlChange']) {
        let tableChangeObj = EnhanceJS2[tableKey + '_onlChange']();
        let columnKey = Object.keys(valueObj)[0];
        if (tableChangeObj[columnKey]) {
          let subRef = refMap[tableKey].value;
          if (subRef instanceof Array) {
            subRef = subRef[0];
          }
          let formEvent = subRef.getFormEvent();
          let event = __spreadValues(
            {
              column: { key: columnKey },
              value: valueObj[columnKey],
            },
            formEvent
          );
          tableChangeObj[columnKey].call(onlineFormContext, onlineFormContext, event);
        }
      }
    }
    function handleValueChange(event, tableKey) {
      if (EnhanceJS2 && EnhanceJS2[tableKey + '_onlChange']) {
        let tableChangeObj = EnhanceJS2[tableKey + '_onlChange'](onlineFormContext);
        if (tableChangeObj[event.column.key]) {
          tableChangeObj[event.column.key].call(onlineFormContext, onlineFormContext, event);
        }
      }
    }
    function handleAdded(sub, event) {
      console.log('handleAdded', sub, event);
    }
    function getSubTableAuthPre(table) {
      return 'online_' + table + ':';
    }
    function onValuesChange(columnKey, value) {
      return __async(this, null, function* () {
        let oldFormData = dbData.value;
        if (oldFormData[columnKey] != value) {
          emit('dataChange', columnKey);
        }
        if (!EnhanceJS2 || !EnhanceJS2['onlChange']) {
          return false;
        }
        if (!columnKey) {
          return false;
        }
        let tableChangeObj = EnhanceJS2['onlChange']();
        if (tableChangeObj[columnKey]) {
          let formData = yield getFieldsValue();
          let event = {
            row: formData,
            column: { key: columnKey },
            value,
          };
          tableChangeObj[columnKey].call(onlineFormContext, onlineFormContext, event);
        }
      });
    }
    function handleCgButtonClick(optType, buttonCode) {
      if ('js' == optType) {
        if (EnhanceJS2 && EnhanceJS2[buttonCode]) {
          EnhanceJS2[buttonCode].call(onlineFormContext, onlineFormContext);
        }
      } else if ('action' == optType) {
        let formData = dbData.value;
        let params = {
          formId: props.id,
          buttonCode,
          dataId: formData.id,
          uiFormData: Object.assign({}, formData),
        };
        defHttp
          .post(
            {
              url: `${urlObject.urlButtonAction}`,
              params,
            },
            { isTransformResponse: false }
          )
          .then((res) => {
            if (res.success) {
              $message.success('\u5904\u7406\u5B8C\u6210!');
            } else {
              $message.warning('\u5904\u7406\u5931\u8D25!');
            }
          });
      }
    }
    function clearSubRows(tbname) {
      let instance = refMap[tbname].value;
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
      let instance = refMap[tbname].value;
      if (typeof rows == 'object') {
        instance.addRows(rows, true);
      } else {
        $message.error('\u6DFB\u52A0\u5B50\u8868\u6570\u636E,\u53C2\u6570\u4E0D\u8BC6\u522B!');
      }
    }
    function clearThenAddRows(tbname, rows) {
      clearSubRows(tbname);
      addSubRows(tbname, rows);
    }
    function changeOptions(field2, options) {
      if (!options && options.length <= 0) {
        options = [];
      }
      options.map((item) => {
        if (!item.hasOwnProperty('label')) {
          item['label'] = item.text;
        }
      });
      updateSchema({
        field: field2,
        componentProps: {
          options,
        },
      });
    }
    function customBeforeSubmit2(that, formData) {
      if (EnhanceJS2 && EnhanceJS2['beforeSubmit']) {
        return EnhanceJS2['beforeSubmit'](that, formData);
      } else {
        return Promise.resolve();
      }
    }
    function handleCustomFormSh(show2, hide) {
      let plain = toRaw(fieldDisplayStatus);
      if (show2 && show2.length > 0) {
        Object.keys(plain).map((k) => {
          if (!k.endsWith('_load') && show2.indexOf(k) < 0) {
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
    function handleCustomFormEdit(record2) {
      return __async(this, null, function* () {
        console.log('\u81EA\u5B9A\u4E49\u5F39\u7A97\u6253\u5F00online\u8868\u5355\u300B\u300Bform', record2);
        yield resetFields();
        dbData.value = '';
        isUpdate.value = true;
        yield edit(record2);
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
      return instance;
    }
    function onOpenReportPrint() {
      let url = onlineExtConfigJson.reportPrintUrl;
      let id = dbData.value.id;
      let token = getToken();
      goJmReportViewPage(url, id, token);
    }
    function openSubFormModalForAdd(sub) {
      console.log(sub);
      vxeTableId.value = sub.id;
      openVxeFormModal(true);
    }
    function openSubFormModalForEdit(sub) {
      console.log(sub);
    }
    function doApplyRequest(formData) {
      Object.keys(formData).map((key) => {
        if (Array.isArray(formData[key])) {
          if (formData[key].length == 0) {
            formData[key] = '';
          }
        }
      });
      console.log('\u63D0\u4EA4pop\u8868\u5355\u6570\u636E\u300B\u300B\u300Bform:', formData);
      if (props.request == false) {
        emit('success', formData);
      } else {
        let url = `${urlObject.optPre}${props.id}?tabletype=${tableType.value}`;
        console.log('\u63D0\u4EA4pop\u8868\u5355url\u300B\u300B\u300Burl:', url);
        if (submitFlowFlag.value === true) {
          formData[SUBMIT_FLOW_KEY] = 1;
        }
        let method = isUpdate.value === true ? 'put' : 'post';
        defHttp
          .request({ url, method, params: formData }, { isTransformResponse: false })
          .then((res) => {
            if (res.success) {
              if (res.result) {
                if (!formData.id) {
                  formData['id'] = res.result;
                }
              }
              emit('success', formData);
              dbData.value = formData;
              isUpdate.value = true;
              $message.success('\u64CD\u4F5C\u6210\u529F!');
            } else {
              $message.warning(res.message);
            }
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
    function recoverFormData() {
      return __async(this, null, function* () {
        let record2 = dbData.value;
        let arr = realFormFieldNames.value;
        let values = pick(record2, ...arr);
        if (record2) {
          yield setFieldsValue(values);
        } else {
          let temp = {};
          for (let key of arr) {
            temp[key] = '';
          }
          yield setFieldsValue(temp);
        }
      });
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
      handleValueChange,
      openSubFormModalForAdd,
      openSubFormModalForEdit,
      registerVxeFormModal,
      vxeTableId,
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
      recoverFormData,
    };
  },
};
const _hoisted_1$3 = ['id'];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent('BasicForm');
  return (
    openBlock(),
    createElementBlock(
      'div',
      {
        id: $setup.tableName + '_form',
      },
      [
        createVNode(
          _component_BasicForm,
          {
            ref: 'onlineFormRef',
            onRegister: $setup.registerForm,
          },
          null,
          8,
          ['onRegister']
        ),
      ],
      8,
      _hoisted_1$3
    )
  );
}
var OnlinePopForm = /* @__PURE__ */ _export_sfc(_sfc_main$4, [['render', _sfc_render$4]]);
var OnlinePopForm$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: OnlinePopForm,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
function useAutoModal(isBpm, { emit } = {}, callback) {
  const onlineFormCompRef = ref(null);
  const disableSubmit = ref(false);
  const formTemplate = ref(1);
  const cgButtonList = ref([]);
  const formRendered = ref(false);
  const modalMinWidth = ref(0);
  const isTreeForm = ref(false);
  const pidFieldName = ref('');
  const submitLoading = ref(false);
  const isUpdate = ref(false);
  const single = ref(true);
  const extConfigJson2 = reactive({});
  const showSub = ref(true);
  const customTitle = ref('');
  const successThenClose = ref(true);
  const topTipVisible = ref(false);
  const { popModalFixedWidth, resetBodyStyle, popBodyStyle } = useFixedHeightModal();
  const FORM_DISABLE_UPDATE = ref(false);
  const modalObject = {
    handleOpenModal: (_data) => {},
  };
  const tableName = ref('');
  const formDataId = ref('');
  let onlineExtConfig = {};
  const title = computed(() => {
    let temp = customTitle.value;
    if (temp) {
      return temp;
    }
    if (unref(disableSubmit) === true) {
      return '\u8BE6\u60C5';
    }
    if (unref(isUpdate) === true) {
      return '\u7F16\u8F91';
    }
    return '\u65B0\u589E';
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) =>
    __async(this, null, function* () {
      customTitle.value = '';
      topTipVisible.value = false;
      if (isBpm === true) {
        yield modalObject.handleOpenModal(data);
      } else {
        yield handleOpenOnlineModal(data);
      }
      resetBodyStyle();
      if (callback) {
        callback();
      }
    })
  );
  const loadItemSuccess = ref(false);
  function getFormStatus() {
    return __async(this, null, function* () {
      yield getRefPromise(loadItemSuccess);
      return FORM_DISABLE_UPDATE.value;
    });
  }
  function handleOpenOnlineModal(data) {
    return __async(this, null, function* () {
      setModalProps({ confirmLoading: false });
      isUpdate.value = data.isUpdate;
      disableSubmit.value = data.disableSubmit || false;
      if ((data == null ? void 0 : data.hideSub) === true) {
        showSub.value = false;
      }
      if (data == null ? void 0 : data.title) {
        customTitle.value = data.title;
      }
      if (data == null ? void 0 : data.record) {
        formDataId.value = data.record.id;
      } else {
        formDataId.value = '';
      }
      yield nextTick(() =>
        __async(this, null, function* () {
          yield getRefPromise(formRendered);
          const { onlineFormContext, resetContext } = useOnlineFormContext();
          let { EnhanceJS: EnhanceJS2, initCgEnhanceJs: initCgEnhanceJs2 } = useEnhance(onlineFormContext, false);

          yield onlineFormCompRef.value.show(
            data == null ? void 0 : data.isUpdate,
            data == null ? void 0 : data.record,
            data == null ? void 0 : data.param
          );
        })
      );
    });
  }
  function renderSuccess(extConfig) {
    formRendered.value = true;
    modalMinWidth.value = extConfig.modalMinWidth;
    if (extConfig.modelFullscreen == 1) {
      setModalProps({ defaultFullscreen: true });
    } else {
      setModalProps({ defaultFullscreen: false });
    }
    onlineExtConfig = extConfig;
  }

  const singleWidth = 1000;
  const one2ManyWidth = 1100;
  const modalWidth = computed(() => {
    let diff = 100 * (formTemplate.value - 1);
    let width = (!unref(single) ? one2ManyWidth : singleWidth) + diff;
    width = calcModalMixWidth(width);
    let minWidth = modalMinWidth.value;
    console.log({ minWidth });
    if (minWidth && width < minWidth) {
      width = minWidth;
    }
    console.log({ width });
    return width;
  });
  function calcModalMixWidth(width) {
    let minWidth = extConfigJson2.modalMinWidth;
    if (minWidth != null && minWidth !== '') {
      try {
        minWidth = Number.parseInt(minWidth);
        if (width < minWidth) {
          return minWidth;
        }
      } catch (e) {
        console.warn('error modalMinWidth value: ', minWidth);
      }
    }
    return width;
  }
  function handleCgButtonClick(optType, buttonCode) {
    onlineFormCompRef.value.handleCgButtonClick(optType, buttonCode);
  }
  function handleSubmit() {
    submitLoading.value = true;
    setTimeout(() => {
      submitLoading.value = false;
    }, 1500);
    onlineFormCompRef.value.handleSubmit();
  }
  function handleCancel() {
    closeModal();
  }
  function loadFormItems(id, params = {}) {
    let url = `/api/online/cgform/api/getFormItem/${id}`;
    return new Promise((resolve, reject) => {
      defHttp
        .get({ url, params }, { isTransformResponse: false })
        .then((res) => {
          console.log('\u8868\u5355\u7ED3\u679C\u300B\u300Bmodal:', res);
          if (res.success) {
            resolve(res.result);
          } else {
            reject(res.message);
          }
        })
        .catch(() => {
          reject();
        });
    });
  }
  function handleFormConfig(id, params) {
    return __async(this, null, function* () {
      let result = yield loadFormItems(id, params);
      let dataFormTemplate = result.head.formTemplate;
      formTemplate.value = dataFormTemplate ? Number(dataFormTemplate) : 1;
      cgButtonList.value = result.cgButtonList;
      isTreeForm.value = result.head.isTree === 'Y';
      pidFieldName.value = result.head.treeParentIdField || '';
      tableName.value = result.head.tableName;
      if (result['form_disable_update'] === true) {
        FORM_DISABLE_UPDATE.value = true;
      } else {
        FORM_DISABLE_UPDATE.value = false;
      }
      loadItemSuccess.value = true;
      emit && emit('formConfig', result);
      yield nextTick(() =>
        __async(this, null, function* () {
          let myForm = yield getRefPromise(onlineFormCompRef);
          yield myForm.createRootProperties(result);
        })
      );
    });
  }
  function handleSuccess(formData) {
    formData[ONL_FORM_TABLE_NAME] = tableName.value;
    emit('success', formData);
    if (successThenClose.value == true) {
      closeModal();
    }
    topTipVisible.value = false;
    successThenClose.value = true;
  }
  function onCloseEvent() {
    if (onlineFormCompRef.value) {
      onlineFormCompRef.value.onCloseModal();
    }
  }
  return {
    title,
    modalWidth,
    registerModal,
    closeModal,
    modalObject,
    onCloseEvent,
    cgButtonList,
    handleCgButtonClick,
    disableSubmit,
    handleSubmit,
    submitLoading,
    handleCancel,
    successThenClose,
    handleSuccess,
    topTipVisible,
    handleFormConfig,
    onlineFormCompRef,
    formTemplate,
    isTreeForm,
    pidFieldName,
    renderSuccess,
    formRendered,
    isUpdate,
    showSub,
    tableName,
    formDataId,
    popBodyStyle,
    popModalFixedWidth,
    getFormStatus,
  };
}
function useFixedHeightModal() {
  const minWidth = 800;
  const popModalFixedWidth = ref(800);
  let tempWidth = window.innerWidth - 300;
  if (tempWidth < minWidth) {
    tempWidth = minWidth;
  }
  popModalFixedWidth.value = tempWidth;
  const popBodyStyle = ref({});
  function resetBodyStyle() {
    let height = window.innerHeight - 210;
    popBodyStyle.value = {
      height: height + 'px',
      overflowY: 'auto',
    };
  }
  return {
    popModalFixedWidth,
    popBodyStyle,
    resetBodyStyle,
  };
}
const _sfc_main$3 = defineComponent({
  name: 'OnlinePopModal',
  components: {
    BasicModal,
    OnlinePopForm,
    JModalTip,
    Button,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    showFields: {
      type: Array,
      default: () => [],
    },
    hideFields: {
      type: Array,
      default: () => [],
    },
    topTip: {
      type: Boolean,
      default: false,
    },
    request: {
      type: Boolean,
      default: true,
    },
    saveClose: {
      type: Boolean,
      default: false,
    },
    isVxeTableData: {
      type: Boolean,
      default: false,
    },
    formTableType: {
      type: String,
      default: '',
    },
  },
  emits: ['success', 'register', 'formConfig'],
  setup(props, { emit }) {
    console.log('\u8FDB\u5165\u8868\u5355\u5F39\u6846\u300B\u300B\u300B\u300Bmodal');
    const {
      title,
      registerModal,
      cgButtonList,
      handleCgButtonClick,
      disableSubmit,
      handleSubmit,
      submitLoading,
      handleCancel,
      handleFormConfig,
      onlineFormCompRef,
      formTemplate,
      isTreeForm,
      pidFieldName,
      renderSuccess,
      formRendered,
      handleSuccess,
      topTipVisible,
      successThenClose,
      isUpdate,
      popBodyStyle,
      popModalFixedWidth,
      getFormStatus,
    } = useAutoModal(false, { emit });
    watch(() => props.id, renderFormItems, { immediate: true });
    function renderFormItems() {
      return __async(this, null, function* () {
        formRendered.value = false;
        if (!props.id) {
          return;
        }
        console.log('\u91CD\u65B0\u6E32\u67D3\u8868\u5355\u300B\u300B\u300B\u300Bmodal');
        let params = {};
        if (props.formTableType) {
          params['tabletype'] = props.formTableType;
        }
        yield handleFormConfig(props.id, params);
        console.log('handleFormConfig');
      });
    }
    function handleSaveData() {
      if (props.saveClose === false) {
        successThenClose.value = false;
      }
      handleSubmit();
    }
    function handleRecover() {
      topTipVisible.value = false;
      onlineFormCompRef.value.recoverFormData();
    }
    function handleDataChange() {
      topTipVisible.value = true;
    }
    const showTopTip = computed(() => {
      if (!isUpdate.value) {
        return false;
      }
      return props.topTip;
    });
    const modalFooter = computed(() => {
      if (isUpdate.value == true) {
        return null;
      } else {
        let flag = submitLoading.value;
        const defaultFooter = [
          h(Button, { type: 'primary', loading: flag, onClick: handleSubmit }, () => '\u786E\u5B9A'),
          h(Button, { onClick: handleCancel }, () => '\u5173\u95ED'),
        ];
        return defaultFooter;
      }
    });
    const that = {
      title,
      topTipVisible,
      handleSaveData,
      handleRecover,
      onlineFormCompRef,
      renderSuccess,
      registerModal,
      handleSubmit,
      handleSuccess,
      handleCancel,
      formTemplate,
      disableSubmit,
      cgButtonList,
      handleCgButtonClick,
      isTreeForm,
      pidFieldName,
      submitLoading,
      handleDataChange,
      isUpdate,
      showTopTip,
      modalFooter,
      popBodyStyle,
      popModalFixedWidth,
      getFormStatus,
    };
    return that;
  },
});
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_j_modal_tip = resolveComponent('j-modal-tip');
  const _component_online_pop_form = resolveComponent('online-pop-form');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      mergeProps(
        {
          width: _ctx.popModalFixedWidth,
          dialogStyle: { top: '70px' },
          bodyStyle: _ctx.popBodyStyle,
        },
        _ctx.$attrs,
        {
          footer: _ctx.modalFooter,
          cancelText: '\u5173\u95ED',
          onRegister: _ctx.registerModal,
          wrapClassName: 'jeecg-online-pop-modal',
          onOk: _ctx.handleSubmit,
        }
      ),
      {
        title: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.title) + ' ', 1),
          _ctx.showTopTip
            ? (openBlock(),
              createBlock(
                _component_j_modal_tip,
                {
                  key: 0,
                  visible: _ctx.topTipVisible,
                  onSave: _ctx.handleSaveData,
                  onCancel: _ctx.handleRecover,
                },
                null,
                8,
                ['visible', 'onSave', 'onCancel']
              ))
            : createCommentVNode('', true),
        ]),
        default: withCtx(() => [
          createVNode(
            _component_online_pop_form,
            {
              ref: 'onlineFormCompRef',
              id: _ctx.id,
              disabled: _ctx.disableSubmit,
              'form-template': _ctx.formTemplate,
              isTree: _ctx.isTreeForm,
              pidField: _ctx.pidFieldName,
              request: _ctx.request,
              isVxeTableData: _ctx.isVxeTableData,
              onRendered: _ctx.renderSuccess,
              onSuccess: _ctx.handleSuccess,
              onDataChange: _ctx.handleDataChange,
              'modal-class': 'jeecg-online-pop-modal',
            },
            null,
            8,
            ['id', 'disabled', 'form-template', 'isTree', 'pidField', 'request', 'isVxeTableData', 'onRendered', 'onSuccess', 'onDataChange']
          ),
        ]),
        _: 1,
      },
      16,
      ['width', 'bodyStyle', 'footer', 'onRegister', 'onOk']
    )
  );
}
var OnlinePopModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [['render', _sfc_render$3]]);
var OnlinePopModal$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: OnlinePopModal,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
function queryTableData(tableName, params) {
  const url = '/online/cgform/api/getData/' + tableName;
  return defHttp.get({ url, params });
}
function queryTableColumns(tableName, params) {
  const url = '/online/cgform/api/getColumns/' + tableName;
  return defHttp.get({ url, params });
}
function useLinkTable(props) {
  const pageNo = ref('1');
  const baseParam = ref({});
  const searchParam = ref({});
  const mainContentField = ref('');
  const auths = reactive({
    add: true,
    update: true,
  });
  const textFieldArray = computed(() => {
    if (props.textField) {
      return props.textField.split(',');
    }
    return [];
  });
  const otherColumns = ref([]);
  const realShowColumns = computed(() => {
    let columns2 = otherColumns.value;
    if (props.multi == true) {
      return columns2.slice(0, 3);
    } else {
      return columns2.slice(0, 6);
    }
  });
  watchEffect(() =>
    __async(this, null, function* () {
      let table = props.tableName;
      if (table) {
        let valueField = props.valueField || '';
        let textField = props.textField || '';
        let arr = [];
        if (valueField) {
          arr.push(valueField);
        }
        if (textField) {
          let temp = textField.split(',');
          mainContentField.value = temp[0];
          for (let field2 of temp) {
            arr.push(field2);
          }
        }
        let imageField = props.imageField || '';
        if (imageField) {
          arr.push(imageField);
        }
        baseParam.value = {
          linkTableSelectFields: arr.join(','),
        };
        yield resetTableColumns();
        yield reloadTableLinkOptions();
      }
    })
  );
  const otherFields = computed(() => {
    let textField = props.textField || '';
    let others = [];
    let labelField = '';
    if (textField) {
      let temp = textField.split(',');
      labelField = temp[0];
      for (let i = 0; i < temp.length; i++) {
        if (i > 0) {
          others.push(temp[i]);
        }
      }
    }
    return {
      others,
      labelField,
    };
  });
  const selectOptions = ref([]);
  const tableColumns = ref([]);
  const dictOptions = ref({});
  function resetTableColumns() {
    return __async(this, null, function* () {
      let params = baseParam.value;
      const data = yield queryTableColumns(props.tableName, params);
      tableColumns.value = data.columns;
      if (data.columns) {
        let imageField = props.imageField;
        let arr = data.columns.filter((c) => c.dataIndex != mainContentField.value && c.dataIndex != imageField);
        otherColumns.value = arr;
      }
      dictOptions.value = data.dictOptions;
      console.log('\u9690\u85CF\u7684\u6309\u94AE', data.hideColumns);
      if (data.hideColumns) {
        let hideCols = data.hideColumns;
        if (hideCols.indexOf('add') >= 0) {
          auths.add = false;
        } else {
          auths.add = true;
        }
        if (hideCols.indexOf('update') >= 0) {
          auths.update = false;
        } else {
          auths.update = true;
        }
      }
    });
  }
  function reloadTableLinkOptions() {
    return __async(this, null, function* () {
      let params = getLoadDataParams();
      const data = yield queryTableData(props.tableName, params);
      let records = data.records;
      let dataList = [];
      let { others, labelField } = otherFields.value;
      let imageField = props.imageField;
      if (records && records.length > 0) {
        for (let rd of records) {
          let temp = __spreadValues({}, rd);
          transData(temp);
          let result = Object.assign({}, pick(temp, others), { id: temp.id, label: temp[labelField], value: temp[props.valueField] });
          if (imageField) {
            result[imageField] = temp[imageField];
          }
          dataList.push(result);
        }
      }
      dataList.push({});
      selectOptions.value = dataList;
    });
  }
  function transData(data) {
    let columns2 = tableColumns.value;
    let dictInfo = dictOptions.value;
    for (let c of columns2) {
      const { dataIndex, customRender } = c;
      if (data[dataIndex] || data[dataIndex] === 0) {
        if (customRender && customRender == dataIndex) {
          if (dictInfo[customRender]) {
            data[dataIndex] = filterMultiDictText(dictInfo[customRender], data[dataIndex]);
          }
        }
      }
    }
  }
  function getLoadDataParams() {
    let params = Object.assign({ pageSize: 10, pageNo: pageNo.value }, baseParam.value, searchParam.value);
    return params;
  }
  function addQueryParams(text2) {
    if (!text2) {
      searchParam.value = {};
    } else {
      let arr = textFieldArray.value;
      let params = [];
      let fields = [];
      for (let i = 0; i < arr.length; i++) {
        if (i <= 1) {
          fields.push(arr[i]);
          params.push({ field: arr[i], rule: 'like', val: text2 });
        }
      }
      params['superQueryMatchType'] = 'or';
      params['superQueryParams'] = encodeURI(JSON.stringify(params));
      searchParam.value = params;
    }
  }
  function loadOne(value) {
    return __async(this, null, function* () {
      if (!value) {
        return [];
      }
      let valueFieldName = props.valueField;
      let params = __spreadProps(__spreadValues({}, baseParam.value), {
        pageSize: 10,
        pageNo: pageNo.value,
      });
      params['superQueryMatchType'] = 'and';
      let valueCondition = [{ field: valueFieldName, rule: 'in', val: value }];
      params['superQueryParams'] = encodeURI(JSON.stringify(valueCondition));
      const data = yield queryTableData(props.tableName, params);
      let records = data.records;
      let dataList = [];
      if (records && records.length > 0) {
        for (let item of records) {
          let temp = __spreadValues({}, item);
          transData(temp);
          dataList.push(temp);
        }
      }
      return dataList;
    });
  }
  function compareData(arr, value) {
    if (!arr || arr.length == 0) {
      return false;
    }
    let valueArray = value.split(',');
    if (valueArray.length != arr.length) {
      return false;
    }
    let flag = true;
    for (let item of arr) {
      let temp = item[props.valueField];
      if (valueArray.indexOf(temp) < 0) {
        flag = false;
      }
    }
    return flag;
  }
  function formatData(formData) {
    Object.keys(formData).map((k) => {
      if (formData[k] instanceof Array) {
        formData[k] = formData[k].join(',');
      }
    });
  }
  function initFormData(formData, linkFieldArray, record2) {
    if (!record2) {
      record2 = {};
    }
    if (linkFieldArray && linkFieldArray.length > 0) {
      for (let str2 of linkFieldArray) {
        let arr = str2.split(',');
        let field2 = arr[0];
        let dictField = arr[1];
        if (!formData[field2]) {
          let value = record2[dictField] || '';
          formData[field2] = [value];
        } else {
          formData[field2].push(record2[dictField]);
        }
      }
    }
  }
  function getImageSrc(item) {
    if (props.imageField) {
      let url = item[props.imageField];
      return getFileAccessHttpUrl(url);
    }
    return '';
  }
  const showImage = computed(() => {
    if (props.imageField) {
      return true;
    } else {
      return false;
    }
  });
  return {
    pageNo,
    otherColumns,
    realShowColumns,
    selectOptions,
    reloadTableLinkOptions,
    textFieldArray,
    addQueryParams,
    tableColumns,
    transData,
    mainContentField,
    loadOne,
    compareData,
    formatData,
    initFormData,
    getImageSrc,
    showImage,
    auths,
  };
}
var LinkTableSelect_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main$2 = {
  name: 'LinkTableSelect',
  components: {
    PlusOutlined,
    EditOutlined,
    OnlinePopModal,
  },
  props: {
    valueField: propTypes.string.def(''),
    textField: propTypes.string.def(''),
    tableName: propTypes.string.def(''),
    multi: propTypes.bool.def(false),
    value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.array]),
    linkFields: propTypes.array.def([]),
    imageField: propTypes.string.def([]),
  },
  emits: ['change', 'update:value'],
  setup(props, { emit }) {
    const selectValue = ref([]);
    const {
      auths,
      mainContentField,
      textFieldArray,
      selectOptions,
      reloadTableLinkOptions,
      addQueryParams,
      formatData,
      initFormData,
      getImageSrc,
      showImage,
    } = useLinkTable(props);
    const [registerPopModal2, { openModal: openPopModal2 }] = useModal();
    const popTableName = computed(() => {
      return props.tableName;
    });
    const bindValue = computed(() => {
      if (props.multi === true) {
        return {
          mode: 'multiple',
        };
      } else {
        return {};
      }
    });
    function handleClickAdd(e) {
      e == null ? void 0 : e.stopPropagation();
      e == null ? void 0 : e.preventDefault();
      openPopModal2(true, {});
    }
    function handleClickEdit(e, record2) {
      e == null ? void 0 : e.stopPropagation();
      e == null ? void 0 : e.preventDefault();
      if (auths.update == false) {
        console.error('\u5F53\u524D\u7528\u6237\u65E0\u7F16\u8F91\u6743\u9650!');
        return;
      }
      openPopModal2(true, {
        isUpdate: true,
        record: record2,
      });
    }
    function getFormData(data) {
      return __async(this, null, function* () {
        yield reloadTableLinkOptions();
        let temp = data[props.valueField];
        selectValue.value = temp;
      });
    }
    function handleSearch(text2) {
      addQueryParams(text2);
      reloadTableLinkOptions();
    }
    function handleChange(text2) {
      emitValue(text2);
      if (!text2) {
        addQueryParams();
        reloadTableLinkOptions();
      }
    }
    function emitValue(text2) {
      let formData = {};
      let linkFieldArray = props.linkFields;
      let textArray = [];
      if (!text2) {
        initFormData(formData, linkFieldArray);
      } else {
        let options = toRaw(selectOptions.value);
        console.log('options>>', options);
        let tempText = toRaw(text2);
        if (tempText instanceof Array) {
          textArray = [...tempText];
        } else {
          if (props.multi == true) {
            textArray = tempText.split(',');
          } else {
            textArray = [tempText];
          }
        }
        let arr = options.filter((i) => textArray.indexOf(i[props.valueField]) >= 0);
        if (arr && arr.length > 0) {
          let record2 = __spreadValues({}, arr[0]);
          if (arr.length > 1) {
            for (let i = 1; i < arr.length; i++) {
              record2 = hebing(record2, arr[i]);
            }
          }
          let titleField = mainContentField.value;
          record2[titleField] = record2.label;
          initFormData(formData, linkFieldArray, record2);
        }
      }
      formatData(formData);
      emit('change', textArray.join(',') || '', formData);
      emit('update:value', textArray.join(',') || '');
    }
    function hebing(oldObj, newObj) {
      let record2 = {};
      Object.keys(oldObj).map((k) => {
        record2[k] = (oldObj[k] || '') + ',' + (newObj[k] || '');
      });
      return record2;
    }
    watch(
      () => props.value,
      (val) =>
        __async(this, null, function* () {
          if (val) {
            if (props.multi == true) {
              selectValue.value = val.split(',');
            } else {
              selectValue.value = val;
            }
            if (props.linkFields && props.linkFields.length > 0) {
              emitValue(val);
            }
          } else {
            selectValue.value = [];
          }
        }),
      { immediate: true }
    );
    watch(
      () => selectOptions.value,
      (val) => {
        if (val && val.length > 0) {
          if (props.linkFields && props.linkFields.length > 0) {
            if (selectValue.value && selectValue.value.length > 0) {
              emitValue(selectValue.value);
            }
          }
        }
      }
    );
    return {
      selectValue,
      selectOptions,
      registerPopModal: registerPopModal2,
      popTableName,
      textFieldArray,
      handleClickAdd,
      handleClickEdit,
      getFormData,
      handleSearch: useDebounceFn(handleSearch, 800),
      handleChange,
      bindValue,
      showImage,
      getImageSrc,
      auths,
    };
  },
};
const _hoisted_1$2 = {
  key: 1,
  class: 'online-select-item',
};
const _hoisted_2$2 = {
  key: 0,
  class: 'left-avatar',
};
const _hoisted_3$2 = ['src'];
const _hoisted_4$2 = { class: 'right-content' };
const _hoisted_5$2 = { class: 'label' };
const _hoisted_6$2 = { class: 'others' };
const _hoisted_7$1 = { class: 'other-item ellipsis' };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PlusOutlined = resolveComponent('PlusOutlined');
  const _component_EditOutlined = resolveComponent('EditOutlined');
  const _component_a_select = resolveComponent('a-select');
  const _component_online_pop_modal = resolveComponent('online-pop-modal');
  return (
    openBlock(),
    createElementBlock('div', null, [
      createVNode(
        _component_a_select,
        mergeProps(
          {
            value: $setup.selectValue,
            'onUpdate:value': _cache[1] || (_cache[1] = ($event) => ($setup.selectValue = $event)),
            style: { width: '100%' },
            placeholder: '\u8BF7\u9009\u62E9',
            'option-label-prop': 'label',
            dropdownClassName: 'table-link-select',
            allowClear: '',
            'show-search': '',
          },
          $setup.bindValue,
          {
            options: $setup.selectOptions,
            'filter-option': false,
            'not-found-content': null,
            onSearch: $setup.handleSearch,
            onChange: $setup.handleChange,
          }
        ),
        {
          option: withCtx((item) => [
            !item.value && $setup.auths.add
              ? (openBlock(),
                createElementBlock(
                  'div',
                  {
                    key: 0,
                    class: 'opt-add',
                    onClick: _cache[0] || (_cache[0] = (...args) => $setup.handleClickAdd && $setup.handleClickAdd(...args)),
                  },
                  [createVNode(_component_PlusOutlined), createTextVNode(' \u8BB0\u5F55 ')]
                ))
              : (openBlock(),
                createElementBlock('div', _hoisted_1$2, [
                  $setup.showImage
                    ? (openBlock(),
                      createElementBlock('div', _hoisted_2$2, [
                        $setup.getImageSrc(item)
                          ? (openBlock(),
                            createElementBlock(
                              'img',
                              {
                                key: 0,
                                src: $setup.getImageSrc(item),
                                alt: '',
                              },
                              null,
                              8,
                              _hoisted_3$2
                            ))
                          : createCommentVNode('', true),
                      ]))
                    : createCommentVNode('', true),
                  createElementVNode('div', _hoisted_4$2, [
                    createElementVNode('div', _hoisted_5$2, [
                      $setup.auths.update
                        ? (openBlock(),
                          createBlock(
                            _component_EditOutlined,
                            {
                              key: 0,
                              onClick: (e) => $setup.handleClickEdit(e, item),
                            },
                            null,
                            8,
                            ['onClick']
                          ))
                        : createCommentVNode('', true),
                      createTextVNode(' ' + toDisplayString(item.label), 1),
                    ]),
                    createElementVNode('div', _hoisted_6$2, [
                      (openBlock(true),
                      createElementBlock(
                        Fragment,
                        null,
                        renderList($setup.textFieldArray, (pro) => {
                          return openBlock(), createElementBlock('div', _hoisted_7$1, toDisplayString(item[pro]), 1);
                        }),
                        256
                      )),
                    ]),
                  ]),
                ])),
          ]),
          _: 1,
        },
        16,
        ['value', 'options', 'onSearch', 'onChange']
      ),
      createVNode(
        _component_online_pop_modal,
        {
          id: $setup.popTableName,
          onRegister: $setup.registerPopModal,
          onSuccess: $setup.getFormData,
          topTip: '',
        },
        null,
        8,
        ['id', 'onRegister', 'onSuccess']
      ),
    ])
  );
}
var LinkTableSelect = /* @__PURE__ */ _export_sfc(_sfc_main$2, [
  ['render', _sfc_render$2],
  ['__scopeId', 'data-v-2f5e23a7'],
]);
var LinkTableSelect$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: LinkTableSelect,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
function useTableColumns(onlineTableContext, extConfigJson) {
  let router = useRouter();
  const columns = ref([]);
  const dictOptionInfo = ref({});
  const selectedKeys = ref([]);
  const rowSelection = ref(null);
  let enableScrollBar = ref(true);
  let tableScroll = computed(() => {
    if (enableScrollBar.value == true) {
      return void 0;
    } else {
      return { x: false };
    }
  });
  const [registerOnlineHrefModal, { openModal: openOnlineHrefModal }] = useModal();
  const hrefMainTableId = ref('');
  const [registerPopModal, { openModal: openPopModal }] = useModal();
  const popTableId = ref('');
  function handleColumnResult(result) {
    dictOptionInfo.value = result.dictOptions;
    if (result.checkboxFlag == 'Y') {
      rowSelection.value = {
        selectedRowKeys: selectedKeys,
        onChange: onSelectChange,
      };
    } else {
      rowSelection.value = null;
    }
    enableScrollBar.value = result.scrollFlag == 1;
    let dataColumns = result.columns;
    dataColumns.forEach((column) => {
      Object.keys(column).map((key) => {
        if (column[key] == null) {
          delete column[key];
        }
      });
    });
    let fieldHrefSlots = result.fieldHrefSlots;
    const fieldHrefSlotKeysMap = {};
    fieldHrefSlots.forEach((item) => (fieldHrefSlotKeysMap[item.slotName] = item));
    let tableColumns = [];
    tableColumns = handleColumnHrefAndDict(dataColumns, fieldHrefSlotKeysMap);
    bpmStatusFilter(tableColumns);
    console.log('-----\u5217\u8868\u5217\u914D\u7F6E----', tableColumns);
    if (onlineTableContext.isTree() === true) {
      let firstField = result.textField;
      let index = -1;
      for (let i = 0; i < tableColumns.length; i++) {
        if (tableColumns[i].dataIndex == firstField) {
          index = i;
          break;
        }
      }
      if (index > 0) {
        let deleteColumns = tableColumns.splice(index, 1);
        tableColumns.unshift(deleteColumns[0]);
      }
      if (tableColumns.length > 0) {
        tableColumns[0].align = 'left';
      }
    }
    columns.value = tableColumns;
    onlineTableContext.reloadTable();
  }
  function onSelectChange(selectedRowKeys, selectedRows) {
    selectedKeys.value = selectedRowKeys;
    onlineTableContext['selectedRows'] = toRaw(selectedRows);
    onlineTableContext['selectedRowKeys'] = toRaw(selectedRowKeys);
  }
  function handleColumnHrefAndDict(columns2, fieldHrefSlotKeysMap) {
    for (let column of columns2) {
      let { customRender, hrefSlotName, fieldType } = column;
      if (fieldType == 'date' || fieldType == 'Date') {
        column.customRender = ({ text: text2 }) => {
          if (!text2) {
            return '';
          }
          if (text2.length > 10) {
            return text2.substring(0, 10);
          }
          return text2;
        };
      } else if (fieldType == 'link_table') {
        column.customRender = ({ text: text2, record: record2 }) => {
          if (!text2) {
            return '';
          }
          if (onlineTableContext.isPopList === true) {
            return record2[column.dataIndex + '_dictText'];
          } else {
            let tempIdArray = (text2 + '').split(',');
            let tempLabelArray = [];
            if (record2[column.dataIndex + '_dictText']) {
              tempLabelArray = record2[column.dataIndex + '_dictText'].split(',');
            }
            let renderResult = [];
            for (let i = 0; i < tempIdArray.length; i++) {
              let renderObj = h(LinkTableListPiece, {
                id: tempIdArray[i],
                text: tempLabelArray[i],
                onTab: (id) => handleClickLinkTable(id, hrefSlotName),
              });
              renderResult.push(renderObj);
            }
            if (renderResult.length == 0) {
              return '';
            }
            return h('div', { style: { overflow: 'hidden' } }, renderResult);
          }
        };
      } else {
        if (!hrefSlotName && column.scopedSlots && column.scopedSlots.customRender) {
          if (fieldHrefSlotKeysMap.hasOwnProperty(column.scopedSlots.customRender)) {
            hrefSlotName = column.scopedSlots.customRender;
          }
        }
        if (customRender || hrefSlotName) {
          let dictCode = customRender;
          let replaceFlag = '_replace_text_';
          column.ellipsis = true;
          column.customRender = ({ text: text2, record: record2 }) => {
            let value = text2;
            if (dictCode) {
              if (dictCode.startsWith(replaceFlag)) {
                let textFieldName = dictCode.replace(replaceFlag, '');
                value = record2[textFieldName];
              } else {
                value = filterMultiDictText(unref(dictOptionInfo)[dictCode], text2 + '');
              }
            }
            if (column.showLength) {
              if (value && value.length > column.showLength) {
                value = value.substr(0, column.showLength) + '...';
              }
            }
            if (hrefSlotName) {
              let field2 = fieldHrefSlotKeysMap[hrefSlotName];
              if (field2) {
                return h(
                  'a',
                  {
                    onClick: () => handleClickFieldHref(field2, record2),
                  },
                  value
                );
              }
            }
            return value;
          };
        }
        if (column.scopedSlots) {
          column.ellipsis = true;
          let slots = column.scopedSlots;
          column['slots'] = slots;
          delete column.scopedSlots;
        }
      }
    }
    return columns2;
  }
  function handleClickFieldHref(field, record) {
    let href = field.href;
    let urlPattern = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/;
    let compPattern = /\.vue(\?.*)?$/;
    let jsPattern = /{{([^}]+)}}/g;
    if (typeof href === 'string') {
      if (href.startsWith('ONLINE:')) {
        let arr = href.split(':');
        hrefMainTableId.value = arr[1];
        let fieldName = arr[2];
        openOnlineHrefModal(true, {
          isUpdate: true,
          disableSubmit: true,
          hideSub: true,
          record: { id: record[fieldName] },
        });
      } else {
        href = href.trim().replace(/\${([^}]+)?}/g, (_s1, s2) => record[s2]);
        if (jsPattern.test(href)) {
          href = href.replace(jsPattern, function (text, s0) {
            try {
              return eval(s0);
            } catch (e) {
              console.error(e);
              return text;
            }
          });
        }
        if (urlPattern.test(href)) {
          window.open(href, '_blank');
        } else if (compPattern.test(href)) {
          openHrefCompModal(href);
        } else {
          router.push(href);
        }
      }
    }
  }
  const dialogStyle = {
    top: 0,
    left: 0,
    height: '100%',
    margin: 0,
    padding: 0,
  };
  const hrefComponent = reactive({
    model: {
      title: '',
      okText: '\u5173\u95ED',
      width: '100%',
      visible: false,
      destroyOnClose: true,
      style: dialogStyle,
      bodyStyle: { padding: '8px', height: 'calc(100vh - 108px)', overflow: 'auto', overflowX: 'hidden' },
      cancelButtonProps: { style: { display: 'none' } },
    },
    on: {
      ok: () => (hrefComponent.model.visible = false),
      cancel: () => (hrefComponent.model.visible = false),
    },
    is: null,
    params: {},
  });
  function openHrefCompModal(href2) {
    let index = href2.indexOf('?');
    let path = href2;
    if (index !== -1) {
      path = href2.substring(0, index);
      let paramString = href2.substring(index + 1, href2.length);
      let paramArray = paramString.split('&');
      let params = {};
      paramArray.forEach((paramObject) => {
        let paramItem = paramObject.split('=');
        params[paramItem[0]] = paramItem[1];
      });
      hrefComponent.params = params;
    } else {
      hrefComponent.params = {};
    }
    hrefComponent.model.visible = true;
    hrefComponent.model.title = '\u64CD\u4F5C';
    hrefComponent.is = markRaw(defineAsyncComponent(() => importViewsFile(path)));
  }
  let fixedAction = 'left';
  if (onlineTableContext.isTree()) {
    fixedAction = 'right';
  }
  const actionColumn = reactive({
    title: '\u64CD\u4F5C',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    fixed: fixedAction,
    align: 'center',
    width: 150,
  });
  watch(
    () => (extConfigJson == null ? void 0 : extConfigJson.value),
    () => {
      var _a, _b;
      if (((_a = extConfigJson == null ? void 0 : extConfigJson.value) == null ? void 0 : _a.tableFixedAction) === 1) {
        actionColumn.fixed = ((_b = extConfigJson == null ? void 0 : extConfigJson.value) == null ? void 0 : _b.tableFixedActionType) || 'right';
        if (onlineTableContext.isTree()) {
          actionColumn.fixed = 'right';
        }
      }
    }
  );
  function bpmStatusFilter(tableColumns) {
    let flag = false;
    for (let i = 0; i < tableColumns.length; i++) {
      let item = tableColumns[i];
      let fieldName = item.dataIndex;
      if (fieldName.toLowerCase() == 'bpm_status') {
        flag = true;
        break;
      }
    }
    onlineTableContext['hasBpmStatus'] = flag;
    return flag;
  }
  function downloadRowFile(text2) {
    if (!text2) {
      return;
    }
    if (text2.indexOf(',') > 0) {
      text2 = text2.substring(0, text2.indexOf(','));
    }
    let url = getFileAccessHttpUrl(text2);
    window.open(url);
  }
  function getImgView(text2) {
    if (text2 && text2.indexOf(',') > 0) {
      text2 = text2.substring(0, text2.indexOf(','));
    }
    return getFileAccessHttpUrl(text2);
  }
  function getPcaText(code) {
    if (!code) {
      return '';
    }
    return getAreaTextByCode(code);
  }
  function getFormatDate(text2) {
    if (!text2) {
      return '';
    }
    let a = text2;
    if (a.length > 10) {
      a = a.substring(0, 10);
    }
    return a;
  }
  watch(selectedKeys, () => {
    onlineTableContext['selectedRowKeys'] = toRaw(selectedKeys.value);
  });
  onlineTableContext['clearSelectedRow'] = () => {
    selectedKeys.value = [];
    onlineTableContext['selectedRows'] = [];
    onlineTableContext['selectedRowKeys'] = [];
  };
  function viewOnlineCellImage(text2) {
    if (text2) {
      let imgList = [];
      let arr = text2.split(',');
      for (let str2 of arr) {
        if (str2) {
          imgList.push(getFileAccessHttpUrl(str2));
        }
      }
      createImgPreview({ imageList: imgList });
    }
  }
  const onlinePopModalRef = ref();
  function handleClickLinkTable(id, hrefTableName) {
    return __async(this, null, function* () {
      popTableId.value = hrefTableName;
      let formStatus = yield onlinePopModalRef.value.getFormStatus();
      if (formStatus == true) {
        hrefMainTableId.value = hrefTableName;
        openOnlineHrefModal(true, {
          isUpdate: true,
          disableSubmit: true,
          hideSub: true,
          record: { id },
        });
      } else {
        openPopModal(true, {
          isUpdate: true,
          record: {
            id,
          },
        });
      }
    });
  }
  return {
    columns,
    actionColumn,
    selectedKeys,
    rowSelection,
    enableScrollBar,
    tableScroll,
    downloadRowFile,
    getImgView,
    getPcaText,
    getFormatDate,
    handleColumnResult,
    onSelectChange,
    hrefComponent,
    viewOnlineCellImage,
    hrefMainTableId,
    registerOnlineHrefModal,
    registerPopModal,
    openPopModal,
    openOnlineHrefModal,
    onlinePopModalRef,
    popTableId,
  };
}
const _sfc_main$1 = defineComponent({
  name: 'OnlinePopListModal',
  components: {
    BasicModal,
    BasicTable,
    TableAction,
    PlusOutlined,
    OnlinePopModal,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    multi: {
      type: Boolean,
      default: false,
    },
    addAuth: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['success', 'register'],
  setup(props, { emit }) {
    const { createMessage: $message } = useMessage();
    const { popModalFixedWidth, resetBodyStyle, popBodyStyle } = useFixedHeightModal();
    const searchText = ref('');
    const modalWidth = ref(800);
    const [registerModal, { closeModal }] = useModalInner(() => {
      searchText.value = '';
      selectedRowKeys.value = [];
      selectedRows.value = [];
      setPagination({ current: 1 });
      reload();
      resetBodyStyle();
    });
    const [registerPopModal2, { openModal: openPopModal2 }] = useModal();
    function handleCancel() {
      closeModal();
    }
    const submitDisabled = computed(() => {
      const arr = selectedRowKeys.value;
      if (arr && arr.length > 0) {
        return false;
      }
      return true;
    });
    const submitLoading = ref(false);
    function handleSubmit() {
      submitLoading.value = true;
      let arr = toRaw(selectedRows.value);
      if (arr && arr.length > 0) {
        emit('success', arr);
        closeModal();
      }
      setTimeout(() => {
        submitLoading.value = false;
      }, 200);
    }
    function queryTableData2(params) {
      const url = '/online/cgform/api/getData/' + props.id;
      return defHttp.get({ url, params });
    }
    function list(params) {
      params['column'] = 'id';
      return new Promise((resolve, _reject) =>
        __async(this, null, function* () {
          const aa = yield queryTableData2(params);
          resolve(aa);
        })
      );
    }
    const onlineTableContext2 = {
      isPopList: true,
      reloadTable() {
        console.log('reloadTable');
      },
      isTree() {
        return false;
      },
    };
    const extConfigJson2 = ref({});
    const {
      columns: columns2,
      downloadRowFile: downloadRowFile2,
      getImgView: getImgView2,
      getPcaText: getPcaText2,
      getFormatDate: getFormatDate2,
      handleColumnResult: handleColumnResult2,
      hrefComponent: hrefComponent2,
      viewOnlineCellImage: viewOnlineCellImage2,
    } = useTableColumns(onlineTableContext2, extConfigJson2);
    function getColumnList() {
      const url = '/online/cgform/api/getColumns/' + props.id;
      return new Promise((resolve, reject) => {
        defHttp.get({ url }, { isTransformResponse: false }).then((res) => {
          if (res.success) {
            resolve(res.result);
          } else {
            $message.warning(res.message);
            reject();
          }
        });
      });
    }
    const modalTitle = ref('');
    watch(
      () => props.id,
      () =>
        __async(this, null, function* () {
          let columnResult = yield getColumnList();
          handleColumnResult2(columnResult);
          modalTitle.value = columnResult.description;
        }),
      { immediate: true }
    );
    const { tableContext } = useListPage({
      designScope: 'process-design',
      pagination: true,
      tableProps: {
        title: '',
        api: list,
        clickToRowSelect: true,
        columns: columns2,
        showTableSetting: false,
        immediate: false,
        canResize: false,
        showActionColumn: false,
        actionColumn: {
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
        useSearchForm: false,
        beforeFetch: (params) => {
          return addQueryParams(params);
        },
      },
    });
    const [registerTable, { reload, setPagination }, { rowSelection: rowSelection2, selectedRowKeys, selectedRows }] = tableContext;
    watch(
      () => props.multi,
      (val) => {
        if (val == true) {
          rowSelection2.type = 'checkbox';
        } else {
          rowSelection2.type = 'radio';
        }
      },
      { immediate: true }
    );
    function getTableAction(record2) {
      return [
        {
          label: '\u7F16\u8F91',
          onClick: handleUpdate.bind(null, record2),
        },
      ];
    }
    function handleUpdate(record2) {
      console.log('handleUpdate', record2);
    }
    function onSearch() {
      reload();
    }
    const eqConditonTypes = ['int', 'double', 'Date', 'Datetime', 'BigDecimal'];
    function addQueryParams(params) {
      let text2 = searchText.value;
      if (!text2) {
        params['superQueryMatchType'] = 'or';
        params['superQueryParams'] = '';
        return params;
      }
      let arr = columns2.value;
      let conditions = [];
      if (arr && arr.length > 0) {
        for (let item of arr) {
          if (item.dbType) {
            if (item.dbType == 'string') {
              conditions.push({ field: item.dataIndex, type: item.dbType.toLowerCase(), rule: 'like', val: text2 });
            } else if (item.dbType == 'Date') {
              if (text2.length == '2020-10-10'.length) {
                conditions.push({ field: item.dataIndex, type: item.dbType.toLowerCase(), rule: 'eq', val: text2 });
              }
            } else if (item.dbType == 'Datetime') {
              if (text2.length == '2020-10-10 10:10:10'.length) {
                conditions.push({ field: item.dataIndex, type: item.dbType.toLowerCase(), rule: 'eq', val: text2 });
              }
            } else if (eqConditonTypes.indexOf(item.dbType)) {
              conditions.push({ field: item.dataIndex, type: item.dbType.toLowerCase(), rule: 'eq', val: text2 });
            } else;
          }
        }
      }
      params['superQueryMatchType'] = 'or';
      params['superQueryParams'] = encodeURI(JSON.stringify(conditions));
      return params;
    }
    function handleAdd() {
      openPopModal2(true, {});
    }
    function handleDataSave(data) {
      console.log('handleDateSave', data);
      let arr = [data];
      emit('success', arr);
      closeModal();
    }
    return {
      registerModal,
      modalWidth,
      handleCancel,
      submitDisabled,
      submitLoading,
      handleSubmit,
      registerTable,
      getTableAction,
      searchText,
      onSearch,
      downloadRowFile: downloadRowFile2,
      getImgView: getImgView2,
      getPcaText: getPcaText2,
      getFormatDate: getFormatDate2,
      hrefComponent: hrefComponent2,
      viewOnlineCellImage: viewOnlineCellImage2,
      rowSelection: rowSelection2,
      modalTitle,
      registerPopModal: registerPopModal2,
      handleAdd,
      reload,
      popModalFixedWidth,
      popBodyStyle,
      handleDataSave,
    };
  },
});
const _hoisted_1$1 = { style: { display: 'inline-block', width: 'calc(100% - 140px)', 'text-align': 'left' } };
const _hoisted_2$1 = {
  key: 0,
  style: { 'font-size': '12px', 'font-style': 'italic' },
};
const _hoisted_3$1 = {
  key: 0,
  style: { 'font-size': '12px', 'font-style': 'italic' },
};
const _hoisted_4$1 = ['src', 'onClick'];
const _hoisted_5$1 = ['innerHTML'];
const _hoisted_6$1 = ['title'];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PlusOutlined = resolveComponent('PlusOutlined');
  const _component_a_button = resolveComponent('a-button');
  const _component_a_input_search = resolveComponent('a-input-search');
  const _component_TableAction = resolveComponent('TableAction');
  const _component_BasicTable = resolveComponent('BasicTable');
  const _component_BasicModal = resolveComponent('BasicModal');
  const _component_online_pop_modal = resolveComponent('online-pop-modal');
  return (
    openBlock(),
    createElementBlock(
      Fragment,
      null,
      [
        createVNode(
          _component_BasicModal,
          {
            onRegister: _ctx.registerModal,
            width: _ctx.popModalFixedWidth,
            dialogStyle: { top: '70px' },
            bodyStyle: _ctx.popBodyStyle,
            title: _ctx.modalTitle,
            wrapClassName: 'jeecg-online-pop-list-modal',
          },
          {
            footer: withCtx(() => [
              createElementVNode('div', _hoisted_1$1, [
                _ctx.addAuth
                  ? (openBlock(),
                    createBlock(
                      _component_a_button,
                      {
                        key: 0,
                        style: { 'border-radius': '50px' },
                        type: 'primary',
                        onClick: _ctx.handleAdd,
                      },
                      {
                        default: withCtx(() => [createVNode(_component_PlusOutlined), createTextVNode('\u65B0\u589E\u8BB0\u5F55')]),
                        _: 1,
                      },
                      8,
                      ['onClick']
                    ))
                  : createCommentVNode('', true),
              ]),
              createVNode(
                _component_a_button,
                {
                  key: 'back',
                  onClick: _ctx.handleCancel,
                },
                {
                  default: withCtx(() => [createTextVNode('\u5173\u95ED')]),
                  _: 1,
                },
                8,
                ['onClick']
              ),
              createVNode(
                _component_a_button,
                {
                  disabled: _ctx.submitDisabled,
                  key: 'submit',
                  type: 'primary',
                  onClick: _ctx.handleSubmit,
                  loading: _ctx.submitLoading,
                },
                {
                  default: withCtx(() => [createTextVNode('\u786E\u5B9A')]),
                  _: 1,
                },
                8,
                ['disabled', 'onClick', 'loading']
              ),
            ]),
            default: withCtx(() => [
              createVNode(
                _component_BasicTable,
                {
                  onRegister: _ctx.registerTable,
                  rowSelection: _ctx.rowSelection,
                },
                {
                  tableTitle: withCtx(() => [
                    createVNode(
                      _component_a_input_search,
                      {
                        value: _ctx.searchText,
                        'onUpdate:value': _cache[0] || (_cache[0] = ($event) => (_ctx.searchText = $event)),
                        onSearch: _ctx.onSearch,
                        placeholder: '\u8BF7\u8F93\u5165\u5173\u952E\u8BCD\uFF0C\u6309\u56DE\u8F66\u641C\u7D22',
                        style: { width: '240px' },
                      },
                      null,
                      8,
                      ['value', 'onSearch']
                    ),
                  ]),
                  action: withCtx(({ record: record2 }) => [
                    createVNode(
                      _component_TableAction,
                      {
                        actions: _ctx.getTableAction(record2),
                      },
                      null,
                      8,
                      ['actions']
                    ),
                  ]),
                  fileSlot: withCtx(({ text: text2 }) => [
                    !text2
                      ? (openBlock(), createElementBlock('span', _hoisted_2$1, '\u65E0\u6587\u4EF6'))
                      : (openBlock(),
                        createBlock(
                          _component_a_button,
                          {
                            key: 1,
                            ghost: true,
                            type: 'primary',
                            preIcon: 'ant-design:download',
                            size: 'small',
                            onClick: ($event) => _ctx.downloadRowFile(text2),
                          },
                          {
                            default: withCtx(() => [createTextVNode(' \u4E0B\u8F7D ')]),
                            _: 2,
                          },
                          1032,
                          ['onClick']
                        )),
                  ]),
                  imgSlot: withCtx(({ text: text2 }) => [
                    !text2
                      ? (openBlock(), createElementBlock('span', _hoisted_3$1, '\u65E0\u56FE\u7247'))
                      : (openBlock(),
                        createElementBlock(
                          'img',
                          {
                            key: 1,
                            src: _ctx.getImgView(text2),
                            alt: '\u56FE\u7247\u4E0D\u5B58\u5728',
                            class: 'online-cell-image',
                            onClick: ($event) => _ctx.viewOnlineCellImage(text2),
                          },
                          null,
                          8,
                          _hoisted_4$1
                        )),
                  ]),
                  htmlSlot: withCtx(({ text: text2 }) => [createElementVNode('div', { innerHTML: text2 }, null, 8, _hoisted_5$1)]),
                  pcaSlot: withCtx(({ text: text2 }) => [
                    createElementVNode(
                      'div',
                      {
                        title: _ctx.getPcaText(text2),
                      },
                      toDisplayString(_ctx.getPcaText(text2)),
                      9,
                      _hoisted_6$1
                    ),
                  ]),
                  dateSlot: withCtx(({ text: text2 }) => [createElementVNode('span', null, toDisplayString(_ctx.getFormatDate(text2)), 1)]),
                  _: 1,
                },
                8,
                ['onRegister', 'rowSelection']
              ),
            ]),
            _: 1,
          },
          8,
          ['onRegister', 'width', 'bodyStyle', 'title']
        ),
        createVNode(
          _component_online_pop_modal,
          {
            id: _ctx.id,
            onRegister: _ctx.registerPopModal,
            onSuccess: _ctx.handleDataSave,
            topTip: '',
          },
          null,
          8,
          ['id', 'onRegister', 'onSuccess']
        ),
      ],
      64
    )
  );
}
var OnlinePopListModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [['render', _sfc_render$1]]);
var OnlinePopListModal$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: OnlinePopListModal,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
var LinkTableCard_vue_vue_type_style_index_0_scoped_true_lang = '';
const _sfc_main = {
  name: 'LinkTableCard',
  props: {
    valueField: propTypes.string.def(''),
    textField: propTypes.string.def(''),
    tableName: propTypes.string.def(''),
    multi: propTypes.bool.def(false),
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    linkFields: propTypes.array.def([]),
    disabled: propTypes.bool.def(false),
    detail: propTypes.bool.def(false),
    imageField: propTypes.string.def([]),
  },
  components: {
    PlusOutlined,
    MinusCircleFilled,
    OnlinePopListModal,
    OnlinePopModal,
  },
  emits: ['change', 'update:value'],
  setup(props, { emit }) {
    const popTableName = computed(() => {
      return props.tableName;
    });
    const [registerListModal, { openModal: openListModal }] = useModal();
    const [registerFormModal, { openModal: openFormModal }] = useModal();
    const selectValue = ref([]);
    const selectRecords = ref([]);
    const showButton = computed(() => {
      if (props.disabled == true) {
        return false;
      }
      if (props.multi === false) {
        if (selectRecords.value.length > 0) {
          return false;
        }
      }
      return true;
    });
    const {
      auths,
      otherColumns,
      realShowColumns,
      tableColumns,
      textFieldArray,
      transData,
      loadOne,
      compareData,
      formatData,
      initFormData,
      getImageSrc,
      showImage,
    } = useLinkTable(props);
    const itemSpan = computed(() => {
      if (props.multi === true) {
        return 12;
      }
      return 24;
    });
    const columnSpan = computed(() => {
      if (props.multi === true) {
        return 24;
      }
      return 12;
    });
    function getMainContent(record2) {
      if (record2) {
        if (textFieldArray.value.length > 0) {
          let field2 = textFieldArray.value[0];
          return record2[field2];
        }
      }
    }
    function prevent(e) {
      e == null ? void 0 : e.stopPropagation();
      e == null ? void 0 : e.preventDefault();
    }
    function handleClickEdit(e, record2) {
      prevent(e);
      if (auths.update == false) {
        console.error('\u5F53\u524D\u7528\u6237\u65E0\u7F16\u8F91\u6743\u9650!');
        return;
      }
      if (props.disabled == false) {
        openFormModal(true, {
          isUpdate: true,
          record: record2,
        });
      }
    }
    function handleAddRecord(e) {
      openListModal(true, {});
    }
    function addCard(data) {
      let arr = selectRecords.value;
      for (let item of data) {
        let temp = __spreadValues({}, item);
        transData(temp);
        arr.push(temp);
      }
      selectRecords.value = arr;
      emitValue();
    }
    function updateCardData(formData) {
      let arr = selectRecords.value;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === formData.id) {
          let temp = __spreadValues({}, formData);
          transData(temp);
          arr.splice(i, 1, temp);
        }
      }
      selectRecords.value = arr;
      emitValue();
    }
    function handleDeleteRecord(e, index) {
      prevent(e);
      let temp = selectRecords.value;
      if (temp && temp.length > index) {
        temp.splice(index, 1);
        selectRecords.value = temp;
      }
      emitValue();
    }
    function emitValue() {
      let arr = selectRecords.value;
      let values = [];
      let formData = {};
      let linkFieldArray = props.linkFields;
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          values.push(arr[i][props.valueField]);
          initFormData(formData, linkFieldArray, arr[i]);
        }
      } else {
        initFormData(formData, linkFieldArray);
      }
      let text2 = values.join(',');
      formatData(formData);
      emit('change', text2, formData);
      emit('update:value', text2);
    }
    watch(
      () => props.value,
      (val) =>
        __async(this, null, function* () {
          if (val) {
            let flag = compareData(selectRecords.value, val);
            if (flag === false) {
              let arr = yield loadOne(val);
              selectRecords.value = arr;
            }
            if (props.linkFields && props.linkFields.length > 0) {
              emitValue();
            }
          } else {
            selectRecords.value = [];
          }
        }),
      { immediate: true }
    );
    return {
      popTableName,
      selectRecords,
      otherColumns,
      realShowColumns,
      showButton,
      selectValue,
      handleAddRecord,
      handleDeleteRecord,
      getMainContent,
      itemSpan,
      columnSpan,
      tableColumns,
      addCard,
      registerListModal,
      registerFormModal,
      handleClickEdit,
      updateCardData,
      getImageSrc,
      showImage,
      auths,
    };
  },
};
const _hoisted_1 = { class: 'table-link-card' };
const _hoisted_2 = { style: { width: '100%', height: '100%' } };
const _hoisted_3 = {
  key: 0,
  class: 'card-button',
};
const _hoisted_4 = ['onClick'];
const _hoisted_5 = {
  key: 0,
  class: 'card-delete',
};
const _hoisted_6 = { class: 'card-inner' };
const _hoisted_7 = { class: 'card-main-content' };
const _hoisted_8 = { class: 'other-content' };
const _hoisted_9 = { class: 'label ellipsis' };
const _hoisted_10 = { class: 'text ellipsis' };
const _hoisted_11 = {
  key: 0,
  class: 'card-item-image',
};
const _hoisted_12 = ['src'];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PlusOutlined = resolveComponent('PlusOutlined');
  const _component_a_button = resolveComponent('a-button');
  const _component_minus_circle_filled = resolveComponent('minus-circle-filled');
  const _component_a_col = resolveComponent('a-col');
  const _component_a_row = resolveComponent('a-row');
  const _component_online_pop_list_modal = resolveComponent('online-pop-list-modal');
  const _component_online_pop_modal = resolveComponent('online-pop-modal');
  return (
    openBlock(),
    createElementBlock('div', null, [
      createElementVNode('div', _hoisted_1, [
        createElementVNode('div', _hoisted_2, [
          $setup.showButton
            ? (openBlock(),
              createElementBlock('div', _hoisted_3, [
                createVNode(
                  _component_a_button,
                  { onClick: $setup.handleAddRecord },
                  {
                    default: withCtx(() => [createVNode(_component_PlusOutlined), createTextVNode('\u8BB0 \u5F55')]),
                    _: 1,
                  },
                  8,
                  ['onClick']
                ),
              ]))
            : createCommentVNode('', true),
          createVNode(_component_a_row, null, {
            default: withCtx(() => [
              (openBlock(true),
              createElementBlock(
                Fragment,
                null,
                renderList($setup.selectRecords, (record2, index) => {
                  return (
                    openBlock(),
                    createBlock(
                      _component_a_col,
                      { span: $setup.itemSpan },
                      {
                        default: withCtx(() => [
                          createElementVNode(
                            'div',
                            {
                              class: normalizeClass(['card-item', { 'disabled-chunk': $props.detail == true }]),
                              onClick: (e) => $setup.handleClickEdit(e, record2),
                            },
                            [
                              createElementVNode(
                                'div',
                                {
                                  class: normalizeClass(['card-item-left', { 'show-right-image': $setup.showImage }]),
                                },
                                [
                                  $props.disabled == false
                                    ? (openBlock(),
                                      createElementBlock('span', _hoisted_5, [
                                        createVNode(
                                          _component_minus_circle_filled,
                                          {
                                            onClick: (e) => $setup.handleDeleteRecord(e, index),
                                          },
                                          null,
                                          8,
                                          ['onClick']
                                        ),
                                      ]))
                                    : createCommentVNode('', true),
                                  createElementVNode('div', _hoisted_6, [
                                    createElementVNode('div', _hoisted_7, toDisplayString($setup.getMainContent(record2)), 1),
                                    createElementVNode('div', _hoisted_8, [
                                      createVNode(
                                        _component_a_row,
                                        null,
                                        {
                                          default: withCtx(() => [
                                            (openBlock(true),
                                            createElementBlock(
                                              Fragment,
                                              null,
                                              renderList($setup.realShowColumns, (col) => {
                                                return (
                                                  openBlock(),
                                                  createBlock(
                                                    _component_a_col,
                                                    { span: $setup.columnSpan },
                                                    {
                                                      default: withCtx(() => [
                                                        createElementVNode('span', _hoisted_9, toDisplayString(col.title), 1),
                                                        createElementVNode('span', _hoisted_10, toDisplayString(record2[col.dataIndex]), 1),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1032,
                                                    ['span']
                                                  )
                                                );
                                              }),
                                              256
                                            )),
                                          ]),
                                          _: 2,
                                        },
                                        1024
                                      ),
                                    ]),
                                  ]),
                                ],
                                2
                              ),
                              $setup.showImage
                                ? (openBlock(),
                                  createElementBlock('div', _hoisted_11, [
                                    $setup.getImageSrc(record2)
                                      ? (openBlock(),
                                        createElementBlock(
                                          'img',
                                          {
                                            key: 0,
                                            src: $setup.getImageSrc(record2),
                                            alt: '',
                                          },
                                          null,
                                          8,
                                          _hoisted_12
                                        ))
                                      : createCommentVNode('', true),
                                  ]))
                                : createCommentVNode('', true),
                            ],
                            10,
                            _hoisted_4
                          ),
                        ]),
                        _: 2,
                      },
                      1032,
                      ['span']
                    )
                  );
                }),
                256
              )),
            ]),
            _: 1,
          }),
        ]),
      ]),
      createVNode(
        _component_online_pop_list_modal,
        {
          onRegister: $setup.registerListModal,
          multi: $props.multi,
          id: $setup.popTableName,
          addAuth: $setup.auths.add,
          onSuccess: $setup.addCard,
        },
        null,
        8,
        ['onRegister', 'multi', 'id', 'addAuth', 'onSuccess']
      ),
      createVNode(
        _component_online_pop_modal,
        {
          id: $setup.popTableName,
          onRegister: $setup.registerFormModal,
          onSuccess: $setup.updateCardData,
          topTip: '',
        },
        null,
        8,
        ['id', 'onRegister', 'onSuccess']
      ),
    ])
  );
}
var LinkTableCard = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-f6bb6746'],
]);
var LinkTableCard$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: LinkTableCard,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
const componentKeyMap = {};
function useExtendComponent() {
  addComponent('OnlineSelectCascade', OnlineSelectCascade);
  addComponent('LinkTableSelect', LinkTableSelect);
  addComponent('LinkTableCard', LinkTableCard);
  function addComponent(key, comp) {
    if (!componentKeyMap[key]) {
      add(key, comp);
      componentKeyMap[key] = 1;
    }
  }
  function linkTableCard2Select(schema) {
    if ('LinkTableCard' == schema.component) {
      schema.component = 'LinkTableSelect';
      schema.componentProps.popContainer = 'body';
    }
  }
  return {
    addComponent,
    linkTableCard2Select,
  };
}
export {
  ENHANCEJS as E,
  FormSchemaFactory as F,
  LinkTableCard as L,
  OnlineSubForm as O,
  SUBMIT_FLOW_KEY as S,
  VALIDATE_FAILED as V,
  OnlinePopModal as a,
  useOnlineFormContext as b,
  useFormItems as c,
  useEnhance as d,
  SUBMIT_FLOW_ID as e,
  ONL_FORM_TABLE_NAME as f,
  getRefPromise as g,
  getDetailFormSchemas as h,
  FORM_VIEW_TO_QUERY_VIEW as i,
  loadOneFieldDefVal as j,
  LINK_DOWN as k,
  loadFormFieldsDefVal as l,
  handleLinkDown as m,
  getFieldIndex as n,
  useTableColumns as o,
  useAutoModal as p,
  SETUP as q,
  OnlineSubForm$1 as r,
  OnlinePopForm$1 as s,
  OnlinePopModal$1 as t,
  useExtendComponent as u,
  LinkTableSelect$1 as v,
  OnlinePopListModal$1 as w,
  LinkTableCard$1 as x,
};
