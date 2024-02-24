export interface SelectionCoords {
  initialX: number
  initialY: number
  x?: number
  y?: number
}

export interface Coords {
  x: number
  y: number
}

export type ItemType = 'file' | 'folder'

export interface DesktopItemInterface {
  id: number
  name: string
  type: ItemType
  coords: Coords
}
