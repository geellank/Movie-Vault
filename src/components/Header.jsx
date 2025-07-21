import Link from 'next/link';
import MenuItem from './MenuItem';
import { AiFillHome } from 'react-icons/ai';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import DarkModeSwitch from './DarkModeSwitch';

export default function Header() {
  return (
    <div className='flex justify-between items-center p-3 max-w-6xl mx-auto'>
      <div className='flex gap-4'>
        {/* Menu Item Home dan About */}
        <MenuItem title='home' address='/' Icon={AiFillHome} />
        <MenuItem title='about' address='/about' Icon={BsFillInfoCircleFill} />
      </div>
      <div className='flex items-center gap-4'>
        {/* Dark Mode Switch */}
        <DarkModeSwitch />

        {/* Tautan Login (BARU) */}
        <Link href='/auth/login' className='text-white hover:text-amber-500 text-sm sm:text-base'>
          Login
        </Link>

        {/* Tautan Sign Up (BARU) */}
        <Link href='/auth/signup' className='text-white hover:text-amber-500 text-sm sm:text-base'>
          Sign Up
        </Link>

        {/* Logo Aplikasi */}
        <Link href={'/'} className='flex gap-1 items-center'>
          <span className='text-2xl font-bold bg-amber-500 py-1 px-2 rounded-lg'>
            Movie
          </span>
          <span className='text-xl hidden sm:inline'>Vault</span>
        </Link>
      </div>
    </div>
  );
}