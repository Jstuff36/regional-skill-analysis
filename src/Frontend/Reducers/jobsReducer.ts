import { createAction, Action } from 'redux-actions';
const uuidv1 = require('uuid/v1');

interface Job {
    position: string;
    zipCode: string;
    skills: string[];
}

export interface JobsStore {
    [id: number]: Job;
}

export const jobsInitialState: JobsStore = {}

type AddJob = 'addJob';
const AddJob: AddJob = 'addJob';

interface AddJobAction extends Action<Job> {
    type: AddJob
}

const addJob = createAction<Job>(AddJob);

export type AddJobActions = AddJobAction;

export const jobActions = {
    addJob
}

export default function jobsReducer(state: JobsStore = jobsInitialState, action: AddJobActions) {
    switch(action.type) {
        case AddJob: 
            return {
                ...state,
                [uuidv1()]: action.payload
            }
        default:
            return state;
    }
}