import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    // ROOT CONTAINER
    // min-h-screen: Ensures the background covers the whole screen
    // flex-col: Stacks Header, Main, and Footer vertically
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      
      {/* FUTURE NAVBAR ZONE */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-center border-2 border-dashed border-blue-300 m-2 rounded-md">
        <span className="text-blue-400 font-mono text-sm">
          {/* TODO: Insert Navbar Component here later */}
          [ Navbar Placeholder ]
        </span>
      </header>


      {/* MAIN CONTENT ZONE */}
      {/* flex-grow: Pushes the footer down if content is short */}
      <main className="flex-grow p-6 flex flex-col items-center justify-center">
        
        {/* This renders whatever page you are currently on */}
        {children}

      </main>


      {/* FUTURE FOOTER ZONE */} 
      <footer className="h-20 bg-slate-900 text-white flex items-center justify-center border-2 border-dashed border-red-400 m-2 rounded-md">
        <span className="text-red-300 font-mono text-sm">
          {/* TODO: Insert Footer Component here later */}
          [ Footer Placeholder ]
        </span>
      </footer>

    </div>
  );
};

export default Layout;