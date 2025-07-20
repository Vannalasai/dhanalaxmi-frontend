// global.d.ts
export {}

declare global {
  interface Window {
    dispatchTokenChange: () => void
  }
}
