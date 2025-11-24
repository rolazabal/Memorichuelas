import { createContext, useState, useContext } from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { LocContext } from './LocContext.jsx';

export const ToastContext = createContext(null);

export const ToastContextProvider = ({ children }) => {

    const [type, setType] = useState("");
	const [msg, setMsg] = useState("");
    const [show, setShow] = useState(false);

    const showToast = (type, msg) => {
        setType(type);
		setMsg(msg);
		setShow(true);
    };

	const { strings } = useContext(LocContext);
    
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position={'top-end'} style={{zIndex: 1}}>
				<Toast
					bg={type}
					onClose={() => setShow(false)}
					show={show}
					delay={50000}
					autohide
				>
					<Toast.Header>{type != "" ? strings.get(type) : type}</Toast.Header>

					{msg != "" && 
						<Toast.Body>{typeof(msg) == typeof([""]) ? msg[strings.lang] : strings.get(msg)}</Toast.Body>
					}
				</Toast>
			</ToastContainer>
        </ToastContext.Provider>
    );

};
