export const openUrl = (method, params) => {
  return window.invokeNative?.(method, params) ?? null;
};
