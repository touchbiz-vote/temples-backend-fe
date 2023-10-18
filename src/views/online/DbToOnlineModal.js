import { defineComponent, ref, resolveComponent, openBlock, createBlock, withCtx, createVNode, createTextVNode, createElementVNode } from 'vue';
import { defHttp } from '/@/utils/http/axios';
import { BasicTable } from '/@/components/Table';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { useListTable } from '/@/hooks/system/useListPage';
import { useMessage } from '/@/hooks/web/useMessage';
import { _ as _export_sfc } from './index.js';
import '/@/components/jeecg/OnLine/JPopupOnlReport.vue';
import 'vue-router';
const _sfc_main = defineComponent({
  name: 'TransDb2Online',
  components: { BasicModal, BasicTable },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const { createMessage: $message } = useMessage();
    const emptyText = ref('\u6682\u65E0\u6570\u636E');
    const confirmLoading = ref(false);
    const btnLoading = ref(false);
    const metaSource = ref([]);
    const dataSource = ref([]);
    const [registerModal, { closeModal }] = useModalInner(() => {
      btnLoading.value = false;
      emptyText.value = '\u6682\u65E0\u6570\u636E';
      selectedRowKeys.value = [];
      queryTables();
    });
    const [registerTable, { setPagination }, { rowSelection, selectedRowKeys }] = useListTable({
      bordered: true,
      columns: [{ title: '\u8868\u540D', align: 'left', dataIndex: 'id' }],
      dataSource,
      maxHeight: 300,
      locale: { emptyText },
      pagination: {
        showQuickJumper: false,
        showSizeChanger: false,
      },
      clickToRowSelect: true,
      showIndexColumn: true,
      showActionColumn: false,
      formConfig: {
        schemas: [
          {
            label: '\u8868\u540D',
            field: 'tableName',
            component: 'Input',
            componentProps: {
              style: { width: '100%' },
              placeholder: '\u8BF7\u8F93\u5165\u8868\u540D\u4EE5\u6A21\u7CCA\u7B5B\u9009',
              onChange: (e) => searchFilter(e.target.value),
            },
            disabledLabelWidth: true,
            itemProps: {
              labelCol: { sm: 24, md: 4 },
              wrapperCol: { sm: 24, md: 20 },
            },
          },
        ],
        baseColProps: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
        showActionButtonGroup: false,
      },
    });
    function queryTables() {
      confirmLoading.value = true;
      return defHttp
        .get(
          {
            url: '/api/online/cgform/head/queryTables/',
          },
          {
            errorMessageMode: 'none',
          }
        )
        .then(
          (result) => {
            dataSource.value = result;
            metaSource.value = [...result];
            return result;
          },
          (e) => {
            if (e.message == 'noadminauth') {
              emptyText.value = '\u975Eadmin\u7528\u6237\u65E0\u6743\u9650\u64CD\u4F5C\uFF01';
              $message.warn(emptyText.value);
            } else {
              console.error(e);
            }
            dataSource.value = [];
            metaSource.value = [];
          }
        )
        .finally(() => {
          confirmLoading.value = false;
        });
    }
    function searchFilter(keyword) {
      if (metaSource.value.length === 0) return;
      if (!keyword) {
        dataSource.value = [...metaSource.value];
      } else {
        dataSource.value = metaSource.value.filter((item) => item.id.toLowerCase().includes(keyword.toLowerCase()));
        emptyText.value = dataSource.value.length === 0 ? '\u65E0\u7B5B\u9009\u7ED3\u679C' : '\u6682\u65E0\u6570\u636E';
      }
      setPagination({ current: 1 });
    }
    function handleCancel() {
      closeModal();
    }
    function handleTrans() {
      if (!selectedRowKeys.value || selectedRowKeys.value.length == 0) {
        $message.warning('\u8BF7\u9009\u62E9\u4E00\u5F20\u8868');
        return;
      } else {
        btnLoading.value = true;
        let tbNames = selectedRowKeys.value.join(',');
        defHttp
          .post({ url: '/api/online/cgform/head/transTables/' + tbNames })
          .then(() => {
            closeModal();
            emit('success');
          })
          .finally(() => (btnLoading.value = false));
      }
    }
    return {
      emptyText,
      confirmLoading,
      btnLoading,
      metaSource,
      handleTrans,
      handleCancel,
      queryTables,
      registerModal,
      registerTable,
      rowSelection,
      selectedRowKeys,
    };
  },
});
const _hoisted_1 = /* @__PURE__ */ createElementVNode(
  'div',
  null,
  [
    /* @__PURE__ */ createTextVNode(' \u6CE8\uFF1A\u5BFC\u5165\u8868\u4F1A\u6392\u9664\u914D\u7F6E\u524D\u7F00\u8868 '),
    /* @__PURE__ */ createElementVNode(
      'a',
      {
        href: 'http://doc.jeecg.com/2043924',
        target: '_blank',
      },
      ' \u53C2\u8003\u6587\u6863'
    ),
  ],
  -1
);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BasicTable = resolveComponent('BasicTable');
  const _component_a_spin = resolveComponent('a-spin');
  const _component_a_button = resolveComponent('a-button');
  const _component_BasicModal = resolveComponent('BasicModal');
  return (
    openBlock(),
    createBlock(
      _component_BasicModal,
      {
        onRegister: _ctx.registerModal,
        width: 500,
        title: '\u4ECE\u6570\u636E\u5E93\u5BFC\u5165\u8868\u5355',
        confirmLoading: _ctx.confirmLoading,
        onCancel: _ctx.handleCancel,
      },
      {
        footer: withCtx(() => [
          createVNode(
            _component_a_button,
            { onClick: _ctx.handleCancel },
            {
              default: withCtx(() => [createTextVNode('\u5173\u95ED')]),
              _: 1,
            },
            8,
            ['onClick']
          ),
          createVNode(
            _component_a_button,
            {
              onClick: _ctx.handleTrans,
              type: 'primary',
              preIcon: 'ant-design:swap',
              loading: _ctx.confirmLoading || _ctx.btnLoading,
            },
            {
              default: withCtx(() => [createTextVNode(' \u751F\u6210\u8868\u5355 ')]),
              _: 1,
            },
            8,
            ['onClick', 'loading']
          ),
        ]),
        default: withCtx(() => [
          createVNode(
            _component_a_spin,
            { spinning: _ctx.confirmLoading },
            {
              default: withCtx(() => [
                createVNode(
                  _component_BasicTable,
                  {
                    onRegister: _ctx.registerTable,
                    rowSelection: _ctx.rowSelection,
                    onTableRedo: _ctx.queryTables,
                  },
                  {
                    tableTitle: withCtx(() => [_hoisted_1]),
                    _: 1,
                  },
                  8,
                  ['onRegister', 'rowSelection', 'onTableRedo']
                ),
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
      ['onRegister', 'confirmLoading', 'onCancel']
    )
  );
}
var DbToOnlineModal = /* @__PURE__ */ _export_sfc(_sfc_main, [['render', _sfc_render]]);
export { DbToOnlineModal as default };
