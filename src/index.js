import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import { AuthProvider } from './context/authProvider';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';


if(process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/*' element={ <App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);

