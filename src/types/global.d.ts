declare var __my__value: string
declare module '*.css' {
  const style: Record<string, string>
  export default style
}
declare module '*.scss' {
  const style: Record<string, string>
  export default style
}

declare module 'chinese-random-name' {
  const name: any
  export default name
}