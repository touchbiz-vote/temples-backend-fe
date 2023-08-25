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
import { useMessage } from "/@/hooks/web/useMessage";
import { ref, watch, resolveComponent, openBlock, createBlock } from "vue";
import { BasicForm } from "/@/components/Form/index";
import { defHttp } from "/@/utils/http/axios";
import { h as getDetailFormSchemas, g as getRefPromise } from "./useExtendComponent.js";
import { Loading } from "/@/components/Loading";
import DetailForm from "./DetailForm.js";
import { _ as _export_sfc } from "./index.js";
import "/@/components/Form/src/componentMap";
import "/@/utils/propTypes";
import "@ant-design/icons-vue";
import "/@/components/Modal";
import "/@/components/Form/src/jeecg/components/JUpload";
import "/@/views/system/user/user.api";
import "./_commonjsHelpers.js";
import "/@/store/modules/user";
import "/@/utils";
import "/@/utils/desform/customExpression";
import "/@/store/modules/permission";
import "/@/utils/dict/JDictSelectUtil";
import "/@/utils/common/compUtils";
import "./pick.js";
import "./_flatRest.js";
import "./isArray.js";
import "./toString.js";
import "./_arrayPush.js";
import "/@/components/Table";
import "/@/hooks/system/useListPage";
import "vue-router";
import "/@/components/Form/src/utils/Area";
import "/@/components/Preview/index";
import "./LinkTableListPiece.js";
import "/@/components/jeecg/OnLine/JPopupOnlReport.vue";
import "./OnlineSelectCascade.js";
import "/@/utils/auth";
import "./JModalTip.js";
import "ant-design-vue";
import "@vueuse/core";
import "/@/utils/dict";
import "/@/utils/dict/index";
import "/@/api/common/api";
const baseUrl = "/online/cgform/api/subform";
const _sfc_main = {
  name: "OnlineSubFormDetail",
  components: {
    BasicForm,
    Loading,
    DetailForm
  },
  props: {
    properties: {
      type: Object,
      required: true
    },
    mainId: {
      type: String,
      default: ""
    },
    table: {
      type: String,
      default: ""
    },
    formTemplate: {
      type: Number,
      default: 1
    }
  },
  emits: ["formChange"],
  setup(props) {
    const formRendered = ref(false);
    const { createMessage: $message } = useMessage();
    const tableName = ref("");
    const subFormData = ref({});
    const { detailFormSchemas, createFormSchemas, formSpan } = getDetailFormSchemas(props);
    watch(
      () => props.table,
      () => {
        tableName.value = props.table;
      },
      { immediate: true }
    );
    watch(
      () => props.properties,
      () => {
        console.log("\u4E3B\u8868properties\u6539\u53D8", props.properties);
        formRendered.value = false;
        createFormSchemas(props.properties);
        formRendered.value = true;
      },
      { deep: true, immediate: true }
    );
    watch(
      () => props.mainId,
      () => {
        console.log("\u4E3B\u8868ID\u6539\u53D8", props.mainId);
        setTimeout(() => {
          resetSubForm();
        }, 100);
      },
      { immediate: true }
    );
    function resetSubForm() {
      return __async(this, null, function* () {
        yield getRefPromise(formRendered);
        subFormData.value = {};
        const { table, mainId } = props;
        if (!table || !mainId) {
          return;
        }
        let values = (yield loadData(table, mainId)) || {};
        subFormData.value = values;
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
      }).catch(() => {
        $message.warning("\u5B50\u8868\u83B7\u53D6\u6570\u636E\u5931\u8D25:" + table);
      });
    }
    return {
      detailFormSchemas,
      subFormData,
      formSpan
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_detail_form = resolveComponent("detail-form");
  return openBlock(), createBlock(_component_detail_form, {
    schemas: $setup.detailFormSchemas,
    data: $setup.subFormData,
    span: $setup.formSpan
  }, null, 8, ["schemas", "data", "span"]);
}
var OnlineSubFormDetail = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OnlineSubFormDetail as default };
