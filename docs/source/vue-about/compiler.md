# 简易渲染器的实现

1. 挂载子节点和元素的属性
2. 处理 `HTML Attributes` 和 `DOM Properties`
3. `class` 处理
4. 卸载操作
5. 区分 `vnode` 类型
6. 事件的处理
7. 更新子节点
8. 文本节点和注释节点
9. `Fragment`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="app"></div>
  <script src="./reactivity.global.js"></script>
  <script>
    const { effect, ref } = VueReactivity

    // 创建元素
    function createElement(tag) {
      console.log(`创建元素 ${tag}`)
      return document.createElement(tag)
    }
    // 设置元素的文本节点
    function setElementText(el, text) {
      // console.log(`设置 ${JSON.stringify(el)} 的文本内容：${text}`)
      el.textContent = text
    }
    // 在给定的parent下添加指定元素
    function insert(el, parent, anchor = null) {
      // console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`)

      parent.insertBefore(el, anchor)
    }
    // 将属性设置相关操作封装到 patchProps 函数中，并作为渲染器选项传递
    function patchProps(el, key, preValue, nextValue) {
      if (/^on/.test(key)) {
        const invokers = el._vei || (el._vei = {})
        let invoker = invokers[key]
        const name = key.slice(2).toLowerCase()
        if (nextValue) {
          if (!invoker) {
            invoker = el._vei[key] = e => {
              if (Array.isArray(invoker.value)) {
                invoker.value.forEach(fn => fn())

              } else {
                invoker.value(e)
              }
            }
            invoker.value = nextValue
            el.addEventListener(name, invoker)
          } else {
            invoker.value = nextValue
          }
        } else if (invoker) {
          el.removeEventListener(name, invoker)
        }
      } else if (key === 'class') {
        el.className = nextValue || ''
      }
      // key 的HTML Attributes属性是否存在与 DOM properties 上
      else if (shouldSetAsProps(el, key, nextValue)) {
        const type = typeof el[key]
        if (type === 'boolean' && nextValue === '') {
          el[key] = true
        } else {
          el[key] = nextValue
        }
      } else {
        el.setAttribute(key, nextValue)
      }
    }

    //  <form id="form1"></form>  <input form="form1" /> 只读
    function shouldSetAsProps(el, key, value) {
      if (key === 'form' && el.tagName === 'INPUT') return false
      return key in el
    }

    function normalizeClass(value) {
      let res = ''
      if (typeof value === 'string') {
        res = value
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i])
          if (normalized) {
            res += normalized + ' '
          }
        }
      } else if (value !== null && typeof value === 'object') {
        for (const name in value) {
          if (value[name]) {
            res += name + ' '
          }
        }
      }
      return res.trim()
    }

    function createRenderer(options) {
      const { createElement, setElementText, insert, patchProps } = options

      function patch(n1, n2, container) {
        // 标签 tagName 不同
        if (n1 && n1.type !== n2.type) {
          unmount(n1)
          n1 = null
        }

        const { type } = n2
        if (typeof type === 'string') {
          if (!n1) {
            mountElement(n2, container)
          } else {
            // 更新，打补丁
            patchElement(n1, n2)
          }
        } else if (typeof type === 'object') {
          // 是对象，则是组件

        } else if (type === 'xxx') {
          // 处理其他类型的 vnode
        }
      }

      function mountElement(vnode, container) {
        // 让 vnode.el 引用真实的 DOM 元素
        const el = vnode.el = createElement(vnode.type)

        // 处理元素
        if (typeof vnode.children === "string") {
          setElementText(el, vnode.children)
        } else if (Array.isArray(vnode.children)) {
          vnode.children.forEach(child => {
            patch(null, child, el)
          });
        }

        // 处理元素属性
        if (vnode.props) {
          for (const key in vnode.props) {
            patchProps(el, key, null, vnode.props[key])
          }
        }

        insert(el, container)
      }

      function render(vnode, container) {
        if (vnode) {
          patch(container._vnode, vnode, container)
        } else {
          if (container._vnode) {
            // 卸载
            unmount(container._vnode)
          }
        }
        container._vnode = vnode
      }

      return { render }
    }

    function unmount(vnode) {
      // 获取 el 的父级元素
      const parent = vnode.el.parentNode
      if (parent) parent.removeChild(vnode.el)
    }

    const renderer = createRenderer({ createElement, setElementText, insert, patchProps })


    //  -------------

    const count = ref(1)

    const vnode = {
      type: 'div',
      props: {
        id: 'foo',
        // 使用 normalizeClass 函数对值进行序列化（转换为字符串形式）
        class: normalizeClass([
          'foo bar',
          { baz: true }
        ]),
        // 序列化后
        // class: 'foo bar bazs7'
      },
      children: [
        {
          type: 'p',
          children: 'hello'
        },
        {
          type: 'button',
          props: {
            disabled: 666,
            onClick: () => {
              alert('clicked')
            }
          },
          children: '按钮'
        }
      ]
    }

    effect(() => {
      renderer.render(vnode, document.getElementById('app'))
    })

    count.value++
  </script>


</body>

</html>

```
