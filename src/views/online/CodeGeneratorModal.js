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
import { defineComponent, ref, computed, reactive, nextTick, resolveComponent, openBlock, createElementBlock, Fragment, createVNode, withCtx, createBlock, mergeProps, createCommentVNode } from "vue";
import { defHttp } from "/@/utils/http/axios";
import { BasicForm, useForm } from "/@/components/Form";
import { BasicModal, useModalInner, useModal } from "/@/components/Modal";
import { JVxeTypes } from "/@/components/jeecg/JVxeTable/types";
import { b as useCodeGeneratorFormSchemas } from "./useSchemas.js";
import { underLine2CamelCase } from "/@/utils/common/compUtils";
import CodeFileListModal from "./CodeFileListModal.js";
import FileSelectModal from "./FileSelectModal.js";
import { _ as _export_sfc } from "./index.js";
import "ant-design-vue";
import "@ant-design/icons-vue";
import "/@/hooks/web/usePermission";
import "/@/utils/helper/validator";
import "./CodeFileViewModal.js";
import "/@/hooks/web/useMessage";
import "/@/utils/file/download";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "vue-router";
const _sfc_main = defineComponent({
  name: "CodeGenerator",
  components: { BasicForm, BasicModal, FileSelectModal, CodeFileListModal },
  emits: ["register"],
  setup(props) {
    const JEECG_ONL_PROJECT_PATH = "JEECG_ONL_PROJECT_PATH";
    const single = ref(true);
    const subTableRef = ref();
    const modalWidth = computed(() => single.value ? 800 : 1200);
    const title = ref("\u4EE3\u7801\u751F\u6210");
    const confirmLoading = ref(false);
    const code = ref("");
    const metaModel = reactive({
      projectPath: "",
      packageStyle: "service",
      jspMode: "",
      jformType: "1",
      tableName_tmp: "",
      ftlDescription: "",
      entityName: "",
      codeTypes: "controller,service,dao,mapper,entity,vue"
    });
    const model = reactive({});
    const jspModeOptions = ref([]);
    const subTable = reactive({
      dataSource: [],
      columns: [
        {
          title: "\u5B50\u8868\u540D",
          key: "tableName",
          type: JVxeTypes.input,
          disabled: true,
          validateRules: [{ required: true, message: "\u8BF7\u8F93\u5165${title}" }]
        },
        {
          title: "\u5B50\u8868\u5B9E\u4F53",
          key: "entityName",
          type: JVxeTypes.input,
          validateRules: [{ required: true, message: "\u8BF7\u8F93\u5165${title}" }]
        },
        {
          title: "\u529F\u80FD\u8BF4\u660E",
          key: "ftlDescription",
          type: JVxeTypes.input,
          validateRules: [{ required: true, message: "\u8BF7\u8F93\u5165${title}" }]
        }
      ]
    });
    const showSubTable = computed(() => subTable.dataSource.length > 0);
    const { formSchemas } = useCodeGeneratorFormSchemas(
      props,
      {
        onProjectPathChange,
        onProjectPathSearch,
        jspModeOptions
      },
      single
    );
    const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
      schemas: formSchemas,
      showActionButtonGroup: false,
      labelAlign: "right"
    });
    const [registerModal, { closeModal }] = useModalInner((data) => __async(this, null, function* () {
      yield resetFields();
      code.value = data.code;
      confirmLoading.value = false;
      subTable.dataSource = [];
      jspModeOptions.value = [];
      getStoreProjectPath();
      Object.assign(model, metaModel);
      loadData();
    }));
    function loadData() {
      return __async(this, null, function* () {
        let { main, sub, jspModeList, projectPath } = yield defHttp.get({
          url: "/online/cgform/head/tableInfo",
          params: { code: code.value }
        });
        let jspModeListForVue3 = [];
        for (let mode of jspModeList) {
          const { code: code2, note } = mode;
          if (code2 == "many")
            ;
          else {
            jspModeListForVue3.push({
              label: note,
              value: code2
            });
          }
        }
        jspModeOptions.value = jspModeListForVue3;
        if (main.isTree == "Y") {
          model.jspMode = "tree";
        } else {
          model.jspMode = jspModeListForVue3[0].value;
        }
        single.value = main.tableType == 1;
        title.value = "\u4EE3\u7801\u751F\u6210\u3010" + main.tableName + "\u3011";
        if (!model.projectPath) {
          model.projectPath = projectPath;
          window.localStorage.setItem(JEECG_ONL_PROJECT_PATH, projectPath);
        }
        model.jformType = main.tableType + "";
        model.tableName_tmp = main.tableName;
        model.ftlDescription = main.tableTxt;
        let entityNameTemp = underLine2CamelCase(main.tableName);
        model.entityName = entityNameTemp.substring(0, 1).toUpperCase() + entityNameTemp.substring(1);
        yield nextTick();
        setFieldsValue(model);
        if (sub && sub.length > 0) {
          subTable.dataSource = sub.map((item) => ({
            tableName: item.tableName,
            entityName: getCamelCase(item.tableName),
            ftlDescription: item.tableTxt
          }));
        }
      });
    }
    const [registerCodeFileListModal, { openModal: openCodeFileListModal }] = useModal();
    function onSubmit() {
      return __async(this, null, function* () {
        try {
          const values = yield validate();
          let params = Object.assign({}, values, { code: code.value, tableName: values.tableName_tmp });
          if (showSubTable.value) {
            let errMap = yield subTableRef.value.validateTable();
            if (errMap) {
              return;
            }
            params.subList = subTableRef.value.getTableData();
          }
          confirmLoading.value = true;
          let res = yield codeGen(params);
          openCodeFileListModal(true, {
            codeList: res.codeList,
            pathKey: res.pathKey,
            tableName: values.tableName_tmp
          });
          closeModal();
        } catch (e) {
          console.error(e);
        } finally {
          confirmLoading.value = false;
        }
      });
    }
    function codeGen(params) {
      return new Promise((resolve, reject) => {
        defHttp.post({ url: "/online/cgform/api/codeGenerate", params }, { isTransformResponse: false }).then((res) => {
          if (res.success) {
            let codeList = res.result;
            let pathKey = res.message;
            resolve({
              codeList,
              pathKey
            });
          } else {
            this.$message.error(res.message);
            reject(res.message);
          }
        });
      });
    }
    function onCancel() {
      closeModal();
    }
    const [registerFileSelectModal, fileSelectModal] = useModal();
    function onProjectPathSearch() {
      fileSelectModal.openModal(true, {});
    }
    function onFileSelect(url) {
      window.localStorage.setItem(JEECG_ONL_PROJECT_PATH, url);
      setFieldsValue({ projectPath: url });
    }
    function getCamelCase(val) {
      let temp = underLine2CamelCase(val);
      return temp.substring(0, 1).toUpperCase() + temp.substring(1);
    }
    function getStoreProjectPath() {
      let path = window.localStorage.getItem(JEECG_ONL_PROJECT_PATH);
      if (path) {
        metaModel.projectPath = path;
      }
    }
    function onProjectPathChange(e) {
      if (e.target.value)
        window.localStorage.setItem(JEECG_ONL_PROJECT_PATH, e.target.value);
    }
    return {
      title,
      modalWidth,
      confirmLoading,
      subTable,
      showSubTable,
      onSubmit,
      onCancel,
      onFileSelect,
      registerFileSelectModal,
      subTableRef,
      registerForm,
      registerModal,
      registerCodeFileListModal
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicForm = resolveComponent("BasicForm");
  const _component_JVxeTable = resolveComponent("JVxeTable");
  const _component_a_card = resolveComponent("a-card");
  const _component_a_spin = resolveComponent("a-spin");
  const _component_BasicModal = resolveComponent("BasicModal");
  const _component_FileSelectModal = resolveComponent("FileSelectModal");
  const _component_code_file_list_modal = resolveComponent("code-file-list-modal");
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(_component_BasicModal, {
      onRegister: _ctx.registerModal,
      title: _ctx.title,
      width: _ctx.modalWidth,
      confirmLoading: _ctx.confirmLoading,
      okText: "\u5F00\u59CB\u751F\u6210",
      cancelText: "\u53D6\u6D88",
      onOk: _ctx.onSubmit,
      onCancel: _ctx.onCancel
    }, {
      default: withCtx(() => [
        createVNode(_component_a_spin, { spinning: _ctx.confirmLoading }, {
          default: withCtx(() => [
            createVNode(_component_BasicForm, { onRegister: _ctx.registerForm }, null, 8, ["onRegister"]),
            _ctx.showSubTable ? (openBlock(), createBlock(_component_a_card, {
              key: 0,
              title: "\u5B50\u8868\u4FE1\u606F",
              size: "small"
            }, {
              default: withCtx(() => [
                createVNode(_component_JVxeTable, mergeProps({
                  ref: "subTableRef",
                  rowNumber: "",
                  maxHeight: 580
                }, _ctx.subTable), null, 16)
              ]),
              _: 1
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["spinning"])
      ]),
      _: 1
    }, 8, ["onRegister", "title", "width", "confirmLoading", "onOk", "onCancel"]),
    createVNode(_component_FileSelectModal, {
      onRegister: _ctx.registerFileSelectModal,
      onSelect: _ctx.onFileSelect
    }, null, 8, ["onRegister", "onSelect"]),
    createVNode(_component_code_file_list_modal, { onRegister: _ctx.registerCodeFileListModal }, null, 8, ["onRegister"])
  ], 64);
}
var CodeGeneratorModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CodeGeneratorModal as default };
