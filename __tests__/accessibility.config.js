// Accessibility Testing Configuration for WCAG 2.1 AA Compliance
module.exports = {
  // WCAG 2.1 AA Standards
  standards: {
    perceivable: {
      colorContrast: '4.5:1 minimum ratio',
      textResize: '200% without loss of functionality',
      audioVideo: 'captions and descriptions required',
      nonTextContent: 'alt text and labels required'
    },
    operable: {
      keyboardAccess: 'all functionality via keyboard',
      focusManagement: 'visible focus indicators',
      timing: 'adjustable time limits',
      navigation: 'skip links and landmarks',
      inputModalities: 'pointer gestures alternatives'
    },
    understandable: {
      readability: 'clear language and structure',
      predictability: 'consistent navigation',
      inputAssistance: 'error identification and suggestions'
    },
    robust: {
      compatibility: 'works with assistive technologies',
      parsing: 'valid HTML and ARIA markup'
    }
  },

  // Testing Tools
  tools: {
    automated: ['jest-axe', 'axe-core'],
    manual: ['screen reader testing', 'keyboard navigation', 'color contrast'],
    browser: ['Chrome DevTools', 'Firefox Accessibility Inspector']
  },

  // Test Coverage Areas
  coverage: {
    components: ['forms', 'navigation', 'content', 'media'],
    interactions: ['keyboard', 'mouse', 'touch', 'voice'],
    devices: ['desktop', 'tablet', 'mobile', 'assistive tech']
  }
}
