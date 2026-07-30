import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

let App = defineComponent({ template: '<div />' })

try {
  const appModule = './App.vue'
  ;({ default: App } = await import(/* @vite-ignore */ appModule))
} catch {
  // The first red run verifies the intended component before it exists.
}

describe('App', () => {
  it('renders the Vue demo heading', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('Vue Demo')
  })

  it('increments the count after clicking the button', async () => {
    const wrapper = mount(App)

    await wrapper.get('button').trigger('click')

    expect(wrapper.get('button').text()).toBe('Count is 1')
  })
})
