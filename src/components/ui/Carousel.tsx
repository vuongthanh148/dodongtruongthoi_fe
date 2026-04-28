'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface CarouselProps<T> {
  items: T[]
  currentIndex: number
  onIndexChange: (index: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  autoScrollMs?: number
  navColor?: 'light' | 'dark'
  containerStyle?: React.CSSProperties
  scrollContainerStyle?: React.CSSProperties
  showDots?: boolean
  showNav?: boolean
}

export function Carousel<T>({
  items,
  currentIndex,
  onIndexChange,
  renderItem,
  autoScrollMs,
  navColor = 'light',
  containerStyle,
  scrollContainerStyle,
  showDots = true,
  showNav = true,
}: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dragStartXRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const currentIndexRef = useRef(currentIndex)

  const navigate = useCallback((index: number, wrap = false) => {
    const length = items.length
    if (length <= 0) {
      onIndexChange(0)
      return
    }

    const maxIndex = length - 1
    const nextIndex = wrap ? ((index % length) + length) % length : Math.max(0, Math.min(index, maxIndex))

    const container = containerRef.current
    if (container) {
      container.scrollTo({ left: container.clientWidth * nextIndex, behavior: 'smooth' })
    }
    onIndexChange(nextIndex)
  }, [items.length, onIndexChange])

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartXRef.current = event.clientX
    isDraggingRef.current = true
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const startX = dragStartXRef.current
    const endX = event.clientX
    isDraggingRef.current = false
    dragStartXRef.current = null

    if (startX === null) {
      return
    }

    const deltaX = startX - endX
    const swipeThreshold = 35
    if (deltaX > swipeThreshold) {
      navigate(currentIndex + 1, true)
    } else if (deltaX < -swipeThreshold) {
      navigate(currentIndex - 1, true)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      navigate(currentIndex + 1, true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      navigate(currentIndex - 1, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      navigate(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      navigate(items.length - 1)
    }
  }

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    if (!autoScrollMs || items.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      const nextIndex = currentIndexRef.current >= items.length - 1 ? 0 : currentIndexRef.current + 1
      onIndexChange(nextIndex)
    }, autoScrollMs)

    return () => {
      window.clearInterval(timer)
    }
  }, [autoScrollMs, items.length, onIndexChange])

  const navStyles = navColor === 'light' ? {
    button: {
      border: '1px solid rgba(244,237,224,0.35)',
      background: 'rgba(20,14,9,0.45)',
      color: '#f4ede0',
    },
    dot: {
      active: 'var(--gold)',
      inactive: 'rgba(244,237,224,0.3)',
    },
  } : {
    button: {
      border: '1px solid rgba(255, 238, 218, 0.38)',
      background: 'rgba(43, 24, 12, 0.46)',
      color: '#fff8ef',
    },
    dot: {
      active: '#c9a961',
      inactive: 'rgba(255, 238, 218, 0.3)',
    },
  }

  return (
    <div style={containerStyle}>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: 0,
          gap: 0,
          position: 'relative',
          ...scrollContainerStyle,
        }}
        className="noscroll"
        tabIndex={0}
        role="region"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              flex: '0 0 100%',
              width: '100%',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {showNav && items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => navigate(currentIndex - 1, true)}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: navStyles.button.border,
              background: navStyles.button.background,
              color: navStyles.button.color,
              fontSize: 18,
              lineHeight: '34px',
              textAlign: 'center',
              cursor: 'pointer',
              zIndex: 2,
            }}
            aria-label="Previous item"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => navigate(currentIndex + 1, true)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: navStyles.button.border,
              background: navStyles.button.background,
              color: navStyles.button.color,
              fontSize: 18,
              lineHeight: '34px',
              textAlign: 'center',
              cursor: 'pointer',
              zIndex: 2,
            }}
            aria-label="Next item"
          >
            ›
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            zIndex: 2,
          }}
        >
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(idx)}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                background: idx === currentIndex ? navStyles.dot.active : navStyles.dot.inactive,
                cursor: 'pointer',
                padding: 0,
                transition: 'background 150ms ease',
              }}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
