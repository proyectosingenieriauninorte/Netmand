import styles from '../app.module.css';
import Link from 'next/link'

export default function login() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 to-gray-700 font-bold">
      <header className="flex flex-col items-center md:flex-row md:items-start md:justify-between md:px-8 ">
        <div className="flex items-center mb-4 md:mb-0">
          <div className={styles.logo}></div>
          <h1 className="text-3xl md:text-4xl text-slate-300 ml-4">Netmand</h1>
        </div>
        <nav>
          <ul className="flex space-x-4 md:space-x-8 items-center">
            <li>
              <Link href='/'>
                <p className={styles.navLink}>Home</p>
              </Link>
            </li>
            <li>
              <Link href='../'>
                <p className={styles.navLink}>Register</p>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="welcome-page text-slate-400 p-16 md:px-36">
        <div>
          <h2 className="text-4xl text-slate-300">Welcome,</h2>
          <h2 className="text-4xl text-slate-300">We are glad to see you again!</h2>

        </div>
        <div>
          <form className="w-full max-w-lg text-slate-300">
            <div className="flex flex-wrap -mx-3 mb-6">

            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <input className={styles.input} id="grid-email" type="email" placeholder="Email" />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <input className={styles.input} id="grid-password" type="password" placeholder="Password" />
              </div>
            </div>
          </form>
        </div>
        <div>
          <Link href='../main'>
            <button className={styles.primaryButton} type="button">Log In</button>
          </Link>

        </div>
      </div>
      <footer className="fixed text-center bottom-10 w-full">
        <div>
          <p>Made by OmarCifuentes, EdgarTorres, JuanVargas y JosephVenegas</p>
        </div>
      </footer>
    </div>

  );
}
