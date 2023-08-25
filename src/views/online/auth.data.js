import { computed } from "vue";
const authFieldColumns = [
  {
    title: "\u542F\u7528",
    dataIndex: "switch",
    width: 80,
    align: "center",
    slots: { customRender: "switch" }
  },
  {
    title: "\u5B57\u6BB5\u540D\u79F0",
    width: 200,
    dataIndex: "code"
  },
  {
    title: "\u5B57\u6BB5\u63CF\u8FF0",
    dataIndex: "title"
  },
  {
    title: "\u5217\u8868\u63A7\u5236",
    dataIndex: "list",
    width: 120,
    slots: { customRender: "list" }
  },
  {
    title: "\u8868\u5355\u63A7\u5236",
    dataIndex: "form",
    width: 180,
    slots: { customRender: "form" }
  }
];
const authButtonColumns = [
  {
    title: "\u542F\u7528",
    dataIndex: "switch",
    width: 80,
    slots: { customRender: "switch" }
  },
  {
    title: "\u540D\u79F0",
    dataIndex: "title"
  },
  {
    title: "\u7F16\u7801",
    dataIndex: "code"
  },
  {
    title: "\u6743\u9650\u63A7\u5236",
    dataIndex: "control",
    width: 180,
    slots: { customRender: "control" }
  }
];
const authButtonFixedList = [
  { code: "add", title: "\u65B0\u589E", status: 0 },
  { code: "update", title: "\u7F16\u8F91", status: 0 },
  { code: "delete", title: "\u5220\u9664", status: 0 },
  { code: "batch_delete", title: "\u6279\u91CF\u5220\u9664", status: 0 },
  { code: "export", title: "\u5BFC\u51FA", status: 0 },
  { code: "import", title: "\u5BFC\u5165", status: 0 },
  { code: "bpm", title: "\u63D0\u4EA4\u6D41\u7A0B", status: 0 },
  { code: "super_query", title: "\u9AD8\u7EA7\u67E5\u8BE2", status: 0 }
];
const USE_SQL_RULES = "USE_SQL_RULES";
const authDataColumns = [
  {
    title: "\u542F\u7528",
    dataIndex: "switch",
    width: 80,
    slots: { customRender: "switch" }
  },
  {
    title: "\u89C4\u5219\u540D\u79F0",
    dataIndex: "ruleName",
    width: 130
  },
  {
    title: "\u89C4\u5219\u63CF\u8FF0",
    dataIndex: "description",
    customRender({ record: { ruleOperator, ruleValue, ruleColumn } }) {
      if (ruleOperator == USE_SQL_RULES) {
        return `\u81EA\u5B9A\u4E49SQL: ${ruleValue}`;
      } else {
        return `${ruleColumn} ${ruleOperator} ${ruleValue}`;
      }
    }
  }
];
function useAuthDataFormSchemas(props, methods) {
  const formSchemas = computed(() => [
    {
      label: "\u89C4\u5219\u540D\u79F0",
      field: "ruleName",
      required: true,
      component: "Input"
    },
    {
      label: "\u89C4\u5219\u5B57\u6BB5",
      field: "ruleColumn",
      component: "JSearchSelect",
      componentProps: {
        dictOptions: props.authFields,
        getPopupContainer: () => document.body
      },
      dynamicRules({ model }) {
        return [{ required: model.ruleOperator != USE_SQL_RULES, message: "\u8BF7\u8F93\u5165\u89C4\u5219\u5B57\u6BB5" }];
      },
      show: ({ model }) => model.ruleOperator != USE_SQL_RULES
    },
    {
      label: "\u6761\u4EF6\u89C4\u5219",
      field: "ruleOperator",
      required: true,
      component: "JDictSelectTag",
      componentProps: {
        dictCode: "rule_conditions",
        onChange: methods.onRuleOperatorChange
      }
    },
    {
      label: "\u89C4\u5219\u503C",
      field: "ruleValue",
      required: true,
      component: "Input"
    },
    {
      label: "\u72B6\u6001",
      field: "status",
      required: true,
      component: "RadioButtonGroup",
      componentProps: {
        options: [
          { label: "\u6709\u6548", value: 1 },
          { label: "\u65E0\u6548", value: 0 }
        ]
      },
      defaultValue: 1
    }
  ]);
  return { formSchemas };
}
export { USE_SQL_RULES as U, authFieldColumns as a, authButtonColumns as b, authButtonFixedList as c, authDataColumns as d, useAuthDataFormSchemas as u };
