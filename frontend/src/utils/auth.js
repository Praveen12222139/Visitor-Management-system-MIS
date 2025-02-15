export const isAuthenticated = () => !!localStorage.getItem("token");

export const loginUser = (token) => {
  localStorage.setItem("token", token);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
