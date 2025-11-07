import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LocContextProvider } from './context/LocContext.jsx';
import { ToastContextProvider } from './context/ToastContext.jsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEarthAmericas, faTrash, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

library.add(faEarthAmericas, faTrash, faPlus, faMagnifyingGlass);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<LocContextProvider>
			<ToastContextProvider>
				<App />
			</ToastContextProvider>
		</LocContextProvider>
	</StrictMode>,
);
