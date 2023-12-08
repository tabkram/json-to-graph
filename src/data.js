async function fetchData(url) {
    try {
        // Use the 'await' keyword to wait for the fetch to complete
        const response = await fetch(url);

        // Check if the request was successful (status code 200)
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        // Use 'await' again to parse the JSON data from the response
        const data = await response.json();

        // Now you can use the 'data' variable as needed
        console.log(data);

        return data; // if you want to return the data from the function
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
        throw error; // if you want to propagate the error further
    }
}

module.exports.fetchData = fetchData;