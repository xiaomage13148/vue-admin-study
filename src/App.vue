<template>
  <!-- Ant Design 全局化配置组件 -->
  <ConfigProvider :locale="getAntdLocale">
    <!--  自定义组件  -->
    <AppProvider>
      <RouterView/>
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
// https://cn.vuejs.org/api/sfc-script-setup.html
// 单文件组件 , 将代码中的内容编译到组件中的setup函数
import {ConfigProvider} from 'ant-design-vue';
import {AppProvider} from '@/components/Application';
import {useTitle} from '@/hooks/web/useTitle';
import {useLocale} from '@/locales/useLocale';
import 'dayjs/locale/zh-cn';

// support Multi-language
const {getAntdLocale} = useLocale();

// Listening to page changes and dynamically changing site titles
useTitle();
</script>
