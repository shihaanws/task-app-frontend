import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../redux/slices/taskSlice";
import TaskCard from "../components/TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import TaskFilters from "../components/TaskFilters";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const modalRef = useRef(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (role === "admin") {
      dispatch(fetchTasks());
    } else if (role === "user") {
      dispatch(fetchTasks(user._id));
    }
  }, [dispatch, role, user]);

  const [showValidation, setShowValidation] = useState(false);

  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.description) {
      return; // Prevent further action until validation passes
    }
    const taskData = { ...newTask };
    if (isEditing) {
      await dispatch(updateTask({ id: editingTaskId, taskData }));
    } else {
      await dispatch(addTask(taskData));
    }
    if (role === "admin") {
      dispatch(fetchTasks());
    } else if (role === "user") {
      dispatch(fetchTasks(user._id));
    }
    resetTaskForm();
    setShowValidation(false); // Reset validation after successful save
  };

  const handleDeleteTask = async (id) => {
    await dispatch(deleteTask(id));
  };

  const resetTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
    });
    setEditingTaskId(null);
    setIsEditing(false);
    modalRef.current.close();
  };

  const openEditModal = (task) => {
    setEditingTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
    setIsEditing(true);
    modalRef.current.showModal();
  };

  const openAddModal = () => {
    resetTaskForm();
    modalRef.current.showModal();
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      filterPriority ? task.priority === filterPriority : true
    )
    .filter((task) => (filterStatus ? task.status === filterStatus : true));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col gap-5">
          <label className="input input-bordered flex items-center">
            <input
              type="text"
              className={`grow ${
                !newTask.title && showValidation ? "input-error" : ""
              }`}
              name="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              placeholder="Title"
              aria-invalid={!newTask.title && showValidation}
            />
            {!newTask.title && showValidation && (
              <span className="text-red-500 text-sm m-0">
                Title is required.
              </span>
            )}
          </label>

          <label className="input input-bordered flex items-center">
            <input
              type="text"
              className={`grow ${
                !newTask.description && showValidation ? "input-error" : ""
              }`}
              name="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Description"
              aria-invalid={!newTask.description && showValidation}
            />
            {!newTask.description && showValidation && (
              <span className="text-red-500 text-sm">
                Description is required.
              </span>
            )}
          </label>

          <div className="flex justify-between gap-4">
            <label className="form-control flex-1">
              <span>Task Status</span>
              <select
                className="select select-bordered w-full"
                name="status"
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option>Todo</option>
                <option>Inprogress</option>
                <option>Done</option>
              </select>
            </label>
            <label className="form-control flex-1">
              <span>Priority</span>
              <select
                className="select select-bordered w-full"
                name="priority"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowValidation(true);
              handleSaveTask();
            }}
          >
            {isEditing ? "Update Task" : "Create Task"}
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>

      <div className="flex flex-col p-[2rem] min-h-[89vh] bg-gray-100">
        <div className="flex items-center justify-end mb-4 ml-5">
          <button
            onClick={openAddModal}
            className="btn btn-outline btn-sm btn-info flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New Task
          </button>
        </div>

        <TaskFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTasks.length > 0 ? (
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task._id}
                  className=""
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: 180,
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskCard
                    task={task}
                    role={role}
                    user={user}
                    handleDelete={handleDeleteTask}
                    openEditModal={openEditModal}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full mt-32 text-center text-gray-500 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="48"
                height="48"
              >
                <path
                  fillRule="evenodd"
                  d="M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z"
                  clipRule="evenodd"
                />
              </svg>

              <p>No data available</p>
              <p className="mt-2">Please try again later or add new tasks.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
