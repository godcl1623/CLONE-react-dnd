import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import { rootReducer } from './reducers';

const root = document.querySelector('#root');
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxStore = createStore(rootReducer, composeEnhancers(applyMiddleware()));

ReactDOM.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  root
);