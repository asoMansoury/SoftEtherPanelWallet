// Sample code for calling VPNHood APIs with different HTTP methods and bearer token

const projectId = 'c750b322-ee70-424e-9f5e-5bd257fd14e7';

// Function to fetch data using different HTTP methods and including bearer token in the headers
export async function fetchVpnHoodApi(url, method, data = null,bearerToken) {
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

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Object to be passed for the POST request


export const revokeTokenDto ={
    expirationTime: {
      value: "2025-03-23T23:15:28.824Z"
    },
    isEnabled: {
      value: true
    }
  }

// Calling the APIs with different HTTP methods and bearer token in headers

// fetchVpnHoodApi(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens/30022c8f-c616-4ea2-a1b0-8b8fc6c0c16f`, 'DELETE');
// fetchVpnHoodApi(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens/0b32c38e-18d1-4817-afd9-12acdb4d694d`, 'PATCH', revokeTokenDto);
// fetchVpnHoodApi(`${vpnhoodBaseUrl}projects/${projectId}/access-tokens/0b32c38e-18d1-4817-afd9-12acdb4d694d/access-key`, 'GET');