"use client";
import { useState } from 'react';
import styles from '../app.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/requests/requests';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    if (!email && !password) {
      setError('Please enter your email and password.');
      return false;
    } else if (!email) {
      setError('Please enter your email.');
      return false;
    } else if (!password) {
      setError('Please enter your password.');
      return false;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email.');
      return false;
    }
    setError('');
    return true;
  };

  const validateEmail = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const token = await login(email, password);
        console.log('Formulario válido, enviando datos...');
        // Save token to localStorage
        localStorage.setItem('token', token);
        // Redirect user to the user page after successful login
        router.push('/user');
      } catch (error: any) {
        setError(error.response ? error.response.data.message : error.message);
      }
    } else {
      console.log('Formulario inválido, no se puede enviar.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 to-gray-700 font-bold">
      <header className="flex flex-col items-center md:flex-row md:items-start md:justify-between md:px-8 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-in animate-normal animate-fill-forwards">
        <div className="flex items-center mb-4 md:mb-0">
          <div className={styles.logo}></div>
          <h1 className="text-3xl md:text-4xl text-slate-300 ml-4">NETMAND</h1>
        </div>
        <nav>
          <ul className="flex space-x-4 md:space-x-8 items-center">
            <li>
              <Link href='/'>
                <p className={styles.navLink}>Home</p>
              </Link>
            </li>
            <li>
              <Link href='/'>
                <p className={styles.navLink}>Register</p>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="welcome-page text-slate-400 p-20 md:px-36 animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-in animate-normal animate-fill-forwards">
        <div className="mb-12">
          <h2 className="text-4xl text-slate-300">Welcome,</h2>
          <h2 className="text-4xl text-slate-300">We are glad to see you again!</h2>
        </div>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
          <form className="w-full max-w-lg text-slate-300" onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <input
                  className={styles.input}
                  id="grid-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <input
                  className={styles.input}
                  id="grid-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 mb-6">
                {error}
              </div>
            )}
            <div className="flex">
              <button className={styles.primaryButton} type="submit">
                Log In
              </button>
            </div>
          </form>
          <div className="md:w-1/2 md:ml-8 text-center text-xl animate-jump-in animate-once animate-duration-1000 animate-delay-200 animate-ease-out animate-normal animate-fill-forwards">
            <p className="text-4xl text-slate-300">¡CREATE AND CONFIGURE YOUR OWN NETWORKS!</p>
          </div>
        </div>
      </div>
      <footer className="fixed text-center bottom-10 w-full animate-fade-up animate-once animate-duration-1000 animate-delay-100 animate-ease-in animate-normal animate-fill-forwards">
        <div>
          <p>Made by OmarCifuentes, EdgarTorres, JuanVargas y JosephVenegas</p>
        </div>
      </footer>
    </div>
  );
}