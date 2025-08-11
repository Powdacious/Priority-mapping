import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Basic Test', () => {
  test('should render a simple component', () => {
    render(<div>Hello World</div>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  test('should handle basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect('hello').toContain('hello')
  })
})
