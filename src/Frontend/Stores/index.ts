import { createStore } from 'redux';
import rootReducer, { StoreState } from '../Reducers/rootReducer';

export default function configureStore(initialState: StoreState) {
    const store = createStore(
        rootReducer,
        initialState
    );
    return store;
}