// Base URL of the backend API
const BASE_URL = "http://localhost:8080/api";

/* Custom API Error*/
class ApiError extends Error {
    constructor(message, status, fieldErrors = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

/**
 * Generic API Request Function
 *
 * @param {string} endpoint
 * @param {Object} options
 * @param {string} options.method
 * @param {Object} options.body
 *
 * @returns {Promise<Object|null>}
 */
export async function api(endpoint, options = {}) {

    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Attach request body if provided
    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    let response;

    try {
        response = await fetch(BASE_URL + endpoint, config);
    } catch (error) {
        throw new ApiError(
            "Cannot connect to the backend server. Make sure Spring Boot is running.",
            0
        );
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
        throw new ApiError(
            data?.message || "Request failed.",
            response.status,
            data?.fieldErrors || null
        );
    }

    return data;
}

export { ApiError };