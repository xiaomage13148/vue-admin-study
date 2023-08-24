import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { basicRoutes } from './routes';

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
// 将路由列表添加到白名单中
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
// 添加基础静态路由
getRouteNames(basicRoutes);

// app router
// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  // 配置滚动行为
  scrollBehavior: () => ({ left: 0, top: 0 }),
} as RouterOptions);

// 重置路由配置
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    // 如果路由配置具有 name 属性，并且该 name 不在 WHITE_NAME_LIST 白名单中
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      // 检查路由是否存在，如果存在，则从路由配置中移除这个路由
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// config router
// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router);
}
