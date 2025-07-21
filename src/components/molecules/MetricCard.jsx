import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className = "" 
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-500 to-accent-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600",
    info: "from-blue-500 to-blue-600"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold font-display bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={`w-4 h-4 mr-1 ${
                  trend === "up" ? "text-accent-500" : "text-red-500"
                }`}
              />
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-accent-600" : "text-red-600"
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;