const import_meta = {};
import JPopupOnlReport from '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import { defineComponent, resolveComponent, openBlock, createElementBlock, createVNode, defineAsyncComponent } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { useRoute } from 'vue-router';
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = defineComponent({
  name: 'OnlCgReportList',
  components: {
    JPopupOnlReport,
  },
  setup(props, { emit, refs }) {
    useMessage();
    const route = useRoute();
    const path = route.path;
    const id = path.substr(path.lastIndexOf('/') + 1);
    return {
      id,
    };
  },
});
const _hoisted_1 = { class: 'p-2' };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JPopupOnlReport = resolveComponent('JPopupOnlReport');
  return (
    openBlock(),
    createElementBlock('div', _hoisted_1, [
      createVNode(
        _component_JPopupOnlReport,
        {
          id: _ctx.id,
          clickToRowSelect: false,
        },
        null,
        8,
        ['id']
      ),
    ])
  );
}
var OnlCgReportList = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
var OnlCgReportList$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: OnlCgReportList,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
console.log('node_modules import.meta: ', import_meta);
var index = {
  install(app, options) {
    app.provide('baseImport', options.baseImport);
    app.component('OnlCgReportList', OnlCgReportList);
    const JOnlineSearchSelect = defineAsyncComponent(() => import('./JOnlineSearchSelect.js'));
    app.component('JOnlineSearchSelect', JOnlineSearchSelect);
    const SuperQuery = defineAsyncComponent(() => import('./SuperQuery.js'));
    app.component('SuperQuery', SuperQuery);
    console.log('--- online init ----');
  },
  getViews() {
    return {
      './src/views/super/online/cgform/CgformCopyList.vue': () => import('./CgformCopyList.js'),
      './src/views/super/online/cgform/index.vue': () => import('./index2.js'),
      './src/views/super/online/cgreport/index.vue': () => import('./index3.js'),
      './src/views/super/online/cgform/components/CgformModal.vue': () =>
        import('./CgformModal.js').then(function (n) {
          return n.h;
        }),
      './src/views/super/online/cgform/components/DbToOnlineModal.vue': () => import('./DbToOnlineModal.js'),
      './src/views/super/online/cgform/components/ExtendConfigModal.vue': () => import('./ExtendConfigModal.js'),
      './src/views/super/online/cgform/components/FileSelectModal.vue': () => import('./FileSelectModal.js'),
      './src/views/super/online/cgform/extend/FieldExtendJsonModal.vue': () => import('./FieldExtendJsonModal.js'),
      './src/views/super/online/cgreport/auto/OnlCgReportList.vue': () =>
        Promise.resolve().then(function () {
          return OnlCgReportList$1;
        }),
      './src/views/super/online/cgreport/components/CgreportModal.vue': () =>
        import('./CgreportModal.js').then(function (n) {
          return n.C;
        }),
      './src/views/super/online/cgreport/demo/ModalFormDemo.vue': () => import('./ModalFormDemo.js'),
      './src/views/super/online/cgform/auto/comp/JOnlineSearchSelect.vue': () => import('./JOnlineSearchSelect.js'),
      './src/views/super/online/cgform/auto/comp/OnlineForm.vue': () =>
        import('./OnlineForm.js').then(function (n) {
          return n.a;
        }),
      './src/views/super/online/cgform/auto/comp/OnlineFormDetail.vue': () => import('./OnlineFormDetail.js'),
      './src/views/super/online/cgform/auto/comp/OnlinePopForm.vue': () =>
        import('./useExtendComponent.js').then(function (n) {
          return n.s;
        }),
      './src/views/super/online/cgform/auto/comp/OnlinePopListModal.vue': () =>
        import('./useExtendComponent.js').then(function (n) {
          return n.w;
        }),
      './src/views/super/online/cgform/auto/comp/OnlinePopModal.vue': () =>
        import('./useExtendComponent.js').then(function (n) {
          return n.t;
        }),
      './src/views/super/online/cgform/auto/comp/OnlineQueryForm.vue': () => import('./OnlineQueryForm.js'),
      './src/views/super/online/cgform/auto/comp/OnlineSearchFormItem.vue': () => import('./OnlineSearchFormItem.js'),
      './src/views/super/online/cgform/auto/comp/OnlineSelectCascade.vue': () => import('./OnlineSelectCascade.js'),
      './src/views/super/online/cgform/auto/comp/OnlineSubForm.vue': () =>
        import('./useExtendComponent.js').then(function (n) {
          return n.r;
        }),
      './src/views/super/online/cgform/auto/comp/OnlineSubFormDetail.vue': () => import('./OnlineSubFormDetail.js'),
      './src/views/super/online/cgform/auto/comp/ProcessOnlineForm.vue': () => import('./ProcessOnlineForm.js'),
      './src/views/super/online/cgform/auto/default/OnlineAutoList.vue': () => import('./OnlineAutoList.js'),
      './src/views/super/online/cgform/auto/default/OnlineAutoModal.vue': () => import('./OnlineAutoModal.js'),
      './src/views/super/online/cgform/auto/default/OnlineCustomModal.vue': () => import('./OnlineCustomModal.js'),
      './src/views/super/online/cgform/auto/default/OnlineDetailModal.vue': () => import('./OnlineDetailModal.js'),
      './src/views/super/online/cgform/auto/tree/OnlineAutoTreeList.vue': () => import('./OnlineAutoTreeList.js'),
      './src/views/super/online/cgform/components/auth/AuthManagerDrawer.vue': () => import('./AuthManagerDrawer.js'),
      './src/views/super/online/cgform/components/auth/AuthSetterModal.vue': () => import('./AuthSetterModal.js'),
      './src/views/super/online/cgform/components/button/CustomButtonList.vue': () => import('./CustomButtonList.js'),
      './src/views/super/online/cgform/components/enhance/EnhanceJavaModal.vue': () => import('./EnhanceJavaModal.js'),
      './src/views/super/online/cgform/components/enhance/EnhanceJsHistory.vue': () =>
        import('./EnhanceJsHistory.js').then(function (n) {
          return n.a;
        }),
      './src/views/super/online/cgform/components/enhance/EnhanceJsModal.vue': () => import('./EnhanceJsModal.js'),
      './src/views/super/online/cgform/components/enhance/EnhanceSqlModal.vue': () => import('./EnhanceSqlModal.js'),
      './src/views/super/online/cgform/components/tables/CheckDictTable.vue': () => import('./CheckDictTable.js'),
      './src/views/super/online/cgform/components/tables/DBAttributeTable.vue': () => import('./DBAttributeTable.js'),
      './src/views/super/online/cgform/components/tables/ForeignKeyTable.vue': () => import('./ForeignKeyTable.js'),
      './src/views/super/online/cgform/components/tables/IndexTable.vue': () => import('./IndexTable.js'),
      './src/views/super/online/cgform/components/tables/PageAttributeTable.vue': () => import('./PageAttributeTable.js'),
      './src/views/super/online/cgform/components/tables/QueryTable.vue': () => import('./QueryTable.js'),
      './src/views/super/online/cgform/extend/form/DetailForm.vue': () => import('./DetailForm.js'),
      './src/views/super/online/cgform/extend/linkTable/JModalTip.vue': () => import('./JModalTip.js'),
      './src/views/super/online/cgform/extend/linkTable/LinkTableCard.vue': () =>
        import('./useExtendComponent.js').then(function (n) {
          return n.x;
        }),
      './src/views/super/online/cgform/extend/linkTable/LinkTableConfigModal.vue': () => import('./LinkTableConfigModal.js'),
      './src/views/super/online/cgform/extend/linkTable/LinkTableFieldConfigModal.vue': () => import('./LinkTableFieldConfigModal.js'),
      './src/views/super/online/cgform/extend/linkTable/LinkTableListPiece.vue': () => import('./LinkTableListPiece.js'),
      './src/views/super/online/cgform/extend/linkTable/LinkTableSelect.vue': () =>
        import('./useExtendComponent.js').then(function (n) {
          return n.v;
        }),
      './src/views/super/online/cgform/auto/comp/superquery/SuperQuery.vue': () => import('./SuperQuery.js'),
      './src/views/super/online/cgform/auto/comp/superquery/SuperQueryValComponent.vue': () => import('./SuperQueryValComponent.js'),
      './src/views/super/online/cgform/components/auth/manager/AuthButtonConfig.vue': () => import('./AuthButtonConfig.js'),
      './src/views/super/online/cgform/components/auth/manager/AuthDataConfig.vue': () => import('./AuthDataConfig.js'),
      './src/views/super/online/cgform/components/auth/manager/AuthFieldConfig.vue': () => import('./AuthFieldConfig.js'),
      './src/views/super/online/cgform/components/auth/setter/AuthButtonTree.vue': () => import('./AuthButtonTree.js'),
      './src/views/super/online/cgform/components/auth/setter/AuthDataTree.vue': () => import('./AuthDataTree.js'),
      './src/views/super/online/cgform/components/auth/setter/AuthFieldTree.vue': () => import('./AuthFieldTree.js'),
      './src/views/super/online/cgform/components/auth/setter/LeftDepart.vue': () => import('./LeftDepart.js'),
      './src/views/super/online/cgform/components/auth/setter/LeftRole.vue': () => import('./LeftRole.js'),
      './src/views/super/online/cgform/components/auth/setter/LeftUser.vue': () => import('./LeftUser.js'),
    };
  },
};
const OnlineSelectCascade = defineAsyncComponent(() => import('./OnlineSelectCascade.js'));
const LinkTableCard = defineAsyncComponent(() =>
  import('./useExtendComponent.js').then(function (n) {
    return n.x;
  })
);
const LinkTableSelect = defineAsyncComponent(() =>
  import('./useExtendComponent.js').then(function (n) {
    return n.v;
  })
);
export { LinkTableCard as L, OnlineSelectCascade as O, _export_sfc as _, LinkTableSelect as a, index as i };
