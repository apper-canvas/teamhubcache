import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { employeeService } from "@/services/api/employeeService";
import { attendanceService } from "@/services/api/attendanceService";
import { leaveService } from "@/services/api/leaveService";
import { format } from "date-fns";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployeeDetails();
  }, [id]);

  const loadEmployeeDetails = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [employeeData, departmentsData, attendanceData, leaveData] = await Promise.all([
        employeeService.getById(id),
        employeeService.getDepartments(),
        attendanceService.getByEmployeeId(id),
        leaveService.getAll()
      ]);

      setEmployee(employeeData);
      setDepartments(departmentsData);
      setAttendance(attendanceData);
      setLeaveRequests(leaveData.filter(req => req.employeeId === id));
    } catch (err) {
      setError(err.message || "Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEmployeeDetails} />;
  if (!employee) return <Error message="Employee not found" />;

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.Id.toString() === departmentId);
    return department ? department.name : "Unknown";
  };

  const recentAttendance = attendance.slice(0, 5);
  const recentLeaveRequests = leaveRequests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employees")}
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Employees
        </Button>
      </div>

      {/* Employee Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center space-x-6">
          <Avatar
            fallback={`${employee.firstName} ${employee.lastName}`}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                {employee.firstName} {employee.lastName}
              </h1>
              <StatusBadge status={employee.status} type="employee" />
            </div>
            <p className="text-gray-600 text-lg">{employee.role}</p>
            <p className="text-gray-500">{getDepartmentName(employee.departmentId)}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">
              <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button variant="primary">
              <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
              Employee Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{employee.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{employee.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900">
                  {format(new Date(employee.startDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                <p className="text-gray-900">EMP-{employee.Id.toString().padStart(4, "0")}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Recent Attendance */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
              Recent Attendance
            </h3>
            {recentAttendance.length === 0 ? (
              <p className="text-gray-500">No attendance records found.</p>
            ) : (
              <div className="space-y-3">
                {recentAttendance.map((record) => (
                  <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(record.date), "EEEE, MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.checkIn && `In: ${format(new Date(record.checkIn), "h:mm a")}`}
                        {record.checkOut && ` • Out: ${format(new Date(record.checkOut), "h:mm a")}`}
                      </p>
                    </div>
                    <StatusBadge status={record.status} type="attendance" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
              Recent Leave Requests
            </h3>
            {recentLeaveRequests.length === 0 ? (
              <p className="text-gray-500">No leave requests found.</p>
            ) : (
              <div className="space-y-3">
                {recentLeaveRequests.map((request) => (
                  <div key={request.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {request.type} Leave
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(request.startDate), "MMM d")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                      </p>
                      {request.reason && (
                        <p className="text-xs text-gray-600 mt-1">{request.reason}</p>
                      )}
                    </div>
                    <StatusBadge status={request.status} type="leave" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDetail;