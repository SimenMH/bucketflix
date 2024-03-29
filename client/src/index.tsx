import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/styles.css';
import { Provider } from 'react-redux';
import store from './redux/Store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
