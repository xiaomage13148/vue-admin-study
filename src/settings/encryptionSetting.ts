import { isDevMode } from '/@/utils/env';

// 用于配置缓存内容加密信息，对缓存到浏览器的信息进行 AES 加密
// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes encryption key
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

// Whether the system cache is encrypted using aes
export const enableStorageEncryption = !isDevMode();
