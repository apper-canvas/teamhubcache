import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import LeaveRequestCard from "@/components/organisms/LeaveRequestCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { employeeService } from "@/services/api/employeeService";
import { attendanceService } from "@/services/api/attendanceService";
import { leaveService } from "@/services/api/leaveService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [data, setData] = useState({
    employees: [],
    attendance: [],
    pendingLeave: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [employees, attendance, pendingLeave] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getByDate(new Date().toISOString().split("T")[0]),
        leaveService.getPending()
      ]);

      setData({
        employees,
        attendance,
        pendingLeave
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (requestId) => {
    try {
      await leaveService.approve(requestId, "HR Admin");
      toast.success("Leave request approved successfully");
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (requestId) => {
    try {
      await leaveService.reject(requestId, "HR Admin");
      toast.success("Leave request rejected");
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to reject leave request");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const todayAttendance = data.attendance.length;
  const presentToday = data.attendance.filter(record => record.status === "present" || record.status === "late").length;
  const attendanceRate = data.employees.length > 0 ? Math.round((presentToday / data.employees.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your team's performance and activities
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value={data.employees.length}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+2 this month"
        />
        <MetricCard
          title="Present Today"
          value={presentToday}
          icon="UserCheck"
          color="accent"
          trend="up"
          trendValue={`${attendanceRate}% attendance`}
        />
        <MetricCard
          title="Pending Requests"
          value={data.pendingLeave.length}
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Active Departments"
          value={5}
          icon="Building2"
          color="info"
        />
      </div>

      {/* Pending Leave Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 font-display">
          Pending Leave Requests
        </h2>
        
        {data.pendingLeave.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No pending requests"
            description="All leave requests have been processed. Great job staying on top of things!"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.pendingLeave.map((request) => {
              const employee = data.employees.find(emp => emp.Id.toString() === request.employeeId);
              return (
                <motion.div
                  key={request.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <LeaveRequestCard
                    request={request}
                    employee={employee}
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                    showActions={true}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;