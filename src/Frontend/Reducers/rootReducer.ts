import { combineReducers } from 'redux';
import jobsReducer, { JobsStore, jobsInitialState } from './jobsReducer';

export interface StoreState {
    jobsStore: JobsStore;
}

export const initialState: StoreState = {
    jobsStore: jobsInitialState
};

const reducers = {
    jobsReducer: jobsReducer
};

const rootReducer = combineReducers(reducers);

export default rootReducer;