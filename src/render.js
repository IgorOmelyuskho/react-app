import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export const reRenderEntireTree = (store) => {
  ReactDOM.render(<App store={store}/>, document.getElementById('root'));
}
