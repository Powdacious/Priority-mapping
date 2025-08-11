import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the FeaturePriorityMatrix component
jest.mock('@/components/feature-priority-matrix', () => {
  return function MockFeaturePriorityMatrix() {
    return <div data-testid="feature-matrix">Feature Priority Matrix</div>
  }
})

// Mock the ThemeToggle component
jest.mock('@/components/theme-toggle', () => {
  return function MockThemeToggle() {
    return <button data-testid="theme-toggle">Theme Toggle</button>
  }
})

describe('Page Accessibility Improvements', () => {
  test('should have proper semantic structure', () => {
    render(<Home />)
    
    // Check for main landmark
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('aria-label', 'Feature Priority Matrix Application')
    
    // Check for header
    const header = screen.getByRole('banner') || document.querySelector('header')
    expect(header).toBeInTheDocument()
    
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    expect(h1).toHaveTextContent('Feature Priority Mapping')
    
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2).toBeInTheDocument()
    expect(h2).toHaveTextContent('Who is this for?')
  })

  test('should have proper section labels', () => {
    render(<Home />)
    
    // Check for section with proper labeling
    const section = screen.getByRole('region', { name: 'Who is this for?' })
    expect(section).toBeInTheDocument()
    
    // Check for feature matrix section
    const matrixSection = screen.getByRole('region', { name: 'Feature Priority Matrix' })
    expect(matrixSection).toBeInTheDocument()
  })

  test('should render main components', () => {
    render(<Home />)
    
    // Check that main components are rendered
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('feature-matrix')).toBeInTheDocument()
  })
})
