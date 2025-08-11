import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

describe('ThemeToggle Accessibility Improvements', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue('light')
    localStorageMock.setItem.mockClear()
  })

  test('should have proper accessibility attributes', () => {
    render(<ThemeToggle />)
    
    const toggleButton = screen.getByRole('button')
    
    // Check for required accessibility attributes
    expect(toggleButton).toHaveAttribute('aria-label')
    expect(toggleButton).toHaveAttribute('title')
    expect(toggleButton).toHaveAttribute('role', 'button')
    expect(toggleButton).toHaveAttribute('tabIndex', '0')
    expect(toggleButton).toHaveAttribute('aria-describedby')
    expect(toggleButton).toHaveAttribute('aria-pressed')
  })

  test('should have adequate touch target size', () => {
    render(<ThemeToggle />)
    
    const toggleButton = screen.getByRole('button')
    
    // Check that the button has minimum touch target size
    expect(toggleButton).toHaveClass('min-w-[44px]')
    expect(toggleButton).toHaveClass('min-h-[44px]')
  })

  test('should have descriptive aria-label', () => {
    render(<ThemeToggle />)
    
    const toggleButton = screen.getByRole('button')
    const ariaLabel = toggleButton.getAttribute('aria-label')
    
    expect(ariaLabel).toMatch(/switch to/i)
    expect(ariaLabel).toMatch(/mode/i)
  })

  test('should have proper title attribute', () => {
    render(<ThemeToggle />)
    
    const toggleButton = screen.getByRole('button')
    const title = toggleButton.getAttribute('title')
    
    expect(title).toMatch(/switch to/i)
    expect(title).toMatch(/mode/i)
  })
})
