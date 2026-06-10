import { useEffect, useLayoutEffect, useRef, useState } from "react"

const DEFAULT_THUMB_STYLE = {
  height: 0,
  left: 0,
  top: 0,
  width: 0,
}

function readItemMetrics(elements) {
  return elements.map((element) =>
    element
      ? {
          height: element.offsetHeight,
          left: element.offsetLeft,
          top: element.offsetTop,
          width: element.offsetWidth,
        }
      : null
  )
}

function isDragPointer(event) {
  return event.isPrimary && event.pointerType !== "mouse"
}

export function useLiquidNav({ activeIndex, onNavigateIndex }) {
  const listRef = useRef(null)
  const itemRefs = useRef([])
  const dragStateRef = useRef({
    active: false,
    currentLeft: 0,
    moved: false,
    pointerId: null,
    startLeft: 0,
    startX: 0,
    suppressClick: false,
  })
  const [thumbStyle, setThumbStyle] = useState(DEFAULT_THUMB_STYLE)
  const [isDragging, setIsDragging] = useState(false)

  function syncThumbToIndex(index) {
    const metrics = readItemMetrics(itemRefs.current)
    const target = metrics[index]

    if (!target) {
      return
    }

    dragStateRef.current.currentLeft = target.left
    setThumbStyle(target)
  }

  function getClosestIndex(left) {
    const metrics = readItemMetrics(itemRefs.current)
    const thumbWidth = thumbStyle.width || metrics[activeIndex]?.width || 0
    const thumbCenter = left + thumbWidth / 2
    let nextIndex = activeIndex
    let nearestDistance = Number.POSITIVE_INFINITY

    metrics.forEach((item, index) => {
      if (!item) {
        return
      }

      const itemCenter = item.left + item.width / 2
      const distance = Math.abs(itemCenter - thumbCenter)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nextIndex = index
      }
    })

    return nextIndex
  }

  function stopDragging() {
    dragStateRef.current.active = false
    dragStateRef.current.pointerId = null
    dragStateRef.current.startLeft = 0
    dragStateRef.current.startX = 0
    setIsDragging(false)
  }

  function handlePointerDown(event) {
    if (!isDragPointer(event)) {
      return
    }

    const listElement = listRef.current
    const pressedLink = event.target.closest("[data-nav-link]")

    if (!listElement || !pressedLink || !listElement.contains(pressedLink)) {
      return
    }

    const metrics = readItemMetrics(itemRefs.current)
    const currentItem = metrics[activeIndex]

    if (!currentItem) {
      return
    }

    dragStateRef.current.active = true
    dragStateRef.current.pointerId = event.pointerId
    dragStateRef.current.startX = event.clientX
    dragStateRef.current.startLeft = dragStateRef.current.currentLeft || currentItem.left
    dragStateRef.current.currentLeft = dragStateRef.current.startLeft
    dragStateRef.current.moved = false

    setIsDragging(true)
    listElement.setPointerCapture?.(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!isDragPointer(event)) {
      return
    }

    if (
      !dragStateRef.current.active ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return
    }

    const metrics = readItemMetrics(itemRefs.current)
    const firstItem = metrics[0]
    const lastItem = metrics[metrics.length - 1]

    if (!firstItem || !lastItem) {
      return
    }

    const deltaX = event.clientX - dragStateRef.current.startX
    const nextLeft = Math.min(
      lastItem.left,
      Math.max(firstItem.left, dragStateRef.current.startLeft + deltaX)
    )

    dragStateRef.current.currentLeft = nextLeft

    if (Math.abs(deltaX) > 6) {
      dragStateRef.current.moved = true
    }

    setThumbStyle((currentStyle) => ({
      ...currentStyle,
      left: nextLeft,
    }))
  }

  function handlePointerUp(event) {
    if (!isDragPointer(event)) {
      return
    }

    if (
      !dragStateRef.current.active ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return
    }

    const listElement = listRef.current
    const wasMoved = dragStateRef.current.moved
    const currentLeft = dragStateRef.current.currentLeft

    listElement?.releasePointerCapture?.(event.pointerId)
    stopDragging()

    if (!wasMoved) {
      return
    }

    dragStateRef.current.suppressClick = true

    const nextIndex = getClosestIndex(currentLeft)

    syncThumbToIndex(nextIndex)

    if (nextIndex !== activeIndex) {
      onNavigateIndex(nextIndex)
    }
  }

  function handlePointerCancel(event) {
    if (!isDragPointer(event)) {
      return
    }

    if (
      !dragStateRef.current.active ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return
    }

    listRef.current?.releasePointerCapture?.(event.pointerId)
    stopDragging()
    syncThumbToIndex(activeIndex)
  }

  function handleClickCapture(event) {
    if (!dragStateRef.current.suppressClick) {
      return
    }

    dragStateRef.current.suppressClick = false
    event.preventDefault()
    event.stopPropagation()
  }

  useLayoutEffect(() => {
    if (!dragStateRef.current.active) {
      syncThumbToIndex(activeIndex)
    }
  }, [activeIndex])

  useEffect(() => {
    function handleResize() {
      if (!dragStateRef.current.active) {
        syncThumbToIndex(activeIndex)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [activeIndex])

  return {
    isDragging,
    itemRefs,
    listRef,
    thumbStyle,
    navEventHandlers: {
      onClickCapture: handleClickCapture,
      onPointerCancel: handlePointerCancel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
