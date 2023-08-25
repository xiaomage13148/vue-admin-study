import type { EChartsOption } from 'echarts';
import type { Ref } from 'vue';
import { useTimeoutFn } from '@vben/hooks';
import { tryOnUnmounted, useDebounceFn } from '@vueuse/core';
import { unref, nextTick, watch, computed, ref } from 'vue';
import { useEventListener } from '/@/hooks/event/useEventListener';
import { useBreakpoint } from '/@/hooks/event/useBreakpoint';
import echarts from '/@/utils/lib/echarts';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'default',
) {
  const { getDarkMode: getSysDarkMode } = useRootSetting();
  const { getCollapsed } = useMenuSetting();

  const getDarkMode = computed(() => {
    return theme === 'default' ? getSysDarkMode.value : theme;
  });
  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Fn = resize;
  const cacheOptions = ref({}) as Ref<EChartsOption>;
  let removeResizeFn: Fn = () => {};

  resizeFn = useDebounceFn(resize, 200);

  const getOptions = computed(() => {
    if (getDarkMode.value !== 'dark') {
      return cacheOptions.value as EChartsOption;
    }
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption;
  });

  function initCharts(t = theme) {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t);
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn,
    });
    removeResizeFn = removeEvent;
    const { widthRef, screenEnum } = useBreakpoint();
    if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn();
      }, 30);
    }

    // TODO echarts 绑定事件不生效
    // chartInstance.on('click' , params => {
    //   console.log('---->打印params' , params);
    // })
  }

  /**
   * 设置图表配置项
   * @param options 图表配置项
   * @param clear 在设置选项前清除图表
   */
  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options;
    return new Promise((resolve) => {
      // 如果图表没有正确渲染
      if (unref(elRef)?.offsetHeight === 0) {
        // 30ms后递归执行
        useTimeoutFn(() => {
          setOptions(unref(getOptions));
          resolve(null);
        }, 30);
      }
      // 下一个dom更新周期执行
      nextTick(() => {
        useTimeoutFn(() => {
          // 双重校验 图表实例不存在
          if (!chartInstance) {
            // 执行默认初始化图表
            initCharts(getDarkMode.value as 'default');
            // 图表实例依然不存在 , 直接返回
            if (!chartInstance) return;
          }

          // if clear --> true 则 清空图表实例
          clear && chartInstance?.clear();

          // 传入配置项
          chartInstance?.setOption(unref(getOptions));
          resolve(null);
        }, 30);
      });
    });
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    });
  }

  watch(
    () => getDarkMode.value,
    (theme) => {
      if (chartInstance) {
        chartInstance.dispose();
        initCharts(theme as 'default');
        setOptions(cacheOptions.value);
      }
    },
  );

  watch(getCollapsed, (_) => {
    useTimeoutFn(() => {
      resizeFn();
    }, 300);
  });

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode.value as 'default');
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  };
}
