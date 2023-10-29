export default {
  panels: [
    {
      index: 0,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 780,
      printElements: [
        {
          options: {
            left: 457.5,
            top: 79.5,
            height: 13,
            width: 120,
            title: '姓名',
            field: 'name',
            testData: '古力娜扎',
            color: '#f00808',
            textDecoration: 'underline',
            textAlign: 'center',
            fields: [
              { text: 'id', field: 'id' },
              { text: '姓名', field: 'name' },
              { text: '性别', field: 'gender' },
              { text: '数量', field: 'count' },
            ],
          },
          printElementType: { title: '文本', type: 'text' },
        },
        {
          options: {
            left: 60,
            top: 132,
            height: 19,
            width: 213,
            title: '所有打印元素都可已拖拽的方式来改变元素大小',
            fontFamily: '微软雅黑',
            textAlign: 'center',
            lineHeight: 18,
          },
          printElementType: { title: '自定义文本', type: 'text' },
        },
        {
          options: {
            left: 153,
            top: 189,
            height: 13,
            width: 238,
            title: '单击元素，右侧可自定义元素属性',
            textAlign: 'center',
            fontFamily: '微软雅黑',
          },
          printElementType: { title: '自定义文本', type: 'text' },
        },
        {
          options: {
            left: 415.5,
            top: 190.5,
            height: 13,
            width: 164,
            title: '可以配置各属性的默认值',
            textAlign: 'center',
            fontFamily: '微软雅黑',
          },
          printElementType: { title: '自定义文本', type: 'text' },
        },

        {
          options: { left: 60, top: 370.5, height: 18, width: 79, title: '配置项表格', textAlign: 'center' },
          printElementType: { title: '自定义文本', type: 'text' },
        },
        {
          options: {
            left: 225,
            top: 385.5,
            height: 38,
            width: 346.5,
            title: '配置模块：主要为客户使用，开发人员可以配置属性，字段，标题等，客户直接使用，配置模块请参考实例2',
            fontFamily: '微软雅黑',
            lineHeight: 15,
            textAlign: 'center',
            color: '#d93838',
          },
          printElementType: { title: '自定义文本', type: 'text' },
        },
      ],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
    },
  ],
};
