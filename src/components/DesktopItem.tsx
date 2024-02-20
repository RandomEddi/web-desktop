import { useState, type FC } from 'react'
import { type DesktopItemInterface } from '../Desktop'

interface Props {
  item: DesktopItemInterface
  isActive: boolean
  setActiveItemId: (id: number) => void
  renameItem: (id: number, name: string) => void
}

export const DesktopItem: FC<Props> = ({ item, isActive, setActiveItemId, renameItem }) => {
  const [title, setTitle] = useState(item.name)

  return (
    <button
      onClick={() => setActiveItemId(item.id)}
      className={'desktop-item' + (isActive ? ' active' : '')}
      style={{ left: item.coords.x, top: item.coords.y }}
    >
      <img src={`/${item.type}.png`} />
      <input
        onBlur={() => {
          renameItem(item.id, title)
        }}
        type='text'
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
    </button>
  )
}
