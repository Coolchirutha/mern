import { TEST_DISPATCH } from './types.js';

// Registration action
export const registerUser = (userData) => {
    return {
        type: TEST_DISPATCH,
        payload: userData
    }
}
