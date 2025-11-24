const apiClient = {
login: async (username, password) => {
const roles = { emp: 'EMPLOYEE', mgr: 'MANAGER', hr: 'HR', admin: 'ADMIN' };
const role = roles[username] || 'EMPLOYEE';
const token = btoa(`${username}:${role}:${Date.now()}`);
const user = { id: username, name: username.toUpperCase(), role, email: `${username}@example.com` };
return { token, user };
},


getProfile: async (id) => {
return { id, name: id.toUpperCase(), email: `${id}@example.com`, department: 'Engineering', joiningDate: '2022-01-01' };
},


getLeaveBalance: async (employeeId) => {
return [
{ leaveType: 'CASUAL', total: 12, used: 2, remaining: 10, year: 2025 },
{ leaveType: 'SICK', total: 8, used: 1, remaining: 7, year: 2025 }
];
},


applyLeave: async (payload) => {
return { leaveId: Math.floor(Math.random()*10000), ...payload, status: 'PENDING', appliedAt: new Date().toISOString() };
},


getLeaves: async (filter = {}) => {
return [
{ leaveId: 101, employeeId: 'emp', employeeName: 'EMP', leaveType: 'CASUAL', startDate: '2025-12-20', endDate: '2025-12-22', days: 3, status: 'PENDING', reason: 'Trip' }
].filter(l => !filter.status || l.status === filter.status);
},


approveLeave: async (leaveId) => {
return { leaveId, status: 'APPROVED', decisionBy: 'mgr', decisionAt: new Date().toISOString() };
},


getHolidays: async () => {
const year = new Date().getFullYear();
return [
{ holidayId: 1, date: `${year}-01-26`, name: 'Republic Day', region: 'IN', recurring: true }
];
}
};


export default apiClient.js;