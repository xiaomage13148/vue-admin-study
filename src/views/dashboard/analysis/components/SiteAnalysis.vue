<template>
  <!-- 通过 v-bind 指令将 $attrs 对象的属性传递给 Card 组件
$attrs 包含了父组件传递给当前组件的所有属性，用于向下传递属性  -->
  <Card
    :tab-list="tabListTitle"
    v-bind="$attrs"
    :active-tab-key="activeKey"
    @tab-change="onTabChange"
  >
    <p v-if="activeKey === 'tab1'">
      <VisitAnalysis />
    </p>
    <p v-if="activeKey === 'tab2'">
      <VisitAnalysisBar />
    </p>
  </Card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import VisitAnalysis from './VisitAnalysis.vue';
  import VisitAnalysisBar from './VisitAnalysisBar.vue';

  const activeKey = ref('tab1');

  const tabListTitle = [
    {
      key: 'tab1',
      tab: '流量折线图',
    },
    {
      key: 'tab2',
      tab: '访问柱状图',
    },
  ];

  function onTabChange(key) {
    activeKey.value = key;
  }
</script>
