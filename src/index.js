import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import KeycloakService from './Component/Keycloak';
import { environment } from './constants/environment';
import App from './App';



KeycloakService.init(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      
        <App />
     
    </React.StrictMode>
  );
}).catch((e) => console.log(e));

reportWebVitals();
