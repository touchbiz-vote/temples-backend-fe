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
import { ref, computed, watch, defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, withCtx, Fragment, renderList, createBlock, createElementVNode, toDisplayString } from "vue";
import { propTypes } from "/@/utils/propTypes";
import { getDictItemsByCode } from "/@/utils/dict";
import { filterMultiDictText, filterDictText } from "/@/utils/dict/JDictSelectUtil";
import { initDictOptions } from "/@/utils/dict/index";
import { loadDictItem, queryDepartTreeSync, getUserList } from "/@/api/common/api";
import { defHttp } from "/@/utils/http/axios";
import { getAreaTextByCode } from "/@/components/Form/src/utils/Area";
import { getFileAccessHttpUrl } from "/@/utils/common/compUtils";
import { createImgPreview } from "/@/components/Preview/index";
import { useMessage } from "/@/hooks/web/useMessage";
import { DownloadOutlined, EyeOutlined, PaperClipOutlined } from "@ant-design/icons-vue";
import { L as LinkTableCard } from "./useExtendComponent.js";
import { _ as _export_sfc } from "./index.js";
import "/@/components/Form/src/componentMap";
import "/@/components/Modal";
import "/@/components/Form/index";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/store/modules/user";
import "/@/utils";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "/@/components/Table";
import "/@/hooks/system/useListPage";
import "vue-router";
import "./LinkTableListPiece.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "./OnlineSelectCascade.js";
import "/@/components/Loading";
import "/@/utils/auth";
import "./JModalTip.js";
import "ant-design-vue";
import "@vueuse/core";
function useDetailForm(props) {
  console.log(props);
  const dictOptionsMap = {};
  const currentLinkFields = [];
  const detailFormData = ref({});
  const { createMessage } = useMessage();
  const formContainerClass = computed(() => {
    if (props.containerClass) {
      return `jeecg-detail-form ${props.containerClass}`;
    } else {
      return "jeecg-detail-form";
    }
  });
  watch(
    () => props.data,
    (formData) => __async(this, null, function* () {
      if (formData) {
        let arr = props.schemas;
        let temp = {};
        if (arr && arr.length > 0) {
          for (let item of arr) {
            let field = item.field;
            try {
              temp[field] = yield getItemContent(item);
            } catch (e) {
              console.error("\u5B57\u6BB5\u3010" + field + "\u3011\u6587\u672C\u83B7\u53D6\u5931\u8D25", e);
            }
          }
        }
        detailFormData.value = temp;
      }
    }),
    { deep: true, immediate: true }
  );
  function getItemContent(item) {
    return __async(this, null, function* () {
      let formData = props.data;
      if (formData) {
        let value = formData[item.field];
        if (!value && value !== "0" && value !== 0) {
          return "";
        }
        let str = value;
        let view = item.view;
        if (view == "list" || view == "radio" || view == "checkbox" || view == "list_multi") {
          str = yield getSelectText(item, formData);
        } else if (view == "sel_search") {
          str = yield getTableDataText(item, formData);
        } else if (view == "cat_tree") {
          str = yield getCategoryDataText(item, formData);
        } else if (view == "link_table") {
          str = yield getLinkTableData(item, formData);
        } else if (view == "sel_depart") {
          str = yield getDepartDataText(item, formData);
        } else if (view == "sel_user") {
          str = yield getUserDataText(item, formData);
        } else if (view == "pca") {
          str = getAreaTextByCode(value);
        } else if (view == "link_down") {
          str = yield getLinkDownDataText(item, formData);
        } else if (view == "sel_tree") {
          str = yield getTreeDataText(item, formData);
        } else if (view == "switch") {
          str = yield getSwitchDataText(item, formData);
        } else if (view == "image" || view == "file") {
          str = getFileList(item, formData);
        } else {
          if (currentLinkFields.indexOf(item.field) >= 0) {
            let arr = dictOptionsMap[item.field];
            if (arr && arr.length > 0) {
              str = filterMultiDictText(arr, value);
            }
          }
        }
        return str;
      }
      return "";
    });
  }
  function getSelectText(item, formData) {
    return __async(this, null, function* () {
      let dictCode = getRequestDictCode(item);
      let value = formData[item.field];
      if (!dictCode) {
        return value;
      }
      let options = getDictItemsByCode(dictCode);
      if (options && options.length > 0) {
        return filterMultiDictText(options, value);
      } else {
        let dictRes = [];
        if (dictOptionsMap[dictCode]) {
          dictRes = dictOptionsMap[dictCode];
        } else {
          dictRes = (yield initDictOptions(dictCode)) || [];
        }
        if (dictRes && dictRes.length > 0) {
          dictOptionsMap[dictCode] = dictRes;
          return filterMultiDictText(dictRes, value);
        }
      }
      return "";
    });
  }
  function getRequestDictCode(item) {
    let temp = "";
    let { dictCode, dictTable, dictText } = item;
    if (!dictTable) {
      temp = dictCode;
    } else {
      temp = encodeURI(`${dictTable},${dictText},${dictCode}`);
    }
    return temp;
  }
  function getTableDataText(item, formData) {
    return __async(this, null, function* () {
      let dictCode = getRequestDictCode(item);
      let value = formData[item.field];
      if (!value) {
        return "";
      }
      let arr = [];
      if (dictOptionsMap[dictCode + value]) {
        arr = dictOptionsMap[dictCode + value];
      } else {
        arr = (yield defHttp.get({ url: `/sys/dict/loadDictItem/${dictCode}`, params: { key: value } })) || [];
      }
      if (arr && arr.length > 0) {
        dictOptionsMap[dictCode + value] = arr;
        return arr.join(",");
      }
      return "";
    });
  }
  function getCategoryDataText(item, formData) {
    return __async(this, null, function* () {
      let value = formData[item.field];
      if (!value) {
        return "";
      }
      let arr = (yield loadDictItem({ ids: value })) || [];
      if (arr && arr.length > 0) {
        return arr.join(",");
      }
      return "";
    });
  }
  function getDepartDataText(item, formData) {
    return __async(this, null, function* () {
      let value = formData[item.field];
      if (!value) {
        return "";
      }
      let extend = getExtendConfig(item);
      let storeField = extend.store || "id";
      let arr = (yield queryDepartTreeSync({ ids: value, primaryKey: storeField })) || [];
      if (arr && arr.length > 0) {
        let temp = [];
        for (let item2 of arr) {
          temp.push(item2.title);
        }
        return temp.join(",");
      }
      return "";
    });
  }
  function getUserDataText(item, formData) {
    return __async(this, null, function* () {
      let value = formData[item.field];
      if (!value) {
        return "";
      }
      let extend = getExtendConfig(item);
      let storeField = extend.store || "username";
      let params = {
        [storeField]: value
      };
      let res = (yield getUserList(params)) || {};
      let arr = res.records || [];
      if (arr && arr.length > 0) {
        let temp = [];
        console.log("getUserDataText", arr);
        let textField = extend.text || "realname";
        for (let item2 of arr) {
          temp.push(item2[textField]);
        }
        return temp.join(",");
      }
      return "";
    });
  }
  function getExtendConfig(item) {
    let extend = {};
    let { fieldExtendJson } = item;
    if (fieldExtendJson) {
      if (typeof fieldExtendJson == "string") {
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
  function getLinkDownDataText(item, formData) {
    return __async(this, null, function* () {
      let { dictTable, field } = item;
      let arr = [];
      if (dictOptionsMap[field]) {
        arr = dictOptionsMap[field];
      } else {
        if (dictTable) {
          let json = JSON.parse(dictTable);
          if (json) {
            let { table, txt, key, linkField } = json;
            let dictCode = `${table},${txt},${key}`;
            let temp = (yield initDictOptions(dictCode)) || [];
            arr = [...temp];
            if (arr && arr.length > 0) {
              dictOptionsMap[field] = arr;
              if (linkField) {
                let fieldArray = linkField.split(",");
                for (let item2 of fieldArray) {
                  dictOptionsMap[item2] = arr;
                  currentLinkFields.push(item2);
                }
              }
            }
          }
        }
      }
      if (arr && arr.length > 0) {
        let value = formData[field];
        return filterMultiDictText(arr, value);
      }
      return "";
    });
  }
  function getTreeDataText(item, formData) {
    return __async(this, null, function* () {
      let { dict, field } = item;
      let arr = [];
      if (dictOptionsMap[field]) {
        arr = dictOptionsMap[field];
      } else {
        if (dict) {
          arr = yield initDictOptions(dict);
        }
      }
      if (arr && arr.length > 0) {
        let value = formData[field];
        return filterMultiDictText(arr, value);
      }
      return "";
    });
  }
  function getSwitchDataText(item, formData) {
    return __async(this, null, function* () {
      let { fieldExtendJson, field } = item;
      let options = ["Y", "N"];
      if (fieldExtendJson) {
        options = JSON.parse(fieldExtendJson);
      }
      let arr = [
        { value: options[0], text: "\u662F" },
        { value: options[1], text: "\u5426" },
        { value: options[0] + "", text: "\u662F" },
        { value: options[1] + "", text: "\u5426" }
      ];
      let value = formData[field];
      return filterDictText(arr, value);
    });
  }
  function getItemSpan(item) {
    if (item.span) {
      return item.span;
    }
    return props.span;
  }
  function getFileList(item, formData) {
    let str = formData[item.field];
    if (!str) {
      return [];
    }
    let arr = str.split(",");
    let result = [];
    for (let item2 of arr) {
      let src = getFileAccessHttpUrl(item2) || "";
      if (src) {
        result.push(src);
      }
    }
    return result;
  }
  function handleDownloadFile(url) {
    if (url) {
      window.open(url);
    }
  }
  function handleViewImage(field) {
    let values = detailFormData.value[field];
    if (!values || values.length == 0) {
      createMessage.warning("\u65E0\u56FE\u7247!");
      return;
    }
    createImgPreview({ imageList: values });
  }
  function getFilename(url) {
    if (!url) {
      return "";
    }
    return url.substring(url.lastIndexOf("/") + 1);
  }
  const span24ViewArray = ["file", "image", "markdown", "umeditor"];
  function getLabelWidthClass(item) {
    if (span24ViewArray.indexOf(item.view) >= 0) {
      if (props.span == 12) {
        return "span12";
      } else if (props.span == 8) {
        return "span8";
      } else if (props.span == 6) {
        return "span6";
      } else {
        return "span24";
      }
    }
    return "";
  }
  function getLinkTableData(item, formData) {
    return __async(this, null, function* () {
      let value = formData[item.field];
      let extend = getExtendConfig(item);
      if (extend.showType == "select") {
        if (!value) {
          return "";
        }
        return formData[item.field + "_dictText"];
      } else {
        if (!value) {
          return "";
        }
        return formData[item.field];
      }
    });
  }
  return {
    formContainerClass,
    detailFormData,
    getItemSpan,
    handleDownloadFile,
    handleViewImage,
    getFilename,
    getLabelWidthClass
  };
}
var DetailForm_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = defineComponent({
  name: "DetailForm",
  components: {
    DownloadOutlined,
    EyeOutlined,
    PaperClipOutlined,
    LinkTableCard
  },
  props: {
    span: propTypes.number.def(24),
    schemas: propTypes.array.def([]),
    data: propTypes.object.def({}),
    containerClass: propTypes.string.def("")
  },
  setup(props) {
    const { formContainerClass, detailFormData, getItemSpan, handleDownloadFile, handleViewImage, getFilename, getLabelWidthClass } = useDetailForm(props);
    return {
      formContainerClass,
      detailFormData,
      getItemSpan,
      handleDownloadFile,
      handleViewImage,
      getFilename,
      getLabelWidthClass
    };
  }
});
const _hoisted_1 = { class: "detail-item" };
const _hoisted_2 = ["title"];
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = {
  key: 1,
  class: "item-content",
  style: { "display": "block", "padding-top": "10px" }
};
const _hoisted_5 = { key: 0 };
const _hoisted_6 = {
  key: 2,
  class: "item-content"
};
const _hoisted_7 = { class: "ant-upload-list ant-upload-list-picture-card" };
const _hoisted_8 = {
  class: "ant-upload-list-picture-card-container",
  style: { "margin-top": "8px" }
};
const _hoisted_9 = {
  class: "ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card",
  "data-has-actions": "true"
};
const _hoisted_10 = { class: "ant-upload-list-item-info" };
const _hoisted_11 = ["src"];
const _hoisted_12 = { class: "ant-upload-list-item-actions" };
const _hoisted_13 = {
  key: 3,
  class: "item-content"
};
const _hoisted_14 = { class: "ant-upload-list ant-upload-list-text" };
const _hoisted_15 = { class: "" };
const _hoisted_16 = { class: "ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-text" };
const _hoisted_17 = { class: "ant-upload-list-item-info" };
const _hoisted_18 = { class: "ant-upload-span" };
const _hoisted_19 = { class: "ant-upload-text-icon" };
const _hoisted_20 = ["href"];
const _hoisted_21 = { class: "ant-upload-list-item-card-actions" };
const _hoisted_22 = {
  key: 4,
  class: "item-content"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_link_table_card = resolveComponent("link-table-card");
  const _component_download_outlined = resolveComponent("download-outlined");
  const _component_eye_outlined = resolveComponent("eye-outlined");
  const _component_paper_clip_outlined = resolveComponent("paper-clip-outlined");
  const _component_a_col = resolveComponent("a-col");
  const _component_a_row = resolveComponent("a-row");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.formContainerClass)
  }, [
    createVNode(_component_a_row, null, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.schemas, (item, index) => {
          return openBlock(), createBlock(_component_a_col, {
            key: index,
            span: _ctx.getItemSpan(item)
          }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                createElementVNode("div", {
                  class: normalizeClass(["item-title", _ctx.getLabelWidthClass(item)]),
                  title: item.label
                }, toDisplayString(item.label) + "\uFF1A ", 11, _hoisted_2),
                item.isHtml ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: "item-content",
                  innerHTML: _ctx.detailFormData[item.field]
                }, null, 8, _hoisted_3)) : item.isCard ? (openBlock(), createElementBlock("div", _hoisted_4, [
                  !_ctx.detailFormData[item.field] ? (openBlock(), createElementBlock("span", _hoisted_5)) : (openBlock(), createBlock(_component_link_table_card, {
                    key: 1,
                    disabled: "",
                    detail: "",
                    value: _ctx.detailFormData[item.field],
                    valueField: item.dictCode,
                    textField: item.dictText,
                    tableName: item.dictTable,
                    multi: item.multi
                  }, null, 8, ["value", "valueField", "textField", "tableName", "multi"]))
                ])) : item.isImage ? (openBlock(), createElementBlock("div", _hoisted_6, [
                  createElementVNode("div", _hoisted_7, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.detailFormData[item.field], (url) => {
                      return openBlock(), createElementBlock("div", _hoisted_8, [
                        createElementVNode("span", null, [
                          createElementVNode("div", _hoisted_9, [
                            createElementVNode("div", _hoisted_10, [
                              createElementVNode("img", {
                                src: url,
                                alt: "\u56FE\u7247\u4E0D\u5B58\u5728",
                                class: "ant-upload-list-item-image"
                              }, null, 8, _hoisted_11)
                            ]),
                            createElementVNode("span", _hoisted_12, [
                              createVNode(_component_download_outlined, {
                                onClick: ($event) => _ctx.handleDownloadFile(url)
                              }, null, 8, ["onClick"]),
                              createVNode(_component_eye_outlined, {
                                onClick: ($event) => _ctx.handleViewImage(item.field)
                              }, null, 8, ["onClick"])
                            ])
                          ])
                        ])
                      ]);
                    }), 256))
                  ])
                ])) : item.isFile ? (openBlock(), createElementBlock("div", _hoisted_13, [
                  createElementVNode("div", _hoisted_14, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.detailFormData[item.field], (url) => {
                      return openBlock(), createElementBlock("div", _hoisted_15, [
                        createElementVNode("span", null, [
                          createElementVNode("div", _hoisted_16, [
                            createElementVNode("div", _hoisted_17, [
                              createElementVNode("span", _hoisted_18, [
                                createElementVNode("div", _hoisted_19, [
                                  createVNode(_component_paper_clip_outlined)
                                ]),
                                createElementVNode("a", {
                                  href: url,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  class: "ant-upload-list-item-name"
                                }, toDisplayString(_ctx.getFilename(url)), 9, _hoisted_20),
                                createElementVNode("span", _hoisted_21, [
                                  createVNode(_component_download_outlined, {
                                    onClick: ($event) => _ctx.handleDownloadFile(url)
                                  }, null, 8, ["onClick"])
                                ])
                              ])
                            ])
                          ])
                        ])
                      ]);
                    }), 256))
                  ])
                ])) : (openBlock(), createElementBlock("div", _hoisted_22, toDisplayString(_ctx.detailFormData[item.field]), 1))
              ])
            ]),
            _: 2
          }, 1032, ["span"]);
        }), 128))
      ]),
      _: 1
    })
  ], 2);
}
var DetailForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-47915cc7"]]);
export { DetailForm as default };
