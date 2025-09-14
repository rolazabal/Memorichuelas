import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Toaster({lang, strings, toast, toastType, setToast}) {
    const del = 5000;
    
    return (
        <ToastContainer position={'top-end'} style={{zIndex: 1}}>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 0}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_login_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 1}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_login_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 2}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_logout_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 3}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_create_acc_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 4}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_change_name_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 5}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_name_exists[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 6}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_delete_acc_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 7}
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
            show={toast && toastType == 8}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_user_timed_out[lang]}</Toast.Body>
          </Toast>
            <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 9}
            delay={del} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_block_login[lang]}</Toast.Body>
          </Toast>
        </ToastContainer>
    )
}

export default Toaster