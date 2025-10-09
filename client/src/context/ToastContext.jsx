import { createContext, useState } from 'react';

import Toaster from './../Toaster.jsx';
import Toast from './../Toast.js';

export const ToastContext = createContext(null);
export const ToastContextProvider = ({ children }) => {

    const toasts = {
		LOGIN_S: 0,
		LOGIN_F: 1,
		LOGOUT_S: 2,
		ACC_CREATE_F: 3,
		USERNAME_S: 4,
		USERNAME_F: 5,
		ACC_DEL_S: 6,
		ACC_DEL_F: 7,
		TIMEOUT: 8,
		LOGIN_BLOCK: 9,
		ERR: 10,
		SET_CREATE_S: 11,
		SET_DEL_S: 12,
		SET_NAME_S: 13,
		SET_WORDS_S: 14,
		SET_WORD_EXISTS: 15,
		SET_FULL: 16
	};

    const [toast, setToast] = useState(toasts.ERR);

    const showToast = (type) => {
        setToast(new Toast(type))
    }
    
    return (
        <ToastContext.Provider value={{ toasts, showToast }}>
            {children}
            <Toaster toast={toast} />
        </ToastContext.Provider>
    );
};