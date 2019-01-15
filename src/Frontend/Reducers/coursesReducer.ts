import { createAction, Action } from 'redux-actions';

export interface Course {
    name: string;
    zipCode: string;
    description?: string;
    id: string;
    skills: string[];
}

export interface CoursesStore {
    [zipCode: string]: Course[];
}

type AddCourse = 'addCourse';
const AddCourse: AddCourse = 'addCourse';

interface AddCourseAction extends Action<Course> {
    type: AddCourse
}

export const addCourse = createAction<Course>(AddCourse);

type RemoveCourse = 'removeCourse';
const RemoveCourse: RemoveCourse = 'removeCourse';

interface RemoveCourseAction extends Action<{ course: Course }> {
    type: RemoveCourse
}

export const removeCourse = createAction<{ course: Course }>(RemoveCourse);

export type CoursesActions = AddCourseAction | RemoveCourseAction;

export const coursesActions = {
    addCourse,
    removeCourse
}

export const coursesInitialState = {}

export default function coursesReducer(state: CoursesStore = coursesInitialState, action: CoursesActions) {
    switch (action.type) {
        case AddCourse: {
            if (action.payload) {
                const course = action.payload
                const currentCourses = state[course.zipCode] || [];
                return {
                    ...state,
                    [course.zipCode]: [
                        ...currentCourses,
                        course
                    ]
                }
            } else {
                return state;
            }
        }
        case RemoveCourse: {
            const { course } = action.payload!;
            const courses = state[course.zipCode].filter(({id}) => id !== course.id);
            return {
                ...state,
                [course.zipCode]: courses
            }
        }
        default:
            return state;
    }
}