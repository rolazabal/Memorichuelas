import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Toaster({lang, strings, toast, toastType, setToast}) {
    
    return (
        <ToastContainer position={'top-end'} style={{zIndex: 1}}>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 0}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_login_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 1}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_login_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 2}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_logout_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 3}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_create_acc_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 4}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_change_name_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 5}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_change_name_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'success'}
            onClose={() => setToast(false)}
            show={toast && toastType == 6}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_success[lang]}</Toast.Header>
            <Toast.Body>{strings.t_delete_acc_success[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'danger'}
            onClose={() => setToast(false)}
            show={toast && toastType == 7}
            delay={5000} autohide
          >
            <Toast.Header>{strings.t_fail[lang]}</Toast.Header>
            <Toast.Body>{strings.t_delete_acc_fail[lang]}</Toast.Body>
          </Toast>
          <Toast
            bg={'warning'}
            onClose={() => setToast(false)}
            show={toast && toastType == 99}
            delay={5000} autohide
          >
            <Toast.Header>Caution</Toast.Header>
            <Toast.Body>
                Cautiously cautious!
            </Toast.Body>
          </Toast>
        </ToastContainer>
    )
}

export default Toaster