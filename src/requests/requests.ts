import axios from 'axios';

export const token = {
  value: '', // Initialize the token value
};

const API_BASE_URL = 'http://172.208.41.46:3000/api';

// *** sirve *** ///
export async function register(username: string, email: string, password: string) {
  const url = `${API_BASE_URL}/auth/register`;
  const data = {username, email, password };

  try {
    const response = await axios.post(url, data);
    console.log('register successful, token:', response);
  } catch (error: any) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// *** sirve *** ///
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

// *** sirve *** ///
export async function fetchUserInfo() {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      throw new Error('Token not found in localStorage');
    }

    const url = `${API_BASE_URL}/users/me`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      console.log('Success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error:', error);
      throw error;
    }
}

// *** sirve *** ///
export async function fetchUserProjects() {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    throw new Error('Token not found in localStorage');
  }

  const url = `${API_BASE_URL}/networks/me/`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    console.log('Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    throw error;
  }
}

// *** sirve *** ///
export async function addProject(data: any) {
  
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    throw new Error('Token not found in localStorage');
  }

  const url = `${API_BASE_URL}/networks/me/`;
  try {
    const response = await axios.post(url, data, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    console.log('Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    throw error;
  }
}

// *** sirve *** ///
export async function removeProject(data: any) {
  
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    throw new Error('Token not found in localStorage');
  }

  const url = `${API_BASE_URL}/networks/me/${data}`;
  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    console.log('Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    throw error;
  }
}


// *** sirve *** ///
export async function openCanvasProject(data: string) {
  
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    throw new Error('Token not found in localStorage');
  }

  const url = `${API_BASE_URL}/networks/me/${data}`;
  console.log(url);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    console.log('Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
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


// *** sirve *** ///
export async function saveCanvas(data: NetworkData, name: string) {
  
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    throw new Error('Token not found in localStorage');
  }

  const url = `${API_BASE_URL}/networks/me/${name}`;
  const file = {doc: data}
  
  try {
    const response = await axios.patch(url, file, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    console.log('Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    throw error;
  }
}