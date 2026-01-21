import { AlertCircle, Loader2 } from "lucide-react";
import { ISSUE_TYPES, PRIORITY_LEVELS } from "../../../constants";

const IssueDetailsForm = ({ address = "", onAddressChange, isLoadingAddress = false }) => {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">Issue Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label htmlFor="issueTitle" className="mb-2 font-semibold text-gray-700 text-sm">Issue Title *</label>
          <input
            id="issueTitle"
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white"
            placeholder="Ex: Large Garbage Dump"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="issueType" className="mb-2 font-semibold text-gray-700 text-sm">Issue Type *</label>
          <select
            id="issueType"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white cursor-pointer"
            required
          >
            <option value="">Select Issue Type</option>
            {ISSUE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label htmlFor="priorityLevel" className="mb-2 font-semibold text-gray-700 text-sm">Priority Level *</label>
          <select
            id="priorityLevel"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white cursor-pointer"
            required
          >
            <option value="">Select Priority Level</option>
            {PRIORITY_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-2 font-semibold text-gray-700 text-sm">
            Address
            {isLoadingAddress && (
              <span className="ml-2 text-xs text-green-600 font-normal inline-flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Fetching address...
              </span>
            )}
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => onAddressChange?.(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white"
            placeholder="Enter Street Address or select on map"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="landmark" className="mb-2 font-semibold text-gray-700 text-sm">Nearby Landmark (Optional)</label>
        <input
          id="landmark"
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white"
          placeholder="Ex: Near City Hall, Behind Shopping Center"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="mb-2 font-semibold text-gray-700 text-sm">Description</label>
        <textarea
          id="description"
          rows="4"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50/50 hover:bg-white resize-none"
          placeholder="Describe the issue in detail - what is the problem, how long has it been there, etc."
        />
      </div>
    </section>
  );
};

export default IssueDetailsForm;
