import React, { useState, useEffect } from 'react';

export const Countdown: React.FC<{ targetDate?: string }> = ({ targetDate }) => {
  // Default to 48 hours from current local time if none provided
  const target = targetDate ? new Date(targetDate).getTime() : Date.now() + 172800000;
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 48,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const padZero = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-6 md:gap-10 font-mono" id="drop-timer">
      <div className="text-center">
        <span className="block text-3xl md:text-5xl font-light text-brand-dark dark:text-white transition-colors duration-300">
          {padZero(timeLeft.hours)}
        </span>
        <span className="block text-[10px] md:text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
          Hours
        </span>
      </div>
      <span className="text-2xl md:text-4xl font-light text-neutral-300 dark:text-neutral-700 animate-pulse">:</span>
      <div className="text-center">
        <span className="block text-3xl md:text-5xl font-light text-brand-dark dark:text-white transition-colors duration-300">
          {padZero(timeLeft.minutes)}
        </span>
        <span className="block text-[10px] md:text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
          Mins
        </span>
      </div>
      <span className="text-2xl md:text-4xl font-light text-neutral-300 dark:text-neutral-700 animate-pulse">:</span>
      <div className="text-center">
        <span className="block text-3xl md:text-5xl font-light text-brand-dark dark:text-white transition-colors duration-300">
          {padZero(timeLeft.seconds)}
        </span>
        <span className="block text-[10px] md:text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
          Secs
        </span>
      </div>
    </div>
  );
};
export default Countdown;
