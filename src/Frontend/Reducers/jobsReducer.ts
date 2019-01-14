import { createAction, Action } from 'redux-actions';

export interface Job {
    id: string;
    position: string;
    zipCode: string;
    skills: string[];
    description?: string;
}

export interface JobsStore {
    [zipCode: string]: Job[];
}

export const jobsInitialState: JobsStore = {
    '12321': [
        {
            id: '12321',
            position: 'CNC Programmer',
            zipCode: '11111',
            skills: ['CNC Programming', 'CAD', '3D Printing'],
            description: "A long winded explanation of some random job woopie...blah blah blah blah balh balha blah blah"
        }
    ],
    '11111': [
        {
            id: '11111',
            position: 'Professional Paint Watcher',
            zipCode: '11111',
            skills: ['CNC Programming', 'Some random skill'],
            description: "A long winded explanation of some random job woopie...blah blah blah blah balh balha blah blah"
        }
    ]
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

type AddAllJobsByZipCode = 'AddAllJobsByZipCode'
const AddAllJobsByZipCode: AddAllJobsByZipCode = 'AddAllJobsByZipCode';

export interface AddAlljobsByZipCodePayload {
    zipCode: string;
    jobs: Job[];
}

interface AddAllJobsByZipCodeAction extends Action<AddAlljobsByZipCodePayload> {
    type: AddAllJobsByZipCode;
}

const addAllJobsByZipCode = createAction<AddAlljobsByZipCodePayload>(AddAllJobsByZipCode);

export type JobActions = AddJobAction | RemoveJobAction | AddAllJobsByZipCodeAction;

export const jobActionCreators = {
    addJob,
    removeJob,
    addAllJobsByZipCode
}

export default function jobsReducer(state: JobsStore = jobsInitialState, action: JobActions) {
    switch(action.type) {
        case AddAllJobsByZipCode:
            if (action.payload) {
                return {
                    ...state,
                    [action.payload.zipCode]: action.payload.jobs
                }
            } else {
                return state;
            }
        case AddJob: 
            if (action.payload) {
                return {
                    ...state,
                    [action.payload.zipCode]: [...state[action.payload.zipCode], action.payload]
                }
            } else {
                return state;
            }
        case RemoveJob:
            const { id } = action.payload!;
            const { [id]: _, ...withJobRemoved } = state;
            return withJobRemoved;  
        default:
            return state;
    }
}