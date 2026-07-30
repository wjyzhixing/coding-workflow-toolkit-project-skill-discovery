import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentType } from 'react'
import { describe, expect, it } from 'vitest'

let App: ComponentType = () => null

try {
  const appModule = './App'
  ;({ default: App } = await import(/* @vite-ignore */ appModule))
} catch {
  // The first red run verifies the intended screen before the component exists.
}

describe('App', () => {
  it('renders the React demo heading', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'React Demo' })).toBeInTheDocument()
  })

  it('increments the count when the user clicks the button', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Count is 0' }))

    expect(screen.getByRole('button', { name: 'Count is 1' })).toBeInTheDocument()
  })
})
