import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { useContext, useState, useEffect } from 'react';
import { LocContext } from './context/LocContext.jsx';
import { ToastContext } from './context/ToastContext.jsx';

function Toaster({toast}) {

	const [show, setShow] = useState(false);
	const [type, setType] = useState(null);

	const { toasts, showToast } = useContext(ToastContext);
	const { strings } = useContext(LocContext);

    const del = 5000;

	useEffect(() => {
		if (toast != null) {
			setType(toast.type);
			setShow(true);
		}
	}, [toast]);

    return (
        <ToastContainer position={'top-end'} style={{zIndex: 1}}>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.LOGIN_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_login_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'danger'}
				onClose={() => setShow(false)}
				show={show && type == toasts.LOGIN_F}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_login_fail')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.LOGOUT_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_logout_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'danger'}
				onClose={() => setShow(false)}
				show={show && type == toasts.ACC_CREATE_F}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_create_acc_fail')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.USERNAME_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_change_name_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'danger'}
				onClose={() => setShow(false)}
				show={show && type == toasts.USERNAME_F}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_name_exists')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.ACC_DEL_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_delete_acc_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'danger'}
				onClose={() => setShow(false)}
				show={show && type == toasts.ACC_DEL_F}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_delete_acc_fail')}</Toast.Body>
			</Toast>
			<Toast
				bg={'warning'}
				onClose={() => setShow(false)}
				show={show && type == toasts.TIMEOUT}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_user_timed_out')}</Toast.Body>
			</Toast>
			<Toast
				bg={'danger'}
				onClose={() => setShow(false)}
				show={show && type == toasts.LOGIN_BLOCK}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_block_login')}</Toast.Body>
			</Toast>
			<Toast
				bg={'danger'}
				onClose={() => setShow(false)}
				show={show && type == toasts.ERR}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_fail')}</Toast.Header>
				<Toast.Body>{strings.get('t_error')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.SET_CREATE_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_create_set_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.SET_DEL_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_delete_set_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.SET_NAME_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_change_setname_success')}</Toast.Body>
			</Toast>
			<Toast
				bg={'success'}
				onClose={() => setShow(false)}
				show={show && type == toasts.SET_WORDS_S}
				delay={del} autohide
			>
				<Toast.Header>{strings.get('t_success')}</Toast.Header>
				<Toast.Body>{strings.get('t_change_setwords_success')}</Toast.Body>
			</Toast>
        </ToastContainer>
    )
}

export default Toaster
