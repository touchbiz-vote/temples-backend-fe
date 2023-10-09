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
import LeftRole from './LeftRole.js';
import LeftDepart from './LeftDepart.js';
import LeftUser from './LeftUser.js';
import AuthFieldTree from './AuthFieldTree.js';
import AuthButtonTree from './AuthButtonTree.js';
import AuthDataTree from './AuthDataTree.js';
import {
  defineComponent,
  ref,
  computed,
  nextTick,
  resolveComponent,
  openBlock,
  createBlock,
  withCtx,
  createVNode,
  createElementBlock,
  Fragment,
  createCommentVNode,
} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { _ as _export_sfc } from './index.js';
import '/@/utils/http/axios';
import '/@/components/Table';
import '/@/hooks/system/useListPage';
import '/@/api/common/api';
import '/@/hooks/web/useMessage';
import './auth.api.js';
import '@ant-design/icons-vue';
import './auth.data.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
const _sfc_main = defineComponent({
  name: 'AuthSetterModal',
  components: {
    BasicModal,
    LeftRole,
    LeftDepart,
    LeftUser,
    AuthFieldTree,
    AuthButtonTree,
    AuthDataTree,
  },
  props: {
    tableType: { type: Number, default: 1 },
  },
  setup(props) {
    const cgformId = ref('');
    const loading = ref(false);
    const activeKey = ref('field');
    const authMode = ref('role');
    const refs = {
      fieldRef: ref(),
      buttonRef: ref(),
      dataRef: ref(),
      roleRef: ref(),
      userRef: ref(),
      departRef: ref(),
    };
    const activeRole = ref('');
    const hasDataAuth = computed(() => props.tableType == 1 || props.tableType == 2);
    const [registerModal, { closeModal }] = useModalInner((data) => {
      activeKey.value = 'field';
      cgformId.value = data.cgformId;
      reset();
    });
    function getActiveRef(key = activeKey.value) {
      var _a;
      return (_a = refs[key + 'Ref']) == null ? void 0 : _a.value;
    }
    function reset() {
      return __async(this, null, function* () {
        yield nextTick();
        clearLeftCurrentTabSelect();
        getActiveRef().clear();
      });
    }
    function onSelectRole(roleId) {
      activeRole.value = roleId;
      onAuthTypeChange(activeKey.value);
      clearLeftOtherTabSelect();
    }
    function onSelectDepart(departid) {
      activeRole.value = departid;
      onAuthTypeChange(activeKey.value);
      clearLeftOtherTabSelect();
    }
    function onSelectUser(userId) {
      activeRole.value = userId;
      onAuthTypeChange(activeKey.value);
      clearLeftOtherTabSelect();
    }
    function clearLeftOtherTabSelect() {
      if (authMode.value == 'role') {
        refs.departRef.value.clearSelected();
        refs.userRef.value.clearSelected();
      } else if (authMode.value == 'depart') {
        refs.roleRef.value.clearSelected();
        refs.userRef.value.clearSelected();
      } else if (authMode.value == 'user') {
        refs.departRef.value.clearSelected();
        refs.roleRef.value.clearSelected();
      }
    }
    function clearLeftCurrentTabSelect() {
      if (authMode.value == 'role') {
        refs.roleRef.value.clearSelected();
      } else if (authMode.value == 'depart') {
        refs.departRef.value.clearSelected();
      } else if (authMode.value == 'user') {
        refs.userRef.value.clearSelected();
      }
      getActiveRef().clearChecked();
    }
    function onAuthTypeChange(key) {
      return __async(this, null, function* () {
        yield nextTick();
        if (activeRole.value) {
          getActiveRef(key).loadChecked(activeRole.value, authMode.value);
        }
      });
    }
    function onAuthModeChange() {
      clearLeftCurrentTabSelect();
    }
    return __spreadProps(__spreadValues({}, refs), {
      cgformId,
      loading,
      activeKey,
      hasDataAuth,
      authMode,
      onAuthModeChange,
      onAuthTypeChange,
      closeModal,
      onSelectRole,
      onSelectDepart,
      onSelectUser,
      registerModal,
    });
  },
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LeftRole = resolveComponent('LeftRole');
  const _component_a_tab_pane = resolveComponent('a-tab-pane');
  const _component_LeftDepart = resolveComponent('LeftDepart');
  const _component_LeftUser = resolveComponent('LeftUser');
  const _component_a_tabs = resolveComponent('a-tabs');
  const _component_a_col = resolveComponent('a-col');
  const _component_AuthFieldTree = resolveComponent('AuthFieldTree');
  const _component_AuthButtonTree = resolveComponent('AuthButtonTree');
  const _component_AuthDataTree = resolveComponent('AuthDataTree');
  const _component_a_row = resolveComponent('a-row');
  const _component_a_spin = resolveComponent('a-spin');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      {
        title: 'Online\u6743\u9650\u6388\u6743',
        width: 900,
        maskClosable: false,
        defaultFullscreen: '',
        okButtonProps: { style: { display: 'none' } },
        cancelText: '\u5173\u95ED',
        onCancel: _ctx.closeModal,
        onRegister: _ctx.registerModal,
      },
      {
        default: withCtx(() => [
          createVNode(
            _component_a_spin,
            { spinning: _ctx.loading },
            {
              default: withCtx(() => [
                createVNode(_component_a_row, null, {
                  default: withCtx(() => [
                    createVNode(
                      _component_a_col,
                      { span: 12 },
                      {
                        default: withCtx(() => [
                          createVNode(
                            _component_a_tabs,
                            {
                              activeKey: _ctx.authMode,
                              'onUpdate:activeKey': _cache[0] || (_cache[0] = ($event) => (_ctx.authMode = $event)),
                              onChange: _ctx.onAuthModeChange,
                            },
                            {
                              default: withCtx(() => [
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u89D2\u8272\u6388\u6743',
                                    key: 'role',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_LeftRole,
                                        {
                                          ref: 'roleRef',
                                          onSelect: _ctx.onSelectRole,
                                        },
                                        null,
                                        8,
                                        ['onSelect']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u90E8\u95E8\u6388\u6743',
                                    key: 'depart',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_LeftDepart,
                                        {
                                          ref: 'departRef',
                                          onSelect: _ctx.onSelectDepart,
                                        },
                                        null,
                                        8,
                                        ['onSelect']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u4EBA\u5458\u6388\u6743',
                                    key: 'user',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_LeftUser,
                                        {
                                          ref: 'userRef',
                                          onSelect: _ctx.onSelectUser,
                                        },
                                        null,
                                        8,
                                        ['onSelect']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ['activeKey', 'onChange']
                          ),
                        ]),
                        _: 1,
                      }
                    ),
                    createVNode(_component_a_col, { span: 1 }),
                    createVNode(
                      _component_a_col,
                      { span: 11 },
                      {
                        default: withCtx(() => [
                          createVNode(
                            _component_a_tabs,
                            {
                              activeKey: _ctx.activeKey,
                              'onUpdate:activeKey': _cache[1] || (_cache[1] = ($event) => (_ctx.activeKey = $event)),
                              onChange: _ctx.onAuthTypeChange,
                            },
                            {
                              default: withCtx(() => [
                                createVNode(
                                  _component_a_tab_pane,
                                  {
                                    tab: '\u5B57\u6BB5\u6743\u9650',
                                    key: 'field',
                                    forceRender: '',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createVNode(
                                        _component_AuthFieldTree,
                                        {
                                          ref: 'fieldRef',
                                          cgformId: _ctx.cgformId,
                                        },
                                        null,
                                        8,
                                        ['cgformId']
                                      ),
                                    ]),
                                    _: 1,
                                  }
                                ),
                                _ctx.hasDataAuth
                                  ? (openBlock(),
                                    createElementBlock(
                                      Fragment,
                                      { key: 0 },
                                      [
                                        createVNode(
                                          _component_a_tab_pane,
                                          {
                                            tab: '\u6309\u94AE\u6743\u9650',
                                            key: 'button',
                                            forceRender: '',
                                          },
                                          {
                                            default: withCtx(() => [
                                              createVNode(
                                                _component_AuthButtonTree,
                                                {
                                                  ref: 'buttonRef',
                                                  cgformId: _ctx.cgformId,
                                                },
                                                null,
                                                8,
                                                ['cgformId']
                                              ),
                                            ]),
                                            _: 1,
                                          }
                                        ),
                                        createVNode(
                                          _component_a_tab_pane,
                                          {
                                            tab: '\u6570\u636E\u6743\u9650',
                                            key: 'data',
                                            forceRender: '',
                                          },
                                          {
                                            default: withCtx(() => [
                                              createVNode(
                                                _component_AuthDataTree,
                                                {
                                                  ref: 'dataRef',
                                                  cgformId: _ctx.cgformId,
                                                },
                                                null,
                                                8,
                                                ['cgformId']
                                              ),
                                            ]),
                                            _: 1,
                                          }
                                        ),
                                      ],
                                      64
                                    ))
                                  : createCommentVNode('', true),
                              ]),
                              _: 1,
                            },
                            8,
                            ['activeKey', 'onChange']
                          ),
                        ]),
                        _: 1,
                      }
                    ),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
            8,
            ['spinning']
          ),
        ]),
        _: 1,
      },
      8,
      ['onCancel', 'onRegister']
    )
  );
}
var AuthSetterModal = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { AuthSetterModal as default };
