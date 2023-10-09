import {
  defineComponent,
  resolveComponent,
  openBlock,
  createElementBlock,
  Fragment,
  createElementVNode,
  normalizeClass,
  createVNode,
  mergeProps,
  withCtx,
  createTextVNode,
  createBlock,
  createCommentVNode,
} from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import { C as CgformModal } from './CgformModal.js';
import DbToOnlineModal from './DbToOnlineModal.js';
import CustomButtonList from './CustomButtonList.js';
import EnhanceJsModal from './EnhanceJsModal.js';
import EnhanceJavaModal from './EnhanceJavaModal.js';
import EnhanceSqlModal from './EnhanceSqlModal.js';
import AuthManagerDrawer from './AuthManagerDrawer.js';
import AuthSetterModal from './AuthSetterModal.js';
import { u as useCgformList, C as CgformPageType } from './useCgformList.js';
import { c as columns, s as searchFormSchema } from './cgform.data.js';
import { _ as _export_sfc } from './index.js';
import '/@/components/Icon';
import '/@/components/Modal';
import '/@/components/Form/index';
import '/@/hooks/web/useMessage';
import './useSchemas.js';
import 'ant-design-vue';
import '@ant-design/icons-vue';
import '/@/utils/common/compUtils';
import '/@/hooks/web/usePermission';
import '/@/utils/helper/validator';
import './DBAttributeTable.js';
import '/@/components/jeecg/JVxeTable/types';
import './useTableSync.js';
import './pick.js';
import './_flatRest.js';
import './isArray.js';
import './toString.js';
import './_arrayPush.js';
import '/@/utils/dict';
import '/@/utils/dict/JDictSelectUtil';
import '/@/utils/uuid';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
import './PageAttributeTable.js';
import './LinkTableConfigModal.js';
import '/@/utils/http/axios';
import './omit.js';
import './_baseClone.js';
import './_baseSlice.js';
import './LinkTableFieldConfigModal.js';
import './FieldExtendJsonModal.js';
import './CheckDictTable.js';
import '/@/components/jeecg/JPrompt';
import '/@/hooks/web/useDesign';
import './ForeignKeyTable.js';
import './IndexTable.js';
import './QueryTable.js';
import './ExtendConfigModal.js';
import '/@/components/Form';
import './useOnlineTest.js';
import '/@/utils';
import './useExtendComponent.js';
import '/@/components/Form/src/componentMap';
import '/@/utils/propTypes';
import '/@/components/Form/src/jeecg/components/JUpload';
import '/@/views/system/user/user.api';
import './_commonjsHelpers.js';
import '/@/store/modules/user';
import '/@/utils/desform/customExpression';
import '/@/store/modules/permission';
import '/@/hooks/system/useListPage';
import '/@/components/Form/src/utils/Area';
import '/@/components/Preview/index';
import './LinkTableListPiece.js';
import './OnlineSelectCascade.js';
import '/@/components/Loading';
import '/@/utils/auth';
import './JModalTip.js';
import '@vueuse/core';
import '/@/utils/file/download';
import './FileSelectModal.js';
import './EnhanceJsHistory.js';
import '/@/utils/dateUtil';
import '/@/store';
import 'pinia';
import '/@/utils/cache';
import './enhance.api.js';
import '/@/utils/is';
import './enhance.data.js';
import '/@/components/Drawer';
import './AuthFieldConfig.js';
import './auth.api.js';
import './auth.data.js';
import './AuthButtonConfig.js';
import './AuthDataConfig.js';
import './LeftRole.js';
import './LeftDepart.js';
import '/@/api/common/api';
import './LeftUser.js';
import './AuthFieldTree.js';
import './AuthButtonTree.js';
import './AuthDataTree.js';
import './clipboard.js';
const _sfc_main = defineComponent({
  name: 'CgformIndex',
  components: {
    BasicTable,
    TableAction,
    CgformModal,
    DbToOnlineModal,
    CustomButtonList,
    EnhanceJsModal,
    EnhanceJavaModal,
    EnhanceSqlModal,
    AuthManagerDrawer,
    AuthSetterModal,
  },
  setup() {
    const {
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
      registerAuthManagerDrawer,
      registerAuthSetterModal,
      registerCustomButtonModal,
      registerEnhanceJsModal,
      registerEnhanceSqlModal,
      registerEnhanceJavaModal,
      registerCgformModal,
      registerDbToOnlineModal,
    } = useCgformList({
      pageType: CgformPageType.normal,
      designScope: 'online-cgform-list',
      columns,
      formSchemas: searchFormSchema,
    });
    const { prefixCls, tableContext } = pageContext;
    const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
    return {
      prefixCls,
      reload,
      rowSelection,
      selectedRowKeys,
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
      registerAuthManagerDrawer,
      registerAuthSetterModal,
      registerCustomButtonModal,
      registerEnhanceJsModal,
      registerEnhanceSqlModal,
      registerEnhanceJavaModal,
      registerTable,
      registerCgformModal,
      registerDbToOnlineModal,
    };
  },
});
const _hoisted_1 = /* @__PURE__ */ createElementVNode('span', null, '\u5220\u9664', -1);
const _hoisted_2 = /* @__PURE__ */ createElementVNode('span', null, '\u6279\u91CF\u64CD\u4F5C', -1);
const _hoisted_3 = {
  key: 0,
  style: { color: 'limegreen' },
};
const _hoisted_4 = {
  key: 1,
  style: { color: 'red' },
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_a_button = resolveComponent('a-button');
  const _component_a_icon = resolveComponent('a-icon');
  const _component_a_menu_item = resolveComponent('a-menu-item');
  const _component_a_menu = resolveComponent('a-menu');
  const _component_a_dropdown = resolveComponent('a-dropdown');
  const _component_TableAction = resolveComponent('TableAction');
  const _component_BasicTable = resolveComponent('BasicTable');
  const _component_CgformModal = resolveComponent('CgformModal');
  const _component_DbToOnlineModal = resolveComponent('DbToOnlineModal');
  const _component_CustomButtonList = resolveComponent('CustomButtonList');
  const _component_EnhanceJsModal = resolveComponent('EnhanceJsModal');
  const _component_EnhanceJavaModal = resolveComponent('EnhanceJavaModal');
  const _component_EnhanceSqlModal = resolveComponent('EnhanceSqlModal');
  const _component_AuthManagerDrawer = resolveComponent('AuthManagerDrawer');
  const _component_AuthSetterModal = resolveComponent('AuthSetterModal');
  return (
    openBlock(),
    createElementBlock(
      Fragment,
      null,
      [
        createElementVNode(
          'div',
          {
            class: normalizeClass(_ctx.prefixCls),
          },
          [
            createVNode(
              _component_BasicTable,
              mergeProps(
                {
                  onRegister: _ctx.registerTable,
                  rowSelection: _ctx.rowSelection,
                },
                _ctx.$attrs
              ),
              {
                tableTitle: withCtx(() => [
                  createVNode(
                    _component_a_button,
                    {
                      onClick: _ctx.onAdd,
                      type: 'primary',
                      preIcon: 'ant-design:plus',
                    },
                    {
                      default: withCtx(() => [createTextVNode('\u65B0\u589E')]),
                      _: 1,
                    },
                    8,
                    ['onClick']
                  ),
                  createVNode(
                    _component_a_button,
                    {
                      onClick: _ctx.onShowCustomButton,
                      type: 'primary',
                      preIcon: 'ant-design:highlight',
                    },
                    {
                      default: withCtx(() => [createTextVNode('\u81EA\u5B9A\u4E49\u6309\u94AE')]),
                      _: 1,
                    },
                    8,
                    ['onClick']
                  ),
                  createVNode(
                    _component_a_button,
                    {
                      onClick: _ctx.onShowEnhanceJs,
                      type: 'primary',
                      preIcon: 'ant-design:strikethrough',
                    },
                    {
                      default: withCtx(() => [createTextVNode('JS\u589E\u5F3A')]),
                      _: 1,
                    },
                    8,
                    ['onClick']
                  ),
                  createVNode(
                    _component_a_button,
                    {
                      onClick: _ctx.onShowEnhanceSql,
                      type: 'primary',
                      preIcon: 'ant-design:filter',
                    },
                    {
                      default: withCtx(() => [createTextVNode(' SQL\u589E\u5F3A ')]),
                      _: 1,
                    },
                    8,
                    ['onClick']
                  ),
                  createVNode(
                    _component_a_button,
                    {
                      onClick: _ctx.onShowEnhanceJava,
                      type: 'primary',
                      preIcon: 'ant-design:tool',
                    },
                    {
                      default: withCtx(() => [createTextVNode('JAVA\u589E\u5F3A')]),
                      _: 1,
                    },
                    8,
                    ['onClick']
                  ),
                  createVNode(
                    _component_a_button,
                    {
                      onClick: _ctx.onImportDbTable,
                      type: 'primary',
                      preIcon: 'ant-design:database',
                    },
                    {
                      default: withCtx(() => [createTextVNode('\u5BFC\u5165\u6570\u636E\u5E93\u8868')]),
                      _: 1,
                    },
                    8,
                    ['onClick']
                  ),
                  _ctx.selectedRowKeys.length > 0
                    ? (openBlock(),
                      createBlock(
                        _component_a_dropdown,
                        { key: 0 },
                        {
                          overlay: withCtx(() => [
                            createVNode(_component_a_menu, null, {
                              default: withCtx(() => [
                                createVNode(
                                  _component_a_menu_item,
                                  {
                                    key: '1',
                                    onClick: _ctx.onDeleteBatch,
                                  },
                                  {
                                    default: withCtx(() => [createVNode(_component_a_icon, { type: 'delete' }), _hoisted_1]),
                                    _: 1,
                                  },
                                  8,
                                  ['onClick']
                                ),
                              ]),
                              _: 1,
                            }),
                          ]),
                          default: withCtx(() => [
                            createVNode(_component_a_button, null, {
                              default: withCtx(() => [_hoisted_2, createVNode(_component_a_icon, { type: 'down' })]),
                              _: 1,
                            }),
                          ]),
                          _: 1,
                        }
                      ))
                    : createCommentVNode('', true),
                ]),
                dbSync: withCtx(({ text }) => [
                  text === 'Y' ? (openBlock(), createElementBlock('span', _hoisted_3, '\u5DF2\u540C\u6B65')) : createCommentVNode('', true),
                  text === 'N' ? (openBlock(), createElementBlock('span', _hoisted_4, '\u672A\u540C\u6B65')) : createCommentVNode('', true),
                ]),
                action: withCtx(({ record }) => [
                  createVNode(
                    _component_TableAction,
                    {
                      actions: _ctx.getTableAction(record),
                      dropDownActions: _ctx.getDropDownAction(record),
                    },
                    null,
                    8,
                    ['actions', 'dropDownActions']
                  ),
                ]),
                _: 1,
              },
              16,
              ['onRegister', 'rowSelection']
            ),
          ],
          2
        ),
        createVNode(
          _component_CgformModal,
          {
            onRegister: _ctx.registerCgformModal,
            onSuccess: _ctx.reload,
          },
          null,
          8,
          ['onRegister', 'onSuccess']
        ),
        createVNode(
          _component_DbToOnlineModal,
          {
            onRegister: _ctx.registerDbToOnlineModal,
            onSuccess: _ctx.reload,
          },
          null,
          8,
          ['onRegister', 'onSuccess']
        ),
        createVNode(_component_CustomButtonList, { onRegister: _ctx.registerCustomButtonModal }, null, 8, ['onRegister']),
        createVNode(_component_EnhanceJsModal, { onRegister: _ctx.registerEnhanceJsModal }, null, 8, ['onRegister']),
        createVNode(_component_EnhanceJavaModal, { onRegister: _ctx.registerEnhanceJavaModal }, null, 8, ['onRegister']),
        createVNode(_component_EnhanceSqlModal, { onRegister: _ctx.registerEnhanceSqlModal }, null, 8, ['onRegister']),
        createVNode(_component_AuthManagerDrawer, { onRegister: _ctx.registerAuthManagerDrawer }, null, 8, ['onRegister']),
        createVNode(_component_AuthSetterModal, { onRegister: _ctx.registerAuthSetterModal }, null, 8, ['onRegister']),
      ],
      64
    )
  );
}
var index = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { index as default };
