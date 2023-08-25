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
import { unref, isRef, watch, ref, h } from "vue";
import { useRouter } from "vue-router";
import { RadioGroup, Radio, Input } from "ant-design-vue";
import { useModal } from "/@/components/Modal";
import { useDrawer } from "/@/components/Drawer";
import { useListPage } from "/@/hooks/system/useListPage";
import { l as list, d as doCopyOnlineView, a as doSingleDelete, b as doSingleRemove, c as doBatchRemove, e as doBatchDelete, f as doDatabaseSync, g as doCopyTable } from "./CgformModal.js";
import { C as Clipboard } from "./clipboard.js";
import { useMessage } from "/@/hooks/web/useMessage";
import { buildUUID } from "/@/utils/uuid";
import { isArray } from "/@/utils/is";
var CgformPageType = /* @__PURE__ */ ((CgformPageType2) => {
  CgformPageType2[CgformPageType2["normal"] = 0] = "normal";
  CgformPageType2[CgformPageType2["copy"] = 1] = "copy";
  return CgformPageType2;
})(CgformPageType || {});
const COPY_CLASS = "copy-this-text";
const CLIPBOARD_TEXT = "data-clipboard-text";
function useCopyModal() {
  return { createCopyModal };
}
const { createMessage, createConfirm } = useMessage();
function createCopyModal(options) {
  var _a, _b, _c, _d, _e;
  const url = unref(options.copyText);
  const insertMenuSql = `INSERT INTO sys_permission(id, parent_id, name, url, component, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_route, is_leaf, keep_alive, hidden, hide_tab, description, status, del_flag, rule_flag, create_by, create_time, update_by, update_time, internal_or_external) 
                       VALUES ('${buildUUID()}', NULL, '${options.copyTitle}', '${url}', '1', NULL, NULL, 0, NULL, '1', 0.00, 0, NULL, 0, 1, 0, 0, 0, NULL, '1', 0, 0, 'admin', null, NULL, NULL, 0)`;
  let modal = createConfirm(__spreadProps(__spreadValues({}, options), {
    iconType: (_a = options.iconType) != null ? _a : "info",
    width: (_b = options.width) != null ? _b : 500,
    title: (_c = options.title) != null ? _c : "\u590D\u5236",
    closable: true,
    maskClosable: (_d = options.maskClosable) != null ? _d : true,
    cancelText: "\u590D\u5236SQL",
    okText: (_e = options.okText) != null ? _e : "\u590D\u5236URL",
    cancelButtonProps: {
      class: "copy-this-sql",
      "data-clipboard-text": insertMenuSql
    },
    okButtonProps: __spreadProps(__spreadValues({}, options.okButtonProps), {
      class: COPY_CLASS,
      [CLIPBOARD_TEXT]: url
    }),
    onOk() {
      return new Promise((resolve) => {
        const clipboard = new Clipboard("." + COPY_CLASS);
        clipboard.on("success", () => {
          clipboard.destroy();
          createMessage.success("\u590D\u5236URL\u6210\u529F");
          resolve();
        });
        clipboard.on("error", () => {
          createMessage.error("\u8BE5\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u81EA\u52A8\u590D\u5236");
          clipboard.destroy();
          resolve();
        });
      });
    },
    onCancel() {
      return new Promise((resolve) => {
        const clipboard = new Clipboard(".copy-this-sql");
        clipboard.on("success", () => {
          clipboard.destroy();
          createMessage.success("\u590D\u5236\u63D2\u5165\u83DC\u5355SQL\u6210\u529F");
          resolve();
        });
        clipboard.on("error", () => {
          createMessage.error("\u8BE5\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u81EA\u52A8\u590D\u5236");
          clipboard.destroy();
          resolve();
        });
      });
    }
  }));
  if (isRef(options.copyText)) {
    watch(options.copyText, (copyText) => {
      modal.update({
        okButtonProps: __spreadProps(__spreadValues({}, options.okButtonProps), {
          class: COPY_CLASS,
          [CLIPBOARD_TEXT]: copyText
        })
      });
    });
  }
  return modal;
}
function useCgformList(options) {
  const isNormalPage = options.pageType === CgformPageType.normal;
  const router = useRouter();
  const pageContext = useListPage({
    designScope: options.designScope,
    tableProps: {
      api: list,
      columns: options.columns,
      formConfig: {
        schemas: options.formSchemas
      },
      beforeFetch: (params) => {
        let copyType = isNormalPage ? 0 : 1;
        let physicId = isNormalPage ? void 0 : router.currentRoute.value.params.code;
        if (isArray(params.tableType_MultiString)) {
          params.tableType_MultiString = params.tableType_MultiString.join(",");
        }
        return Object.assign(params, { copyType, physicId });
      }
    }
  });
  const { tableContext, createMessage: $message, createConfirm: $confirm } = pageContext;
  const [, { reload, setLoading }, { selectedRowKeys, selectedRows }] = tableContext;
  const [registerCgformModal, cgformModal] = useModal();
  const [registerDbToOnlineModal, dbToOnlineModal] = useModal();
  const [registerCodeGeneratorModal, codeGeneratorModal] = useModal();
  const [registerCustomButtonModal, customButtonModal] = useModal();
  const [registerEnhanceJsModal, enhanceJsModal] = useModal();
  const [registerEnhanceSqlModal, enhanceSqlModal] = useModal();
  const [registerEnhanceJavaModal, enhanceJavaModal] = useModal();
  const [registerAuthManagerDrawer, authManagerDrawer] = useDrawer();
  const [registerAuthSetterModal, authSetterModal] = useModal();
  function onAdd() {
    cgformModal.openModal(true, { isUpdate: false });
  }
  function onEdit(record) {
    cgformModal.openModal(true, { isUpdate: true, record });
  }
  function handleDelete(id) {
    return __async(this, null, function* () {
      yield doSingleDelete(id);
      reload();
    });
  }
  function handleRemove(id) {
    return __async(this, null, function* () {
      yield doSingleRemove(id);
      reload();
    });
  }
  function onDeleteBatch() {
    let idList = selectedRowKeys.value;
    if (idList.length <= 0) {
      $message.warning("\u8BF7\u5148\u9009\u62E9\u4E00\u6761\u8BB0\u5F55\uFF01");
      return;
    }
    $confirm({
      title: "\u5220\u9664",
      content: "<p>\u79FB\u9664\u53EA\u4F1A\u5220\u9664\u8868\u5355\u914D\u7F6E\uFF1B<br>\u5220\u9664\u5219\u4F1A\u5220\u9664\u5BF9\u5E94\u7684\u6570\u636E\u5E93\u8868\u4EE5\u53CA\u5B50\u8868\u4E14\u4E0D\u80FD\u6062\u590D\u3002<br>\u8BF7\u786E\u8BA4\u60A8\u7684\u64CD\u4F5C\u2026</p>",
      iconType: "warning",
      closable: true,
      okText: "\u79FB\u9664",
      cancelText: "\u5220\u9664",
      cancelButtonProps: { danger: true },
      onOk: () => __async(this, null, function* () {
        return executeDelete(doBatchRemove, idList, true);
      }),
      onCancel(event) {
        if (!(event == null ? void 0 : event.triggerCancel)) {
          return executeDelete(doBatchDelete, idList, true);
        }
        return Promise.resolve();
      }
    });
  }
  function executeDelete(fn, idList, clearSelected = false) {
    return __async(this, null, function* () {
      try {
        setLoading(true);
        const res = yield fn(idList);
        reload();
        if (clearSelected) {
          selectedRowKeys.value = [];
        }
        return res;
      } finally {
        setLoading(false);
      }
      return Promise.reject();
    });
  }
  function onShowCustomButton() {
    getSelectedRows(([row]) => customButtonModal.openModal(true, { row }));
  }
  function onShowEnhanceJs() {
    getSelectedRows(([row]) => enhanceJsModal.openModal(true, { row }));
  }
  function onShowEnhanceSql() {
    getSelectedRows(([row]) => enhanceSqlModal.openModal(true, { row }));
  }
  function onShowEnhanceJava() {
    getSelectedRows(([row]) => enhanceJavaModal.openModal(true, { row }));
  }
  function onImportDbTable() {
    dbToOnlineModal.openModal(true, {});
  }
  function getSelectedRows(fn, min = 1, max = 1) {
    if (selectedRows.value.length < min) {
      $message.warning(`\u8BF7\u5148\u81F3\u5C11\u9009\u4E2D ${min} \u6761\u8BB0\u5F55`);
    } else if (selectedRows.value.length > max) {
      $message.warning(`\u6700\u591A\u53EA\u80FD\u9009\u4E2D ${min} \u6761\u8BB0\u5F55`);
    } else {
      fn(selectedRows.value);
    }
  }
  function onGenerateCode() {
    if (selectedRows.value.length === 0) {
      $message.warning("\u8BF7\u5148\u9009\u4E2D\u4E00\u6761\u8BB0\u5F55");
    } else if (selectedRows.value.length > 1) {
      $message.warning("\u4EE3\u7801\u751F\u6210\u53EA\u80FD\u9009\u4E2D\u4E00\u6761\u8BB0\u5F55");
    } else {
      let row = selectedRows.value[0];
      if (!row) {
        $message.warning("\u8BF7\u9009\u4E2D\u5F53\u524D\u9875\u7684\u6570\u636E\uFF01");
      } else if (row.isDbSynch != "Y") {
        $message.warning("\u8BF7\u5148\u540C\u6B65\u6570\u636E\u5E93\uFF01");
      } else if (row.tableType == 3) {
        $message.warning("\u8BF7\u9009\u4E2D\u8BE5\u8868\u5BF9\u5E94\u7684\u4E3B\u8868");
      } else {
        codeGeneratorModal.openModal(true, { code: row.id });
      }
    }
  }
  function onGoToTest(record) {
    console.log(record);
    if (record.isTree == "Y") {
      router.push({ path: "/online/cgformTreeList/" + record.id });
    } else {
      router.push({ path: "/online/cgformList/" + record.id });
    }
  }
  function onSyncDatabase(record) {
    const syncMethod = ref("normal");
    const disabled = ref(false);
    const modalFunc = $confirm({
      iconType: "info",
      title: "\u540C\u6B65\u6570\u636E\u5E93",
      content: () => h(
        "div",
        {
          style: "margin: 20px 0;"
        },
        h(
          RadioGroup,
          {
            value: syncMethod.value,
            disabled: disabled.value,
            "onUpdate:value": (v) => syncMethod.value = v
          },
          () => [h(Radio, { value: "normal" }, () => "\u666E\u901A\u540C\u6B65\uFF08\u4FDD\u7559\u8868\u6570\u636E\uFF09"), h(Radio, { value: "force" }, () => "\u5F3A\u5236\u540C\u6B65\uFF08\u5220\u9664\u8868\uFF0C\u91CD\u65B0\u751F\u6210\uFF09")]
        )
      ),
      maskClosable: true,
      okText: "\u5F00\u59CB\u540C\u6B65",
      onOk() {
        return __async(this, null, function* () {
          disabled.value = true;
          modalFunc.update({
            maskClosable: false,
            keyboard: false,
            okText: "\u540C\u6B65\u4E2D\u2026",
            okButtonProps: { loading: disabled.value },
            cancelButtonProps: { disabled: disabled.value }
          });
          try {
            yield doDatabaseSync(record.id, syncMethod.value);
          } catch (e) {
            $message.warn(e.message || e);
          } finally {
            reload();
          }
        });
      }
    });
  }
  const { createCopyModal: createCopyModal2 } = useCopyModal();
  function onShowOnlineUrl(record) {
    let onlineUrl;
    if (record.themeTemplate === "erp") {
      onlineUrl = `/online/cgformErpList/${record.id}`;
    } else if (record.themeTemplate === "innerTable") {
      onlineUrl = `/online/cgformInnerTableList/${record.id}`;
    } else if (record.themeTemplate === "tab") {
      onlineUrl = `/online/cgformTabList/${record.id}`;
    } else if (record.isTree == "Y") {
      onlineUrl = `/online/cgformTreeList/${record.id}`;
    } else {
      onlineUrl = `/online/cgformList/${record.id}`;
    }
    createCopyModal2({
      title: `\u83DC\u5355\u94FE\u63A5\u3010${record.tableTxt}\u3011`,
      content: onlineUrl,
      copyText: onlineUrl,
      copyTitle: `${record.tableTxt}`
    });
  }
  function onCopyTable(record) {
    const tableName = ref(record.tableName + "_copy");
    $confirm({
      title: "\u590D\u5236\u8868",
      content: () => h(
        "div",
        {
          style: "margin: 20px 0;"
        },
        [
          "\u8BF7\u8F93\u5165\u65B0\u8868\u540D\uFF1A",
          h(Input, {
            value: tableName.value,
            "onUpdate:value": (v) => tableName.value = v
          })
        ]
      ),
      iconType: "info",
      closable: true,
      okText: "\u590D\u5236",
      onOk() {
        if (!tableName.value) {
          $message.warning("\u8BF7\u8F93\u5165\u65B0\u8868\u540D");
        } else if (tableName.value === record.tableName) {
          $message.warning("\u65B0\u8868\u540D\u548C\u65E7\u8868\u540D\u4E0D\u80FD\u4E00\u81F4");
        } else {
          doCopyTable(record.id, tableName.value).then(reload);
        }
      }
    });
  }
  function getTableAction(record) {
    return [
      {
        label: "\u7F16\u8F91",
        onClick: () => onEdit(record)
      }
    ];
  }
  function getDropDownAction(record) {
    return [
      {
        label: "\u540C\u6B65\u6570\u636E\u5E93",
        onClick: () => onSyncDatabase(record),
        ifShow: () => isNormalPage && record.isDbSynch != "Y"
      },
      {
        label: "\u529F\u80FD\u6D4B\u8BD5",
        class: ["low-app-hide"],
        onClick: () => onGoToTest(record),
        ifShow: () => isNormalPage ? record.isDbSynch == "Y" && record.tableType !== 3 : true
      },
      {
        label: "\u914D\u7F6E\u5730\u5740",
        class: ["low-app-hide"],
        onClick: () => onShowOnlineUrl(record),
        ifShow: () => isNormalPage ? record.isDbSynch == "Y" && record.tableType !== 3 : true
      },
      {
        label: "\u6743\u9650\u63A7\u5236",
        onClick: () => authManagerDrawer.openDrawer(true, { cgformId: record.id })
      },
      {
        label: "\u89D2\u8272\u6388\u6743",
        onClick: () => authSetterModal.openModal(true, { cgformId: record.id })
      },
      {
        label: "\u89C6\u56FE\u7BA1\u7406",
        class: ["low-app-hide"],
        onClick: () => router.push(`/online/copyform/${record.id}`),
        ifShow: () => isNormalPage && record.hascopy == 1
      },
      {
        label: "\u751F\u6210\u89C6\u56FE",
        class: ["low-app-hide"],
        popConfirm: {
          title: "\u786E\u5B9A\u751F\u6210\u89C6\u56FE\u5417\uFF1F",
          placement: "left",
          confirm: () => {
            setLoading(true);
            doCopyOnlineView(record.id).then(() => {
              $message.success("\u5DF2\u6210\u529F\u751F\u6210\u89C6\u56FE");
            }).finally(() => {
              setLoading(false);
              reload();
            });
          }
        },
        ifShow: () => isNormalPage
      },
      {
        label: "\u590D\u5236\u8868",
        onClick: () => onCopyTable(record),
        ifShow: () => isNormalPage
      },
      {
        label: "\u79FB\u9664",
        popConfirm: {
          title: "\u786E\u5B9A\u79FB\u9664\u5417\uFF1F",
          placement: "left",
          confirm: () => handleRemove(record.id)
        }
      },
      {
        label: "\u5220\u9664",
        popConfirm: {
          title: "\u786E\u5B9A\u5220\u9664\u5417\uFF1F",
          placement: "left",
          confirm: () => handleDelete(record.id)
        },
        ifShow: () => isNormalPage
      }
    ];
  }
  return {
    router,
    pageContext,
    onAdd,
    onDeleteBatch,
    onImportDbTable,
    onGenerateCode,
    onShowCustomButton,
    onShowEnhanceJs,
    onShowEnhanceSql,
    onShowEnhanceJava,
    getTableAction,
    getDropDownAction,
    registerCustomButtonModal,
    registerEnhanceJsModal,
    registerEnhanceSqlModal,
    registerEnhanceJavaModal,
    registerAuthManagerDrawer,
    registerAuthSetterModal,
    registerCgformModal,
    registerDbToOnlineModal,
    registerCodeGeneratorModal
  };
}
export { CgformPageType as C, useCgformList as u };
