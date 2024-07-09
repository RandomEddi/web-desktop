import { useState, type FC, useEffect, type Dispatch, type SetStateAction } from 'react'
import { minmax } from '../utils'
import { SelectionCoords } from '../types'

interface Props {
  coords: null | SelectionCoords
  setCoords: Dispatch<SetStateAction<null | SelectionCoords>>
}

export const SelectionArea: FC<Props> = ({ coords, setCoords }) => {
  const [isMouseDown, setIsMouseDown] = useState(false)

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false)
      setCoords(null)
    }
    if (isMouseDown) {
      document.body.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      if (isMouseDown) {
        document.body.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isMouseDown])

  const getStyle: () => React.CSSProperties = () => {
    if (coords?.x === undefined || coords?.y === undefined) return {}

    const { initialX, initialY } = coords

    if (initialX < coords.x && initialY < coords.y) {
      return {
        left: `${initialX}px`,
        top: `${initialY}px`,
        width: `${coords.x - initialX}px`,
        height: `${coords.y - initialY}px`,
      }
    }

    if (initialX > coords.x && initialY > coords.y) {
      return {
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${initialX - coords.x}px`,
        height: `${initialY - coords.y}px`,
      }
    }

    if (initialX < coords.x && initialY > coords.y) {
      return {
        left: `${initialX}px`,
        top: `${coords.y}px`,
        width: `${coords.x - initialX}px`,
        height: `${initialY - coords.y}px`,
      }
    }

    if (initialX > coords.x && initialY < coords.y) {
      return {
        left: `${coords.x}px`,
        top: `${initialY}px`,
        width: `${initialX - coords.x}px`,
        height: `${coords.y - initialY}px`,
      }
    }

    return {}
  }
  return (
    <div
      onMouseDown={(event) => {
        if (event.nativeEvent.button !== 0) return
        setIsMouseDown(true)
        const bound = event.currentTarget.getBoundingClientRect()
        const left = minmax(event.clientX - bound.left, 0, bound.width)
        const top = minmax(event.clientY - bound.top, 0, bound.height)
        setCoords({ initialX: left, initialY: top })
      }}
      onMouseMove={(event) => {
        if (!isMouseDown) return
        setCoords((prev) => ({ ...prev!, x: event.clientX, y: event.clientY }))
      }}
      className='container'
    >
      {coords && <div className='selection' style={getStyle()}></div>}
    </div>
  )
}
