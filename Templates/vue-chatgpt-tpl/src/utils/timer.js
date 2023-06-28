let timeout = null;

export function debounce(func, wait = 500, immediate = false) {
  if (timeout !== null) clearTimeout(timeout);
  if (immediate) {
    var callNow = !timeout;
    timeout = setTimeout(function () {
      timeout = null;
    }, wait);
    if (callNow) typeof func === "function" && func();
  } else {
    timeout = setTimeout(function () {
      typeof func === "function" && func();
    }, wait);
  }
}

export const throttle = (func, wait = 300) => {
  let timer;

  return () => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      func();
      timer = null;
    }, wait);
  };
};
