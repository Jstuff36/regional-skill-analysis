import { combineReducers } from 'redux';
import jobsReducer, { JobsStore, jobsInitialState } from './jobsReducer';
import coursesReducer, { coursesInitialState, CoursesStore } from './coursesReducer';

export interface StoreState {
    jobsStore: JobsStore;
    coursesStore: CoursesStore;
}

export const initialState: StoreState = {
    jobsStore: jobsInitialState,
    coursesStore: coursesInitialState
};

const reducers = {
    jobsStore: jobsReducer,
    coursesStore: coursesReducer
};

const rootReducer = combineReducers(reducers);

export default rootReducer;