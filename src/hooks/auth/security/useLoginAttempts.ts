import { useState } from "react";
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION } from "./securityConstants";

export const useLoginAttempts = () => {
  // Get login attempts for a specific email
  const getLoginAttempts = (email: string) => {
    const attemptsData = localStorage.getItem(`login_attempts_${email}`);
    if (attemptsData) {
      try {
        return JSON.parse(attemptsData);
      } catch (e) {
        return { count: 0, timestamp: Date.now() };
      }
    }
    return { count: 0, timestamp: Date.now() };
  };

  // Update login attempts for tracking failed logins
  const updateLoginAttempts = (email: string, increment = true) => {
    const attempts = getLoginAttempts(email);
    const now = Date.now();
    
    // If the lockout period has passed, reset the counter
    if (attempts.lockUntil && attempts.lockUntil < now) {
      localStorage.setItem(`login_attempts_${email}`, JSON.stringify({
        count: increment ? 1 : 0,
        timestamp: now
      }));
      return { count: increment ? 1 : 0, timestamp: now };
    }
    
    // Otherwise, increment the counter
    const newCount = increment ? attempts.count + 1 : 0;
    const newData = { 
      count: newCount, 
      timestamp: now,
      lockUntil: newCount >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_DURATION : undefined
    };
    
    localStorage.setItem(`login_attempts_${email}`, JSON.stringify(newData));
    return newData;
  };

  // Check if an account is locked
  const checkAccountLocked = (email: string) => {
    const attempts = getLoginAttempts(email);
    if (attempts.lockUntil && attempts.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((attempts.lockUntil - Date.now()) / (60 * 1000));
      return {
        locked: true,
        remainingMinutes: remainingTime
      };
    }
    return { locked: false, remainingMinutes: 0 };
  };

  return {
    getLoginAttempts,
    updateLoginAttempts,
    checkAccountLocked
  };
};
