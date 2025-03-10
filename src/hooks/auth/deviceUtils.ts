
import { v4 as uuidv4 } from 'uuid';

// Generate a trusted device token
export const generateTrustedDeviceToken = (userId: string) => {
  const token = uuidv4();
  const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
  const deviceData = {
    token,
    fingerprint,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  };
  
  const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
  trustedDevices.push(deviceData);
  
  // Limit number of trusted devices
  if (trustedDevices.length > 5) {
    trustedDevices.shift();
  }
  
  localStorage.setItem(`trusted_devices_${userId}`, JSON.stringify(trustedDevices));
  
  // Set in current device's local storage
  localStorage.setItem(`device_token_${userId}`, token);
  
  return token;
};

// Check if current device is trusted
export const isCurrentDeviceTrusted = (userId: string) => {
  const currentToken = localStorage.getItem(`device_token_${userId}`);
  if (!currentToken) return false;
  
  const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
  return trustedDevices.some((device: any) => device.token === currentToken);
};

// Update trusted device last used timestamp
export const updateTrustedDevice = (userId: string) => {
  const currentToken = localStorage.getItem(`device_token_${userId}`);
  if (!currentToken) return false;
  
  const trustedDevices = JSON.parse(localStorage.getItem(`trusted_devices_${userId}`) || '[]');
  const updatedDevices = trustedDevices.map((device: any) => {
    if (device.token === currentToken) {
      return {
        ...device,
        lastUsed: new Date().toISOString()
      };
    }
    return device;
  });
  
  localStorage.setItem(`trusted_devices_${userId}`, JSON.stringify(updatedDevices));
  return true;
};
