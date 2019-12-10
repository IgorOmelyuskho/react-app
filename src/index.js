import './index.css';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import rootReducer from '../src/store/reducers';
import { reRenderEntireTree } from './render';

export const store = createStore(rootReducer);
store.subscribe(
  val => {
    console.log(store.getState());
    reRenderEntireTree(store);
  }
)

reRenderEntireTree(store);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
