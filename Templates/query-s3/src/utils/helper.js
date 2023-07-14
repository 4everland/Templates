export const toTree = (arr, pid) => {
  function loop(pid) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.pid !== pid) {
        continue;
      }
      if (item.cid) {
        item.children = loop(item.cid);
      }
      res.push(item);
    }
    return res;
  }
  return loop(pid);
};

export async function limitLoad(list, handler, limit = 5) {
  const sequence = [].concat(list);
  let promise = [];
  let err = false;
  promise = sequence.splice(0, limit).map((it, index) => {
    return handler(it)
      .then(() => {
        return index;
      })
      .catch((e) => {
        err = e;
      });
  });
  let race = Promise.race(promise);
  for (const it of sequence) {
    if (err) throw err;
    const index = await race;
    promise[index] = handler(it)
      .then(() => {
        return index;
      })
      .catch((e) => {
        err = e;
      });
    race = Promise.race(promise);
  }
}

export const calcGCD = (u, v) => {
  while (v != 0) {
    [u, v] = [v, u % v];
  }
  return u;
};
