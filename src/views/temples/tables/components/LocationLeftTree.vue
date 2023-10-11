<template>
  <a-card :bordered="false" style="height: 100%">
    <div class="j-table-operator" style="width: 100%">
      <!-- <a-button type="primary" preIcon="ant-design:plus-outlined" @click="onAddDepart">新增</a-button>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="onAddChildDepart()">添加下级</a-button>
      <a-upload name="file" :showUploadList="false" :customRequest="onImportXls">
        <a-button type="primary" preIcon="ant-design:import-outlined">导入</a-button>
      </a-upload>
      <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls">导出</a-button> -->
    </div>
    <a-spin :spinning="loading">
      <template v-if="treeData.length > 0">
        <a-tree
          v-if="!treeReloading"
          :clickRowToExpand="false"
          :treeData="treeData"
          :selectedKeys="selectedKeys"
          :load-data="loadChildrenTreeData"
          v-model:expandedKeys="expandedKeys"
          @select="onSelect"
        >
          <template #title="{ key: treeKey, title }">
            <a-dropdown :trigger="['contextmenu']">
              <Popconfirm
                :visible="visibleTreeKey === treeKey"
                title="确定要删除吗？"
                ok-text="确定"
                cancel-text="取消"
                placement="rightTop"
                @visibleChange="onVisibleChange"
              >
                <span>{{ title }}</span>
              </Popconfirm>
            </a-dropdown>
          </template>
        </a-tree>
      </template>
      <a-empty v-else description="暂无数据" />
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
  import { nextTick, ref, defineExpose } from 'vue';
  import { queryTreeSync } from '../tablets.api';
  import { Popconfirm } from 'ant-design-vue';

  const emit = defineEmits(['select', 'rootTreeData']);
  const loading = ref<boolean>(false);
  // 部门树列表数据
  const treeData = ref<any[]>([]);
  // 当前展开的项
  const expandedKeys = ref<any[]>([]);
  // 当前选中的项
  const selectedKeys = ref<any[]>([]);
  // 树组件重新加载
  const treeReloading = ref<boolean>(false);
  // 当前选中的部门
  const currentDepart = ref<any>(null);
  // 控制确认删除提示框是否显示
  const visibleTreeKey = ref<any>(null);

  // 加载顶级部门信息
  async function loadRootTreeData() {
    try {
      loading.value = true;
      treeData.value = [];
      const result = await queryTreeSync();
      if (Array.isArray(result)) {
        treeData.value = result;
      }
      if (expandedKeys.value.length === 0) {
        autoExpandParentNode();
      } else {
        if (selectedKeys.value.length === 0) {
          let item = treeData.value[0];
          if (item) {
            // 默认选中第一个
            setSelectedKey(item.id, item);
          }
        } else {
          emit('select', currentDepart.value);
        }
      }
      emit('rootTreeData', treeData.value);
    } finally {
      loading.value = false;
    }
  }

  loadRootTreeData();

  // 加载子级部门信息
  async function loadChildrenTreeData(treeNode) {
    try {
      const result = await queryTreeSync({
        pid: treeNode.dataRef.id,
      });
      if (result.length == 0) {
        treeNode.dataRef.isLeaf = true;
      } else {
        treeNode.dataRef.children = result;
        if (expandedKeys.value.length > 0) {
          // 判断获取的子级是否有当前展开的项
          let subKeys: any[] = [];
          for (let key of expandedKeys.value) {
            if (result.findIndex((item) => item.id === key) !== -1) {
              subKeys.push(key);
            }
          }
          if (subKeys.length > 0) {
            expandedKeys.value = [...expandedKeys.value];
          }
        }
      }
      treeData.value = [...treeData.value];
      emit('rootTreeData', treeData.value);
    } catch (e) {
      console.error(e);
    }
    return Promise.resolve();
  }

  // 自动展开父节点，只展开一级
  function autoExpandParentNode() {
    let item = treeData.value[0];
    if (item) {
      if (!item.isLeaf) {
        expandedKeys.value = [item.key];
      }
      // 默认选中第一个
      setSelectedKey(item.id, item);
      reloadTree();
    } else {
      emit('select', null);
    }
  }

  // 重新加载树组件，防止无法默认展开数据
  async function reloadTree() {
    await nextTick();
    treeReloading.value = true;
    await nextTick();
    treeReloading.value = false;
  }

  /**
   * 设置当前选中的行
   */
  function setSelectedKey(key: string, data?: object) {
    selectedKeys.value = [key];
    if (data) {
      currentDepart.value = data;
      emit('select', data);
    }
  }

  // 树选择事件
  function onSelect(selKeys, event) {
    console.log('select: ', selKeys, event);
    if (selKeys.length > 0 && selectedKeys.value[0] !== selKeys[0]) {
      setSelectedKey(selKeys[0], event.selectedNodes[0]);
    } else {
      // 这样可以防止用户取消选择
      setSelectedKey(selectedKeys.value[0]);
    }
  }

  function onVisibleChange(visible) {
    if (!visible) {
      visibleTreeKey.value = null;
    }
  }

  defineExpose({
    loadRootTreeData,
  });
</script>
