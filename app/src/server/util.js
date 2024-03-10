let server = "http://localhost:8000";

async function postServiceData(method, params) {
    try {
        const response = await fetch(server + "/" + method, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        const data = await response.json();
        return await Promise.resolve(data);
    } catch (error) {
        console.log(error);
        return error;
    }
}

export { postServiceData };