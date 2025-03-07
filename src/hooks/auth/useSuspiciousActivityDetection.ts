
import { useState, useEffect } from 'react';

export function useSuspiciousActivityDetection() {
  const [hasDetectedSuspiciousActivity, setHasDetectedSuspiciousActivity] = useState(false);

  useEffect(() => {
    // Check for suspicious login patterns or bot activity
    const typingSpeedCheck = () => {
      const now = Date.now();
      const lastActivityStr = sessionStorage.getItem('last_login_activity');
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr) : 0;
      
      if (lastActivity && (now - lastActivity < 100)) {
        // Typing is suspiciously fast - might be automated
        incrementSuspiciousCounter();
      }
      sessionStorage.setItem('last_login_activity', now.toString());
    };

    // Add event listeners to monitor behavior
    const formElements = document.querySelectorAll('input, button');
    formElements.forEach(el => {
      el.addEventListener('click', typingSpeedCheck);
      el.addEventListener('keypress', typingSpeedCheck);
    });

    // Check for unusual browser/device patterns
    const detectSuspiciousEnvironment = () => {
      // Check for automation tools, headless browsers, or unusual plugins
      const windowObj = window as any;
      const navigatorObj = navigator as any;
      
      const automationHints = [
        'webdriver' in navigatorObj,
        'domAutomation' in windowObj,
        'callPhantom' in windowObj,
        '__nightmare' in windowObj,
        '__selenium_evaluate' in windowObj,
        '__webdriverFunc' in windowObj,
        navigator.userAgent.toLowerCase().includes('selenium'),
        /headless/i.test(navigator.userAgent)
      ];
      
      if (automationHints.some(hint => hint)) {
        incrementSuspiciousCounter(3); // Higher weight for automation signals
      }
    };
    
    detectSuspiciousEnvironment();

    return () => {
      // Clean up event listeners
      formElements.forEach(el => {
        el.removeEventListener('click', typingSpeedCheck);
        el.removeEventListener('keypress', typingSpeedCheck);
      });
    };
  }, []);

  const incrementSuspiciousCounter = (increment = 1) => {
    const counterStr = sessionStorage.getItem('suspicious_activity_counter');
    const currentCount = counterStr ? parseInt(counterStr) : 0;
    const newCount = currentCount + increment;
    sessionStorage.setItem('suspicious_activity_counter', newCount.toString());
    
    // If we reach a threshold, add security measures
    if (newCount >= 5 && !hasDetectedSuspiciousActivity) {
      setHasDetectedSuspiciousActivity(true);
      // Log the suspicious activity
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push({
        type: 'suspicious_login_behavior',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        indicators: {
          rapidActivity: newCount >= 5,
          automationSignals: /headless|selenium|webdriver/i.test(navigator.userAgent)
        }
      });
      localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    }
  };

  return { hasDetectedSuspiciousActivity };
}
