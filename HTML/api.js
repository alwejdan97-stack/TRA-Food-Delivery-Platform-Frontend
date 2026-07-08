const BASE_URL = "http://localhost:8080/api";

async function getData(endpoint) {
    const response = await fetch(BASE_URL + endpoint);

    if (!response.ok) {
        throw new Error("Request Failed");
    }

    return await response.json();
}

async function postData(endpoint, data) {
    const response = await fetch(BASE_URL + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Request Failed");
    }

    return await response.json();
}