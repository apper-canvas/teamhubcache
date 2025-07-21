const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const employeeService = {
  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "employee_as_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "department_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("employee_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

// Transform database fields to match UI expectations
      const employees = (response.data || []).map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        role: emp.role_c || '',
        employeeAs: emp.employee_as_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'active',
        avatar: emp.avatar_c || '',
        departmentId: emp.department_id_c?.Id || emp.department_id_c || ''
      }));

      return employees;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message);
      } else {
        console.error("Error fetching employees:", error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "employee_as_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "department_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("employee_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Employee not found");
      }

// Transform database fields to match UI expectations
      const employee = {
        Id: response.data.Id,
        firstName: response.data.first_name_c || '',
        lastName: response.data.last_name_c || '',
        email: response.data.email_c || '',
        phone: response.data.phone_c || '',
        role: response.data.role_c || '',
        employeeAs: response.data.employee_as_c || '',
        startDate: response.data.start_date_c || '',
        status: response.data.status_c || 'active',
        avatar: response.data.avatar_c || '',
        departmentId: response.data.department_id_c?.Id || response.data.department_id_c || ''
      };

      return employee;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching employee with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(employeeData) {
    try {
      await delay(400);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Transform UI fields to database fields, including only updateable fields
      const params = {
        records: [{
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone,
          role_c: employeeData.role,
          employee_as_c: employeeData.employeeAs,
          start_date_c: employeeData.startDate,
          status_c: employeeData.status || 'active',
          avatar_c: employeeData.avatar || '',
          department_id_c: employeeData.departmentId ? parseInt(employeeData.departmentId) : null
        }]
      };

      const response = await apperClient.createRecord("employee_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
return {
            Id: successfulRecord.data.Id,
            firstName: successfulRecord.data.first_name_c || '',
            lastName: successfulRecord.data.last_name_c || '',
            email: successfulRecord.data.email_c || '',
            phone: successfulRecord.data.phone_c || '',
            role: successfulRecord.data.role_c || '',
            employeeAs: successfulRecord.data.employee_as_c || '',
            startDate: successfulRecord.data.start_date_c || '',
            status: successfulRecord.data.status_c || 'active',
            avatar: successfulRecord.data.avatar_c || '',
            departmentId: successfulRecord.data.department_id_c?.Id || successfulRecord.data.department_id_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message);
      } else {
        console.error("Error creating employee:", error.message);
      }
      throw error;
    }
  },

  async update(id, employeeData) {
    try {
      await delay(350);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

// Transform UI fields to database fields, including only updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          first_name_c: employeeData.firstName,
          last_name_c: employeeData.lastName,
          email_c: employeeData.email,
          phone_c: employeeData.phone,
          role_c: employeeData.role,
          employee_as_c: employeeData.employeeAs,
          start_date_c: employeeData.startDate,
          status_c: employeeData.status || 'active',
          avatar_c: employeeData.avatar || '',
          department_id_c: employeeData.departmentId ? parseInt(employeeData.departmentId) : null
        }]
      };

      const response = await apperClient.updateRecord("employee_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
return {
            Id: successfulRecord.data.Id,
            firstName: successfulRecord.data.first_name_c || '',
            lastName: successfulRecord.data.last_name_c || '',
            email: successfulRecord.data.email_c || '',
            phone: successfulRecord.data.phone_c || '',
            role: successfulRecord.data.role_c || '',
            employeeAs: successfulRecord.data.employee_as_c || '',
            startDate: successfulRecord.data.start_date_c || '',
            status: successfulRecord.data.status_c || 'active',
            avatar: successfulRecord.data.avatar_c || '',
            departmentId: successfulRecord.data.department_id_c?.Id || successfulRecord.data.department_id_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message);
      } else {
        console.error("Error updating employee:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(250);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("employee_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete employees ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error?.response?.data?.message);
      } else {
        console.error("Error deleting employee:", error.message);
      }
      throw error;
    }
  },

  async getDepartments() {
    try {
      await delay(200);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "manager_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("department_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const departments = (response.data || []).map(dept => ({
        Id: dept.Id,
        name: dept.Name || '',
        description: dept.description_c || '',
        managerId: dept.manager_id_c?.Id || dept.manager_id_c || ''
      }));

      return departments;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching departments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching departments:", error.message);
      }
      return [];
    }
  }
};