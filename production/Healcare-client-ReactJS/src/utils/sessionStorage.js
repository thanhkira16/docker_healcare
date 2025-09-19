// Utility functions for managing user session in localStorage

const USER_SESSION_KEY = 'vku_healthcare_user_session';

/**
 * Save user session to localStorage
 * @param {Object} userInfo - User information object
 */
export const saveUserSession = (userInfo) => {
    try {
        const sessionData = {
            userInfo,
            isLoggedIn: true,
            timestamp: Date.now()
        };
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
        console.error('Error saving user session:', error);
    }
};

/**
 * Get user session from localStorage
 * @returns {Object|null} Session data or null if not found/expired
 */
export const getUserSession = () => {
    try {
        const sessionData = localStorage.getItem(USER_SESSION_KEY);
        if (!sessionData) {
            return null;
        }

        const parsedData = JSON.parse(sessionData);

        // Check if session is older than 24 hours (optional expiry)
        const sessionAge = Date.now() - parsedData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (sessionAge > maxAge) {
            removeUserSession();
            return null;
        }

        return {
            userInfo: parsedData.userInfo,
            isLoggedIn: parsedData.isLoggedIn
        };
    } catch (error) {
        console.error('Error getting user session:', error);
        return null;
    }
};

/**
 * Remove user session from localStorage
 */
export const removeUserSession = () => {
    try {
        localStorage.removeItem(USER_SESSION_KEY);
    } catch (error) {
        console.error('Error removing user session:', error);
    }
};

/**
 * Check if user session exists and is valid
 * @returns {boolean} True if valid session exists
 */
export const hasValidSession = () => {
    const session = getUserSession();
    return session !== null && session.isLoggedIn;
};