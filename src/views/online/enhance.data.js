import { computed } from 'vue';
import { o as onlineDefaultButton } from './cgform.data.js';
function useJavaColumns(btnList) {
  let columns = [
    {
      title: '\u9875\u9762\u6309\u94AE',
      align: 'center',
      dataIndex: 'buttonCode',
      customRender: ({ text }) => renderButtonText(text, btnList.value),
    },
    {
      title: '\u4E8B\u4EF6\u72B6\u6001',
      align: 'center',
      dataIndex: 'event',
      customRender: ({ text }) => (text == 'start' ? '\u5F00\u59CB' : '\u7ED3\u675F'),
    },
    {
      title: '\u7C7B\u578B',
      align: 'center',
      dataIndex: 'cgJavaType',
      customRender: ({ text }) => {
        if (text == 'spring') {
          return 'spring-key';
        } else if (text === 'class') {
          return 'java-class';
        } else if (text === 'http') {
          return 'http-api';
        } else {
          return text;
        }
      },
    },
    {
      title: '\u5185\u5BB9',
      align: 'center',
      dataIndex: 'cgJavaValue',
    },
    {
      title: '\u662F\u5426\u751F\u6548',
      align: 'center',
      dataIndex: 'activeStatus',
      customRender: ({ text }) => {
        if (text == '1') {
          return '\u6709\u6548';
        } else {
          return '\u65E0\u6548';
        }
      },
    },
  ];
  return { columns };
}
function useJavaFormSchemas(btnList) {
  const formSchemas = computed(() => {
    return [
      {
        label: '\u9875\u9762\u6309\u94AE',
        field: 'buttonCode',
        component: 'Select',
        componentProps: {
          options: [
            { label: '\u65B0\u589E', value: 'add' },
            { label: '\u7F16\u8F91', value: 'edit' },
            { label: '\u5220\u9664', value: 'delete' },
            { label: '\u5BFC\u5165', value: 'import' },
            { label: '\u5BFC\u51FA', value: 'export' },
            { label: '\u67E5\u8BE2', value: 'query' },
            ...btnList.value.map((item) => ({ label: item.buttonName, value: item.buttonCode })),
          ],
        },
        defaultValue: 'add',
      },
      {
        label: '\u4E8B\u4EF6\u72B6\u6001',
        field: 'event',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u5F00\u59CB', value: 'start' },
            { label: '\u7ED3\u675F', value: 'end' },
          ],
        },
        defaultValue: 'end',
      },
      {
        label: '\u7C7B\u578B',
        field: 'cgJavaType',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: 'spring-key', value: 'spring' },
            { label: 'java-class', value: 'class' },
            { label: 'http-api', value: 'http' },
          ],
        },
        defaultValue: 'spring',
      },
      {
        label: '\u5185\u5BB9',
        field: 'cgJavaValue',
        component: 'Input',
        required: true,
      },
      {
        label: '\u662F\u5426\u751F\u6548',
        field: 'activeStatus',
        component: 'RadioButtonGroup',
        componentProps: {
          options: [
            { label: '\u6709\u6548', value: '1' },
            { label: '\u65E0\u6548', value: '0' },
          ],
        },
        defaultValue: '1',
      },
    ];
  });
  return { formSchemas };
}
function useSqlColumns(btnList) {
  let columns = [
    {
      title: '\u9875\u9762\u6309\u94AE',
      align: 'center',
      dataIndex: 'buttonCode',
      customRender: ({ text }) => renderButtonText(text, btnList.value),
    },
    {
      title: '\u589E\u5F3ASQL',
      align: 'center',
      dataIndex: 'cgbSql',
      ellipsis: true,
    },
  ];
  return { columns };
}
function useSqlFormSchemas(btnList) {
  const formSchemas = computed(() => {
    return [
      {
        label: '\u9875\u9762\u6309\u94AE',
        field: 'buttonCode',
        component: 'Select',
        componentProps: {
          options: [
            { label: '\u65B0\u589E', value: 'add' },
            { label: '\u7F16\u8F91', value: 'edit' },
            { label: '\u5220\u9664', value: 'delete' },
            ...btnList.value.map((item) => ({ label: item.buttonName, value: item.buttonCode })),
          ],
        },
        defaultValue: 'add',
      },
      {
        label: '\u589E\u5F3ASQL',
        field: 'cgbSql',
        component: 'JCodeEditor',
        componentProps: {
          language: 'sql',
          placeholder: '\u8BF7\u8F93\u5165SQL\u8BED\u53E5',
          languageChange: false,
          lineNumbers: false,
          fullScreen: true,
          height: '320px',
        },
        defaultValue: '',
      },
      {
        label: '\u63CF\u8FF0',
        field: 'content',
        component: 'InputTextArea',
        defaultValue: '',
      },
    ];
  });
  return { formSchemas };
}
function renderButtonText(text, btnList) {
  let str = text;
  for (let item of onlineDefaultButton) {
    if (item.code === text) {
      str = item.title;
      break;
    }
  }
  if (!str) {
    for (let item of btnList) {
      if (item.buttonCode === text) {
        str = item.buttonName;
        break;
      }
    }
  }
  return str;
}
export { useJavaColumns as a, useSqlFormSchemas as b, useSqlColumns as c, useJavaFormSchemas as u };
