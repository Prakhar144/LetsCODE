import { useState, useEffect } from 'react';

export default function Contest() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 59 });

  useEffect(() => {
    // Check local storage for registration
    const reg = localStorage.getItem('contest_registered');
    if (reg === 'true') setIsRegistered(true);

    // Mock countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) { seconds = 59; minutes -= 1; }
        if (minutes < 0) { minutes = 59; hours -= 1; }
        if (hours < 0) { hours = 23; days -= 1; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegister = () => {
    const newState = !isRegistered;
    setIsRegistered(newState);
    localStorage.setItem('contest_registered', newState);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Weekly Contest 405</h1>
        
        <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <h2 className="text-2xl font-bold text-white mb-6">Contest Starts In</h2>
          
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-3xl font-bold text-white border border-[#3A3A3A]">
                {timeLeft.days}
              </div>
              <span className="text-gray-500 mt-2 font-medium">Days</span>
            </div>
            <div className="text-4xl font-bold text-gray-600 mt-4">:</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-3xl font-bold text-white border border-[#3A3A3A]">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <span className="text-gray-500 mt-2 font-medium">Hours</span>
            </div>
            <div className="text-4xl font-bold text-gray-600 mt-4">:</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-3xl font-bold text-white border border-[#3A3A3A]">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <span className="text-gray-500 mt-2 font-medium">Minutes</span>
            </div>
            <div className="text-4xl font-bold text-gray-600 mt-4">:</div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-3xl font-bold text-blue-400 border border-[#3A3A3A]">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <span className="text-gray-500 mt-2 font-medium">Seconds</span>
            </div>
          </div>

          <button 
            onClick={handleRegister}
            className={`px-12 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg ${
              isRegistered 
                ? 'bg-[#1A1A1A] text-green-400 border border-green-500/30 hover:border-green-500' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
            }`}
          >
            {isRegistered ? 'Registered! Click to Unregister' : 'Register Now'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Contest Rules</h3>
            <ul className="list-disc pl-5 text-gray-400 space-y-2 text-sm">
              <li>You will have 90 minutes to solve 4 problems.</li>
              <li>Penalty time of 5 minutes applies for each wrong submission.</li>
              <li>Plagiarism will result in an immediate ban.</li>
              <li>Top 10% of participants receive a profile badge.</li>
            </ul>
          </div>
          <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Prizes</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-[#1A1A1A] p-3 rounded-lg">
                <div className="text-2xl">🥇</div>
                <div>
                  <div className="font-bold text-white">1st Place</div>
                  <div className="text-xs text-gray-400">10,000 Lets&lt;CODE&gt; Coins + Premium</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#1A1A1A] p-3 rounded-lg">
                <div className="text-2xl">🥈</div>
                <div>
                  <div className="font-bold text-white">2nd - 5th Place</div>
                  <div className="text-xs text-gray-400">5,000 Lets&lt;CODE&gt; Coins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
