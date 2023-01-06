import { useState } from 'react';
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import RefreshTokenHandler from '../components/RefreshTokenHandler';

export default function App({ Component, pageProps }: AppProps) {
  const [interval, setInterval] = useState(0);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={interval}>
      <Component {...pageProps} />
      <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
}
