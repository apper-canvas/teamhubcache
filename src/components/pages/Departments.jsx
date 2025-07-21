import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";
import { toast } from "react-toastify";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      setDepartments(departmentsData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getDepartmentEmployees = (departmentId) => {
    return employees.filter(emp => emp.departmentId === departmentId.toString());
  };

  const getDepartmentManager = (managerId) => {
    return employees.find(emp => emp.Id.toString() === managerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Departments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage organizational departments and teams
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <Empty
          icon="Building2"
          title="No departments found"
          description="Get started by creating your first department to organize your team."
          actionText="Create Department"
          onAction={() => toast.info("Department creation feature coming soon!")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department, index) => {
            const departmentEmployees = getDepartmentEmployees(department.Id);
            const manager = getDepartmentManager(department.managerId);
            
            return (
              <motion.div
                key={department.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 font-display">
                        {department.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {departmentEmployees.length} employee{departmentEmployees.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {department.description}
                </p>

                {/* Department Manager */}
                {manager && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        fallback={`${manager.firstName} ${manager.lastName}`}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {manager.firstName} {manager.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Department Manager</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Employees */}
                {departmentEmployees.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
                    <div className="flex -space-x-2 mb-3">
                      {departmentEmployees.slice(0, 4).map((employee) => (
                        <Avatar
                          key={employee.Id}
                          fallback={`${employee.firstName} ${employee.lastName}`}
                          size="sm"
                          className="border-2 border-white"
                        />
                      ))}
                      {departmentEmployees.length > 4 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{departmentEmployees.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                    View Team
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Departments;