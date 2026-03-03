import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'verimind_session_id';

/**
 * Retrieves the current anonymous session ID.
 * If none exists, generates a new secure UUID and saves it.
 * This ensures privacy-preserving isolation without login.
 */
export const getSessionId = (): string => {
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
};

/**
 * Clears the session (e.g. for "Logout" feel or privacy clear)
 */
export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};
