import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">My Application</h1>
            </header>
            <main className="flex-grow p-4 bg-gray-100">
                {children}
            </main>
            <footer className="bg-blue-600 text-white p-4 text-center">
                &copy; 2024 My Application
            </footer>
        </div>
    );
};

export default Layout;