import React from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";

const AttendanceGrid = ({ attendance, employees }) => {
  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.Id.toString() === employeeId);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 font-display">
          Today's Attendance
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendance.map((record, index) => {
            const employee = getEmployee(record.employeeId);
            if (!employee) return null;

            return (
              <motion.div
                key={record.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar
                    fallback={`${employee.firstName} ${employee.lastName}`}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Status:</span>
                    <StatusBadge status={record.status} type="attendance" />
                  </div>
                  
                  {record.checkIn && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Check In:</span>
                      <span className="text-xs font-medium text-gray-900">
                        {formatTime(record.checkIn)}
                      </span>
                    </div>
                  )}
                  
                  {record.checkOut && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Check Out:</span>
                      <span className="text-xs font-medium text-gray-900">
                        {formatTime(record.checkOut)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;