let activeEffect

const effectStack = []

function effect(fn) {
  const effectFn = () => {
    cleanUp(effectFn)

    activeEffect = fn

    effectStack.push(effectFn)

    fn()

    effectStack.pop()

    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.deps = []

  effectFn()
}

const bucket = new WeakMap()

const data = { foo:true, bar:true }
const obj = new Proxy(data,{
  get(target,key) {
    track(target,key)
    return target[key]
  },
  set(target,key,value) {
    target[key] = value
    trigger(target,key)
    return true
  }
})

function track(target,key) {
  if(!activeEffect) return target[key]
  let depsMap = bucket.get(target)
  if(!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if(!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  deps.add(activeEffect)
  // deps就是一个与当前副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps)
}

function trigger(target,key) {
  let depsMap = bucket.get(target)
  if(!depsMap) return true

  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if(activeEffect !== effectFn) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => effectFn())
}


function cleanUp(effectFn) {
  effectFn.deps.forEach(deps => {
    deps.delete(effectFn)
  })
  effectFn.deps.length = 0
}

export {}