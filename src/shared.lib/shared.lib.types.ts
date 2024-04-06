
export type FilterBetween = [number, number?]

export const filterBetweenArr = (between: FilterBetween | undefined, min: number = 0, max: number = 65536): [number, number] => {
  if (!between) return [min, max]
  let [from, to] = between
  if (!from) from = min
  if (!to) to = max
  return [from, to]
}


//Патерн для создания фильтров от интерфейсов
export type FilterType<T> = {
  [P in keyof T]?:
  T[P] extends number ? FilterBetween :
  T[P] extends string ? T[P][] :
  never
};

interface Pagination {

}
