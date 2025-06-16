import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMedication } from '../../hooks/useMedication';
import { AnimatePresence, motion } from 'framer-motion';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { getUpcomingDoses, cart } = useMedication();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const upcomingDoses = getUpcomingDoses();
  const hasNotifications = upcomingDoses.length > 0;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/reminders':
        return 'Medication Reminders';
      case '/pharmacy':
        return 'Pharmacy';
      case '/telemedicine':
        return 'Telemedicine';
      case '/analysis':
        return 'AI Analysis';
      case '/profile':
        return 'Profile';
      default:
        return 'MediSphere';
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileOpen) setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  return (
    <header className="z-10 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 md:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
            </div>
          </div>
          <div className="flex items-center">
            {location.pathname === '/pharmacy' && (
              <Link
                to="/pharmacy"
                className="relative mr-4 flex items-center text-gray-500 hover:text-gray-900"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.items.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            )}
            <div className="relative">
              <button
                type="button"
                className="relative flex items-center text-gray-500 hover:text-gray-900"
                onClick={toggleNotifications}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {hasNotifications && (
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-500"></span>
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      <div className="border-b border-gray-200 px-4 py-2">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {upcomingDoses.length > 0 ? (
                          upcomingDoses.map((dose) => (
                            <div key={dose.id} className="border-b border-gray-100 px-4 py-3">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                                    <span className="text-xs font-medium">Med</span>
                                  </span>
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    Upcoming medication
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Time: {new Date(dose.scheduledTime).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No new notifications
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 px-4 py-2">
                        <Link
                          to="/reminders"
                          className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all reminders
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative ml-4">
              <button
                type="button"
                className="flex items-center"
                onClick={toggleProfile}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt="User"
                />
                <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
                  {user?.name}
                </span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;