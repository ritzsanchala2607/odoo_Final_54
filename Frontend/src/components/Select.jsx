
import React, { useState } from 'react';
import './Select.css';

const Select = ({
  placeholder,
  options = [],
  value,
  onChange,
  className = '',
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectClass = `
    select-container 
    ${isOpen ? 'select-open' : ''}
    ${error ? 'select-error' : ''}
    ${className}
  `.trim();

  // Find the selected option label
  const selectedOption = options.find(opt => (typeof opt === 'object' ? opt.value : opt) === value);
  const displayLabel = selectedOption ? (selectedOption.label || selectedOption.value || selectedOption) : placeholder;

  return (
    <div className={selectClass}>
      <div
        className="select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`select-value ${!value ? 'select-placeholder' : ''}`}>
          {displayLabel}
        </span>
        <span className={`select-arrow ${isOpen ? 'select-arrow-up' : ''}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          {options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return (
              <div
                key={index}
                className={`select-option ${value === optionValue ? 'select-option-selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {optionLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
