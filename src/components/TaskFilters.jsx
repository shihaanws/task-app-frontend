import React from "react";

const TaskFilters = ({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
      <div
        role="tablist"
        className="tabs tabs-bordered w-full sm:w-auto mb-4 sm:mb-0"
      >
        {["All", "Todo", "Inprogress", "Done"].map((status) => (
          <a
            key={status}
            role="tab"
            className={`tab ${
              filterStatus === status ||
              (status === "All" && filterStatus === "")
                ? "tab-active"
                : ""
            }`}
            onClick={() => setFilterStatus(status === "All" ? "" : status)}
          >
            {status}
          </a>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
        <label
          className="input input-bordered flex items-center gap-2 w-full sm:w-auto bg-white"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow bg-white border-none focus:outline-none "
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

        <select
          className="w-full bg-white sm:w-32 select select-bordered outline-none px-2 py-2 bg-transparent text-sm text-gray-700"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">Priority</option>
          {["High", "Medium", "Low"].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
