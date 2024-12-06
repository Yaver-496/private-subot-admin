import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Clock } from 'lucide-react';

export function Navigation() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/subscribers', icon: Users, label: 'Subscribers' },
    { to: '/plans', icon: Clock, label: 'Subscription Plans' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'border-b-2 border-[#0088cc] text-[#0088cc]'
                    : 'text-gray-600 hover:text-[#0088cc]'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}