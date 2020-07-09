const debounce = (func, delay = 1000) => {
  let timeOutId;
  //  same as (arg1, arg2, arg3)
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      // same as func(arg1, arg2, arg3)
      func.apply(null, args);
    }, delay);
  };
};
