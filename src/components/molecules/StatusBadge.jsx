import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "general" }) => {
  const getStatusConfig = (status, type) => {
    switch (type) {
      case "employee":
        return status === "active" 
          ? { variant: "success", text: "Active" }
          : { variant: "danger", text: "Inactive" };
      
      case "attendance":
        switch (status) {
          case "present":
            return { variant: "success", text: "Present" };
          case "absent":
            return { variant: "danger", text: "Absent" };
          case "late":
            return { variant: "warning", text: "Late" };
          default:
            return { variant: "default", text: status };
        }
      
      case "leave":
        switch (status) {
          case "approved":
            return { variant: "success", text: "Approved" };
          case "rejected":
            return { variant: "danger", text: "Rejected" };
          case "pending":
            return { variant: "warning", text: "Pending" };
          default:
            return { variant: "default", text: status };
        }
      
      default:
        return { variant: "default", text: status };
    }
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatusBadge;