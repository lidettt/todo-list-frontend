import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import todosServices from "../services/todos";
import { formatDate, formatTime } from "../utils/formatDate";
import toast from "react-hot-toast";

// ────────────────────────────────────
const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await todosServices.getUserTodos();
        setTodos(data);
      } catch (error) {
        toast.error("Couldn't load your tasks. Try again!");
      }
    };

    if (user) {
      fetchTodos();
    }
  }, [user]);

  const addTodo = async (input) => {
    try {
      const newTodo = await todosServices.addUserTodo({ title: input });

      setTodos((prev) => [newTodo, ...prev]);
      toast.success("Task added!");
    } catch (error) {
      toast.error("Couldn't add your task. Try again!");
    }
  };

  //update todo status
  const toggleTodo = async (id) => {
    //find the todo that being updated by find the id that got past from the button
    const todo = todos.find((todo) => todo.id === id);
    //create a object that contain of all the previous todos, and change the property completed value to the opposite
    const changedTodo = { ...todo, completed: !todo.completed };
    try {
      const returnedTodo = await todosServices.updateUserTodo(id, changedTodo);
      setTodos(todos.map((todo) => (todo.id !== id ? todo : returnedTodo)));
      toast.success("Task updated!");
    } catch (error) {
      toast.error("Couldn't update your task. Try again!");
    }
  };
  const deleteTodo = async (id) => {
    // const todo = todos.find((todo) => todo.id === id);
    try {
      await todosServices.deleteUserTodo(id);
      setTodos((prevTodo) => prevTodo.filter((t) => t.id !== id));
      toast.success("Task deleted!");
    } catch (error) {
      toast.error("Couldn't delete your task. Try again!");
    }
  };

  return { todos, loading: false, addTodo, toggleTodo, deleteTodo };
};
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS = ["All", "Active", "Completed"];

export default function Todo() {
  const { todos, loading, addTodo, deleteTodo, toggleTodo } = useTodos();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Please enter a task first!");
      return;
    }
    addTodo(input.trim());
    setInput("");
  };

  //filterd object that fitler by the todo completed value
  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  //filter the amount of active and completed
  const total = todos.length;
  const active = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout Successfully.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-subtle font-sans">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex flex-col items-center px-4 py-16 font-sans">
      {/* Navbar */}
      <div className="w-full max-w-2xl flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-surface border border-border text-dimmed text-sm font-medium px-4 py-2 rounded-xl hover:text-white hover:border-hover-border transition-colors duration-200 cursor-pointer"
        >
          Logout
        </button>
      </div>
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-6xl font-bold text-white tracking-tight mb-2">
          ToDo List
        </h1>
        <p className="text-muted ">Plan, prioritize, and progress.</p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Stats */}

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: total },
            { label: "Active", value: active },
            { label: "Completed", value: completed },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-2xl flex flex-col items-center justify-center py-6 gap-1"
            >
              <span className="font-serif text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-muted text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-2xl py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer
                ${
                  filter === f
                    ? "bg-white text-black"
                    : "bg-surface border border-border text-dimmed hover:text-white"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Add Task */}
        <form
          onSubmit={handleAdd}
          className="bg-surface border border-border rounded-2xl px-5 py-4 flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-transparent text-white text-sm placeholder-faint outline-none"
          />
          <button
            type="submit"
            className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-xl hover:bg-dimmed transition-colors duration-200 cursor-pointer"
          >
            Add Task
          </button>
        </form>

        {/* Todo List */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-hover-border text-sm text-center py-12">
              {filter === "All"
                ? "No tasks yet. Add one to get started."
                : `No ${filter.toLowerCase()} tasks.`}
            </p>
          ) : (
            <ul className="divide-y divide-elevated">
              {filtered.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-base transition-colors duration-150"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => {
                      toggleTodo(todo.id);
                    }}
                    className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors duration-200 cursor-pointer
                      ${
                        todo.completed
                          ? "bg-white border-white"
                          : "border-faint hover:border-muted"
                      }`}
                  />

                  {/* Text */}
                  <span
                    className={`flex-1 transition-colors duration-200
                      ${todo.completed ? "line-through text-hover-border" : "text-white"}`}
                  >
                    {todo.title}
                  </span>
                  <span className="text-faint">
                    {formatDate(todo.createdAt)} · {formatTime(todo.createdAt)}
                  </span>
                  {/* Delete */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-faint hover:text-red-400 transition-colors duration-200 text-lg cursor-pointer"
                    aria-label="Delete task"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
