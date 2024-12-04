import React, { useState, useEffect } from 'react';

const TaskModal = ({
  isOpen,
  onClose,
  taskData,
  onSave,
  isEditing,
}) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
  });

  useEffect(() => {
    if (isEditing && taskData) {
      setNewTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
      });
    } else {
      resetTaskForm();
    }
  }, [isEditing, taskData]);

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.description) {
      alert('Both title and description are required.');
      return;
    }
    onSave(newTask);
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
    });
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex flex-col gap-5">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            name="title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Title"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            name="description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description"
          />
        </label>
        <div className="flex justify-between gap-4">
          <label className="form-control flex-1">
            <span>Task Status</span>
            <select
              className="select select-bordered w-full"
              name="status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
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
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleSaveTask}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>Close</button>
      </form>
    </dialog>
  );
};

export default TaskModal;
