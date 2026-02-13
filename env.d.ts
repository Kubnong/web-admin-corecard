/// <reference types="vite/client" />

// 👇 เพิ่มส่วนนี้ลงไป
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}