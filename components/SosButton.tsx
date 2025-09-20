import React, { useState, useEffect, useRef } from 'react';

export const SosButton: React.FC = () => {
  const [activated, setActivated] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isCountingDown) {
      timerRef.current = window.setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimer();
  }, [isCountingDown]);

  useEffect(() => {
    if (countdown === 0) {
      clearTimer();
      setIsCountingDown(false);
      setActivated(true);
      alert("SOS Activated! Your location has been sent to the nearest rescue team. Help is on the way.");
      setTimeout(() => setActivated(false), 5000); // Reset after 5 seconds
    }
  }, [countdown]);

  const handleSOSClick = () => {
    if (!activated && !isCountingDown) {
      setIsCountingDown(true);
      setCountdown(5);
    }
  };

  const handleCancelClick = () => {
    clearTimer();
    setIsCountingDown(false);
    setCountdown(5);
  };

  return (
    <div className="bg-brand-gray-800 rounded-xl shadow-lg p-6 h-full flex flex-col justify-center items-center border border-brand-gray-700">
      <h3 className="text-xl font-bold text-brand-gray-100 mb-4 text-center">Emergency Help</h3>
      <p className="text-center text-brand-gray-400 mb-6 h-10 flex items-center">
        {isCountingDown 
          ? 'Sending alert in...' 
          : 'Press the button in case of immediate danger.'
        }
      </p>
      
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSOSClick}
          disabled={isCountingDown || activated}
          className={`relative w-40 h-40 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl transition-all duration-300
          ${activated 
            ? 'bg-brand-green' 
            : isCountingDown
            ? 'bg-yellow-500'
            : 'bg-brand-red hover:bg-red-600'
          }`}
          aria-live="polite"
        >
          {!isCountingDown && !activated && <span className="absolute h-full w-full rounded-full bg-brand-red opacity-75 animate-ping"></span>}
          {activated ? 'SENT' : isCountingDown ? countdown : 'SOS'}
        </button>

        {isCountingDown && (
          <button
            onClick={handleCancelClick}
            className="px-6 py-2 bg-brand-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-gray-500 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {activated && <p className="mt-4 text-sm text-brand-green font-semibold">Help is on the way.</p>}
    </div>
  );
};