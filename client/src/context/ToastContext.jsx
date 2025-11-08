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
	    	USERNAME_TAKEN: 6,
		ACC_DEL_S: 7,
		ACC_DEL_F: 8,
		TIMEOUT: 9,
		LOGIN_BLOCK: 10,
		ERR: 11,
		SET_CREATE_S: 12,
		SET_DEL_S: 13,
		SET_NAME_S: 14,
	    	SET_NAME_F: 15,
		SET_WORDS_S: 16,
		SET_WORD_EXISTS: 17,
		SET_FULL: 18
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
