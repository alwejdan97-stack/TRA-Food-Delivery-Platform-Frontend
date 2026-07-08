// api.js used to connect with back-end code
const BASE = 'http://localhost:8080/api';

class ApiError extends Error {
    constructor(msg, status, fieldErrors) {
        super(msg);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

async function api(path, { method = 'GET', body = null } = {}) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    };

    let res;
    try {
        res = await fetch(BASE + path, options);
    } catch (networkError) {
        throw new ApiError('Network connection failed. Please check if the backend is running.', 0);
    }

    if (res.status === 204) {
        return null;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(
            data?.message || 'Request failed', 
            res.status, 
            data?.fieldErrors
        );
    }

    return data;
}