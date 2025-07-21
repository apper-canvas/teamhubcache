const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leaveService = {
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("leave_request_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const leaveRequests = (response.data || []).map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c || '',
        type: request.type_c || '',
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        approvedBy: request.approved_by_c || null,
        requestDate: request.request_date_c || new Date().toISOString()
      }));

      return leaveRequests;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching leave requests:", error?.response?.data?.message);
      } else {
        console.error("Error fetching leave requests:", error.message);
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ]
      };

      const response = await apperClient.getRecordById("leave_request_c", parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Leave request not found");
      }

      // Transform database fields to match UI expectations
      const request = {
        Id: response.data.Id,
        employeeId: response.data.employee_id_c?.Id || response.data.employee_id_c || '',
        type: response.data.type_c || '',
        startDate: response.data.start_date_c || '',
        endDate: response.data.end_date_c || '',
        reason: response.data.reason_c || '',
        status: response.data.status_c || 'pending',
        approvedBy: response.data.approved_by_c || null,
        requestDate: response.data.request_date_c || new Date().toISOString()
      };

      return request;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching leave request with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching leave request with ID ${id}:`, error.message);
      }
      throw error;
    }
  },

  async create(leaveData) {
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
          Name: `${leaveData.type} - ${leaveData.startDate} to ${leaveData.endDate}`,
          employee_id_c: parseInt(leaveData.employeeId),
          type_c: leaveData.type,
          start_date_c: leaveData.startDate,
          end_date_c: leaveData.endDate,
          reason_c: leaveData.reason,
          status_c: 'pending',
          approved_by_c: null,
          request_date_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("leave_request_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create leave requests ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return {
            Id: successfulRecord.data.Id,
            employeeId: successfulRecord.data.employee_id_c?.Id || successfulRecord.data.employee_id_c || '',
            type: successfulRecord.data.type_c || '',
            startDate: successfulRecord.data.start_date_c || '',
            endDate: successfulRecord.data.end_date_c || '',
            reason: successfulRecord.data.reason_c || '',
            status: successfulRecord.data.status_c || 'pending',
            approvedBy: successfulRecord.data.approved_by_c || null,
            requestDate: successfulRecord.data.request_date_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating leave request:", error?.response?.data?.message);
      } else {
        console.error("Error creating leave request:", error.message);
      }
      throw error;
    }
  },

  async update(id, leaveData) {
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
          Name: `${leaveData.type} - ${leaveData.startDate} to ${leaveData.endDate}`,
          employee_id_c: parseInt(leaveData.employeeId),
          type_c: leaveData.type,
          start_date_c: leaveData.startDate,
          end_date_c: leaveData.endDate,
          reason_c: leaveData.reason,
          status_c: leaveData.status || 'pending',
          approved_by_c: leaveData.approvedBy || null,
          request_date_c: leaveData.requestDate || new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord("leave_request_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update leave requests ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return {
            Id: successfulRecord.data.Id,
            employeeId: successfulRecord.data.employee_id_c?.Id || successfulRecord.data.employee_id_c || '',
            type: successfulRecord.data.type_c || '',
            startDate: successfulRecord.data.start_date_c || '',
            endDate: successfulRecord.data.end_date_c || '',
            reason: successfulRecord.data.reason_c || '',
            status: successfulRecord.data.status_c || 'pending',
            approvedBy: successfulRecord.data.approved_by_c || null,
            requestDate: successfulRecord.data.request_date_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating leave request:", error?.response?.data?.message);
      } else {
        console.error("Error updating leave request:", error.message);
      }
      throw error;
    }
  },

  async approve(id, approvedBy) {
    try {
      await delay(300);

      // Get the current request first
      const currentRequest = await this.getById(id);
      
      // Update with approved status
      const updatedData = {
        ...currentRequest,
        status: 'approved',
        approvedBy: approvedBy
      };

      return await this.update(id, updatedData);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error approving leave request:", error?.response?.data?.message);
      } else {
        console.error("Error approving leave request:", error.message);
      }
      throw error;
    }
  },

  async reject(id, approvedBy) {
    try {
      await delay(300);

      // Get the current request first
      const currentRequest = await this.getById(id);
      
      // Update with rejected status
      const updatedData = {
        ...currentRequest,
        status: 'rejected',
        approvedBy: approvedBy
      };

      return await this.update(id, updatedData);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error rejecting leave request:", error?.response?.data?.message);
      } else {
        console.error("Error rejecting leave request:", error.message);
      }
      throw error;
    }
  },

  async getPending() {
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
          { field: { Name: "employee_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "request_date_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["pending"]
          }
        ]
      };

      const response = await apperClient.fetchRecords("leave_request_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const pendingRequests = (response.data || []).map(request => ({
        Id: request.Id,
        employeeId: request.employee_id_c?.Id || request.employee_id_c || '',
        type: request.type_c || '',
        startDate: request.start_date_c || '',
        endDate: request.end_date_c || '',
        reason: request.reason_c || '',
        status: request.status_c || 'pending',
        approvedBy: request.approved_by_c || null,
        requestDate: request.request_date_c || new Date().toISOString()
      }));

      return pendingRequests;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pending leave requests:", error?.response?.data?.message);
      } else {
        console.error("Error fetching pending leave requests:", error.message);
      }
      return [];
    }
  }
};