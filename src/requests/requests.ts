import axios from 'axios';

const API_BASE_URL = 'http://172.208.41.46:3000/api';

interface LoginResponse {
  token: string;
}

export async function register(username: string, email: string, password: string): Promise<void> {
  const data = {
    username,
    email,
    password,
  };

  const config = {
    method: 'post',
    url: `${API_BASE_URL}/auth/register`,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  try {
    const response = await axios(config);
    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error realizando la petición:', error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<string> {
  const data = {
    email,
    password,
  };

  const url = `${API_BASE_URL}/auth/login`;

  try {
    const response = await axios.post<LoginResponse>(url, data);
    const token = response.data.token;
    console.log('Login successful, token:', token);
    return token;
  } catch (error: any) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }

}

export async function getUserInfo(): Promise<any> {
  const url = `${API_BASE_URL}/users/me`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo información del usuario:', error);
    throw error;
  }
}

export async function updateUserName(userId: number, newName: string): Promise<void> {
  const url = `${API_BASE_URL}/users/me/${userId}`;

  const data = {
    name: newName,
  };

  try {
    await axios.put(url, data);
    console.log('Nombre de usuario actualizado con éxito');
  } catch (error) {
    console.error('Error actualizando el nombre del usuario:', error);
    throw error;
  }
}

export interface Project {
  id: number;
  name: string;
  createdAt: string;
}

export async function getProjects(): Promise<Project[]> {
  const url = `${API_BASE_URL}/networks/me/`;

  try {
    const response = await axios.get<Project[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    throw error;
  }
}

export async function createProject(projectName: string): Promise<Project> {
  const url = `${API_BASE_URL}/networks/me`;

  const data = {
    name: projectName,
  };

  try {
    const response = await axios.post(url, data);
    return response.data; // Devolver el proyecto creado
  } catch (error) {
    console.error('Error creando el proyecto:', error);
    throw error;
  }
}

export async function deleteProject(projectId: number): Promise<void> {
  const url = `${API_BASE_URL}api/networks/me/${projectId}`;

  try {
    await axios.delete(url);
    console.log('Proyecto eliminado con éxito');
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    throw error;
  }
}
