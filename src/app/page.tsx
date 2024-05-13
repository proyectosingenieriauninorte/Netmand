'use client';
// Importar estilos desde app.module.css
import styles from './app.module.css';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    firstName: '',
    lastName: '',
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
    const { firstName, lastName, email, password, confirmPassword } = formData;
    let error = '';
  
    if (!firstName.trim() || !lastName.trim()) {
      error += 'Please enter your first and last name. ';
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
    console.log('Sending data to database:', formData);
    setTimeout(() => {
      console.log('Data sent successfully!');
    }, 1000);
  };

  // Manejador del registro
  const handleRegister = async () => {
    if (validateForm()) {
      console.log('Formulario válido, enviando datos...');
      sendDataToDatabase();
      router.push('/main');
    } else {
      console.log('Formulario inválido, no se puede enviar.');
    }

    const isFormEmpty = !formData.firstName.trim() && !formData.lastName.trim() && !formData.email.trim() && !formData.password.trim();
    if (isFormEmpty) {
      setErrorMessage('Please fill out the form.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 to-gray-700 font-bold">
      {/* Encabezado */}
      <header className="flex flex-col items-center md:flex-row md:items-start md:justify-between md:px-8">
        {/* Logo y nombre */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className={styles.logo}></div>
          <h1 className="text-3xl md:text-4xl text-slate-300 ml-4">Netmand</h1>
        </div>
        {/* Navegación */}
        <nav className="flex space-x-4 md:space-x-8 items-center">
          <Link href='/'><p className={styles.navLink}>Home</p></Link>
          <Link href='./login'><p className={styles.navLink}>Join</p></Link>
        </nav>
      </header>

      {/* Contenido principal */}
      <div className="welcome-page text-slate-400 p-16 md:px-36">
        <div className="w-full md:w-3/4 lg:w-1/2 text-2 mb-8">
          <h3>START FOR FREE</h3>
        </div>
        {/* Formulario */}
        <div>
          <h2 className="text-4xl text-slate-300">Create a new account</h2>
          <h2 className="text-2xl py-10 text-slate-400">
            Already a member? <a href="./login" className="text-blue-700 hover:underline">Log in</a>
          </h2>
        </div>
        <div>
          <form className="w-full max-w-lg text-slate-300">
            {/* Campos del formulario */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <input
                  className={styles.input}
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange} />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
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
            <div className="flex flex-wrap -mx-3 mb-6">
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
            <div className="flex flex-wrap -mx-3 mb-6">
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
        </div>
        {/* Mensaje de error */}
        {errorMessage && (
          <div className="text-red-600">
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
          >
            Create Account
          </button>
          <Link href='/'>
            <button className={styles.secondaryButton} type="button">
              Change method
            </button>
          </Link>
        </div>
      </div>
      {/* Pie de página */}
      <footer className="fixed text-center bottom-10 w-full">
        <div>
          <p>Made by OmarCifuentes, EdgarTorres, JuanVargas y JosephVenegas</p>
        </div>
      </footer>
    </div>
  );
}

