import {createStore, applyMiddleware, compose} from 'redux';
import {thunk} from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducers/rootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // optionally, specify which reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(preloadedState) {
  const middlewares = [thunk];
  const middlewaresEnhancer = applyMiddleware(...middlewares);

  const storeEnhancer = [middlewaresEnhancer];
  const composedEnhancer = compose(...storeEnhancer);

  const store = createStore(persistedReducer, preloadedState, composedEnhancer);
  const persistor = persistStore(store);
  return {store, persistor};
}
