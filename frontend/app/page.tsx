// src/app/user/profile/page.tsx

'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { subscribe } from './notifications/subscribe';

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log('Registering Service Worker...');
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          subscribe();
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    } else {
      console.error('Service Worker not supported in this browser.');
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div>
            <h1>Welcome to the App</h1>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}