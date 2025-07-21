import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { employeeService } from "@/services/api/employeeService";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment]);

  const loadEmployees = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        employeeService.getDepartments()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

if (searchTerm) {
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.phone && emp.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.departmentId === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  };

  const handleCreateEmployee = async (formData) => {
    try {
      await employeeService.create(formData);
      toast.success("Employee created successfully");
      setShowModal(false);
      loadEmployees();
    } catch (err) {
      toast.error(err.message || "Failed to create employee");
    }
  };

  const handleUpdateEmployee = async (formData) => {
    try {
      await employeeService.update(editingEmployee.Id, formData);
      toast.success("Employee updated successfully");
      setShowModal(false);
      setEditingEmployee(null);
      loadEmployees();
    } catch (err) {
      toast.error(err.message || "Failed to update employee");
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await employeeService.delete(employeeToDelete.Id);
      toast.success("Employee deleted successfully");
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
      loadEmployees();
    } catch (err) {
      toast.error(err.message || "Failed to delete employee");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEmployees} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Employees
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEmployee(null);
            setShowModal(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search employees..."
          className="flex-1"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.Id} value={dept.Id.toString()}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>

      {/* Employee Table */}
      {filteredEmployees.length === 0 ? (
        <Empty
          icon="Users"
          title="No employees found"
          description="No employees match your current filters. Try adjusting your search or filters."
          actionText="Add First Employee"
          onAction={() => {
            setEditingEmployee(null);
            setShowModal(true);
          }}
        />
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Employee Modal */}
      <EmployeeModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEmployee(null);
        }}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
        employee={editingEmployee}
        departments={departments}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-hover max-w-md w-full p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Trash2" className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Employee
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>
                {employeeToDelete?.firstName} {employeeToDelete?.lastName}
              </strong>? This will remove all their data permanently.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEmployeeToDelete(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteEmployee}
                className="flex-1"
              >
                Delete Employee
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Employees;