/*
 * @Author: YinXuan
 * @Date: 2024-05-17 13:08:17
 * @LastEditTime: 2025-04-21 13:32:04
 * @Description:
 */

type AnimationFrameCallback = (timestamp: number) => void

interface Window {
  mozRequestAnimationFrame?: (callback: AnimationFrameCallback) => number
  webkitRequestAnimationFrame?: (callback: AnimationFrameCallback) => number
  msRequestAnimationFrame?: (callback: AnimationFrameCallback) => number
  mozCancelAnimationFrame?: (handle: number) => void
}

interface RAF {
  id: number
}

// @ts-ignore
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  // @ts-ignore
  window.mozRequestAnimationFrame ||
  // @ts-ignore
  window.webkitRequestAnimationFrame ||
  // @ts-ignore
  window.msRequestAnimationFrame

// @ts-ignore
export const cancelAnimationFrame =
  typeof window !== 'undefined'
    ? window.cancelAnimationFrame ||
      // @ts-ignore
      window.mozCancelAnimationFrame
    : () => {}

export function rafTimeout(fn: () => void, delay = 0, interval = false): RAF {
  // @ts-ignore
  const requestAnimationFrame =
    typeof window !== 'undefined'
      ? window.requestAnimationFrame ||
        // @ts-ignore
        window.mozRequestAnimationFrame ||
        // @ts-ignore
        window.webkitRequestAnimationFrame ||
        // @ts-ignore
        window.msRequestAnimationFrame
      : () => {}

  let start: number | null = null

  function timeElapse(timestamp: number) {
    if (!start) {
      start = timestamp
    }
    const elapsed = timestamp - start
    if (elapsed >= delay) {
      fn()
      if (interval) {
        start = null
        raf.id = requestAnimationFrame(timeElapse) || 0
      }
    } else {
      raf.id = requestAnimationFrame(timeElapse) || 0
    }
  }

  const raf: RAF = {
    id: requestAnimationFrame(timeElapse) || 0
  }

  return raf
}

export function cancelRaf(raf: RAF): void {
  // @ts-ignore
  const cancelAnimationFrame =
    typeof window !== 'undefined'
      ? window.cancelAnimationFrame ||
        // @ts-ignore
        window.mozCancelAnimationFrame
      : () => {}

  if (raf && raf.id) {
    cancelAnimationFrame(raf.id)
  }
}
