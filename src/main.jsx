import {AuthProvider} from './context/Auth';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import App from './App';
import {SavedPropertiesProvider} from './context/SavedProperties';
import './styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><HashRouter><SavedPropertiesProvider><AuthProvider><App/></AuthProvider></SavedPropertiesProvider></HashRouter></React.StrictMode>);
