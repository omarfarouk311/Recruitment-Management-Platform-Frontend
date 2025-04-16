import { useEffect, useState } from "react";

export interface TimerProps {
  className?: string;
  initialMinutes: number;
  timeIsUp: boolean;
  setTimeIsUp: (timeIsUp: boolean) => void;
}

export const Timer = ({ 
  className, 
  initialMinutes,
  timeIsUp,
  setTimeIsUp
}: TimerProps) => {
  const [endTime, setEndTime] = useState<Date>(() => {
    const initialEndTime = new Date();
    initialEndTime.setMinutes((new Date()).getMinutes() + initialMinutes);
    return initialEndTime;
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize end time on mount
  useEffect(() => {
    if (!endTime) {
      const initialEndTime = new Date();
      initialEndTime.setMinutes(initialEndTime.getMinutes() + initialMinutes);
      setEndTime(initialEndTime);
    }
  }, [initialMinutes, endTime, setEndTime]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (endTime && now >= endTime) {
        setTimeIsUp(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!endTime || timeIsUp) return null;

  const getTimeRemaining = () => {
    const totalSeconds = Math.floor((endTime.getTime() - currentTime.getTime()) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds };
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");
  const { hours, minutes, seconds } = getTimeRemaining();

  return (
    <div className={`fixed top-4 right-4 bg-black p-3 rounded-lg shadow-md z-10 ${className || ""}`}>
      <span className="font-semibold text-lg text-white">
        {formatNumber(hours)}:
        {formatNumber(minutes)}:
        {formatNumber(seconds)}
      </span>
    </div>
  );
};
