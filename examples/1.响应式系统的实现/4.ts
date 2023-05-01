// 用一个全局变量来存储被注册的副作用函数
let activeEffect;

// effect函数用来注册副作用函数
// function effect(fn) {
//   // 当调用effect函数时，将副作用函数fn赋值给activeEffect
//   activeEffect = fn;
//   // 执行副作用函数
//   fn();
// }

// 使用effect函数来注册一个副作用函数
// effect(
//   // 一个匿名的副作用函数
//   () => {
//   document.querySelector("#root")?.textContent = obj.text;
// });

function effect(fn) {
  
  const effectFn = () => {
    cleanUp(effectFn)
    activeEffect = effectFn
    fn()
  }

  effectFn.deps = []
  effectFn()
}

function cleanUp(effectFn) {
  effectFn.deps.forEach(deps => {
    deps.delete(effectFn)
  })
  effectFn.deps.length = 0
}

const bucket = new WeakMap()
const obj = new Proxy(data, {
  get(target, key) {
    track(target,key)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    trigger(target,key)
    return true
  }
})

function track(target, key ) {
  if(!activeEffect) return target[key]
    let depsMap = bucket.get(target)
    if(!depsMap) {
      bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps) {
      depsMap.set(key,(deps = new Set()))
    }
    deps.add(activeEffect)

    activeEffect.deps.push(deps)
}

function trigger(target,key) {
  const depsMap = bucket.get(target)
  if(!depsMap) return true
  const effects = depsMap.get(key)
  // effects && effects.forEach(fn => fn())
  const effectsToRun = new Set(effects)
  effectsToRun.forEach(effectFn => effectFn())
}
export {}