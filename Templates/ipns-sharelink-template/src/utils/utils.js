let timeout = null;

function debounce(func, wait = 500, immediate = false) {
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

function getFileSize(byte, isObj = false, fix = 2) {
  if (!byte && byte !== 0 && !isObj) {
    return byte;
  }
  const mb = Math.pow(1024, 2);
  const gb = Math.pow(1024, 3);
  const tb = Math.pow(1024, 4);
  let num = byte;
  let unit = "B";
  if (byte >= tb) {
    num = byte / tb;
    unit = "TB";
  } else if (byte >= gb) {
    num = byte / gb;
    unit = "GB";
  } else if (byte >= mb) {
    num = byte / mb;
    unit = "MB";
  } else if (byte >= 1024 || byte < 0.01) {
    num = byte / 1024;
    unit = "KB";
  } else if (byte > 0) {
    num = parseInt(byte);
  }
  if (unit != "B") {
    num = num.toFixed(fix);
  }
  if (num) num = (num + "").replace(".00", "");
  if (isObj)
    return {
      num,
      unit,
    };
  return num + " " + unit;
}

String.prototype.cutStr = function (pre = 100, trail = 0) {
  if (this.length <= pre + 3 + trail) return this;
  let txt = this.substr(0, pre) + "...";
  if (trail) txt += this.substr(-trail);
  return txt;
};
export { getFileSize, debounce };
