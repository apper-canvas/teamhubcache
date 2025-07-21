import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";

const EmployeeModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  employee = null, 
  departments = [] 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    role: "",
    startDate: "",
    status: "active"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        departmentId: employee.departmentId || "",
        role: employee.role || "",
        startDate: employee.startDate || "",
        status: employee.status || "active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        departmentId: "",
        role: "",
        startDate: "",
        status: "active"
      });
    }
    setErrors({});
  }, [employee, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-md bg-white rounded-xl shadow-hover">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">
                    {employee ? "Edit Employee" : "Add New Employee"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="First Name"
                      required
                      error={errors.firstName}
                    >
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="John"
                        error={errors.firstName}
                      />
                    </FormField>

                    <FormField
                      label="Last Name"
                      required
                      error={errors.lastName}
                    >
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Doe"
                        error={errors.lastName}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Email"
                    required
                    error={errors.email}
                  >
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john.doe@company.com"
                      error={errors.email}
                    />
                  </FormField>

<FormField
                    label="Secondary Email"
                    error={errors.phone}
                  >
                    <Input
                      type="email"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="secondary@company.com"
                      error={errors.phone}
                    />
                  </FormField>

                  <FormField
                    label="Department"
                    required
                    error={errors.departmentId}
                  >
                    <select
                      value={formData.departmentId}
                      onChange={(e) => handleChange("departmentId", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
>
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.Id} value={dept.Id.toString()}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Role"
                    required
                    error={errors.role}
                  >
                    <Input
                      value={formData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      placeholder="Software Engineer"
                      error={errors.role}
                    />
                  </FormField>

                  <FormField
                    label="Start Date"
                    required
                    error={errors.startDate}
                  >
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      error={errors.startDate}
                    />
                  </FormField>

                  <FormField label="Status">
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FormField>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          {employee ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        employee ? "Update Employee" : "Create Employee"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmployeeModal;