let server = "http://localhost:8000";

const postServiceData = async (method, params) => {
    try {
        const response = await fetch(server + "/" + method, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

const stringToDate = (_date) => {
    if (!Date.parse(_date)) {
        console.error('Invalid date string:', _date);
        return null;
    }

    var delimiter = "-";
    var formatLowerCase = "yyyy-mm-dd";
    if (_date.indexOf("/") > 0) {
        delimiter = "/";
        formatLowerCase = "dd/mm/yyyy";
    }
    var formatItems=formatLowerCase.split(delimiter);
    var dateItems=_date.split(delimiter);

    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;

    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate.toDateString();
}

const formatDate = (dateString) => {
    if (!dateString) {
        return 'N/A';
    }

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export  { postServiceData, stringToDate, formatDate };