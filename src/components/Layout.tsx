import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#03a9f4] flex flex-col">
    <header className="flex items-center gap-4 px-8 py-6">
      <img src="/logo.svg" alt="ColorMix" className="h-16" />
      <h1 className="text-white text-4xl font-bold drop-shadow">Голосование ColorMix 2025</h1>
    </header>
    <main className="flex-1 flex flex-col items-center justify-start">{children}</main>
  </div>
);

export default Layout;
