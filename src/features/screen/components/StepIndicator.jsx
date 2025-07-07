import React from 'react';

const StepIndicator = ({ stepNumber, title, currentStep, visible = true }) => {
  if (!visible) return null;

  // Determine step state
  const isCompleted = currentStep > stepNumber;
  const isCurrent = currentStep === stepNumber;
  const isUpcoming = currentStep < stepNumber;

  // Dynamic classes
  const lineClasses = `absolute h-1 top-5 -left-1/2 right-1/2 w-full ${
    isCompleted ? 'bg-green-500' : 'bg-gray-200'
  }`;

  const circleClasses = [
    'w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-semibold',
    'transition-all duration-300 ease-in-out',
    isCompleted ? 'bg-green-500 text-white shadow-md' : '',
    isCurrent ? 'bg-primary text-white shadow-lg scale-110' : '',
    isUpcoming ? 'bg-gray-200 text-gray-500' : ''
  ].join(' ').trim();

  const titleClasses = [
    'text-sm transition-colors duration-300',
    isCurrent ? 'font-bold text-primary' : '',
    isCompleted ? 'font-medium text-green-600' : '',
    isUpcoming ? 'text-gray-500' : ''
  ].join(' ').trim();

  return (
    <div className="flex-1 text-center relative group">
      {/* Connecting line (for multi-step indicators) */}
      {stepNumber > 1 && <div className={lineClasses} />}
      
      {/* Step circle */}
      <div className="relative z-10">
        <div className={circleClasses}>
          {isCompleted ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            stepNumber
          )}
        </div>
      </div>
      
      {/* Step title */}
      <p className={titleClasses}>
        {title}
      </p>
    </div>
  );
};

export default StepIndicator;