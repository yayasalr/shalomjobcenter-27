
// Define the keys used in localStorage
export enum LocalStorageKeys {
  USER = 'user_data',
  AUTH_TOKEN = 'auth_token',
  REFRESH_TOKEN = 'refresh_token'
}

// Ensure an admin account exists for demo purposes
export const ensureAdminAccount = () => {
  const existingUser = localStorage.getItem(LocalStorageKeys.USER);
  if (!existingUser) {
    // Create a default admin account if none exists
    const defaultAdmin = {
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isAdmin: true
    };
    
    // Note: In a real app, you would never store credentials in localStorage like this
    // This is only for demo purposes
    localStorage.setItem('admin_credentials', JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123'
    }));
  }
};
