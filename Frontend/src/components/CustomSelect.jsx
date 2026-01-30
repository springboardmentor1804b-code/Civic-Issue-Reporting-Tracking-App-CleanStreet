import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const priorityColors = {
  Low: 'text-green-700',
  Medium: 'text-yellow-700',
  High: 'text-red-900',
};

export default function CustomSelect({ label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const isPrioritySelect =
    options.includes('Low') && options.includes('Medium') && options.includes('High');

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block mb-2 text-sm text-gray-700 font-medium">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border-2 p-3 rounded-lg transition-all duration-200 bg-white
          ${
            isOpen
              ? 'border-blue-500 ring-2 ring-blue-100'
              : 'border-gray-300 hover:border-blue-400'
          }
          ${isPrioritySelect && priorityColors[value] ? priorityColors[value] : 'text-gray-800'}
        `}
      >
        <span className="truncate">{value || 'Select an option'}</span>
        <FaChevronDown
          className={`text-sm ml-2 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          <ul className="py-1">
            {options.map(option => (
              <li
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors
                  ${
                    isPrioritySelect && priorityColors[option]
                      ? `${priorityColors[option]} hover:bg-blue-50`
                      : value === option
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }
                `}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

