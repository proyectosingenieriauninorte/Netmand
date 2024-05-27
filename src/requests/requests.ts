import axios from 'axios';


export function sendComponentsData(data: JSON) {

    const url = 'https://your-api-endpoint.com/api/your-endpoint'; // Replace with your API endpoint

    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Success:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


