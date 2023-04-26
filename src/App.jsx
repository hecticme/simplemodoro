import { useState } from "react";
import { Modal } from "./components/Modal";
import { TimerDisplay } from "./components/TimerDisplay";
import { TimerControl } from "./components/TimerControl";
import { GoalDisplay } from "./components/GoalDisplay";
import { useTimer } from "./hooks/useTimer";
import { formatTime } from "./functions";

function App() {
  // Modal and Drop-down states.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const {
    time,
    setTime,
    isPaused,
    setIsPaused,
    countdown,
    isBreak,
    resetTimer,
    progress,
    goal,
    setGoal,
  } = useTimer();

  return (
    <div
      className={`${
        isBreak ? "bg-blue-400 dark:bg-blue-900" : ""
      } flex h-screen select-none flex-col items-center justify-center gap-4 p-4 transition-colors duration-500`}
      onClick={() => {
        setIsGoalOpen(false);
      }}
    >
      <TimerDisplay isBreak={isBreak} formatTime={formatTime} time={time} />
      <TimerControl
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        countdown={countdown}
        isBreak={isBreak}
        resetTimer={resetTimer}
      />

      <button
        className="cursor-pointer rounded bg-gray-900 py-2 px-4 text-sm text-slate-100 transition-colors hover:bg-gray-700  dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300  sm:text-base"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen((prev) => !prev);
        }}
      >
        Set Duration.
      </button>

      <GoalDisplay
        isBreak={isBreak}
        progress={progress}
        goal={goal}
        isGoalOpen={isGoalOpen}
        setGoal={setGoal}
        setIsGoalOpen={setIsGoalOpen}
      />

      {/* Modal and Overlay. */}
      <div
        className={`pointer-events-none fixed h-full w-full bg-gray-900 opacity-30 dark:bg-slate-700 ${
          isModalOpen ? "pointer-events-auto block" : "hidden"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(false);
        }}
      ></div>
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        time={time}
        setTime={setTime}
      />
    </div>
  );
}

export default App;
