import { useState, type FC, useEffect } from 'react'
import { ContextMenu, SelectionArea, DesktopItem } from './components'

export interface Coords {
  initialX: number
  initialY: number
  x?: number
  y?: number
}

export interface DesktopItemInterface {
  id: number
  name: string
  type: 'file' | 'folder'
  coords: {
    x: number
    y: number
  }
}

export const Desktop: FC = () => {
  const [desktopItems, setDesktopItems] = useState<DesktopItemInterface[]>([
    { id: 1, name: 'Файл', type: 'file', coords: { x: 0, y: 0 } },
    { id: 2, name: 'Папка', type: 'folder', coords: { x: 300, y: 300 } },
  ])
  const [activeItemsId, setActiveItemsId] = useState<number[]>([])
  const [selectionAreaCoords, setSelectionAreaCoords] = useState<null | Coords>(null)

  useEffect(() => {
    const desktopItems = localStorage.getItem('desktopItems')

    if (desktopItems) {
      setDesktopItems(JSON.parse(desktopItems))
    }
  }, [])

  useEffect(() => {
    if (desktopItems.length > 0) {
      localStorage.setItem('desktopItems', JSON.stringify(desktopItems))
    }
  }, [desktopItems])

  const addItem = (item: DesktopItemInterface) => {
    setDesktopItems((prev) => [...prev, item])
  }

  const deleteItems = () => {
    setDesktopItems([])
  }

  return (
    <div className='desktop'>
      <SelectionArea coords={selectionAreaCoords} setCoords={setSelectionAreaCoords} />
      <ContextMenu addItem={addItem} deleteItems={deleteItems}/>
      {desktopItems.map((item) => (
        <DesktopItem
          key={item.name}
          item={item}
          isActive={activeItemsId.includes(item.id)}
          renameItem={(id: number, name: string) => {
            setDesktopItems((prev) =>
              prev.map((item) => {
                if (item.id === id) return { ...item, name }
                return item
              }),
            )
          }}
          setActiveItemId={(id: number) => {
            if (activeItemsId.includes(id)) setActiveItemsId((prev) => prev.filter((i) => i !== id))
            else setActiveItemsId([item.id])
          }}
        />
      ))}
    </div>
  )
}
