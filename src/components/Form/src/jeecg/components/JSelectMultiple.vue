<!--字典下拉多选-->
<template>
  <a-select
    :value="arrayValue"
    @change="onChange"
    mode="multiple"
    :filter-option="filterOption"
    :disabled="disabled"
    :placeholder="placeholder"
    allowClear
    :getPopupContainer="getParentContainer"
  >
    <a-select-option v-for="(item, index) in dictOptions" :key="index" :getPopupContainer="getParentContainer" :value="item.value">
      {{ item.text || item.label }}
    </a-select-option>
  </a-select>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref, nextTick, watch } from 'vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { propTypes } from '/@/utils/propTypes';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { getDictItems } from '/@/api/common/api';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage, createErrorModal } = useMessage();
  export default defineComponent({
    name: 'JSelectMultiple',
    components: {},
    inheritAttrs: false,
    props: {
      value: propTypes.oneOfType([propTypes.string, propTypes.array]),
      placeholder: {
        type: String,
        default: '请选择',
        required: false,
      },
      readOnly: {
        type: Boolean,
        required: false,
        default: false,
      },
      options: {
        type: Array,
        default: () => [],
        required: false,
      },
      triggerChange: {
        type: Boolean,
        required: false,
        default: true,
      },
      spliter: {
        type: String,
        required: false,
        default: ',',
      },
      popContainer: {
        type: String,
        default: '',
        required: false,
      },
      dictCode: {
        type: String,
        required: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['options-change', 'change', 'input', 'update:value'],
    setup(props, { emit, refs }) {
      const emitData = ref<any[]>([]);
      const arrayValue = ref<any[]>(!props.value ? [] : props.value.split(props.spliter));
      const dictOptions = ref<any[]>([]);
      const attrs = useAttrs();
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      onMounted(() => {
        if (props.dictCode) {
          loadDictOptions();
        } else {
          dictOptions.value = props.options;
        }
      });

      watch(
        () => props.value,
        (val) => {
          if (!val) {
            arrayValue.value = [];
          } else {
            arrayValue.value = props.value.split(props.spliter);
          }
        }
      );

      //适用于 动态改变下拉选项的操作
      watch(
        () => props.options,
        () => {
          if (props.dictCode) {
            // nothing to do
          } else {
            dictOptions.value = props.options;
          }
        }
      );

      function onChange(selectedValue) {
        if (props.triggerChange) {
          emit('change', selectedValue.join(props.spliter));
          emit('update:value', selectedValue.join(props.spliter));
        } else {
          emit('input', selectedValue.join(props.spliter));
          emit('update:value', selectedValue.join(props.spliter));
        }
      }

      function getParentContainer(node) {
        if (!props.popContainer) {
          return node.parentNode;
        } else {
          return document.querySelector(props.popContainer);
        }
      }

      // 根据字典code查询字典项
      function loadDictOptions() {
        //update-begin-author:taoyan date:2022-6-21 for: 字典数据请求前将参数编码处理，但是不能直接编码，因为可能之前已经编码过了
        let temp = props.dictCode || '';
        if (temp.indexOf(',') > 0 && temp.indexOf(' ') > 0) {
          // 编码后 是不包含空格的
          temp = encodeURI(temp);
        }
        //update-end-author:taoyan date:2022-6-21 for: 字典数据请求前将参数编码处理，但是不能直接编码，因为可能之前已经编码过了
        getDictItems(temp).then((res) => {
          if (res) {
            dictOptions.value = res.map((item) => ({ value: item.value, label: item.text }));
          } else {
            console.error('getDictItems error: : ', res);
            dictOptions.value = [];
          }
        });
      }

      //update-begin-author:taoyan date:2022-5-31 for: VUEN-1145 下拉多选，搜索时，查不到数据
      function filterOption(input, option) {
        return option.children()[0].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }
      //update-end-author:taoyan date:2022-5-31 for: VUEN-1145 下拉多选，搜索时，查不到数据

      return {
        state,
        attrs,
        dictOptions,
        onChange,
        arrayValue,
        getParentContainer,
        filterOption,
      };
    },
  });
</script>
