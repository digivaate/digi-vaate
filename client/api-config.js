let backendHost = `http://localhost:${process.env.PORT}`;
//this needs improvement
if (process.env.NODE_ENV === 'development') {
    backendHost = `http://localhost:${process.env.PORT || 3000}`;
}
export const API_ROOT = `${backendHost}/api`;