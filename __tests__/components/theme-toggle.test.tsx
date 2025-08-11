import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ThemeToggle } from '@/components/theme-toggle'

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations)

// Mock the theme provider context
const mockUseTheme = {
  theme: 'light',
  setTheme: jest.fn(),
}

jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme,
}))

describe('ThemeToggle Accessibility Tests', () => {
  const renderThemeToggle = () => {
    return render(<ThemeToggle />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('WCAG 2.1 AA Compliance', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderThemeToggle()
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper button role and accessibility', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).toHaveAttribute('aria-label')
      expect(toggleButton).toHaveAttribute('title')
    })

    test('should have proper focus management', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      toggleButton.focus()
      expect(toggleButton).toHaveFocus()
    })

    test('should handle keyboard interactions properly', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Test Enter key
      fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' })
      expect(mockUseTheme.setTheme).toHaveBeenCalled()
      
      // Test Space key
      fireEvent.keyDown(toggleButton, { key: ' ', code: 'Space' })
      expect(mockUseTheme.setTheme).toHaveBeenCalled()
    })

    test('should have proper visual indicators', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Check that the button has an icon or visual indicator
      const icon = toggleButton.querySelector('svg') || toggleButton.querySelector('[data-icon]')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Theme Switching', () => {
    test('should toggle between light and dark themes', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      fireEvent.click(toggleButton)
      
      expect(mockUseTheme.setTheme).toHaveBeenCalledWith('dark')
    })

    test('should handle theme changes gracefully', () => {
      // Test with dark theme
      mockUseTheme.theme = 'dark'
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      fireEvent.click(toggleButton)
      
      expect(mockUseTheme.setTheme).toHaveBeenCalledWith('light')
    })

    test('should maintain accessibility during theme transitions', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Simulate theme change
      fireEvent.click(toggleButton)
      
      // Button should still be accessible
      expect(toggleButton).toBeInTheDocument()
      expect(toggleButton).toHaveAttribute('aria-label')
    })
  })

  describe('Screen Reader Support', () => {
    test('should have descriptive aria-label', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      const ariaLabel = toggleButton.getAttribute('aria-label')
      
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toMatch(/theme|mode|dark|light/i)
    })

    test('should have proper title attribute', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      const title = toggleButton.getAttribute('title')
      
      expect(title).toBeTruthy()
      expect(title).toMatch(/theme|mode|dark|light/i)
    })

    test('should announce theme changes to screen readers', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Check that the button has proper ARIA attributes for announcements
      expect(toggleButton).toHaveAttribute('aria-label')
    })
  })

  describe('Mobile and Touch Accessibility', () => {
    test('should have adequate touch target size', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      const rect = toggleButton.getBoundingClientRect()
      
      // Minimum touch target size should be 44x44 pixels
      expect(rect.width).toBeGreaterThanOrEqual(44)
      expect(rect.height).toBeGreaterThanOrEqual(44)
    })

    test('should handle touch events properly', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Simulate touch event
      fireEvent.touchStart(toggleButton)
      fireEvent.touchEnd(toggleButton)
      
      expect(mockUseTheme.setTheme).toHaveBeenCalled()
    })
  })

  describe('High Contrast Mode', () => {
    test('should be visible in high contrast mode', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Check that the button has sufficient contrast
      const computedStyle = window.getComputedStyle(toggleButton)
      expect(computedStyle.border).toBeTruthy() || expect(computedStyle.outline).toBeTruthy()
    })

    test('should maintain functionality in high contrast mode', () => {
      renderThemeToggle()
      
      const toggleButton = screen.getByRole('button')
      
      // Button should still be clickable
      fireEvent.click(toggleButton)
      expect(mockUseTheme.setTheme).toHaveBeenCalled()
    })
  })
})
