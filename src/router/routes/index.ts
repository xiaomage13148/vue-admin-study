import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
// { eager: true } 立即加载这些模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: AppRouteModule[] = [];

// TODO ---->打印modules , 日期: 2023/8/25
console.log(`---->打印modules , 当前时间是: ${new Date().toString()}`, modules);

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  // 获取模块路径对应的模块的默认导出 , 没有的话设置为 {}
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

// TODO ---->打印routeModuleList , 日期: 2023/8/25
console.log(`---->打印routeModuleList , 当前时间是: ${new Date().toString()}`, routeModuleList);

// 异步路由
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
} as AppRouteRecordRaw;

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
} as AppRouteRecordRaw;

// 不需要权限的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
