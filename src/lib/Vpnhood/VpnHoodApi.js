// Sample code for calling VPNHood APIs with different HTTP methods and bearer token

const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmOTU2Y2JhNi00NGRlLTRmYWMtODY3Zi1mZTU4NjM1MDUwMDEiLCJhdXRob3JpemF0aW9uX2NvZGUiOiIzMTk5ZWQwYS05MTQ1LTRlNWYtYjc2Mi1jNjkxNDMyY2RiNWIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJ2ZXJzaW9uIjoyLCJpYXQiOjE3MTEyMzM2NjAsImp0aSI6ImZiMWQ4ZDM0LTIwNmQtNDk2NS1iMGYwLWI0NDRkZTdiNzY1OSIsImV4cCI6MjEyMTQ2MDg2MCwiaXNzIjoiYXV0aC52cG5ob29kLmNvbSIsImF1ZCI6ImFjY2Vzcy52cG5ob29kLmNvbSJ9.IRDE7VR-tyh9p-sgy_Hbc4h2I24G06d3Sd3XAhF4BEw';
const projectId = 'c750b322-ee70-424e-9f5e-5bd257fd14e7';
const vpnhoodBaseUrl = 'https://api.vpnhood.com/api/v1/';
// Function to fetch data using different HTTP methods and including bearer token in the headers
export async function fetchData(url, method, data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData); // You can handle the response data here
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Object to be passed for the POST request
export const createTokenDto = {
    serverFarmId: "ac58f6fe-fac2-4e96-a37e-d76d1e3d09c2",
    accessTokenName: "test",
    maxTraffic: 0,
    lifetime: 0,
    maxDevice: 1,
    expirationTime: "2024-03-23T22:58:30",
    url: "string",
    isPublic: true
};

export const revokeTokenDto ={
    expirationTime: {
      value: "2025-03-23T23:15:28.824Z"
    },
    isEnabled: {
      value: true
    }
  }

// Calling the APIs with different HTTP methods and bearer token in headers
fetchData(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens`, 'POST', createTokenDto);
fetchData(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens/30022c8f-c616-4ea2-a1b0-8b8fc6c0c16f`, 'DELETE');
fetchData(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens/0b32c38e-18d1-4817-afd9-12acdb4d694d`, 'PATCH', revokeTokenDto);
fetchData(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens/0b32c38e-18d1-4817-afd9-12acdb4d694d/access-key`, 'GET');