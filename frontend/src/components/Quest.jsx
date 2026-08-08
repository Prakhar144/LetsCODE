import { useState } from 'react';
import { Link } from 'react-router-dom';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correctAnswer: 1,
    explanation: "A Stack follows the Last In First Out principle, meaning the last element added is the first one to be removed."
  },
  {
    id: 2,
    question: "What is the time complexity of binary search in the worst case?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
    explanation: "Binary search halves the search space at each step, resulting in logarithmic time complexity: O(log n)."
  },
  {
    id: 3,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2,
    explanation: "Merge sort has an average and worst-case time complexity of O(n log n), which is optimal for comparison-based sorting algorithms."
  },
  {
    id: 4,
    question: "What is the main advantage of a Hash Table?",
    options: ["Elements are kept sorted", "O(1) average time complexity for search, insert, and delete", "Uses less memory than an array", "Easy to implement range queries"],
    correctAnswer: 1,
    explanation: "Hash tables provide extremely fast O(1) average time complexity for lookups, insertions, and deletions."
  }
];

export default function Quest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelect = (index) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
      setIsAnswered(true);
      if (index === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const q = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-8 pb-24 text-slate-200">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/problems" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </Link>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Daily Quest</h1>
            </div>
            <p className="text-slate-400 pl-12 text-lg">Test your algorithmic knowledge and earn rewards.</p>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">Rewards</span>
            <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
              <span className="font-bold text-yellow-400">+{score * 10}</span>
              <span className="text-xs text-yellow-600 font-bold">COINS</span>
            </div>
          </div>
        </div>

        {!quizCompleted ? (
          <div className="glass-card p-8 md:p-10 border border-white/5 bg-[#222] relative overflow-hidden">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${((currentQuestion) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q.question}</h2>

            <div className="flex flex-col gap-4 mb-8">
              {q.options.map((opt, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === q.correctAnswer;
                
                let btnStyle = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10";
                
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-red-500/20 border-red-500/50 text-red-400";
                  } else {
                    btnStyle = "bg-white/5 border-white/5 text-slate-500 opacity-50";
                  }
                } else if (isSelected) {
                   btnStyle = "bg-blue-500/20 border-blue-500/50 text-blue-400";
                }

                return (
                  <button 
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${btnStyle} flex items-center justify-between group`}
                  >
                    <span className="font-medium text-lg">{opt}</span>
                    {isAnswered && isCorrect && (
                      <svg className="w-6 h-6 text-emerald-500 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <svg className="w-6 h-6 text-red-500 animate-in zoom-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className={`p-4 rounded-lg mb-6 border ${selectedAnswer === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <p className="text-sm leading-relaxed text-slate-300">
                    <strong className={selectedAnswer === q.correctAnswer ? 'text-emerald-400' : 'text-red-400'}>
                      {selectedAnswer === q.correctAnswer ? 'Correct! ' : 'Incorrect. '}
                    </strong>
                    {q.explanation}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  >
                    {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-12 border border-white/5 bg-[#222] text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2">Quest Completed!</h2>
            <p className="text-slate-400 mb-8">You answered {score} out of {QUIZ_QUESTIONS.length} questions correctly.</p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={restartQuiz}
                className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-bold rounded-lg transition-all"
              >
                Try Again
              </button>
              <Link to="/problems">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
