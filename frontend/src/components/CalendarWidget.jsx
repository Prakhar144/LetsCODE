import React, { useState, useEffect } from 'react';

export default function CalendarWidget({ streak = 0 }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayedDate, setDisplayedDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const [timeLeft, setTimeLeft] = useState('');

  // Clock tick for countdown to midnight
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateTimeLeft(); // initial call
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevMonth = () => {
    setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = displayedDate.getFullYear();
  const month = displayedDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Generate calendar cells
  const cells = [];
  
  // Empty cells for first week
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`}></div>);
  }
  
  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = currentDate.getDate() === day && currentDate.getMonth() === month && currentDate.getFullYear() === year;
    
    // Check if this day is part of the streak
    let isStreakDay = false;
    if (streak > 0) {
      const cellDate = new Date(year, month, day);
      const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const diffTime = todayDate - cellDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If it's today and we have a streak, or it's within the past 'streak' days
      if (diffDays >= 0 && diffDays < streak) {
        isStreakDay = true;
      }
    }

    let cellClass = "p-1 rounded cursor-pointer transition-colors ";
    
    if (isToday) {
      cellClass += "bg-emerald-500 text-black font-bold";
    } else if (isStreakDay) {
      cellClass += "text-emerald-500 font-bold hover:bg-[#3A3A3A]";
    } else {
      cellClass += "hover:bg-[#3A3A3A]";
    }

    cells.push(
      <div key={`day-${day}`} className={cellClass}>
        {day}
      </div>
    );
  }

  // Calculate current week of the month (1-5)
  const currentWeekOfMonth = Math.ceil((currentDate.getDate() + getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())) / 7);

  return (
    <div className="bg-[#282828] rounded-xl p-5 border border-[#3A3A3A] shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-gray-300 text-sm font-semibold">{monthNames[month]} {year}</span>
          {currentDate.getMonth() === month && currentDate.getFullYear() === year && (
            <span className="text-gray-500 text-xs font-normal">Day {currentDate.getDate()} <span className="text-emerald-500">{timeLeft} left</span></span>
          )}
        </div>
        <div className="flex gap-2 text-gray-500">
          <svg onClick={handlePrevMonth} className="w-4 h-4 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <svg onClick={handleNextMonth} className="w-4 h-4 cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2 font-medium">
        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-300">
        {cells}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
            Weekly Premium
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </span>
          <span className="text-xs text-slate-500">6 days left</span>
        </div>
        <div className="flex justify-between text-xs font-bold text-yellow-600">
          {[1, 2, 3, 4, 5].map(w => (
            <span key={w} className={w === currentWeekOfMonth ? "bg-yellow-500 text-black px-2 py-0.5 rounded-full" : ""}>
              W{w}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            0 Redeem
          </span>
          <span className="text-xs text-slate-500 hover:text-white cursor-pointer transition-colors">Rules</span>
        </div>
      </div>
    </div>
  );
}
