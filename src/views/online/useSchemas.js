import { computed, h } from 'vue';
import { Input, Button } from 'ant-design-vue';
import { FolderOpenOutlined } from '@ant-design/icons-vue';
import { bindMapFormSchema } from '/@/utils/common/compUtils';
import { usePermission } from '/@/hooks/web/usePermission';
import { rules } from '/@/utils/helper/validator';
usePermission();
function useFormSchemas(_props, handlers) {
  const mapFormSchema = bindMapFormSchema(
    {
      one: {
        colProps: { xs: 24, sm: 24 },
        itemProps: {
          labelCol: { xs: 24, sm: 2 },
          wrapperCol: { xs: 24, sm: 22 },
        },
      },
      tow: {
        colProps: { xs: 24, sm: 12 },
        itemProps: {
          labelCol: { xs: 24, sm: 4 },
          wrapperCol: { xs: 24, sm: 20 },
        },
      },
      three: {
        colProps: { xs: 24, sm: 8 },
        itemProps: {
          labelCol: { xs: 24, sm: 6 },
          wrapperCol: { xs: 24, sm: 18 },
        },
      },
    },
    'three'
  );
  const formSchemas = [
    { label: '', field: 'id', component: 'Input', show: false },
    { label: '', field: 'tableVersion', component: 'Input', show: false },
    mapFormSchema({
      label: '\u8868\u540D',
      field: 'tableName',
      component: 'Input',
      required: true,
      dynamicDisabled: ({ model }) => model.tableVersion && model.tableVersion != 1,
      dynamicRules: ({ model, schema }) => rules.duplicateCheckRule('onl_cgform_head', 'table_name', model, schema, true),
    }),
    mapFormSchema({
      label: '\u8868\u63CF\u8FF0',
      field: 'tableTxt',
      component: 'Input',
      required: true,
    }),
    mapFormSchema({
      label: '\u8868\u7C7B\u578B',
      field: 'tableType',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '\u5355\u8868', value: 1 },
          { label: '\u4E3B\u8868', value: 2 },
          { label: '\u9644\u8868', value: 3 },
        ],
        onChange: handlers.onTableTypeChange,
      },
    }),
    {
      label: '',
      field: 'relationType',
      component: 'InputNumber',
      render: () => '',
      colProps: { xs: 0, sm: 17 },
      ifShow: fieldIfShow,
    },
    mapFormSchema({
      label: '',
      field: 'relationType',
      component: 'RadioGroup',
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '\u4E00\u5BF9\u591A', value: 0 },
          { label: '\u4E00\u5BF9\u4E00', value: 1 },
        ],
      },
      colProps: { xs: 24, sm: 4 },
      itemProps: {
        colon: false,
        labelCol: { xs: 0, sm: 0 },
        wrapperCol: { xs: 24, sm: 24 },
      },
      ifShow: fieldIfShow,
    }),
    mapFormSchema({
      label: '\u5E8F\u53F7',
      field: 'tabOrderNum',
      component: 'InputNumber',
      componentProps: {
        style: {
          width: '100%',
        },
      },
      colProps: { xs: 24, sm: 3 },
      itemProps: {
        labelCol: { xs: 24, sm: 7 },
        wrapperCol: { xs: 24, sm: 24 - 7 },
      },
      ifShow: fieldIfShow,
    }),
    mapFormSchema({
      label: '\u8868\u5355\u5206\u7C7B',
      field: 'formCategory',
      component: 'JDictSelectTag',
      defaultValue: 'temp',
      componentProps: {
        dictCode: 'ol_form_biz_type',
      },
    }),
    mapFormSchema({
      label: '\u4E3B\u952E\u7B56\u7565',
      field: 'idType',
      component: 'Select',
      defaultValue: 'NATIVE',
      componentProps: {
        options: [
          { label: 'ID_WORKER(\u5206\u5E03\u5F0F\u81EA\u589E)', value: 'UUID' },
          { label: 'NATIVE(表自增)', value: 'NATIVE' },
        ],
      },
    }),
    mapFormSchema({
      label: '\u5E8F\u53F7\u540D\u79F0',
      field: 'idSequence',
      component: 'Input',
      componentProps: {},
      ifShow: fieldIfShow,
    }),
    mapFormSchema({
      label: '\u663E\u793A\u590D\u9009\u6846',
      field: 'isCheckbox',
      component: 'Select',
      defaultValue: 'Y',
      componentProps: {
        options: [
          { label: '\u662F', value: 'Y' },
          { label: '\u5426', value: 'N' },
        ],
      },
    }),
    mapFormSchema({
      label: '\u4E3B\u9898\u6A21\u677F',
      field: 'themeTemplate',
      component: 'Select',
      defaultValue: 'normal',
      componentProps: {
        options: [{ label: '\u9ED8\u8BA4\u4E3B\u9898', value: 'normal' }],
      },
      dynamicDisabled: ({ model }) => model.tableType === 1,
    }),
    mapFormSchema({
      label: '\u8868\u5355\u98CE\u683C',
      field: 'formTemplate',
      component: 'Select',
      defaultValue: '1',
      componentProps: {
        options: [
          { label: '\u4E00\u5217', value: '1' },
          { label: '\u4E24\u5217', value: '2' },
          { label: '\u4E09\u5217', value: '3' },
          { label: '\u56DB\u5217', value: '4' },
        ],
        placeholder: '\u8BF7\u9009\u62E9PC\u8868\u5355\u98CE\u683C',
      },
    }),
    mapFormSchema({
      label: '\u79FB\u52A8\u8868\u5355\u98CE\u683C',
      field: 'formTemplateMobile',
      component: 'Select',
      defaultValue: '1',
      componentProps: {
        options: [
          { label: 'AntDesign\u6A21\u677F', value: '1' },
          { label: 'Bootstrap\u6A21\u677F', value: '2' },
        ],
        placeholder: '\u8BF7\u9009\u62E9\u79FB\u52A8\u8868\u5355\u98CE\u683C',
      },
      ifShow: false,
    }),
    mapFormSchema({
      label: '\u6EDA\u52A8\u6761',
      field: 'scroll',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '\u6709', value: 1 },
          { label: '\u65E0', value: 0 },
        ],
      },
    }),
    mapFormSchema({
      label: '\u662F\u5426\u5206\u9875',
      field: 'isPage',
      component: 'Select',
      defaultValue: 'Y',
      componentProps: {
        options: [
          { label: '\u662F', value: 'Y' },
          { label: '\u5426', value: 'N' },
        ],
      },
    }),
    mapFormSchema({
      label: '\u662F\u5426\u6811',
      field: 'isTree',
      component: 'Select',
      defaultValue: 'N',
      componentProps: {
        options: [
          { label: '\u662F', value: 'Y' },
          { label: '\u5426', value: 'N' },
        ],
        onChange: handlers.onIsTreeChange,
      },
      dynamicRules({ model }) {
        return [
          {
            validator({}, value) {
              if (value === 'Y' && (model.tableType == 2 || model.tableType == 3)) {
                return Promise.reject('\u4E3B\u8868\u548C\u9644\u8868\u4E0D\u652F\u6301\u6811\u7C7B\u578B\uFF01');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    }),
    mapFormSchema({
      label: ' ',
      field: 'extConfigJson',
      component: 'Input',
      slot: 'extConfigButton',
      itemProps: { colon: false },
    }),
    mapFormSchema({
      label: '\u6811\u8868\u5355\u7236ID',
      field: 'treeParentIdField',
      component: 'Input',
      ifShow: fieldIfShow,
    }),
    mapFormSchema({
      label: '\u662F\u5426\u6709\u5B50\u8282\u70B9\u5B57\u6BB5',
      field: 'treeIdField',
      component: 'Input',
      show: false,
    }),
    mapFormSchema({
      label: '\u6811\u5F00\u8868\u5355\u5217',
      field: 'treeFieldname',
      required: true,
      component: 'Input',
      ifShow: fieldIfShow,
    }),
    mapFormSchema(
      {
        label: '\u9644\u8868',
        field: 'subTableStr',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: ' ',
          allowClear: false,
        },
        ifShow: handlers.ifShowOfSubTableStr,
      },
      'one'
    ),
  ];
  function fieldIfShow({ field, model }) {
    switch (field) {
      case 'relationType':
      case 'tabOrderNum':
        return model.tableType === 3;
      case 'treeParentIdField':
      case 'treeIdField':
      case 'treeFieldname':
        return model.isTree === 'Y';
      case 'idSequence':
        return model.idType === 'SEQUENCE';
    }
    return true;
  }
  return { formSchemas };
}
function useExtendConfigFormSchemas(_props, handlers) {
  const mapFormSchema = bindMapFormSchema(
    {
      left: {
        colProps: { xs: 24, sm: 7 },
        itemProps: {
          labelCol: { xs: 24, sm: 11 },
          wrapperCol: { xs: 24, sm: 13 },
        },
        style: { width: '100%' },
      },
      right: {
        colProps: { xs: 24, sm: 17 },
        itemProps: {
          labelCol: { xs: 24, sm: 3 },
          wrapperCol: { xs: 24, sm: 20 },
        },
        style: { width: '100%' },
      },
    },
    'left'
  );
  const formSchemas = [
    mapFormSchema(
      {
        label: '\u5F39\u7A97\u9ED8\u8BA4\u5168\u5C4F',
        field: 'modelFullscreen',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u542F', value: 1 },
            { label: '\u5173\u95ED', value: 0 },
          ],
          buttonStyle: 'solid',
        },
      },
      'left'
    ),
    mapFormSchema(
      {
        label: '\u5F39\u7A97\u5BBD\u5EA6',
        field: 'modalMinWidth',
        component: 'InputNumber',
        componentProps: {
          style: 'width: 80%',
          placeholder: '\u5F39\u7A97\u6700\u5C0F\u5BBD\u5EA6\uFF08\u5355\u4F4D\uFF1Apx\uFF09',
        },
      },
      'right'
    ),
    mapFormSchema(
      {
        label: '\u5F00\u542F\u8868\u5355\u8BC4\u8BBA',
        field: 'commentStatus',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u542F', value: 1 },
            { label: '\u5173\u95ED', value: 0 },
          ],
          buttonStyle: 'solid',
        },
      },
      'left'
    ),
    mapFormSchema(
      {
        label: '',
        field: 'commentStatus',
        component: 'InputNumber',
        render: () => '',
      },
      'right'
    ),
    mapFormSchema(
      {
        label: '\u542F\u7528\u8054\u5408\u67E5\u8BE2',
        field: 'joinQuery',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u542F', value: 1 },
            { label: '\u5173\u95ED', value: 0 },
          ],
          buttonStyle: 'solid',
          onChange: handlers.onJoinQueryChange,
        },
      },
      'left'
    ),
    mapFormSchema(
      {
        label: '',
        field: 'joinQuery',
        component: 'InputNumber',
        render: () => '',
      },
      'right'
    ),
    mapFormSchema(
      {
        label: '\u96C6\u6210\u79EF\u6728\u62A5\u8868',
        field: 'reportPrintShow',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u542F', value: 1 },
            { label: '\u5173\u95ED', value: 0 },
          ],
          buttonStyle: 'solid',
          onChange: handlers.onReportPrintShowChange,
        },
      },
      'left'
    ),
    mapFormSchema(
      {
        label: '\u62A5\u8868\u5730\u5740',
        field: 'reportPrintUrl',
        component: 'Input',
        componentProps: {
          style: 'width: 80%',
        },
        dynamicDisabled: ({ model }) => !model.reportPrintShow,
        dynamicRules: ({ model }) => {
          return [
            { required: !!model.reportPrintShow, message: '\u8BF7\u8F93\u5165\u62A5\u8868\u5730\u5740\uFF01' },
            {
              validator({}, value) {
                if (/\/jmreport\/view\/{积木报表ID}/.test(value)) {
                  return Promise.reject(
                    '\u8BF7\u5C06{\u79EF\u6728\u62A5\u8868ID}\u66FF\u6362\u4E3A\u771F\u5B9E\u7684\u79EF\u6728\u62A5\u8868ID\uFF01'
                  );
                }
                return Promise.resolve();
              },
            },
          ];
        },
      },
      'right'
    ),
    mapFormSchema(
      {
        label: '\u96C6\u6210\u8BBE\u8BA1\u8868\u5355',
        field: 'isDesForm',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u542F', value: 'Y' },
            { label: '\u5173\u95ED', value: 'N' },
          ],
          buttonStyle: 'solid',
          onChange: handlers.onIsDesformChange,
        },
      },
      'left'
    ),
    mapFormSchema(
      {
        label: '\u8868\u5355\u7F16\u7801',
        field: 'desFormCode',
        component: 'Input',
        componentProps: {
          style: 'width: 80%',
        },
        dynamicDisabled: ({ model }) => model.isDesForm !== 'Y',
        dynamicRules: ({ model }) => {
          return [{ required: model.isDesForm === 'Y', message: '\u8BF7\u8F93\u5165\u8868\u5355\u7F16\u7801\uFF01' }];
        },
      },
      'right'
    ),
    mapFormSchema(
      {
        label: '\u56FA\u5B9A\u64CD\u4F5C\u5217',
        field: 'tableFixedAction',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u542F', value: 1 },
            { label: '\u5173\u95ED', value: 0 },
          ],
          buttonStyle: 'solid',
        },
        defaultValue: 1,
      },
      'left'
    ),
    mapFormSchema(
      {
        label: '\u56FA\u5B9A\u65B9\u5F0F',
        field: 'tableFixedActionType',
        component: 'Select',
        componentProps: {
          options: [
            { label: '\u56FA\u5B9A\u5230\u53F3\u4FA7', value: 'right' },
            { label: '\u56FA\u5B9A\u5230\u5DE6\u4FA7', value: 'left' },
          ],
          style: 'width: 80%',
        },
        defaultValue: 'right',
        dynamicDisabled: ({ model }) => !model.tableFixedAction,
        dynamicRules: ({ model }) => {
          return [{ required: !!model.tableFixedAction, message: '\u8BF7\u9009\u62E9\u56FA\u5B9A\u65B9\u5F0F\uFF01' }];
        },
      },
      'right'
    ),
  ];
  return { formSchemas };
}
function useCodeGeneratorFormSchemas(_, handlers, single) {
  const mapFormSchema = bindMapFormSchema(
    {
      one: {
        colProps: { xs: 24, sm: 24 },
        itemProps: {
          labelCol: { xs: 24, sm: 5 },
          wrapperCol: { xs: 24, sm: 16 },
        },
      },
      towOne: {
        colProps: { xs: 24, sm: 24 },
        itemProps: {
          labelCol: { xs: 24, sm: 3 },
          wrapperCol: { xs: 24, sm: 20 },
        },
      },
      tow: {
        colProps: { xs: 24, sm: 12 },
        itemProps: {
          labelCol: { xs: 24, sm: 6 },
          wrapperCol: { xs: 24, sm: 16 },
        },
      },
    },
    'one'
  );
  const getColSize = computed(() => (single.value ? 'one' : 'tow'));
  const formSchemas = computed(() => [
    mapFormSchema(
      {
        label: '\u4EE3\u7801\u751F\u6210\u76EE\u5F55',
        field: 'projectPath',
        render: ({ model, field }) =>
          h(
            Input.Search,
            {
              value: model[field],
              onChange: (e) => {
                model[field] = e.target.value;
                handlers.onProjectPathChange(e);
              },
              onSearch: handlers.onProjectPathSearch,
            },
            {
              enterButton: () =>
                h(
                  Button,
                  {
                    preIcon: 'ant-design:folder-open',
                  },
                  {
                    default: () => '\u6D4F\u89C8',
                    icon: () => h(FolderOpenOutlined),
                  }
                ),
            }
          ),
        component: 'InputSearch',
        required: true,
      },
      single.value ? 'one' : 'towOne'
    ),
    mapFormSchema(
      {
        label: '\u9875\u9762\u98CE\u683C',
        field: 'jspMode',
        component: 'Select',
        componentProps: {
          options: handlers.jspModeOptions.value,
        },
      },
      getColSize.value
    ),
    mapFormSchema(
      {
        label: '\u529F\u80FD\u8BF4\u660E',
        field: 'ftlDescription',
        component: 'Input',
      },
      getColSize.value
    ),
    { label: '\u6570\u636E\u6A21\u578B', field: 'jformType', component: 'Input', show: false },
    mapFormSchema(
      {
        label: '\u8868\u540D',
        field: 'tableName_tmp',
        required: true,
        dynamicDisabled: true,
        component: 'Input',
      },
      getColSize.value
    ),
    mapFormSchema(
      {
        label: '\u5B9E\u4F53\u7C7B\u540D',
        field: 'entityName',
        required: true,
        component: 'Input',
        componentProps: {
          placeholder: '\u8BF7\u8F93\u5165\u5B9E\u4F53\u7C7B\u540D(\u9996\u5B57\u6BCD\u5927\u5199)',
        },
      },
      getColSize.value
    ),
    mapFormSchema(
      {
        label: '\u5305\u540D(\u5C0F\u5199)',
        field: 'entityPackage',
        required: true,
        component: 'Input',
      },
      getColSize.value
    ),
    mapFormSchema(
      {
        label: '\u4EE3\u7801\u5206\u5C42\u6837\u5F0F',
        field: 'packageStyle',
        component: 'Select',
        componentProps: {
          disabled: true,
          options: [
            { label: '\u4E1A\u52A1\u5206\u5C42', value: 'service' },
            { label: '\u4EE3\u7801\u5206\u5C42', value: 'project' },
          ],
        },
      },
      getColSize.value
    ),
    mapFormSchema(
      {
        label: '\u9875\u9762\u4EE3\u7801',
        field: 'vueStyle',
        required: true,
        component: 'RadioGroup',
        defaultValue: 'vue3',
        componentProps: {
          options: [
            { label: 'Vue3', value: 'vue3' },
            { label: 'Vue3 \u539F\u751F', value: 'vue3Native' },
            { label: 'Vue2', value: 'vue' },
          ],
        },
      },
      getColSize.value
    ),
    { label: '\u9700\u8981\u751F\u6210\u7684\u4EE3\u7801', field: 'codeTypes', component: 'Input', show: false },
  ]);
  return { formSchemas };
}
export { useExtendConfigFormSchemas as a, useCodeGeneratorFormSchemas as b, useFormSchemas as u };
