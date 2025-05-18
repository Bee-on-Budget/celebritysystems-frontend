import React from "react";


const AddSystem = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-dark mb-6 text-center">Add New Supervisor</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="system-name" className="block text-sm font-medium text-gray-700 mb-1">
            Supervisor Name
            </label>
            <input
              id="system-name"
              type="text"
              placeholder="Enter system name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="system-desc" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="system-desc"
              placeholder="Describe the system..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="system-type" className="block text-sm font-medium text-gray-700 mb-1">
              System Type
            </label>
            <select
              id="system-type"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select type</option>
              <option value="web">Web Application</option>
              <option value="mobile">Mobile Application</option>
              <option value="desktop">Desktop Application</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 rounded-md transition-colors"
            disabled
          >
            Add System
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSystem; 