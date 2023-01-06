import { signIn, signOut } from 'next-auth/react';

import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <h2 className={inter.className}>
        Next.JS Auth
      </h2>
      <button onClick={() => signIn('credentials', { type: 'pacient', username: 'nilson', password: 'nilson' })}>
        Sign in
      </button>
      <button onClick={() => signOut()}>
        Sign out
      </button>
    </>
  )
}