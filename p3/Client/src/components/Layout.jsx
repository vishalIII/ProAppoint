import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5'; // Icon for professionals (human consultant)

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenu = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Users', path: '/users', icon: <FaUser /> }, // Icon for users
    { name: 'Professionals', path: '/professionals', icon: <IoPerson /> }, // Icon for professionals (human consultant)
  ];

  const userMenu = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Appointments', path: '/user-appointments', icon: <FaCalendarAlt /> },
    { name: 'Apply Professionals', path: '/apply-professionals', icon: <IoPerson /> }, // Icon for applying professionals
  ];

  const doctorMenu = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Appointments', path: '/Professionals-appointments', icon: <FaCalendarAlt /> },
    { name: 'Profile', path: `/Professionals/profile/${user?._id}`, icon: <FaUser /> }, // Use appropriate icon for doctor profile
  ];

  const mainMenu = user?.isAdmin ? adminMenu : (user?.isDoctor ? doctorMenu : userMenu);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button className="md:hidden mr-4" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="text-lg font-semibold mr-8">ProAppoint</h1>
          <div className="hidden md:flex items-center space-x-4">
            {mainMenu.map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center mx-2 text-white">
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/notifications" className="relative flex items-center mx-2">
            <FaBell className="text-white text-xl mr-5" />
            {user?.unseenNotification.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-white text-black text-xs font-bold text-center rounded-full">
                {user.unseenNotification.length}
              </span>
            )}
          </Link>
          <span className="flex items-center mx-2">
            <FaUser className="text-white text-xl" />
            <span className="ml-2">{user?.name}</span>
          </span>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="hidden md:flex items-center mx-2 text-white">
            <FaSignOutAlt />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-50 bg-gray-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:hidden`}>
        <div className="p-4 w-64">
          <button className="text-white" onClick={toggleSidebar}>
            ✖
          </button>
          <ul className="mt-4 cursor-pointer space-y-4">
            {mainMenu.map((item) => (
              <li key={item.path} className="hover:bg-slate-700 rounded-md flex items-center p-2">
                {item.icon}
                <Link to={item.path} onClick={toggleSidebar} className="ml-2">{item.name}</Link>
              </li>
            ))}
            <li className="hover:bg-slate-700 rounded-md flex items-center p-2" onClick={() => { localStorage.clear(); navigate('/login'); }}>
              <FaSignOutAlt />
              <span className="ml-2">Logout</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
