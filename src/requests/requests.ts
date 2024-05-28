import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()

const API_BASE_URL = 'http://172.208.41.46:3000/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiZW1haWwxMjNAZ21haWwuY29tIiwidXNlcm5hbWUiOiJldGdhciIsImlhdCI6MTcxNjg1ODkwMywiZXhwIjoxNzE2OTQ1MzAzfQ.qVHXZKISnzabm5XSxcM18OxmIq_p_MNc0TTD3rcNzBY"

export function register(username: string, email: string, password: string) {
  const config = {
    method: 'post',
    url: `${API_BASE_URL}/auth/register`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: { username, email, password },
  };

  axios(config)
    .then((response) => {
      console.log('Respuesta del servidor:', response.data);
    })
    .catch((error) => {
      console.error('Error realizando la petición:', error);
    });
}

export async function login(email: string, password: string) {
  const url = `${API_BASE_URL}/auth/login`;
  const data = { email, password };

  try {
    const response = await axios.post(url, data);
    const token = response.data.token;
    console.log('Login successful, token:', token);
    return token;
  } catch (error: any) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function fetchUserInfo(userId: string) {
  const url = `${API_BASE_URL}/auth/users/${userId}`;
  try {
    const response = await axios.get(url);
    const userInfo = response.data;
    return userInfo;
  } catch (error: any) {
    console.error('Error fetching user info:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function fetchUserNetworks(userId: number) {
  const url = `${API_BASE_URL}/auth/networks/${userId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user networks:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function createNetwork(userId: number, networkData: { name: string }) {
  const url = `${API_BASE_URL}/auth/networks/${userId}`;
  try {
    const response = await axios.post(url, networkData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating network:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function updateNetwork(userId: number, networkName: string, updatedNetworkData: object) {
  const url = `${API_BASE_URL}/auth/networks/${userId}/${networkName}`;
  try {
    const response = await axios.put(url, updatedNetworkData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating network:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function deleteNetwork(userId: number, networkName: string) {
  const url = `${API_BASE_URL}/auth/networks/${userId}/${networkName}`;
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting network:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function fetchNetwork(userId: number, networkName: string) {
  const url = `${API_BASE_URL}/auth/networks/${userId}/${networkName}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching network:', error.response ? error.response.data : error.message);
    throw error;
  }
}


//CANVAS
export interface NetworkData {
  pcs: {
      x: number;
      y: number;
      textx: number;
      texty: number;
      identifier: number;
      text: string;
      ports: {
          object_id: number | undefined;
          type: string | null;
      };
      mask: string;
      ip: string;
      gateway: string;
  }[];
  switches: {
      x: number;
      y: number;
      textx: number;
      texty: number;
      identifier: number;
      text: string;
      ports: {
          object_id: number | null;
          type: string | null;
          speed: string;
          duplex: string;
          description: string;
          status: string;
          mode: string;
          vlan: {
              name: string;
              id: string;
          };
          name: string;
      }[];
      hostname: string;
      message: string;
  }[];
  routers: {
      x: number;
      y: number;
      textx: number;
      texty: number;
      identifier: number;
      text: string;
      ports: {
          object_id: number | null;
          type: string | null;
          speed: string;
          duplex: string;
          description: string;
          status: string;
          net: string;
          interface_ip: string;
          interface_mask: string;
          dot1q: {
              vlan: {
                  name: string;
                  id: string;
              };
              ip: string;
              mask: string;
          }[];
          name: string;
      }[];
      hostname: string;
      message: string;
      rip: string;
  }[];
  cables: {
      startCoordinates: { x: number; y: number };
      endCoordinates: { x: number; y: number };
      startComponent: {
          type: string | null;
          object_id: number | null;
      };
      endComponent: {
          type: string | null;
          object_id: number | null;
      };
      identifier: number;
  }[];
  vlans: string[];
}

export async function getCommands(data: NetworkData) {

  const url = `${API_BASE_URL}/networks/commands`;

  try {
      const response = await axios.post(url, data, {
          headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Success:', response.data);
      return response.data;
      //define the error type
  } catch (error: any) {
      console.error('Error:', error);
  }
}

export async function saveCanvas(data: NetworkData) {

  const url = `${API_BASE_URL}/networks/me/queso`;
  const file = {doc: data}

  console.log( `Bearer ${token}`);

  try {
      const response = await axios.patch(url, file, {
          headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Success:', response.data);
      return response.data;
  } catch (error: any) {
      console.error('Error:', error);
  }

}