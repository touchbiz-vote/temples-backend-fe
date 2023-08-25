var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { defineComponent, ref, reactive, unref, computed, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode, createElementVNode, createTextVNode } from "vue";
import { useModalInner, BasicModal } from "/@/components/Modal";
import { useForm, BasicForm } from "/@/components/Form/index";
import { useJvxeMethod } from "/@/hooks/system/useJvxeMethods.ts";
import { JVxeTypes } from "/@/components/jeecg/JVxeTable/types";
import { duplicateCheck } from "/@/views/system/user/user.api";
import { defHttp } from "/@/utils/http/axios";
import { useMessage } from "/@/hooks/web/useMessage";
const { createConfirm } = useMessage();
const onlCgreportParamList = "/online/cgreport/param/listByHeadId";
const onlCgreportItemList = "/online/cgreport/item/listByHeadId";
const list = (params) => defHttp.get({ url: "/online/cgreport/head/list", params });
const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: "/online/cgreport/head/delete", params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
const batchDelete = (params, handleSuccess) => {
  createConfirm({
    title: "\u786E\u8BA4\u5220\u9664",
    content: "\u662F\u5426\u5220\u9664\u9009\u4E2D\u6570\u636E",
    okText: "\u786E\u8BA4",
    cancelText: "\u53D6\u6D88",
    iconType: "warning",
    onOk: () => {
      return defHttp.delete({ url: "/online/cgreport/head/deleteBatch", data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    }
  });
};
const saveOrUpdate = (params, isUpdate) => {
  if (isUpdate) {
    return defHttp.put({ url: "/online/cgreport/head/editAll", params });
  } else {
    return defHttp.post({ url: "/online/cgreport/head/add", params });
  }
};
const getReportParam = (id) => {
  return defHttp.get({ url: "/online/cgreport/api/getParamsInfo/" + id });
};
const getDataSourceList = () => {
  return defHttp.get({ url: "/sys/dataSource/options" });
};
const analyzeSql = (params) => {
  return defHttp.get({
    url: "/online/cgreport/head/parseSql?" + params
  });
};
const columns = [
  {
    title: "\u62A5\u8868\u540D\u5B57",
    align: "center",
    dataIndex: "name",
    width: 120
  },
  {
    title: "\u62A5\u8868\u7F16\u7801",
    align: "center",
    dataIndex: "code",
    width: 120
  },
  {
    title: "\u62A5\u8868SQL",
    align: "center",
    dataIndex: "cgrSql",
    width: 360
  },
  {
    title: "\u6570\u636E\u6E90",
    align: "center",
    dataIndex: "dbSource",
    width: 120
  },
  {
    title: "\u521B\u5EFA\u65F6\u95F4",
    align: "center",
    dataIndex: "createTime",
    width: 120
  }
];
const searchFormSchema = [
  {
    label: "\u62A5\u8868\u540D\u79F0",
    field: "name",
    component: "JInput"
  },
  {
    label: "\u62A5\u8868\u7F16\u7801",
    field: "code",
    component: "JInput"
  }
];
const codePattern = /^[a-z|A-Z][a-z|A-Z|\d|_|-]{0,}$/;
const formSchema = [
  {
    label: "",
    field: "id",
    component: "Input",
    show: false
  },
  {
    label: "\u62A5\u8868\u7F16\u7801",
    field: "code",
    component: "Input",
    colProps: {
      sm: 24,
      xs: 24,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    },
    dynamicRules: ({ values, model }) => {
      console.log("values:", values);
      return [
        {
          required: true,
          validator: (_, value) => {
            return new Promise((resolve, reject) => {
              if (!value) {
                return reject("\u8BF7\u8F93\u5165\u62A5\u8868\u7F16\u7801\uFF01");
              }
              if (!codePattern.test(value)) {
                return reject("\u7F16\u7801\u5FC5\u987B\u4EE5\u5B57\u6BCD\u5F00\u5934\uFF0C\u53EF\u5305\u542B\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u3001\u6A2A\u6760\uFF01");
              }
              let params = {
                tableName: "onl_cgreport_head",
                fieldName: "code",
                fieldVal: value,
                dataId: model.id
              };
              duplicateCheck(params).then((res) => {
                res.success ? resolve() : reject("\u62A5\u8868\u7F16\u7801\u5DF2\u5B58\u5728!");
              }).catch((err) => {
                reject(err.message || "\u6821\u9A8C\u5931\u8D25");
              });
            });
          }
        }
      ];
    }
  },
  {
    label: "\u62A5\u8868\u540D\u5B57",
    field: "name",
    component: "Input",
    colProps: {
      sm: 24,
      xs: 24,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    },
    dynamicRules: () => {
      return [{ required: true, message: "\u8BF7\u8F93\u5165\u62A5\u8868\u540D\u5B57!" }];
    }
  },
  {
    label: "\u52A8\u6001\u6570\u636E\u6E90",
    field: "dbSource",
    colProps: {
      sm: 24,
      xs: 24,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    },
    component: "ApiSelect",
    componentProps: {
      api: getDataSourceList
    }
  },
  {
    label: "\u62A5\u8868SQL",
    field: "cgrSql",
    component: "JCodeEditor",
    rules: [{ required: true, message: "\u8BF7\u586B\u5199\u62A5\u8868SQL" }],
    itemProps: {
      labelCol: { xs: 24, sm: 2 },
      wrapperCol: { xs: 24, sm: 22 }
    },
    componentProps: {
      height: "200px",
      fullScreen: true
    },
    colProps: {
      span: 20
    }
  },
  {
    label: " ",
    field: "analyseButton",
    component: "Input",
    slot: "analyseButton",
    colProps: {
      span: 4
    },
    itemProps: {
      labelCol: { xs: 1, sm: 1 },
      wrapperCol: { xs: 23, sm: 23 },
      colon: false
    }
  }
];
const onlCgreportParamColumns = [
  {
    title: "\u53C2\u6570\u5B57\u6BB5",
    key: "paramName",
    type: JVxeTypes.input,
    width: "200px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: "",
    validateRules: [{ required: true, message: "${title}\u4E0D\u80FD\u4E3A\u7A7A" }]
  },
  {
    title: "\u53C2\u6570\u6587\u672C",
    key: "paramTxt",
    type: JVxeTypes.input,
    width: "200px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: "",
    validateRules: [{ required: true, message: "${title}\u4E0D\u80FD\u4E3A\u7A7A" }]
  },
  {
    title: "\u53C2\u6570\u9ED8\u8BA4\u503C",
    key: "paramValue",
    type: JVxeTypes.input,
    width: "200px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: ""
  }
];
const onlCgreportItemColumns = [
  {
    title: "\u5B57\u6BB5\u540D\u5B57",
    key: "fieldName",
    type: JVxeTypes.input,
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: "",
    validateRules: [{ required: true, message: "${title}\u4E0D\u80FD\u4E3A\u7A7A" }]
  },
  {
    title: "\u5B57\u6BB5\u6587\u672C",
    key: "fieldTxt",
    type: JVxeTypes.input,
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: "",
    validateRules: [{ required: true, message: "${title}\u4E0D\u80FD\u4E3A\u7A7A" }]
  },
  {
    title: "\u5B57\u6BB5\u7C7B\u578B",
    key: "fieldType",
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: "",
    validateRules: [{ required: true, message: "${title}\u4E0D\u80FD\u4E3A\u7A7A" }],
    type: JVxeTypes.select,
    options: [
      { title: "\u6570\u503C\u7C7B\u578B", value: "Integer" },
      { title: "\u5B57\u7B26\u7C7B\u578B", value: "String" },
      { title: "\u65E5\u671F\u7C7B\u578B", value: "Date" },
      { title: "\u65F6\u95F4\u7C7B\u578B", value: "Datetime" },
      { title: "\u957F\u6574\u578B", value: "Long" }
    ]
  },
  {
    title: "\u662F\u5426\u663E\u793A",
    key: "isShow",
    minWidth: "80px",
    align: "center",
    type: JVxeTypes.checkbox,
    customValue: [1, 0],
    defaultChecked: true
  },
  {
    title: "\u5B57\u6BB5href",
    key: "fieldHref",
    type: JVxeTypes.input,
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: ""
  },
  {
    title: "\u67E5\u8BE2\u6A21\u5F0F",
    key: "searchMode",
    type: JVxeTypes.select,
    minWidth: "150px",
    placeholder: "\u8BF7\u9009\u62E9${title}",
    options: [
      { title: "\u5355\u6761\u4EF6\u67E5\u8BE2", value: "single" },
      { title: "\u8303\u56F4\u67E5\u8BE2", value: "group" }
    ]
  },
  {
    title: "\u53D6\u503C\u8868\u8FBE\u5F0F",
    key: "replaceVal",
    type: JVxeTypes.input,
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: ""
  },
  {
    title: "\u5B57\u5178code",
    key: "dictCode",
    type: JVxeTypes.input,
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: ""
  },
  {
    title: "\u5206\u7EC4\u6807\u9898",
    key: "groupTitle",
    type: JVxeTypes.input,
    minWidth: "150px",
    placeholder: "\u8BF7\u8F93\u5165${title}",
    defaultValue: ""
  },
  {
    title: "\u662F\u5426\u67E5\u8BE2",
    key: "isSearch",
    type: JVxeTypes.checkbox,
    customValue: ["1", "0"],
    minWidth: "80px",
    align: "center",
    defaultChecked: false
  },
  {
    title: "\u662F\u5426\u5408\u8BA1",
    align: "center",
    key: "isTotal",
    type: JVxeTypes.checkbox,
    customValue: ["1", "0"],
    minWidth: "80px",
    defaultChecked: false
  }
];
const _hoisted_1 = { style: { "flex": "1", "text-align": "left" } };
const _hoisted_2 = /* @__PURE__ */ createElementVNode("br", null, null, -1);
const _hoisted_3 = /* @__PURE__ */ createElementVNode("br", null, null, -1);
const _hoisted_4 = /* @__PURE__ */ createElementVNode("br", null, null, -1);
const _hoisted_5 = /* @__PURE__ */ createElementVNode("br", null, null, -1);
const _hoisted_6 = /* @__PURE__ */ createElementVNode("br", null, null, -1);
const _hoisted_7 = /* @__PURE__ */ createElementVNode("span", { style: { "color": "red" } }, "\u6CE8\uFF1A\u53C2\u6570\u53EA\u652F\u6301\u52A8\u6001\u62A5\u8868\uFF0Cpopup\u6682\u4E0D\u652F\u6301", -1);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CgreportModal",
  emits: ["register", "success"],
  setup(__props, { emit }) {
    const { createMessage } = useMessage();
    const isUpdate = ref(true);
    const confirmLoading = ref(true);
    const refKeys = ref(["onlCgreportItem", "onlCgreportParam"]);
    const activeKey = ref("onlCgreportItem");
    const onlCgreportParam = ref();
    const onlCgreportItem = ref();
    const tableRefs = { onlCgreportItem, onlCgreportParam };
    const onlCgreportParamTable = reactive({
      loading: false,
      dataSource: [],
      columns: onlCgreportParamColumns
    });
    const onlCgreportItemTable = reactive({
      loading: false,
      dataSource: [],
      columns: onlCgreportItemColumns
    });
    const [registerForm, { setProps, resetFields, setFieldsValue, validate, validateFields }] = useForm({
      schemas: formSchema,
      showActionButtonGroup: false
    });
    const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => __async(this, null, function* () {
      var _a, _b;
      yield reset();
      setModalProps({ confirmLoading: false, showCancelBtn: data == null ? void 0 : data.showFooter, showOkBtn: data == null ? void 0 : data.showFooter });
      isUpdate.value = !!(data == null ? void 0 : data.isUpdate);
      if (unref(isUpdate)) {
        yield setFieldsValue(__spreadValues({}, data.record));
        requestSubTableData(onlCgreportParamList, { headId: (_a = data == null ? void 0 : data.record) == null ? void 0 : _a.id }, onlCgreportParamTable);
        requestSubTableData(onlCgreportItemList, { headId: (_b = data == null ? void 0 : data.record) == null ? void 0 : _b.id }, onlCgreportItemTable);
      }
      setProps({ disabled: !(data == null ? void 0 : data.showFooter) });
    }));
    const [handleChangeTabs, handleSubmit, requestSubTableData, formRef] = useJvxeMethod(
      requestAddOrEdit,
      classifyIntoFormData,
      tableRefs,
      activeKey,
      refKeys
    );
    const title = computed(() => !unref(isUpdate) ? "\u65B0\u589E" : "\u7F16\u8F91");
    function reset() {
      return __async(this, null, function* () {
        yield resetFields();
        activeKey.value = "onlCgreportItem";
        onlCgreportParamTable.dataSource = [];
        onlCgreportItemTable.dataSource = [];
      });
    }
    function classifyIntoFormData(allValues) {
      let main = Object.assign({}, allValues.formValue);
      return __spreadProps(__spreadValues({}, main), {
        onlCgreportParamList: allValues.tablesValue[1].tableData,
        onlCgreportItemList: allValues.tablesValue[0].tableData
      });
    }
    function requestAddOrEdit(values) {
      return __async(this, null, function* () {
        try {
          setModalProps({ confirmLoading: true });
          let params = [], items = [], head = {};
          Object.keys(values).map((k) => {
            if (k == "onlCgreportItemList") {
              items = values[k];
            } else if (k == "onlCgreportParamList") {
              params = values[k];
            } else {
              head[k] = values[k];
            }
          });
          let obj = { head, params, items };
          console.log("\u62A5\u8868\u914D\u7F6E\u4FDD\u5B58\u8BF7\u6C42\u53C2\u6570", obj);
          yield saveOrUpdate(obj, isUpdate.value);
          closeModal();
          emit("success");
        } finally {
          setModalProps({ confirmLoading: false });
        }
      });
    }
    function handleSQLAnalyze() {
      setModalProps({ confirmLoading: true });
      validateFields(["cgrSql", "dbSource"]).then((values) => {
        let { cgrSql, dbSource } = values;
        let urlParam = "sql=" + encodeURIComponent(cgrSql);
        if (dbSource) {
          urlParam += "&dbKey=" + dbSource;
        }
        console.log("urlParam----", urlParam);
        analyzeSql(urlParam).then((res) => {
          if (res) {
            createMessage.success("\u89E3\u6790\u6210\u529F");
            let { fields, params } = res;
            let newFields = fields.filter((item) => item.fieldName != "__row_number__");
            let itemDataSource = onlCgreportItem.value.getTableData();
            let newItemDataList = getTabData(itemDataSource, newFields || [], "fieldName");
            newItemDataList = newItemDataList.sort((a, b) => a.orderNum - b.orderNum);
            onlCgreportItemTable.dataSource = newItemDataList;
            let paramDataSource = onlCgreportParam.value.getTableData();
            let newParamList = getTabData(paramDataSource, params || [], "paramName");
            newParamList = newParamList.sort((a, b) => a.orderNum - b.orderNum);
            onlCgreportParamTable.dataSource = newParamList;
          }
        });
      }).catch(() => {
        console.log("\u89E3\u6790\u5931\u8D25");
      }).finally(() => {
        setModalProps({ confirmLoading: false });
      });
    }
    function getTabData(old_arr, new_arr, columnName) {
      if (old_arr.length > 0) {
        let need = [], field_arr = [], max_order = 1;
        for (let t of new_arr) {
          for (let o of old_arr) {
            if (o[columnName] == t[columnName]) {
              need.push(o);
              field_arr.push(t[columnName]);
              if (o.orderNum > max_order) {
                max_order = o.orderNum;
              }
              break;
            }
          }
        }
        for (let t of new_arr) {
          if (field_arr.indexOf(t[columnName]) < 0) {
            t.orderNum = ++max_order;
            need.push(t);
          }
        }
        return need;
      } else {
        let max_order = 0;
        for (let t of new_arr) {
          if (!t.orderNum) {
            t.orderNum = ++max_order;
          }
        }
        return new_arr;
      }
    }
    return (_ctx, _cache) => {
      const _component_a_icon = resolveComponent("a-icon");
      const _component_a_popover = resolveComponent("a-popover");
      const _component_a_button = resolveComponent("a-button");
      const _component_a_divider = resolveComponent("a-divider");
      const _component_JVxeTable = resolveComponent("JVxeTable");
      const _component_a_tab_pane = resolveComponent("a-tab-pane");
      const _component_a_tabs = resolveComponent("a-tabs");
      return openBlock(), createBlock(unref(BasicModal), mergeProps(_ctx.$attrs, {
        onRegister: unref(registerModal),
        title: unref(title),
        width: 1200,
        maskClosable: false,
        defaultFullscreen: true,
        confirmLoading: confirmLoading.value,
        onOk: unref(handleSubmit)
      }), {
        default: withCtx(() => [
          createVNode(unref(BasicForm), {
            onRegister: unref(registerForm),
            ref_key: "formRef",
            ref: formRef
          }, {
            analyseButton: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                createVNode(_component_a_popover, {
                  title: "\u4F7F\u7528\u6307\u5357",
                  trigger: "hover",
                  style: { "margin": "0 10px 0 6px" }
                }, {
                  content: withCtx(() => [
                    createTextVNode(" \u60A8\u53EF\u4EE5\u952E\u5165\u201C\u201D\u4F5C\u4E3A\u4E00\u4E2A\u53C2\u6570\uFF0C\u8FD9\u91CCabc\u662F\u53C2\u6570\u7684\u540D\u79F0\u3002\u4F8B\u5982\uFF1A"),
                    _hoisted_2,
                    createTextVNode(" select * from table where id = ${abc}\u3002"),
                    _hoisted_3,
                    createTextVNode(" select * from table where id like concat('%',${abc},'%')\u3002(mysql\u6A21\u7CCA\u67E5\u8BE2)"),
                    _hoisted_4,
                    createTextVNode(" select * from table where id like '%'||${abc}||'%'\u3002(oracle\u6A21\u7CCA\u67E5\u8BE2)"),
                    _hoisted_5,
                    createTextVNode(" select * from table where id like '%'+${abc}+'%'\u3002(sqlserver\u6A21\u7CCA\u67E5\u8BE2)"),
                    _hoisted_6,
                    _hoisted_7
                  ]),
                  default: withCtx(() => [
                    createVNode(_component_a_icon, { type: "question-circle" })
                  ]),
                  _: 1
                }),
                createVNode(_component_a_button, {
                  style: { "margin-left": "10px" },
                  type: "primary",
                  onClick: handleSQLAnalyze
                }, {
                  default: withCtx(() => [
                    createTextVNode("SQL\u89E3\u6790")
                  ]),
                  _: 1
                })
              ])
            ]),
            _: 1
          }, 8, ["onRegister"]),
          createVNode(_component_a_divider, {
            style: { "margin": "1px 0" },
            class: "cust-divider"
          }),
          createVNode(_component_a_tabs, {
            activeKey: activeKey.value,
            "onUpdate:activeKey": _cache[0] || (_cache[0] = ($event) => activeKey.value = $event),
            animated: "",
            onChange: unref(handleChangeTabs)
          }, {
            default: withCtx(() => [
              (openBlock(), createBlock(_component_a_tab_pane, {
                tab: "\u52A8\u6001\u62A5\u8868\u914D\u7F6E\u660E\u7EC6",
                key: refKeys.value[0],
                forceRender: true
              }, {
                default: withCtx(() => [
                  createVNode(_component_JVxeTable, {
                    "keep-source": "",
                    dragSort: "",
                    resizable: "",
                    ref_key: "onlCgreportItem",
                    ref: onlCgreportItem,
                    loading: onlCgreportItemTable.loading,
                    columns: onlCgreportItemTable.columns,
                    dataSource: onlCgreportItemTable.dataSource,
                    height: 390,
                    rowNumber: true,
                    rowSelection: true,
                    toolbar: true
                  }, null, 8, ["loading", "columns", "dataSource"])
                ]),
                _: 1
              })),
              (openBlock(), createBlock(_component_a_tab_pane, {
                tab: "\u62A5\u8868\u53C2\u6570",
                key: refKeys.value[1],
                forceRender: true
              }, {
                default: withCtx(() => [
                  createVNode(_component_JVxeTable, {
                    "keep-source": "",
                    resizable: "",
                    dragSort: "",
                    ref_key: "onlCgreportParam",
                    ref: onlCgreportParam,
                    loading: onlCgreportParamTable.loading,
                    columns: onlCgreportParamTable.columns,
                    dataSource: onlCgreportParamTable.dataSource,
                    height: 390,
                    rowNumber: true,
                    rowSelection: true,
                    toolbar: true
                  }, null, 8, ["loading", "columns", "dataSource"])
                ]),
                _: 1
              }))
            ]),
            _: 1
          }, 8, ["activeKey", "onChange"])
        ]),
        _: 1
      }, 16, ["onRegister", "title", "confirmLoading", "onOk"]);
    };
  }
});
var CgreportModal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
export { CgreportModal as C, _sfc_main as _, batchDelete as b, columns as c, deleteOne as d, getReportParam as g, list as l, searchFormSchema as s };
