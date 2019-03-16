import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './Router';

import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)

ReactDOM.createRoot(document.getElementById('root')).render(<Router />);
