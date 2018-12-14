import { createAction, Action } from 'redux-actions';
const uuidv1 = require('uuid/v1');

export interface Job {
    position: string;
    zipCode: string;
    skills: string[];
}

export interface JobsStore {
    [id: string]: Job;
}

export const jobsInitialState: JobsStore = {
    '12321': {
        position: 'CNC Programmer',
        zipCode: '11111',
        skills: ['CNC Programming', 'CAD', '3D Printing']
    },
    '11111': {
        position: 'Professional Paint Watcher',
        zipCode: '11111',
        skills: ['CNC Programming', 'Some random skill']
    }
}

type AddJob = 'addJob';
const AddJob: AddJob = 'addJob';

interface AddJobAction extends Action<Job> {
    type: AddJob
}

const addJob = createAction<Job>(AddJob);

type RemoveJob = 'removeJob';
const RemoveJob: RemoveJob = 'removeJob';

interface RemoveJobAction extends Action<{id: string}> {
    type: RemoveJob
}

const removeJob = createAction<{id: string}>(RemoveJob);

export type AddJobActions = AddJobAction | RemoveJobAction;

export const jobActions = {
    addJob,
    removeJob
}

export default function jobsReducer(state: JobsStore = jobsInitialState, action: AddJobActions) {
    switch(action.type) {
        case AddJob: 
            return {
                ...state,
                [uuidv1()]: action.payload
            }
        case RemoveJob:
            const { id } = action.payload!;
            const { [id]: _, ...withJobRemoved } = state;
            return withJobRemoved;  
        default:
            return state;
    }
}