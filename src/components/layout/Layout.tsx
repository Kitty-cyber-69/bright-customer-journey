
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header />
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
