import React, { useContext } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome back!
            </h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        </div>

<div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <Avatar
              fallback={user ? `${user.firstName || ''} ${user.lastName || ''}` : "User"}
              size="md"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddress : "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.companyRole || "Employee"}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;