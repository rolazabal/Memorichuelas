import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LocContextProvider } from './context/LocContext.jsx';
import { ToastContextProvider } from './context/ToastContext.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<LocContextProvider>
			<ToastContextProvider>
				<App />
			</ToastContextProvider>
		</LocContextProvider>
	</StrictMode>,
)
