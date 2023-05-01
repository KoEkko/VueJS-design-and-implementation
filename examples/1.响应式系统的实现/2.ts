// 用一个全局变量来存储被注册的副作用函数
let activeEffect;

// effect函数用来注册副作用函数
function effect(fn) {
  // 当调用effect函数时，将副作用函数fn赋值给activeEffect
  activeEffect = fn;
  // 执行副作用函数
  fn();
}

// 使用effect函数来注册一个副作用函数
effect(
  // 一个匿名的副作用函数
  () => {
  document.querySelector("#root")?.textContent = obj.text;
});

const bucket = new Set()
const obj = new Proxy(data, {
  get(target, key) {
    if(!activeEffect) return target[key]
    bucket.add(activeEffect)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    bucket.forEach(fn => fn())
    return true
  }
})


export {}