const DEPT_ROLE = {
  motor: "motor",
  electrical: "electrical",
  denting: "denter",
  painting: "painter",
};

const STATUS_FLOW = ["received", "reviewing", "contacted", "inspection", "in_progress", "completed"];
const ALL_STATUSES = [...STATUS_FLOW, "cancelled"];

// can this user (with these roles) see/manage a request for this dept & customer?
function canSeeRequest(user, dept, customerId) {
  if (!user) return false;
  if (user.roles.includes("admin")) return true;
  if (customerId && customerId === user.id) return true;
  return user.roles.includes(DEPT_ROLE[dept]);
}

function canManageRequest(user, dept) {
  if (!user) return false;
  if (user.roles.includes("admin")) return true;
  return user.roles.includes(DEPT_ROLE[dept]);
}

module.exports = { DEPT_ROLE, STATUS_FLOW, ALL_STATUSES, canSeeRequest, canManageRequest };
