import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/browser';

import App from './App';

import './index.css';

if (process.env.REACT_APP_ENV === 'production') {
  Sentry.init({
    dsn: '',   // TODO
    release: ''   // --sentry release--
  });
}

ReactDOM.render(<App />, document.getElementById('iframe'));
