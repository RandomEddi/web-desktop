export const minmax = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max)
}

let id = 1

export const useId = (ids?: number[]): number => {
  if (ids) {
    id = Math.max(...ids) + 1
  }
  return id++
}
