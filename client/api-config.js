let backendHost = process.env.REACT_APP_BACKEND_HOST || `http://localhost:${process.env.PORT || 8080}`;
//this needs improvement
if (process.env.NODE_ENV === 'development') {
    backendHost = `http://localhost:${process.env.PORT || 3000}`;
}
export const API_ROOT = `${backendHost}/api`;