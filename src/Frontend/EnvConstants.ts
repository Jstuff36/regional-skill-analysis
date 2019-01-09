// These constants are set by webpack
const REACT_APP_STAGE = process.env.REACT_APP_STAGE

export const backendBaseURL = REACT_APP_STAGE === 'prod' ? '' : ''