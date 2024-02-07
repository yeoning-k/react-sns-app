import { ReactNode } from 'react';
import Navigation from './Navigation';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="layout">
      {children}
      <Navigation />
    </div>
  );
};

export default Layout;
