import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="demo-page">
      <section className="demo-card" aria-labelledby="demo-title">
        <p className="eyebrow">Vite + React + TypeScript</p>
        <h1 id="demo-title">React Demo</h1>
        <p>这是一个可直接扩展的基础 React 工程。</p>
        <button type="button" onClick={() => setCount((currentCount) => currentCount + 1)}>
          Count is {count}
        </button>
      </section>
    </main>
  )
}
