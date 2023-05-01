// 存储副作用的桶
const bucket = new Set()

// 原始数据
const data = { text:'hello world'}

// 对原始数据进行代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数加入bucket中
    bucket.add(effect) 
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, value) {
    // 设置属性值
    target[key] = value
    // 把副作用函数从bucket中取出并执行
    bucket.forEach(effect => effect())
    // 返回true
    return true
  }
})