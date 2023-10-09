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
import {
  defineComponent,
  resolveComponent,
  openBlock,
  createElementBlock,
  createVNode,
  unref,
  mergeProps,
  withCtx,
  createTextVNode,
  createBlock,
  createCommentVNode,
} from 'vue';
import { BasicTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import {
  l as list,
  c as columns,
  s as searchFormSchema,
  _ as _sfc_main$1,
  b as batchDelete,
  g as getReportParam,
  d as deleteOne,
} from './CgreportModal.js';
import { useModal } from '/@/components/Modal';
import { C as Clipboard } from './clipboard.js';
import { useRouter } from 'vue-router';
import { buildUUID } from '/@/utils/uuid';
import '/@/components/Form/index';
import '/@/hooks/system/useJvxeMethods.ts';
import '/@/components/jeecg/JVxeTable/types';
import '/@/views/system/user/user.api';
import '/@/utils/http/axios';
import '/@/hooks/web/useMessage';
import './_commonjsHelpers.js';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  setup(__props, { expose }) {
    let router = useRouter();
    const [registerModal, { openModal }] = useModal();
    const {
      tableContext,
      createMessage: $message,
      createConfirm: $confirm,
    } = useListPage({
      designScope: 'online-cgreport-list',
      pagination: true,
      tableProps: {
        title: 'Online\u62A5\u8868',
        api: list,
        rowKey: 'id',
        columns,
        formConfig: {
          autoSubmitOnEnter: true,
          showAdvancedButton: true,
          schemas: searchFormSchema,
        },
      },
    });
    const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
    function handleAdd() {
      openModal(true, {
        isUpdate: false,
        showFooter: true,
      });
    }
    function handleEdit(record) {
      openModal(true, {
        record,
        isUpdate: true,
        showFooter: true,
      });
    }
    function handleDelete(record) {
      return __async(this, null, function* () {
        yield deleteOne({ id: record.id }, reload);
      });
    }
    function batchHandleDelete() {
      return __async(this, null, function* () {
        yield batchDelete({ ids: selectedRowKeys.value }, () => {
          reload();
          selectedRowKeys.value = [];
        });
      });
    }
    function handleSuccess() {
      reload();
    }
    function getAction(record) {
      return [
        {
          label: '\u7F16\u8F91',
          onClick: handleEdit.bind(null, record),
        },
      ];
    }
    function getDropDownAction(record) {
      return [
        {
          label: '\u529F\u80FD\u6D4B\u8BD5',
          class: ['low-app-hide'],
          onClick: () => onShowList(record.id),
        },
        {
          label: '\u914D\u7F6E\u5730\u5740',
          class: ['low-app-hide'],
          onClick: () => onShowOnlineUrl(record),
        },
        {
          label: '\u5220\u9664',
          popConfirm: {
            title: '\u662F\u5426\u786E\u8BA4\u5220\u9664',
            confirm: handleDelete.bind(null, record),
          },
        },
      ];
    }
    function onShowList(id) {
      router.push({ path: '/online/cgreport/' + id });
    }
    function onShowOnlineUrl(record) {
      let id = record.id;
      let baseUrl = `/online/cgreport/${id}`;
      let insertMenuSql = `INSERT INTO sys_permission(id, parent_id, name, url, component, component_name, redirect, menu_type, perms, perms_type, sort_no, always_show, icon, is_route, is_leaf, keep_alive, hidden, hide_tab, description, status, del_flag, rule_flag, create_by, create_time, update_by, update_time, internal_or_external) 
                         VALUES ('${buildUUID()}', NULL, '${
        record.name
      }', '${baseUrl}', '1', NULL, NULL, 0, NULL, '1', 0.00, 0, NULL, 0, 1, 0, 0, 0, NULL, '1', 0, 0, 'admin', null, NULL, NULL, 0)`;
      getReportParam(id)
        .then((arr) => {
          let urlParam = '';
          if (arr && arr.length > 0) {
            for (let i of arr) {
              urlParam += i.paramName + '=${' + i.paramName + '}&';
            }
          }
          if (urlParam.length > 0) {
            urlParam = urlParam.substring(0, urlParam.length - 1);
            baseUrl += '?' + urlParam;
          }
        })
        .catch(() => {
          $message.warning('\u83B7\u53D6\u53C2\u6570\u5931\u8D25!');
        })
        .finally(() => {
          $confirm({
            iconType: 'info',
            width: 500,
            title: `\u83DC\u5355\u94FE\u63A5\u3010${record.name}\u3011`,
            content: baseUrl,
            closable: true,
            maskClosable: true,
            cancelText: '\u590D\u5236SQL',
            okText: '\u590D\u5236URL',
            cancelButtonProps: {
              class: 'copy-this-sql',
              'data-clipboard-text': insertMenuSql,
            },
            okButtonProps: {
              class: 'copy-this-text',
              'data-clipboard-text': baseUrl,
            },
            onOk() {
              return new Promise((resolve) => {
                const clipboard = new Clipboard('.copy-this-text');
                clipboard.on('success', () => {
                  clipboard.destroy();
                  $message.success('\u590D\u5236URL\u6210\u529F');
                  resolve();
                });
                clipboard.on('error', () => {
                  $message.error('\u8BE5\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u81EA\u52A8\u590D\u5236');
                  clipboard.destroy();
                  resolve();
                });
              });
            },
            onCancel() {
              return new Promise((resolve) => {
                const clipboard = new Clipboard('.copy-this-sql');
                clipboard.on('success', () => {
                  clipboard.destroy();
                  $message.success('\u590D\u5236\u63D2\u5165\u83DC\u5355SQL\u6210\u529F');
                  resolve();
                });
                clipboard.on('error', () => {
                  $message.error('\u8BE5\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u81EA\u52A8\u590D\u5236');
                  clipboard.destroy();
                  resolve();
                });
              });
            },
          });
        });
    }
    expose({
      handleAdd,
    });
    return (_ctx, _cache) => {
      const _component_a_button = resolveComponent('a-button');
      const _component_Icon = resolveComponent('Icon');
      const _component_a_menu_item = resolveComponent('a-menu-item');
      const _component_a_menu = resolveComponent('a-menu');
      const _component_a_dropdown = resolveComponent('a-dropdown');
      return (
        openBlock(),
        createElementBlock('div', null, [
          createVNode(
            unref(BasicTable),
            mergeProps(
              {
                onRegister: unref(registerTable),
                rowSelection: unref(rowSelection),
              },
              _ctx.$attrs
            ),
            {
              tableTitle: withCtx(() => [
                createVNode(
                  _component_a_button,
                  {
                    preIcon: 'ant-design:plus-outlined',
                    type: 'primary',
                    onClick: handleAdd,
                    style: { 'margin-right': '5px' },
                  },
                  {
                    default: withCtx(() => [createTextVNode('\u5F55\u5165')]),
                    _: 1,
                  }
                ),
                unref(selectedRowKeys).length > 0
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
                                  onClick: batchHandleDelete,
                                },
                                {
                                  default: withCtx(() => [
                                    createVNode(_component_Icon, { icon: 'ant-design:delete-outlined' }),
                                    createTextVNode(' \u5220\u9664 '),
                                  ]),
                                  _: 1,
                                }
                              ),
                            ]),
                            _: 1,
                          }),
                        ]),
                        default: withCtx(() => [
                          createVNode(_component_a_button, null, {
                            default: withCtx(() => [
                              createTextVNode('\u6279\u91CF\u64CD\u4F5C '),
                              createVNode(_component_Icon, { icon: 'mdi:chevron-down' }),
                            ]),
                            _: 1,
                          }),
                        ]),
                        _: 1,
                      }
                    ))
                  : createCommentVNode('', true),
              ]),
              action: withCtx(({ record }) => [
                createVNode(
                  unref(TableAction),
                  {
                    actions: getAction(record),
                    dropDownActions: getDropDownAction(record),
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
          createVNode(
            _sfc_main$1,
            {
              onRegister: unref(registerModal),
              onSuccess: handleSuccess,
            },
            null,
            8,
            ['onRegister']
          ),
        ])
      );
    };
  },
});
export { _sfc_main as default };
