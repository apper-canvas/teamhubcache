import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getByEmployeeId(employeeId) {
    await delay(200);
    return attendance.filter(record => record.employeeId === employeeId.toString());
  },

  async getByDate(date) {
    await delay(200);
    return attendance.filter(record => record.date === date);
  },

  async create(attendanceData) {
    await delay(300);
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(record => record.Id)) + 1,
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(250);
    const index = attendance.findIndex(record => record.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async checkIn(employeeId) {
    await delay(300);
    const today = new Date().toISOString().split("T")[0];
    const existingRecord = attendance.find(
      record => record.employeeId === employeeId.toString() && record.date === today
    );

    if (existingRecord) {
      throw new Error("Already checked in today");
    }

    const newRecord = {
      Id: Math.max(...attendance.map(record => record.Id)) + 1,
      employeeId: employeeId.toString(),
      date: today,
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: "present"
    };

    attendance.push(newRecord);
    return { ...newRecord };
  },

  async checkOut(employeeId) {
    await delay(300);
    const today = new Date().toISOString().split("T")[0];
    const recordIndex = attendance.findIndex(
      record => record.employeeId === employeeId.toString() && record.date === today
    );

    if (recordIndex === -1) {
      throw new Error("No check-in record found for today");
    }

    if (attendance[recordIndex].checkOut) {
      throw new Error("Already checked out today");
    }

    attendance[recordIndex].checkOut = new Date().toISOString();
    return { ...attendance[recordIndex] };
  }
};