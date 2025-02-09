<template>
  <!--异步字典下拉搜素-->
  <a-select
    v-if="async"
    v-bind="attrs"
    v-model:value="selectedAsyncValue"
    showSearch
    labelInValue
    allowClear
    :getPopupContainer="getParentContainer"
    :placeholder="placeholder"
    :filterOption="false"
    :notFoundContent="loading ? undefined : null"
    @search="loadData"
    @change="handleAsyncChange"
  >
    <template #notFoundContent>
      <a-spin size="small" />
    </template>
    <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
  </a-select>
  <!--字典下拉搜素-->
  <a-select
    v-else
    v-model:value="selectedValue"
    v-bind="attrs"
    showSearch
    :getPopupContainer="getParentContainer"
    :placeholder="placeholder"
    :filterOption="filterOption"
    :notFoundContent="loading ? undefined : null"
    :dropdownAlign="{ overflow: { adjustY: adjustY } }"
    @change="handleChange"
  >
    <template #notFoundContent>
      <a-spin v-if="loading" size="small" />
    </template>
    <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
  </a-select>
</template>

<script lang="ts">
  import { useDebounceFn } from '@vueuse/core';
  import { defineComponent, PropType, ref, reactive, watchEffect, computed, unref, watch, onMounted } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { initDictOptions } from '/@/utils/dict/index';
  import { defHttp } from '/@/utils/http/axios';

  export default defineComponent({
    name: 'JSearchSelect',
    inheritAttrs: false,
    props: {
      value: propTypes.oneOfType([propTypes.string, propTypes.number]),
      dict: propTypes.string,
      dictOptions: {
        type: Array,
        default: () => [],
      },
      async: propTypes.bool.def(false),
      placeholder: propTypes.string,
      popContainer: propTypes.string,
      pageSize: propTypes.number.def(10),
      getPopupContainer: {
        type: Function,
        default: (node) => node.parentNode,
      },
      //默认开启Y轴溢出位置调整，因此在可视空间不足时下拉框位置会自动上移，导致Select的输入框被遮挡。需要注意的是，默认情况是是可视空间，而不是所拥有的空间
      //update-begin-author:liusq date:2023-04-04 for:[issue/286]下拉搜索框遮挡问题
      adjustY: propTypes.bool.def(true),
      //update-end-author:liusq date:2023-04-04 for:[issue/286]下拉搜索框遮挡问题
      //是否在有值后立即触发change
      immediateChange: propTypes.bool.def(false),
      //update-begin-author:taoyan date:2022-8-15 for: VUEN-1971 【online 专项测试】关联记录和他表字段 1
      //支持传入查询参数，如排序信息
      params: {
        type: Object,
        default: () => {},
      },
      //update-end-author:taoyan date:2022-8-15 for: VUEN-1971 【online 专项测试】关联记录和他表字段 1
    },
    emits: ['change', 'update:value'],
    setup(props, { emit, refs }) {
      const options = ref<any[]>([]);
      const loading = ref(false);
      const attrs = useAttrs();
      const selectedValue = ref([]);
      const selectedAsyncValue = ref([]);
      const lastLoad = ref(0);
      // 是否根据value加载text
      const loadSelectText = ref(true);
      /**
       * 监听字典code
       */
      watchEffect(() => {
        props.dict && initDictData();
      });
      /**
       * 监听value
       */
      watch(
        () => props.value,
        (val) => {
          if (val || val === 0) {
            initSelectValue();
          } else {
            selectedValue.value = [];
            selectedAsyncValue.value = [];
          }
        },
        { immediate: true }
      );
      /**
       * 监听dictOptions
       */
      watch(
        () => props.dictOptions,
        (val) => {
          if (val && val.length > 0) {
            options.value = [...val];
          }
        },
        { immediate: true }
      );
      /**
       * 异步查询数据
       */
      async function loadData(value) {
        lastLoad.value += 1;
        const currentLoad = unref(lastLoad);
        options.value = [];
        loading.value = true;
        let keywordInfo = getKeywordParam(value);
        // 字典code格式：table,text,code
        defHttp
          .get({
            url: `/sys/dict/loadDict/${props.dict}`,
            params: { keyword: keywordInfo, pageSize: props.pageSize },
          })
          .then((res) => {
            loading.value = false;
            if (res && res.length > 0) {
              if (currentLoad != unref(lastLoad)) {
                return;
              }
              options.value = res;
            }
          });
      }
      /**
       * 初始化value
       */
      function initSelectValue() {
        //update-begin-author:taoyan date:2022-4-24 for: 下拉搜索组件每次选中值会触发value的监听事件，触发此方法，但是实际不需要
        if (loadSelectText.value === false) {
          loadSelectText.value = true;
          return;
        }
        //update-end-author:taoyan date:2022-4-24 for: 下拉搜索组件每次选中值会触发value的监听事件，触发此方法，但是实际不需要
        let { async, value, dict } = props;
        if (async) {
          if (!selectedAsyncValue.value || !selectedAsyncValue.value.key || selectedAsyncValue.value.key !== value) {
            defHttp.get({ url: `/sys/dict/loadDictItem/${dict}`, params: { key: value } }).then((res) => {
              if (res && res.length > 0) {
                let obj = {
                  key: value,
                  label: res,
                };
                selectedAsyncValue.value = { ...obj };
                //update-begin-author:taoyan date:2022-8-11 for: 值改变触发change事件--用于online关联记录配置页面
                if (props.immediateChange == true) {
                  emit('change', value);
                }
                //update-end-author:taoyan date:2022-8-11 for: 值改变触发change事件--用于online关联记录配置页面
              }
            });
          }
        } else {
          selectedValue.value = value.toString();
          //update-begin-author:taoyan date:2022-8-11 for: 值改变触发change事件--用于online他表字段配置界面
          if (props.immediateChange == true) {
            emit('change', value.toString());
          }
          //update-end-author:taoyan date:2022-8-11 for: 值改变触发change事件--用于online他表字段配置界面
        }
      }

      /**
       * 初始化字典下拉数据
       */
      async function initDictData() {
        let { dict, async, dictOptions, pageSize } = props;
        if (!async) {
          //如果字典项集合有数据
          if (dictOptions && dictOptions.length > 0) {
            options.value = dictOptions;
          } else {
            //根据字典Code, 初始化字典数组
            let dictStr = '';
            if (dict) {
              let arr = dict.split(',');
              if (arr[0].indexOf('where') > 0) {
                let tbInfo = arr[0].split('where');
                dictStr = tbInfo[0].trim() + ',' + arr[1] + ',' + arr[2] + ',' + encodeURIComponent(tbInfo[1]);
              } else {
                dictStr = dict;
              }
              //根据字典Code, 初始化字典数组
              const dictData = await initDictOptions(dictStr);
              options.value = dictData;
            }
          }
        } else {
          if (!dict) {
            console.error('搜索组件未配置字典项');
          } else {
            //异步一开始也加载一点数据
            loading.value = true;
            let keywordInfo = getKeywordParam('');
            defHttp
              .get({
                url: `/sys/dict/loadDict/${dict}`,
                params: { pageSize: pageSize, keyword: keywordInfo },
              })
              .then((res) => {
                loading.value = false;
                if (res && res.length > 0) {
                  options.value = res;
                }
              });
          }
        }
      }
      /**
       * 同步改变事件
       * */
      function handleChange(value) {
        selectedValue.value = value;
        callback();
      }
      /**
       * 异步改变事件
       * */
      function handleAsyncChange(selectedObj) {
        if (selectedObj) {
          selectedAsyncValue.value = selectedObj;
          selectedValue.value = selectedObj.key;
        } else {
          selectedAsyncValue.value = null;
          selectedValue.value = null;
          options.value = null;
          loadData('');
        }
        callback();
      }
      /**
       *回调方法
       * */
      function callback() {
        loadSelectText.value = false;
        emit('change', unref(selectedValue));
        emit('update:value', unref(selectedValue));
      }
      /**
       * 过滤选中option
       */
      function filterOption(input, option) {
        //update-begin-author:taoyan date:2022-11-8 for: issues/218 所有功能表单的下拉搜索框搜索无效
        let value = '',
          label = '';
        try {
          value = option.value;
          label = option.children()[0].children;
        } catch (e) {
          console.log('获取下拉项失败', e);
        }
        let str = input.toLowerCase();
        return value.toLowerCase().indexOf(str) >= 0 || label.toLowerCase().indexOf(str) >= 0;
        //update-end-author:taoyan date:2022-11-8 for: issues/218 所有功能表单的下拉搜索框搜索无效
      }

      function getParentContainer(node) {
        // update-begin-author:taoyan date:20220407 for: getPopupContainer一直有值 导致popContainer的逻辑永远走不进去，把它挪到前面判断
        if (props.popContainer) {
          return document.querySelector(props.popContainer);
        } else {
          if (typeof props.getPopupContainer === 'function') {
            return props.getPopupContainer(node);
          } else {
            return node.parentNode;
          }
        }
        // update-end-author:taoyan date:20220407 for: getPopupContainer一直有值 导致popContainer的逻辑永远走不进去，把它挪到前面判断
      }

      //update-begin-author:taoyan date:2022-8-15 for: VUEN-1971 【online 专项测试】关联记录和他表字段 1
      //获取关键词参数 支持设置排序信息
      function getKeywordParam(text) {
        // 如果设定了排序信息，需要写入排序信息，在关键词后加 [orderby:create_time,desc]
        if (props.params && props.params.column && props.params.order) {
          let temp = text || '';

          //update-begin-author:taoyan date:2023-5-22 for: /issues/4905 表单生成器字段配置时，选择关联字段，在进行高级配置时，无法加载数据库列表，提示 Sgin签名校验错误！ #4905
          temp = temp + '[orderby:' + props.params.column + ',' + props.params.order + ']';
          return encodeURI(temp);
          //update-end-author:taoyan date:2023-5-22 for: /issues/4905 表单生成器字段配置时，选择关联字段，在进行高级配置时，无法加载数据库列表，提示 Sgin签名校验错误！ #4905
        } else {
          return text;
        }
      }
      //update-end-author:taoyan date:2022-8-15 for: VUEN-1971 【online 专项测试】关联记录和他表字段 1

      return {
        attrs,
        options,
        loading,
        selectedValue,
        selectedAsyncValue,
        loadData: useDebounceFn(loadData, 800),
        getParentContainer,
        filterOption,
        handleChange,
        handleAsyncChange,
      };
    },
  });
</script>

<style scoped></style>
