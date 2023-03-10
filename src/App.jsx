import { useEffect, useState, useRef } from "react";
import { Modal } from "./Modal";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathRoundedSquareIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { GoalDropDownn } from "./GoalDropDown";

function App() {
  // Modal and Drop-down states.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  // Daily goal display states.
  const [goal, setGoal] = useState(1);
  // Timer states.
  const [isPaused, setIsPaused] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState({
    sessionTime: 25 * 60,
    breakTime: 5 * 60,
    displayTime: 25 * 60,
  });
  const cdInterval = useRef(null);

  const timer = () => {
    cdInterval.current = setInterval(() => {
      setTime((prev) => {
        return {
          ...prev,
          displayTime: prev.displayTime - 1,
        };
      });
    }, 1000);
  };

  const countdown = () => {
    if (isPaused) {
      timer();
    } else {
      clearInterval(cdInterval.current);
    }
  };

  const resetTimer = () => {
    setTime((prev) => {
      return {
        ...prev,
        displayTime: prev.sessionTime,
      };
    });
    setIsPaused(true);
    setIsBreak(false);
    clearInterval(cdInterval.current);
  };

  useEffect(() => {
    if (time.displayTime < 0) {
      if (!isBreak) {
        clearInterval(cdInterval.current);
        setTime((prev) => ({
          ...prev,
          displayTime: prev.breakTime,
        }));
        setIsBreak(true);
        timer();
      } else {
        clearInterval(cdInterval.current);
        setTime((prev) => ({
          ...prev,
          displayTime: prev.sessionTime,
        }));
        setIsBreak(false);
        setIsPaused(true);
      }
    }
  }, [time]);

  useEffect(() => {
    setTime((prev) => {
      return {
        ...prev,
        displayTime: prev.sessionTime,
      };
    });
  }, [time.sessionTime]);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  return (
    <div
      className={`${
        isBreak ? "bg-blue-400" : "bg-slate-100"
      } flex h-screen select-none flex-col items-center justify-center gap-4 p-4 transition-colors duration-500`}
      onClick={() => {
        setIsGoalOpen(false);
      }}
    >
      <h1 className="text-6xl font-bold sm:text-7xl md:text-8xl">
        {formatTime(time.displayTime)}
      </h1>
      <div className="mb-4 flex gap-2">
        <div
          className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700"
          onClick={() => {
            setIsPaused((prev) => !prev);
            countdown();
          }}
        >
          {isPaused ? (
            <PlayIcon className="w-1/2 text-white" />
          ) : (
            <PauseIcon className="w-1/2 text-white" />
          )}
        </div>
        <div
          className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700"
          onClick={() => {
            resetTimer();
          }}
        >
          {isBreak ? (
            <ArrowRightOnRectangleIcon className="w-1/2 text-white" />
          ) : (
            <ArrowPathRoundedSquareIcon className="w-1/2 text-white" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div
          className="cursor-pointer rounded bg-gray-900 py-2 px-4 text-white transition-colors hover:bg-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen((prev) => !prev);
          }}
        >
          Set Duration.
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="mt-4 text-xl font-bold sm:text-2xl md:text-3xl">
          Today's Goal
        </h2>
        <div
          className={`h-2 w-full rounded-full transition-colors duration-500 ${
            isBreak ? "bg-slate-100" : "bg-gray-300"
          }`}
        >
          <div className="h-2 w-[10%] rounded-full bg-gray-800"></div>
        </div>
        <div className="flex justify-end gap-2 self-end">
          <p className="flex items-center text-sm sm:text-base">{goal} hours</p>
          <div
            className="relative flex aspect-square w-6 cursor-pointer items-center justify-center rounded bg-gray-900 hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsGoalOpen((prev) => !prev);
            }}
          >
            <PencilIcon className="w-1/2 text-white" />
            <GoalDropDownn
              isGoalOpen={isGoalOpen}
              goal={goal}
              setGoal={setGoal}
            />
          </div>
        </div>
      </div>

      {/* Modal and Overlay. */}
      <div
        className={`pointer-events-none fixed h-full w-full bg-gray-900 opacity-30 ${
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
