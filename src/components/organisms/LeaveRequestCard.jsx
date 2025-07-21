import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format, differenceInDays } from "date-fns";

const LeaveRequestCard = ({ 
  request, 
  employee, 
  onApprove, 
  onReject, 
  showActions = true 
}) => {
  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case "vacation":
        return "Palmtree";
      case "sick":
        return "Activity";
      case "personal":
        return "User";
      default:
        return "Calendar";
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "vacation":
        return "text-blue-600 bg-blue-100";
      case "sick":
        return "text-red-600 bg-red-100";
      case "personal":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const duration = differenceInDays(
    new Date(request.endDate),
    new Date(request.startDate)
  ) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            fallback={employee ? `${employee.firstName} ${employee.lastName}` : "Unknown"}
            size="md"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee"}
            </p>
            <p className="text-xs text-gray-500">
              {employee ? employee.role : "Unknown Role"}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} type="leave" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${getLeaveTypeColor(request.type)}`}>
            <ApperIcon 
              name={getLeaveTypeIcon(request.type)} 
              className="w-4 h-4"
            />
          </div>
          <span className="text-sm text-gray-600 capitalize">
            {request.type} Leave
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {duration} day{duration > 1 ? "s" : ""}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <strong>Dates:</strong> {format(new Date(request.startDate), "MMM d, yyyy")} - {format(new Date(request.endDate), "MMM d, yyyy")}
        </div>

        {request.reason && (
          <div className="text-sm text-gray-600">
            <strong>Reason:</strong> {request.reason}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Requested on {format(new Date(request.requestDate), "MMM d, yyyy 'at' h:mm a")}
        </div>
      </div>

      {showActions && request.status === "pending" && (
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="accent"
            size="sm"
            onClick={() => onApprove(request.Id)}
            className="flex-1"
          >
            <ApperIcon name="Check" className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onReject(request.Id)}
            className="flex-1"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default LeaveRequestCard;