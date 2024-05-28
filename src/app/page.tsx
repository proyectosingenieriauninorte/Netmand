'use client';
import styles from './app.module.css';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/requests/requests';





// Función para validar el email
const validateEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Función para validar la igualdad de contraseñas
const validatePassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

export default function Register() {
  const router = useRouter();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Estado para el mensaje de error
  const [errorMessage, setErrorMessage] = useState('');

  // Manejador de cambios en los campos del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage('');
  };

  // Función para validar el formulario
  const validateForm = () => {
    const {userName, email, password, confirmPassword } = formData;
    let error = '';

    if (!userName.trim()) {
      error += 'Please enter your user name. ';
    }
    if (!email.trim()) {
      error += 'Please enter your email address. ';
    } else if (!validateEmail(email)) {
      error += 'Please enter a valid email address. ';
    }
    if (!password.trim() || !confirmPassword.trim()) {
      error += 'Please enter both password fields. ';
    } else if (password.trim() !== confirmPassword.trim()) {
      error += 'Passwords do not match. ';
    }

    setErrorMessage(error.trim());
    return !error;
  };

  // Manejador para enviar datos a la base de datos simulada
  const sendDataToDatabase = async () => {
    register(formData.userName,formData.email,formData.password)
    setTimeout(() => {
      console.log('Data sent successfully!');
    }, 1000);
  };

  // Manejador del registro
  const handleRegister = async () => {
    if (validateForm()) {
      console.log('Formulario válido, enviando datos...');
      sendDataToDatabase();
      router.push('./user');
    } else {
      console.log('Formulario inválido, no se puede enviar.');
    }

    const isFormEmpty = !formData.userName.trim()  && !formData.email.trim() && !formData.password.trim();
    if (isFormEmpty) {
      setErrorMessage('Please fill out the form.');
    }
  };

  return (
    <div>
      <div className={`bg-gradient-to-r from-neutral-950 to-gray-700 font-bold flex flex-col min-h-screen`}>
        {/* Encabezado */}
        <header className="flex flex-col items-center md:flex-row md:items-start md:justify-between md:px-8 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-in animate-normal animate-fill-forwards">
          {/* Logo y nombre */}
          <div className="flex items-center mb-4">
            <div className={styles.logo}></div>
            <h1 className="text-4xl md:text-5xl text-slate-300 ml-4">NETMAND</h1>
          </div>
          {/* Navegación */}
          <nav className="flex space-x-4 md:space-x-8 items-center">
            <Link href='/'><p className={styles.navLink}>Home</p></Link>
            <Link href='./login'><p className={styles.navLink}>Join</p></Link>
          </nav>
        </header>
        <div>

        </div>
        {/* Contenido principal */}
        <div className="welcome-page text-slate-400 p-16 md:px-36 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-in animate-normal animate-fill-forwards">
          <div className="w-full md:w-3/4 lg:w-1/2 text-2 mb-8">
            <h3>START FOR FREE</h3>
          </div>
          {/* Formulario */}
          <div>
            <h2 className="text-4xl text-slate-300">Create a new account</h2>
            <h2 className="text-2xl py-10 text-slate-400">
              Already a member? <a href="./login" className="text-blue-600 hover:underline">Log in</a>
            </h2>
          </div>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <form className="w-full max-w-lg text-slate-300">
              {/* Campos del formulario */}
              <div className="flex -mx-3 mb-6">
                
                <div className="w-full px-3">
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="User Name"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange} />
                </div>
              </div>
              <div className="flex  -mx-3 mb-6">
                <div className="w-full px-3">
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange} />
                </div>
              </div>
              <div className="flex  -mx-3 mb-6">
                <div className="w-full px-3">
                  <input
                    className={styles.input}
                    id="passwordField"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex  -mx-3 mb-6">
                <div className="w-full px-3">
                  <input
                    className={styles.input}
                    id="confirmPasswordField"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
            <div className="md:w-1/2 md:ml-8 text-center text-xl animate-jump-in animate-once animate-duration-1000 animate-delay-200 animate-ease-out animate-normal animate-fill-forwards">
              <p className="text-4xl text-slate-300">¡CREATE AND CONFIGURE YOUR OWN NETWORKS!</p>
            </div>
          </div>
          {/* Mensaje de error */}
          {errorMessage && (
            <div className="text-red-500 mb-6">
              {errorMessage.split('. ').map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}
          {/* Botones */}
          <div>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={handleRegister}
            >Create Account
            </button>
          </div>
        </div>
        {/* Pie de página */}
        <footer className="text-center bottom-10 w-full animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-in animate-normal animate-fill-forwards">
          <div>
            <p>Made by OmarCifuentes, EdgarTorres, JuanVargas y JosephVenegas</p>
          </div>
        </footer>
      </div>
    </div>
  );
}