const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    try {
      await delay(250);
      
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
          { field: { Name: "description_c" } },
          { field: { Name: "manager_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("department_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Department not found");
      }

      // Transform database fields to match UI expectations
      const department = {
        Id: response.data.Id,
        name: response.data.Name || '',
        description: response.data.description_c || '',
        managerId: response.data.manager_id_c?.Id || response.data.manager_id_c || ''
      };

      return department;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching department with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching department with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(departmentData) {
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
          Name: departmentData.name,
          description_c: departmentData.description,
          manager_id_c: departmentData.managerId ? parseInt(departmentData.managerId) : null
        }]
      };

      const response = await apperClient.createRecord("department_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create departments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return {
            Id: successfulRecord.data.Id,
            name: successfulRecord.data.Name || '',
            description: successfulRecord.data.description_c || '',
            managerId: successfulRecord.data.manager_id_c?.Id || successfulRecord.data.manager_id_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating department:", error?.response?.data?.message);
      } else {
        console.error("Error creating department:", error.message);
      }
      throw error;
    }
  },

  async update(id, departmentData) {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI fields to database fields, including only updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.name,
          description_c: departmentData.description,
          manager_id_c: departmentData.managerId ? parseInt(departmentData.managerId) : null
        }]
      };

      const response = await apperClient.updateRecord("department_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update departments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return {
            Id: successfulRecord.data.Id,
            name: successfulRecord.data.Name || '',
            description: successfulRecord.data.description_c || '',
            managerId: successfulRecord.data.manager_id_c?.Id || successfulRecord.data.manager_id_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating department:", error?.response?.data?.message);
      } else {
        console.error("Error updating department:", error.message);
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

      const response = await apperClient.deleteRecord("department_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete departments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting department:", error?.response?.data?.message);
      } else {
        console.error("Error deleting department:", error.message);
      }
      throw error;
    }
  }
};