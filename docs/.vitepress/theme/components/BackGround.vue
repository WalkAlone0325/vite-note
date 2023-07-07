<script setup lang="ts">
import { ref, reactive, onMounted, Ref } from 'vue'
import { useWindowSize, useRafFn } from '@vueuse/core'
import type { Fn } from '@vueuse/core'

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12
const color = '#88888825'

const canvas = ref<HTMLCanvasElement | null>(null)

const { random } = Math
const size = reactive(useWindowSize())
let start = ref<Fn>(() => { })
let stopped = ref(false)
const init = ref(4)
const len = ref(6)

function initCanvas(
  canvas: Ref<HTMLCanvasElement>,
  width = 400,
  height = 400,
  _dpi?: number
) {
  const ctx = canvas.value.getContext('2d')!

  const dpr = window.devicePixelRatio || 1
  // @ts-expect-error vendor
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1

  const dpi = _dpi || dpr / bsr

  canvas.value.style.width = `${width}px`
  canvas.value.style.height = `${height}px`
  canvas.value.width = dpi * width
  canvas.value.height = dpi * height
  ctx.scale(dpi, dpi)

  return { ctx, dpi }
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}

onMounted(() => {
  const { ctx } = initCanvas(canvas!, size.width, size.height)
  const { width, height } = canvas.value!

  let steps: Fn[] = []
  let prevSteps: Fn[] = []

  let iterations = 0
  const step = (x: number, y: number, rad: number) => {
    const length = random() * len.value

    const [nx, ny] = polar2cart(x, y, length, rad)

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()

    const rad1 = rad + random() * r15
    const rad2 = rad - random() * r15

    if (
      nx < -200 ||
      nx > size.width + 200 ||
      ny < -200 ||
      ny > size.height + 200
    )
      return

    if (iterations <= init.value || random() > 0.5)
      steps.push(() => step(nx, ny, rad1))
    if (iterations <= init.value || random() > 0.5)
      steps.push(() => step(nx, ny, rad2))
  }

  let lastTime = performance.now()
  const interval = 1000 / 40

  let controls: ReturnType<typeof useRafFn>

  const frame = () => {
    if (performance.now() - lastTime < interval) return

    iterations += 1
    prevSteps = steps
    steps = []
    lastTime = performance.now()

    if (!prevSteps.length) {
      controls.pause()
      stopped.value = true
    }
    prevSteps.forEach((i) => i())
  }

  controls = useRafFn(frame, { immediate: true })

  start.value = () => {
    controls.pause()
    iterations = 0
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1
    ctx.strokeStyle = color
    prevSteps = []
    steps = [
      () => step(random() * size.width, 0, r90),
      () => step(random() * size.width, size.height, -r90),
      () => step(0, random() * size.height, 0),
      () => step(size.width, random() * size.height, r180)
    ]
    if (size.width < 500) steps = steps.slice(0, 2)
    controls.resume()
    stopped.value = false
  }

  start.value()
})
</script>

<template>
  <div style="z-index: -1; position: fixed; top: 0; left: 0">
    <slot />
    <canvas ref="canvas" width="400" height="400"></canvas>
  </div>
</template>
