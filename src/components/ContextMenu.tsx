import { useEffect, type FC, useState } from 'react'
import { minmax } from '../utils'
import { Coords, ItemType } from '../types'

interface Props {
  addItem: (coords: Coords, type: ItemType) => void
  deleteItems: () => void
}

export const ContextMenu: FC<Props> = ({ addItem, deleteItems }) => {
  const [contextMenuCoords, setContextMenuCoords] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    const handleOpenContextMenu = (event: MouseEvent) => {
      event.preventDefault()

      setContextMenuCoords({
        left: minmax(event.clientX, 0, window.innerWidth - 200),
        top: minmax(event.clientY, 0, window.innerHeight - 138),
      })

      const handleCloseContextMenu = () => {
        setContextMenuCoords(null)
        document.removeEventListener('mousedown', handleCloseContextMenu)
      }

      document.addEventListener('mousedown', handleCloseContextMenu)
    }

    document.addEventListener('contextmenu', handleOpenContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleOpenContextMenu)
    }
  }, [])

  if (!contextMenuCoords) return <></>

  return (
    <div className='context-menu' onMouseDown={(event) => event.stopPropagation()} style={contextMenuCoords}>
      <button
        onClick={() => {
          setContextMenuCoords(null)
          window.location.reload()
        }}
      >
        Обновить страницу
      </button>
      <label htmlFor='wallpaper'>
        Сменить обои
        <input
          type='file'
          name='wallpaper'
          id='wallpaper'
          accept='image/*'
          onChange={(event) => {
            setContextMenuCoords(null)
            if (event.target.files?.item(0)) {
              const reader = new FileReader()
              reader.onload = function (e) {
                document.body.style.backgroundImage = `url('${e.target?.result}')`
              }

              reader.readAsDataURL(event.target.files?.item(0)!)
            }
          }}
        />
      </label>
      <button
        onClick={() => {
          console.log('asd')
          setContextMenuCoords(null)
          addItem({ x: contextMenuCoords.left, y: contextMenuCoords.top }, 'folder')
        }}
      >
        Добавить папку
      </button>
      <button
        onClick={() => {
          setContextMenuCoords(null)
          addItem({ x: contextMenuCoords.left, y: contextMenuCoords.top }, 'file')
        }}
      >
        Добавить файл
      </button>
      <button
        onClick={() => {
          setContextMenuCoords(null)
          deleteItems()
        }}
      >
        Удалить
      </button>
    </div>
  )
}
