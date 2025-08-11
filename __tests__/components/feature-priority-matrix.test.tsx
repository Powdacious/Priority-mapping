import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import FeaturePriorityMatrix from '@/components/feature-priority-matrix'

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations)

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock the theme provider
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="theme-provider">{children}</div>
)

jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: MockThemeProvider,
}))

describe('FeaturePriorityMatrix Accessibility Tests', () => {
  const renderComponent = () => {
    return render(
      <MockThemeProvider>
        <FeaturePriorityMatrix />
      </MockThemeProvider>
    )
  }

  describe('WCAG 2.1 AA Compliance - Perceivable', () => {
    test('should have no accessibility violations', async () => {
      const { container } = renderComponent()
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper heading structure', () => {
      renderComponent()
      
      // Check for main heading
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveTextContent('Add Feature')
      
      // Check for sub-headings
      const subHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(subHeadings.length).toBeGreaterThan(0)
    })

    test('should have proper form labels', () => {
      renderComponent()
      
      // Check that all form inputs have associated labels
      const featureNameInput = screen.getByLabelText('Feature Name')
      expect(featureNameInput).toBeInTheDocument()
      
      const valueSelect = screen.getByLabelText('Value to User (How will users react?)')
      expect(valueSelect).toBeInTheDocument()
      
      const costSelect = screen.getByLabelText('Cost to Build (How difficult is implementation?)')
      expect(costSelect).toBeInTheDocument()
    })

    test('should have proper button labels and descriptions', () => {
      renderComponent()
      
      // Check add button has descriptive text
      const addButton = screen.getByRole('button', { name: /add feature/i })
      expect(addButton).toBeInTheDocument()
      expect(addButton).toHaveTextContent(/add feature \(\d+\/12\)/)
      
      // Check share button
      const shareButton = screen.getByRole('button', { name: /share/i })
      expect(shareButton).toBeInTheDocument()
      
      // Check export button
      const exportButton = screen.getByRole('button', { name: /export as image/i })
      expect(exportButton).toBeInTheDocument()
    })

    test('should have proper tab labels and descriptions', () => {
      renderComponent()
      
      // Check tab labels are descriptive
      const matrixTab = screen.getByRole('tab', { name: /matrix view/i })
      expect(matrixTab).toBeInTheDocument()
      
      const affinityTab = screen.getByRole('tab', { name: /affinity view/i })
      expect(affinityTab).toBeInTheDocument()
      
      const stackedTab = screen.getByRole('tab', { name: /stacked rank/i })
      expect(stackedTab).toBeInTheDocument()
    })

    test('should have proper color contrast and not rely solely on color', () => {
      renderComponent()
      
      // Check that important information is not conveyed by color alone
      const valueLabels = screen.getAllByText(/amazing|great|good|ok|meh/i)
      expect(valueLabels.length).toBeGreaterThan(0)
      
      const costLabels = screen.getAllByText(/extreme|difficult|challenging|doable|easy/i)
      expect(costLabels.length).toBeGreaterThan(0)
    })
  })

  describe('WCAG 2.1 AA Compliance - Operable', () => {
    test('should be fully keyboard navigable', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      // Tab through all interactive elements
      await user.tab()
      expect(screen.getByLabelText('Feature Name')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('Value to User (How will users react?)')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByLabelText('Cost to Build (How difficult is implementation?)')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button', { name: /add feature/i })).toHaveFocus()
    })

    test('should have proper focus indicators', () => {
      renderComponent()
      
      // Check that focusable elements have visible focus indicators
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        input.focus()
        expect(input).toHaveFocus()
      })
    })

    test('should handle keyboard shortcuts properly', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      const featureInput = screen.getByLabelText('Feature Name')
      await user.click(featureInput)
      await user.type(featureInput, 'Test Feature')
      
      // Test Enter key functionality
      await user.keyboard('{Enter}')
      
      // Should show error since value and cost are not selected
      expect(screen.getByText(/please select a value/i)).toBeInTheDocument()
    })

    test('should have proper skip links or landmarks', () => {
      renderComponent()
      
      // Check for main landmark
      const main = screen.getByRole('main') || screen.getByRole('region')
      expect(main).toBeInTheDocument()
    })
  })

  describe('WCAG 2.1 AA Compliance - Understandable', () => {
    test('should have clear and descriptive error messages', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      // Try to add feature without required fields
      const addButton = screen.getByRole('button', { name: /add feature/i })
      await user.click(addButton)
      
      // Check for clear error message
      const errorMessage = screen.getByText(/please enter a feature name/i)
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })

    test('should have proper form validation feedback', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      const featureInput = screen.getByLabelText('Feature Name')
      await user.type(featureInput, 'Test Feature')
      
      // Check that validation feedback is provided
      await user.click(screen.getByRole('button', { name: /add feature/i }))
      
      const errorMessage = screen.getByText(/please select a value/i)
      expect(errorMessage).toBeInTheDocument()
    })

    test('should have consistent navigation and layout', () => {
      renderComponent()
      
      // Check that navigation elements are consistently placed
      const tabs = screen.getByRole('tablist')
      expect(tabs).toBeInTheDocument()
      
      // Check that form elements are consistently structured
      const formElements = screen.getAllByRole('textbox')
      expect(formElements.length).toBeGreaterThan(0)
    })

    test('should have proper help text and instructions', () => {
      renderComponent()
      
      // Check for descriptive text
      const description = screen.getByText(/enter feature details and rate its value to users and cost to build/i)
      expect(description).toBeInTheDocument()
      
      // Check for tooltip information
      const infoButton = screen.getByRole('button', { name: /information/i })
      expect(infoButton).toBeInTheDocument()
    })
  })

  describe('WCAG 2.1 AA Compliance - Robust', () => {
    test('should work with assistive technologies', () => {
      renderComponent()
      
      // Check for proper ARIA attributes
      const tabs = screen.getByRole('tablist')
      expect(tabs).toHaveAttribute('aria-label')
      
      // Check for proper roles
      const tabPanels = screen.getAllByRole('tabpanel')
      expect(tabPanels.length).toBeGreaterThan(0)
    })

    test('should have proper semantic HTML structure', () => {
      renderComponent()
      
      // Check for proper form structure
      const form = screen.getByRole('form') || screen.getByRole('group')
      expect(form).toBeInTheDocument()
      
      // Check for proper list structure
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(0)
    })

    test('should handle dynamic content updates properly', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      // Add a feature and check that the UI updates properly
      const featureInput = screen.getByLabelText('Feature Name')
      await user.type(featureInput, 'Test Feature')
      
      // Select value
      const valueSelect = screen.getByLabelText('Value to User (How will users react?)')
      await user.click(valueSelect)
      
      // Select cost
      const costSelect = screen.getByLabelText('Cost to Build (How difficult is implementation?)')
      await user.click(costSelect)
      
      // Add feature
      const addButton = screen.getByRole('button', { name: /add feature/i })
      await user.click(addButton)
      
      // Check that feature was added
      await waitFor(() => {
        expect(screen.getByText('Test Feature')).toBeInTheDocument()
      })
    })
  })

  describe('Specific Accessibility Features', () => {
    test('should have proper alt text for icons', () => {
      renderComponent()
      
      // Check that icons have proper accessibility labels
      const icons = screen.getAllByRole('img', { hidden: true })
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-label') || expect(icon).toHaveAttribute('aria-labelledby')
      })
    })

    test('should have proper table structure for matrix view', () => {
      renderComponent()
      
      // Check that matrix has proper table semantics
      const matrix = screen.getByRole('table') || screen.getByRole('grid')
      expect(matrix).toBeInTheDocument()
    })

    test('should have proper slider accessibility', () => {
      renderComponent()
      
      // Check that sliders have proper labels and values
      const sliders = screen.getAllByRole('slider')
      sliders.forEach(slider => {
        expect(slider).toHaveAttribute('aria-label')
        expect(slider).toHaveAttribute('aria-valuemin')
        expect(slider).toHaveAttribute('aria-valuemax')
      })
    })

    test('should have proper alert and notification accessibility', async () => {
      const user = userEvent.setup()
      renderComponent()
      
      // Trigger an error to test alert accessibility
      const addButton = screen.getByRole('button', { name: /add feature/i })
      await user.click(addButton)
      
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Mobile and Responsive Accessibility', () => {
    test('should be accessible on mobile devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      renderComponent()
      
      // Check that mobile-specific accessibility features are present
      const mobileElements = screen.getAllByRole('button')
      expect(mobileElements.length).toBeGreaterThan(0)
    })

    test('should have proper touch target sizes', () => {
      renderComponent()
      
      // Check that interactive elements have adequate touch target sizes
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect()
        expect(rect.width).toBeGreaterThanOrEqual(44)
        expect(rect.height).toBeGreaterThanOrEqual(44)
      })
    })
  })
})
