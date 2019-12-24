export const toastType = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning'
};

export const isEmpty = (obj: any) => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
