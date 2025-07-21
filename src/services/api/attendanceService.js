const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
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
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "employee_id_c" } }
        ]
      };

      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const attendance = (response.data || []).map(record => ({
        Id: record.Id,
        employeeId: record.employee_id_c?.Id || record.employee_id_c || '',
        date: record.date_c || '',
        checkIn: record.check_in_c || null,
        checkOut: record.check_out_c || null,
        status: record.status_c || 'absent'
      }));

      return attendance;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance:", error.message);
      }
      return [];
    }
  },

  async getByEmployeeId(employeeId) {
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
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const attendance = (response.data || []).map(record => ({
        Id: record.Id,
        employeeId: record.employee_id_c?.Id || record.employee_id_c || '',
        date: record.date_c || '',
        checkIn: record.check_in_c || null,
        checkOut: record.check_out_c || null,
        status: record.status_c || 'absent'
      }));

      return attendance;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by employee:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance by employee:", error.message);
      }
      return [];
    }
  },

  async getByDate(date) {
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
          { field: { Name: "date_c" } },
          { field: { Name: "check_in_c" } },
          { field: { Name: "check_out_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "employee_id_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ]
      };

      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const attendance = (response.data || []).map(record => ({
        Id: record.Id,
        employeeId: record.employee_id_c?.Id || record.employee_id_c || '',
        date: record.date_c || '',
        checkIn: record.check_in_c || null,
        checkOut: record.check_out_c || null,
        status: record.status_c || 'absent'
      }));

      return attendance;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance by date:", error.message);
      }
      return [];
    }
  },

  async create(attendanceData) {
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
          Name: `Attendance - ${attendanceData.date} - Employee ${attendanceData.employeeId}`,
          date_c: attendanceData.date,
          check_in_c: attendanceData.checkIn,
          check_out_c: attendanceData.checkOut,
          status_c: attendanceData.status || 'present',
          employee_id_c: parseInt(attendanceData.employeeId)
        }]
      };

      const response = await apperClient.createRecord("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return {
            Id: successfulRecord.data.Id,
            employeeId: successfulRecord.data.employee_id_c?.Id || successfulRecord.data.employee_id_c || '',
            date: successfulRecord.data.date_c || '',
            checkIn: successfulRecord.data.check_in_c || null,
            checkOut: successfulRecord.data.check_out_c || null,
            status: successfulRecord.data.status_c || 'present'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
      } else {
        console.error("Error creating attendance:", error.message);
      }
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      await delay(250);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI fields to database fields, including only updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Attendance - ${attendanceData.date} - Employee ${attendanceData.employeeId}`,
          date_c: attendanceData.date,
          check_in_c: attendanceData.checkIn,
          check_out_c: attendanceData.checkOut,
          status_c: attendanceData.status || 'present',
          employee_id_c: parseInt(attendanceData.employeeId)
        }]
      };

      const response = await apperClient.updateRecord("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          if (failedRecords[0].message) {
            throw new Error(failedRecords[0].message);
          }
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          return {
            Id: successfulRecord.data.Id,
            employeeId: successfulRecord.data.employee_id_c?.Id || successfulRecord.data.employee_id_c || '',
            date: successfulRecord.data.date_c || '',
            checkIn: successfulRecord.data.check_in_c || null,
            checkOut: successfulRecord.data.check_out_c || null,
            status: successfulRecord.data.status_c || 'present'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
      } else {
        console.error("Error updating attendance:", error.message);
      }
      throw error;
    }
  },

  async checkIn(employeeId) {
    try {
      await delay(300);
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toISOString();

      // First check if already checked in today
      const existingAttendance = await this.getByDate(today);
      const existingRecord = existingAttendance.find(
        record => record.employeeId.toString() === employeeId.toString()
      );

      if (existingRecord) {
        throw new Error("Already checked in today");
      }

      // Create new attendance record
      const attendanceData = {
        employeeId: employeeId.toString(),
        date: today,
        checkIn: now,
        checkOut: null,
        status: "present"
      };

      return await this.create(attendanceData);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking in:", error?.response?.data?.message);
      } else {
        console.error("Error checking in:", error.message);
      }
      throw error;
    }
  },

  async checkOut(employeeId) {
    try {
      await delay(300);
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toISOString();

      // Find today's attendance record
      const todayAttendance = await this.getByDate(today);
      const record = todayAttendance.find(
        record => record.employeeId.toString() === employeeId.toString()
      );

      if (!record) {
        throw new Error("No check-in record found for today");
      }

      if (record.checkOut) {
        throw new Error("Already checked out today");
      }

      // Update record with check-out time
      const updatedData = {
        employeeId: record.employeeId,
        date: record.date,
        checkIn: record.checkIn,
        checkOut: now,
        status: record.status
      };

      return await this.update(record.Id, updatedData);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking out:", error?.response?.data?.message);
      } else {
        console.error("Error checking out:", error.message);
      }
      throw error;
    }
  }
};