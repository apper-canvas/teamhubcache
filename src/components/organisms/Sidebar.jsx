import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Employees", href: "/employees", icon: "Users" },
    { name: "Attendance", href: "/attendance", icon: "Clock" },
    { name: "Leave Management", href: "/leave", icon: "Calendar" },
    { name: "Departments", href: "/departments", icon: "Building2" },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Users" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-gray-900">TeamHub</h1>
            <p className="text-sm text-gray-500">Employee Management</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-l-4 border-primary-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                }`}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={`w-5 h-5 mr-3 ${
                    isActive(item.href) ? "text-primary-600" : "text-gray-400"
                  }`}
                />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;