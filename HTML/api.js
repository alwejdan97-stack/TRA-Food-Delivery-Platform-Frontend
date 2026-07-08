// Base URL of the backend API
export const BASE_URL = "http://localhost:8080/api";

/* Custom API Error*/
class ApiError extends Error {
    constructor(message, status, fieldErrors = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

export async function api(endpoint, options = {}) {

    const config = {
        method: options.method || "GET",
        headers: {}
    };

    if (options.body) {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(options.body);
    }

    let response;
    const controller = new AbortController();
    const timeout = setTimeout(() => {controller.abort();}, 10000);

    config.signal = controller.signal;
    try {
        response = await fetch(BASE_URL + endpoint, config);
        clearTimeout(timeout);
    } catch (error) {
        clearTimeout(timeout);
        if (error.name === "AbortError") {
            throw new ApiError("Request timeout. Server took too long to respond.",408);
        }
    throw new ApiError("Cannot connect to backend server. Make sure Spring Boot is running.",0);
    }
    // No Content
    if (response.status === 204) {
        return null;
    }

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    // Handling HTTP errors
    if (!response.ok) {
        throw new ApiError(data?.message || "Request failed.", response.status, data?.fieldErrors || null);
    }

    return data;
}
export { ApiError };