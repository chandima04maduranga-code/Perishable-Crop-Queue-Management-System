export const ROLE_LABELS = {
  ADMIN: "Admin",
  FARM_MANAGER: "Farm Manager",
  DISTRIBUTOR: "Distributor",
};
export const CROP_ROLES = ["ADMIN", "FARM_MANAGER"];
export const DISTRIBUTION_ROLES = ["ADMIN", "DISTRIBUTOR"];
export function hasRole(user, roles) {
  return user?.status === "ACTIVE" && roles.includes(user.role);
}
export function isActiveUser(user) {
  return Boolean(
    user &&
      user.id != null &&
      typeof user.name === "string" &&
      typeof user.email === "string" &&
      user.status === "ACTIVE" &&
      Object.hasOwn(ROLE_LABELS, user.role),
  );
}
export function safeReturnPath(value) {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/^\/(login|register)(\/|\?|$)/.test(value)
    ? value
    : "/";
}
