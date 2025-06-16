import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Store, 
  Video, 
  Brain, 
  User, 
  Pill,
  X 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reminders', href: '/reminders', icon: Bell },
    { name: 'Pharmacy', href: '/pharmacy', icon: Store },
    { name: 'Telemedicine', href: '/telemedicine', icon: Video },
    { name: 'AI Analysis', href: '/analysis', icon: Brain },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="flex h-full flex-col bg-white shadow-sm">
      {mobile && (
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">MediSphere</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
      <div className={`flex ${mobile ? '' : 'h-16'} items-center justify-center border-b border-gray-200 px-6 ${mobile ? 'hidden' : ''}`}>
        <div className="flex items-center space-x-2">
          <Pill className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">MediSphere</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              isActive
                ? 'group flex items-center rounded-md bg-primary-50 px-3 py-3 text-sm font-medium text-primary-700'
                : 'group flex items-center rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
            }
            onClick={mobile && onClose ? onClose : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-8 w-1 rounded-r-md bg-primary-600"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-md bg-primary-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Pill className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-800">Need Help?</h3>
              <p className="mt-1 text-xs text-primary-700">
                Contact our support team for assistance with your medications.
              </p>
              <a
                href="#"
                className="mt-2 block text-xs font-medium text-primary-600 hover:text-primary-500"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;