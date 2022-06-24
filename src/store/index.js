import { applyMiddleware, createStore} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {persistStore} from 'redux-persist';

import rootReducer from './root.reducer';

const store: Store = __DEV__
? createStore(rootReducer, {}, composeWithDevTools(applyMiddleware(thunk)))
: createStore(rootReducer, {}, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor};