import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminApp: React.FC = () => {
  const { adminUser, logoutAdmin } = useCms();
  const [loggedIn, setLoggedIn] = useState(!!adminUser);

  if (!adminUser && !loggedIn) {
    return <AdminLogin onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        logoutAdmin();
        setLoggedIn(false);
      }}
    />
  );
};
