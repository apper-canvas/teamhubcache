import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import MetricCard from "@/components/molecules/MetricCard";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { attendanceService } from "@/services/api/attendanceService";
import { employeeService } from "@/services/api/employeeService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [attendanceData, employeesData] = await Promise.all([
        attendanceService.getByDate(selectedDate),
        employeeService.getAll()
      ]);
      
      setAttendance(attendanceData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`checkin_${employeeId}`]: true }));
      await attendanceService.checkIn(employeeId);
      toast.success("Checked in successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to check in");
    } finally {
      setActionLoading(prev => ({ ...prev, [`checkin_${employeeId}`]: false }));
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`checkout_${employeeId}`]: true }));
      await attendanceService.checkOut(employeeId);
      toast.success("Checked out successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to check out");
    } finally {
      setActionLoading(prev => ({ ...prev, [`checkout_${employeeId}`]: false }));
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const presentCount = attendance.filter(record => record.status === "present" || record.status === "late").length;
  const absentCount = employees.length - attendance.length;
  const lateCount = attendance.filter(record => record.status === "late").length;
  const attendanceRate = employees.length > 0 ? Math.round((presentCount / employees.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            Track employee attendance and working hours
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {isToday && (
            <Button variant="primary">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Date Display */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
          {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          {isToday && (
            <span className="ml-2 text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              Today
            </span>
          )}
        </h2>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value={employees.length}
          icon="Users"
          color="info"
        />
        <MetricCard
          title="Present"
          value={presentCount}
          icon="UserCheck"
          color="accent"
          trend="up"
          trendValue={`${attendanceRate}%`}
        />
        <MetricCard
          title="Absent"
          value={absentCount}
          icon="UserX"
          color="danger"
        />
        <MetricCard
          title="Late Arrivals"
          value={lateCount}
          icon="Clock"
          color="warning"
        />
      </div>

      {/* Quick Actions for Today */}
      {isToday && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
            Quick Check-in/Check-out
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.slice(0, 6).map((employee) => {
              const attendanceRecord = attendance.find(record => record.employeeId === employee.Id.toString());
              const hasCheckedIn = attendanceRecord?.checkIn;
              const hasCheckedOut = attendanceRecord?.checkOut;
              
              return (
                <div key={employee.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!hasCheckedIn ? (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => handleCheckIn(employee.Id)}
                        disabled={actionLoading[`checkin_${employee.Id}`]}
                      >
                        {actionLoading[`checkin_${employee.Id}`] ? (
                          <ApperIcon name="Loader2" className="w-3 h-3 animate-spin" />
                        ) : (
                          "Check In"
                        )}
                      </Button>
                    ) : !hasCheckedOut ? (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCheckOut(employee.Id)}
                        disabled={actionLoading[`checkout_${employee.Id}`]}
                      >
                        {actionLoading[`checkout_${employee.Id}`] ? (
                          <ApperIcon name="Loader2" className="w-3 h-3 animate-spin" />
                        ) : (
                          "Check Out"
                        )}
                      </Button>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">Complete</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Attendance Grid */}
      <AttendanceGrid
        attendance={attendance}
        employees={employees}
      />
    </div>
  );
};

export default Attendance;