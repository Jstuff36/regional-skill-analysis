import { createAction, Action } from 'redux-actions';

export interface Job {
    id: string;
    position: string;
    zipCode: string;
    skills: string[];
    description?: string;
}

export interface JobsStore {
    [id: string]: Job;
}

export const jobsInitialState: JobsStore = {
    '12321': {
        id: '12321',
        position: 'CNC Programmer',
        zipCode: '11111',
        skills: ['CNC Programming', 'CAD', '3D Printing'],
        description: "A long winded explanation of some random job woopie...blah blah blah blah balh balha blah blah"
    },
    '11111': {
        id: '11111',
        position: 'Professional Paint Watcher',
        zipCode: '11111',
        skills: ['CNC Programming', 'Some random skill'],
        description: "A long winded explanation of some random job woopie...blah blah blah blah balh balha blah blah"
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

export type JobActions = AddJobAction | RemoveJobAction;

export const jobActions = {
    addJob,
    removeJob
}

export default function jobsReducer(state: JobsStore = jobsInitialState, action: JobActions) {
    switch(action.type) {
        case AddJobsByZipCode:
            // when type ahead queries for zipcode merge them in here
            // Then load that data into the home page for show all zipcodes they searched for
            // By saving it by zipcode we can keep old searches saved under there zipcode
            // This will also make it easy for the user to go back

        // Check to see if this is right. Shouldnt it do merge the object that that zipcode maps to
        case AddJob: 
            if (action.payload) {
                return {
                    ...state,
                    [action.payload.id]: action.payload
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