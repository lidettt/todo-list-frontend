import api from "./api";

const getUserTodos = async () => {
  const response = await api.get("/todos");
  return response.data;
};

const addUserTodo = async (newObject) => {
  const response = await api.post("/todos", newObject);
  return response.data;
};

const updateUserTodo = async (id, newObject) => {
  const response = await api.put(`/todos/${id}`, newObject);
  return response.data;
};

const deleteUserTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
export default {
  getUserTodos,
  addUserTodo,
  updateUserTodo,
  deleteUserTodo,
};
