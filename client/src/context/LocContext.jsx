import { createContext, useState } from 'react';
import Tome from './../Strings.js';

export const LocContext = createContext(null);
export const LocContextProvider = ({ children }) => {
    const [strings, setStrings] = useState(new Tome('english'));
    
    return (
        <LocContext.Provider value={{ strings, setStrings }}>
            {children}
        </LocContext.Provider>
    );
};