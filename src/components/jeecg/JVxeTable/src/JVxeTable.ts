import { defineComponent, h, ref, useSlots } from 'vue';
import { vxeEmits, vxeProps } from './vxe.data';
import { useData, useRefs, useResolveComponent as rc } from './hooks/useData';
import { useColumns } from './hooks/useColumns';
import { useMethods } from './hooks/useMethods';
import { useDataSource } from './hooks/useDataSource';
import { useDragSort } from './hooks/useDragSort';
import { useRenderComponents } from './hooks/useRenderComponents';
import { useFinallyProps } from './hooks/useFinallyProps';
import { JVxeTableProps } from './types';
import './style/index.less';

export default defineComponent({
  name: 'JVxeTable',
  inheritAttrs: false,
  props: vxeProps(),
  emits: [...vxeEmits],
  setup(props: JVxeTableProps, context) {
    const instanceRef = ref();
    const refs = useRefs();
    const slots = useSlots();
    const data = useData(props);
    const { methods, publicMethods, created } = useMethods(props, context, data, refs, instanceRef);
    created();
    useColumns(props, data, methods, slots);
    useDataSource(props, data, methods, refs);
    useDragSort(props, methods);
    // 最终传入到 template 里的 props
    const finallyProps = useFinallyProps(props, data, methods);
    // 渲染子组件
    const renderComponents = useRenderComponents(props, data, methods, slots);
    return {
      instanceRef,
      ...refs,
      ...publicMethods,
      ...finallyProps,
      ...renderComponents,
      vxeDataSource: data.vxeDataSource,
    };
  },
  created() {
    this.instanceRef = this;
  },
  render() {
    return h(
      'div',
      {
        class: this.$attrs.class,
        style: this.$attrs.style,
      },
      h(
        rc('a-spin'),
        {
          spinning: this.loading,
          wrapperClassName: this.prefixCls,
        },
        {
          default: () => [
            this.renderSubPopover(),
            this.renderToolbar(),
            this.renderToolbarAfterSlot(),
            h(
              rc('vxe-grid'),
              {
                ...this.vxeProps,
                data: this.vxeDataSource,
              },
              this.$slots
            ),
            this.renderPagination(),
            this.renderDetailsModal(),
          ],
        }
      )
    );
  },
});
