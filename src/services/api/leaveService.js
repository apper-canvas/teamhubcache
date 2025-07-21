import leaveData from "@/services/mockData/leaveRequests.json";

let leaveRequests = [...leaveData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leaveService = {
  async getAll() {
    await delay(300);
    return [...leaveRequests];
  },

  async getById(id) {
    await delay(200);
    const request = leaveRequests.find(req => req.Id === parseInt(id));
    if (!request) {
      throw new Error("Leave request not found");
    }
    return { ...request };
  },

  async create(leaveData) {
    await delay(400);
    const newRequest = {
      ...leaveData,
      Id: Math.max(...leaveRequests.map(req => req.Id)) + 1,
      requestDate: new Date().toISOString(),
      status: "pending"
    };
    leaveRequests.push(newRequest);
    return { ...newRequest };
  },

  async update(id, leaveData) {
    await delay(300);
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    leaveRequests[index] = { ...leaveRequests[index], ...leaveData };
    return { ...leaveRequests[index] };
  },

  async approve(id, approvedBy) {
    await delay(300);
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    leaveRequests[index] = {
      ...leaveRequests[index],
      status: "approved",
      approvedBy: approvedBy
    };
    return { ...leaveRequests[index] };
  },

  async reject(id, approvedBy) {
    await delay(300);
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    leaveRequests[index] = {
      ...leaveRequests[index],
      status: "rejected",
      approvedBy: approvedBy
    };
    return { ...leaveRequests[index] };
  },

  async getPending() {
    await delay(250);
    return leaveRequests.filter(req => req.status === "pending");
  }
};