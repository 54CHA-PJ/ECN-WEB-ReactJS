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
        const res = await Promise.resolve(data);
        console.log('SERVER:', JSON.stringify(res).substring(0, 200) + (JSON.stringify(res).length > 200 ? '...' : ''));
        return(res);
    } catch (error) {
        console.log('SERVER ERROR:',error);
        return error;
    }
}

export { postServiceData };