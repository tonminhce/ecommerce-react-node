import React from "react";

const ChangePassword = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-slate-700 mb-6">
        Change Password
      </h2>

      <form>
        {/* Old Password */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="old_password"
            className="text-sm font-medium text-slate-600 mb-1"
          >
            Old Password
          </label>
          <input
            className="outline-none px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 text-slate-700"
            type="password"
            name="old_password"
            id="old_password"
            placeholder="Enter your old password"
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="new_password"
            className="text-sm font-medium text-slate-600 mb-1"
          >
            New Password
          </label>
          <input
            className="outline-none px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 text-slate-700"
            type="password"
            name="new_password"
            id="new_password"
            placeholder="Enter your new password"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="confirm_password"
            className="text-sm font-medium text-slate-600 mb-1"
          >
            Confirm New Password
          </label>
          <input
            className="outline-none px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 text-slate-700"
            type="password"
            name="confirm_password"
            id="confirm_password"
            placeholder="Confirm your new password"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-md shadow-md hover:bg-teal-500 hover:shadow-lg transition-all duration-200 ease-in-out"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
