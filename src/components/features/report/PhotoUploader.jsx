import { useRef } from "react";
import { Camera, X, Plus } from "lucide-react";

const PhotoUploader = ({ selectedFiles = [], onFilesChange, maxFiles = 4 }) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Append new files to existing files, respecting maxFiles limit
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, maxFiles);
    onFilesChange(combinedFiles);
    // Reset input so the same file can be selected again if removed
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
  };

  const remainingSlots = maxFiles - selectedFiles.length;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800">Upload Photos</h3>
          <span className="text-xs text-gray-400">({selectedFiles.length}/{maxFiles})</span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {/* Preview existing images */}
        {selectedFiles.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${index}`}
              className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200"
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add more button - show only if there's room for more */}
        {remainingSlots > 0 && (
          <div
            onClick={handleFileClick}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-green-500 mt-1">Add</span>
          </div>
        )}
      </div>

      {selectedFiles.length === 0 && (
        <p className="text-xs text-gray-400 mt-2">
          Click the add button to upload up to {maxFiles} photos
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  );
};

export default PhotoUploader;
