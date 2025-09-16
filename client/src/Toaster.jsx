import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Toaster({lang, strings, toast, t_menu, toastType, setToast}) {
    const del = 5000;
    
    return (
        <ToastContainer position={'top-end'} style={{zIndex: 1}}>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.LOGIN_S}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_login_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.LOGIN_F}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_login_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.LOGOUT_S}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_logout_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.ACC_CREATE_F}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_create_acc_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.USERNAME_S}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_change_name_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.USERNAME_F}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_name_exists[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.ACC_DEL_S}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_delete_acc_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.ACC_DEL_F}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_delete_acc_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'warning'}
            onClose={() => setToast(false)}
            show={toast && toastType == 99}
            delay={del} autohide
          >
            <Toast.Header>Caution</Toast.Header>
            <Toast.Body>
                Cautiously cautious!
            </Toast.Body>
          </Toast>
          <Toast
            bg={'warning'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.TIMEOUT}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_user_timed_out[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.LOGIN_BLOCK}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_block_login[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == t_menu.ERR}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_error[lang]}</Toast.Body>
          </Toast>
        </ToastContainer>
    )
}

export default Toaster