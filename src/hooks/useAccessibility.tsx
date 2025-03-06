
import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  keyboardNavigation: boolean;
  setKeyboardNavigation: (enabled: boolean) => void;
}

const initialState: AccessibilityContextType = {
  fontSize: 1,
  setFontSize: () => null,
  highContrast: false,
  setHighContrast: () => null,
  keyboardNavigation: false,
  setKeyboardNavigation: () => null,
};

const AccessibilityContext = createContext<AccessibilityContextType>(initialState);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('a11y-font-size');
    return saved ? parseFloat(saved) : 1;
  });
  
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    const saved = localStorage.getItem('a11y-high-contrast');
    return saved === 'true';
  });
  
  const [keyboardNavigation, setKeyboardNavigationState] = useState<boolean>(() => {
    const saved = localStorage.getItem('a11y-keyboard-nav');
    return saved === 'true';
  });

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-factor', String(fontSize));
    localStorage.setItem('a11y-font-size', String(fontSize));
    
    // Add appropriate class based on font size
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-larger');
    
    if (fontSize === 1) {
      root.classList.add('font-size-normal');
    } else if (fontSize === 1.5) {
      root.classList.add('font-size-large');
    } else if (fontSize === 2) {
      root.classList.add('font-size-larger');
    }
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    localStorage.setItem('a11y-high-contrast', String(highContrast));
  }, [highContrast]);

  // Apply keyboard navigation
  useEffect(() => {
    const root = document.documentElement;
    
    if (keyboardNavigation) {
      root.classList.add('keyboard-nav');
      
      // Focus outline styles
      const style = document.createElement('style');
      style.id = 'keyboard-nav-styles';
      style.textContent = `
        .keyboard-nav *:focus {
          outline: 3px solid #0070f3 !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      root.classList.remove('keyboard-nav');
      const style = document.getElementById('keyboard-nav-styles');
      if (style) {
        document.head.removeChild(style);
      }
    }
    
    localStorage.setItem('a11y-keyboard-nav', String(keyboardNavigation));
  }, [keyboardNavigation]);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
  };

  const setKeyboardNavigation = (enabled: boolean) => {
    setKeyboardNavigationState(enabled);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        keyboardNavigation,
        setKeyboardNavigation,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
};
