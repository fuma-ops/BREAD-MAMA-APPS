import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ProductionDashboard } from './dashboards/ProductionDashboard';
import { DeliveryDashboard } from './dashboards/DeliveryDashboard';

export function DashboardRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'production':
      return <ProductionDashboard />;
    case 'livreur':
      return <DeliveryDashboard />;
    default:
      return <div>Role inconnu</div>;
  }
}
