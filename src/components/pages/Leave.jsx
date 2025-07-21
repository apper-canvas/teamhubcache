import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import MetricCard from "@/components/molecules/MetricCard";
import LeaveRequestCard from "@/components/organisms/LeaveRequestCard";
import LeaveRequestModal from "@/components/organisms/LeaveRequestModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { leaveService } from "@/services/api/leaveService";
import { employeeService } from "@/services/api/employeeService";
import { toast } from "react-toastify";

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, selectedStatus]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [leaveData, employeesData] = await Promise.all([
        leaveService.getAll(),
        employeeService.getAll()
      ]);
      
      setLeaveRequests(leaveData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...leaveRequests];

    if (selectedStatus !== "all") {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    // Sort by request date, newest first
    filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

    setFilteredRequests(filtered);
  };

  const handleCreateRequest = async (formData) => {
    try {
      await leaveService.create(formData);
      toast.success("Leave request submitted successfully");
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to submit leave request");
    }
  };

  const handleApproveLeave = async (requestId) => {
    try {
      await leaveService.approve(requestId, "HR Admin");
      toast.success("Leave request approved successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (requestId) => {
    try {
      await leaveService.reject(requestId, "HR Admin");
      toast.success("Leave request rejected");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to reject leave request");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const pendingCount = leaveRequests.filter(req => req.status === "pending").length;
  const approvedCount = leaveRequests.filter(req => req.status === "approved").length;
  const rejectedCount = leaveRequests.filter(req => req.status === "rejected").length;
  const totalCount = leaveRequests.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Leave Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage employee leave requests and approvals
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={totalCount}
          icon="Calendar"
          color="info"
        />
        <MetricCard
          title="Pending"
          value={pendingCount}
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Approved"
          value={approvedCount}
          icon="CheckCircle"
          color="accent"
        />
        <MetricCard
          title="Rejected"
          value={rejectedCount}
          icon="XCircle"
          color="danger"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600">
        Showing {filteredRequests.length} of {totalCount} requests
      </div>

      {/* Leave Requests */}
      {filteredRequests.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No leave requests found"
          description="No leave requests match your current filter. Try adjusting your filter or create a new request."
          actionText="Create New Request"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => {
            const employee = employees.find(emp => emp.Id.toString() === request.employeeId);
            return (
              <motion.div
                key={request.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LeaveRequestCard
                  request={request}
                  employee={employee}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                  showActions={request.status === "pending"}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Leave Request Modal */}
      <LeaveRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateRequest}
        employees={employees}
      />
    </div>
  );
};

export default Leave;