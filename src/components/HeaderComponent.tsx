import React from 'react';
import Image from 'next/image';

export default function HeaderComponent() {
  return (
    <header className="h-16 flex items-center justify-between px-8 shadow-md">
      <div className="flex items-center gap-2">
        <Image src="/logo-white.svg" alt="WindBorne logo" width={32} height={32} />
        <h1 className="text-2xl font-extrabold tracking-tight">WindBorne World</h1>
      </div>
    </header>
  );
}
