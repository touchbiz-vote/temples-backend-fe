import {
  defineComponent,
  ref,
  computed,
  resolveComponent,
  openBlock,
  createBlock,
  withCtx,
  createVNode,
  createElementBlock,
  Fragment,
  createCommentVNode,
} from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import AuthFieldConfig from './AuthFieldConfig.js';
import AuthButtonConfig from './AuthButtonConfig.js';
import AuthDataConfig from './AuthDataConfig.js';
import { _ as _export_sfc } from './index.js';
import '/@/components/Table';
import './auth.api.js';
import '/@/utils/http/axios';
import './auth.data.js';
import './_baseClone.js';
import './_arrayPush.js';
import './isArray.js';
import '/@/components/Modal';
import '/@/components/Form';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import '/@/hooks/web/useMessage';
import 'vue-router';
const _sfc_main = defineComponent({
  name: 'AuthManagerDrawer',
  components: {
    BasicDrawer,
    AuthFieldConfig,
    AuthButtonConfig,
    AuthDataConfig,
  },
  props: {
    tableType: {
      type: Number,
      default: 1,
    },
  },
  emits: ['register'],
  setup(props) {
    const cgformId = ref('');
    const headId = ref('');
    const authFields = ref([]);
    const activeKey = ref('field');
    const hasDataAuth = computed(() => props.tableType == 1 || props.tableType == 2);
    const [registerDrawer, { closeDrawer }] = useDrawerInner((data) => {
      cgformId.value = data.cgformId;
      headId.value = cgformId.value + '?' + new Date().getTime();
      activeKey.value = 'field';
    });
    function onClose() {
      closeDrawer();
    }
    return {
      activeKey,
      cgformId,
      headId,
      authFields,
      hasDataAuth,
      onClose,
      registerDrawer,
    };
  },
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_AuthFieldConfig = resolveComponent('AuthFieldConfig');
  const _component_a_tab_pane = resolveComponent('a-tab-pane');
  const _component_AuthButtonConfig = resolveComponent('AuthButtonConfig');
  const _component_AuthDataConfig = resolveComponent('AuthDataConfig');
  const _component_a_tabs = resolveComponent('a-tabs');
  const _component_BasicDrawer = resolveComponent('BasicDrawer');
  return (
    openBlock(),
    createBlock(
      _component_BasicDrawer,
      {
        onRegister: _ctx.registerDrawer,
        title: '\u6743\u9650\u7BA1\u7406',
        width: 800,
        onClose: _ctx.onClose,
      },
      {
        default: withCtx(() => [
          createVNode(
            _component_a_tabs,
            {
              activeKey: _ctx.activeKey,
              'onUpdate:activeKey': _cache[1] || (_cache[1] = ($event) => (_ctx.activeKey = $event)),
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
                        _component_AuthFieldConfig,
                        {
                          headId: _ctx.headId,
                          authFields: _ctx.authFields,
                          'onUpdate:authFields': _cache[0] || (_cache[0] = ($event) => (_ctx.authFields = $event)),
                        },
                        null,
                        8,
                        ['headId', 'authFields']
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
                            default: withCtx(() => [createVNode(_component_AuthButtonConfig, { headId: _ctx.headId }, null, 8, ['headId'])]),
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
                                _component_AuthDataConfig,
                                {
                                  cgformId: _ctx.cgformId,
                                  authFields: _ctx.authFields,
                                },
                                null,
                                8,
                                ['cgformId', 'authFields']
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
            ['activeKey']
          ),
        ]),
        _: 1,
      },
      8,
      ['onRegister', 'onClose']
    )
  );
}
var AuthManagerDrawer = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { AuthManagerDrawer as default };
