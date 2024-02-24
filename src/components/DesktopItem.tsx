import { useState, type FC, useEffect, useRef } from 'react'
import { Coords, DesktopItemInterface, SelectionCoords } from '../types'
import cn from 'classnames'

interface Props {
  item: DesktopItemInterface
  isActive: boolean
  selectionCoords: SelectionCoords | null
  setActiveItemId: (id: number) => void
  renameItem: (id: number, name: string) => void
  updateCoords: (id: number, coords: Coords) => void
}

export const DesktopItem: FC<Props> = ({
  item,
  selectionCoords,
  isActive,
  setActiveItemId,
  renameItem,
  updateCoords,
}) => {
  const [title, setTitle] = useState(item.name)
  const [isHovered, setIsHovered] = useState(false)
  const [dragCoords, setDragCoords] = useState<Coords | null>(null)
  const itemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!selectionCoords || isActive || !itemRef.current) return

    const selectionAreaX =
      selectionCoords.x && selectionCoords.initialX > selectionCoords.x ? selectionCoords.x : selectionCoords.initialX
    const selectionAreaY =
      selectionCoords.y && selectionCoords.initialY > selectionCoords.y ? selectionCoords.y : selectionCoords.initialY
    const selectionAreaWidth = selectionCoords.x ? Math.abs(selectionCoords.initialX - selectionCoords.x) : 0
    const selectionAreaHeight = selectionCoords.y ? Math.abs(selectionCoords.initialY - selectionCoords.y) : 0
    // console.log(item.id, selectionAreaX, item.coords.x)

    // TODO: ДОдел
    // if (
    //   // selectionAreaX
    // ) {
    //   setIsHovered(true)
    // }
  }, [selectionCoords])

  const handleMouseMove = (event: MouseEvent) => {
    setDragCoords({ x: event.clientX, y: event.clientY })
  }

  const handleMouseUp = (event: MouseEvent) => {
    updateCoords(item.id, { x: event.clientX, y: event.clientY })
    setDragCoords(null)
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    setDragCoords({ x: event.clientX, y: event.clientY })

    document.body.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <>
      <button
        ref={itemRef}
        onClick={(event) => {
          event.stopPropagation()
          setActiveItemId(item.id)
        }}
        onMouseEnter={() => {
          // setIsHovered(true)
        }}
        onMouseLeave={() => {
          if (selectionCoords) return
          setIsHovered(false)
        }}
        onMouseDown={handleMouseDown}
        className={cn('desktop-item', {
          active: isActive,
          hovered: isHovered,
        })}
        style={{ left: item.coords.x, top: item.coords.y, zIndex: item.id }}
      >
        <img draggable='false' src={`/${item.type}.png`} />
        <input
          onBlur={() => {
            renameItem(item.id, title)
          }}
          type='text'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </button>
      {dragCoords && (
        <div
          className='desktop-item__drag'
          style={{
            left: dragCoords.x,
            top: dragCoords.y,
          }}
        >
          <img src={`/${item.type}.png`} />
        </div>
      )}
    </>
  )
}
