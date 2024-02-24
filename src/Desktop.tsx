import { useState, type FC, useEffect, useCallback } from 'react'
import { ContextMenu, SelectionArea, DesktopItem } from './components'
import { useId } from './utils'
import { Coords, DesktopItemInterface, ItemType, SelectionCoords } from './types'

export const Desktop: FC = () => {
  const [desktopItems, setDesktopItems] = useState<DesktopItemInterface[]>(
    localStorage.getItem('desktopItems')
      ? JSON.parse(localStorage.getItem('desktopItems') as string)
      : [
          { id: useId(), name: 'Файл', type: 'file', coords: { x: 0, y: 0 } },
          { id: useId(), name: 'Папка', type: 'folder', coords: { x: 300, y: 300 } },
        ],
  )
  const [activeItemsId, setActiveItemsId] = useState<number[]>([])
  const [selectionAreaCoords, setSelectionAreaCoords] = useState<null | SelectionCoords>(null)

  useEffect(() => {
    localStorage.setItem('desktopItems', JSON.stringify(desktopItems))
  }, [desktopItems])

  const addItem = useCallback((coords: Coords, type: ItemType) => {
    setDesktopItems((prev) => [
      ...prev,
      {
        id: useId(desktopItems.map((item) => item.id)),
        name: type === 'file' ? 'Файл' : 'Папка',
        type,
        coords: { x: coords.x, y: coords.y },
      },
    ])
  }, [])

  const deleteItems = useCallback(() => {
    setDesktopItems([])
  }, [])

  return (
    <div
      className='desktop'
      onClick={() => {
        setActiveItemsId([])
      }}
    >
      <SelectionArea coords={selectionAreaCoords} setCoords={setSelectionAreaCoords} />
      <ContextMenu addItem={addItem} deleteItems={deleteItems} />
      {desktopItems.map((item) => (
        <DesktopItem
          key={item.id}
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
          selectionCoords={selectionAreaCoords}
          setActiveItemId={(id: number) => {
            if (activeItemsId.includes(id)) setActiveItemsId((prev) => prev.filter((i) => i !== id))
            else setActiveItemsId([item.id])
          }}
        />
      ))}
    </div>
  )
}
