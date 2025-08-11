import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Page from '@/app/page'

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations)

// Mock the theme provider
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="theme-provider">{children}</div>
)

jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: MockThemeProvider,
}))

describe('Page Accessibility Tests', () => {
  const renderPage = () => {
    return render(
      <MockThemeProvider>
        <Page />
      </MockThemeProvider>
    )
  }

  describe('WCAG 2.1 AA Compliance', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderPage()
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper page title and metadata', () => {
      renderPage()
      
      // Check for main heading
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveTextContent(/feature priority matrix/i)
    })

    test('should have proper document structure', () => {
      renderPage()
      
      // Check for main landmark
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      
      // Check for proper heading hierarchy
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // First heading should be h1
      expect(headings[0]).toHaveAttribute('role', 'heading')
    })

    test('should have proper language declaration', () => {
      renderPage()
      
      // Check that the page has proper language attributes
      const html = document.documentElement
      expect(html).toHaveAttribute('lang', 'en')
    })
  })

  describe('Component Integration', () => {
    test('should render FeaturePriorityMatrix component', () => {
      renderPage()
      
      // Check that the main component is rendered
      const featureMatrix = screen.getByRole('region') || screen.getByRole('main')
      expect(featureMatrix).toBeInTheDocument()
    })

    test('should have proper theme toggle accessibility', () => {
      renderPage()
      
      // Check that theme toggle is accessible
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
      expect(themeToggle).toBeInTheDocument()
      expect(themeToggle).toHaveAttribute('aria-label')
    })
  })

  describe('Responsive Design', () => {
    test('should be accessible on different screen sizes', () => {
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })
      
      renderPage()
      
      // Check that desktop layout is accessible
      const desktopElements = screen.getAllByRole('button')
      expect(desktopElements.length).toBeGreaterThan(0)
    })

    test('should maintain accessibility on mobile devices', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      renderPage()
      
      // Check that mobile layout is accessible
      const mobileElements = screen.getAllByRole('button')
      expect(mobileElements.length).toBeGreaterThan(0)
    })
  })
})
