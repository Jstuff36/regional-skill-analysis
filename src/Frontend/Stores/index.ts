import { createStore, applyMiddleware } from 'redux';
import rootReducer, { StoreState } from '../Reducers/rootReducer';
import logger from 'redux-logger';

export default function configureStore(initialState: StoreState) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(logger)
    );
    return store;
}