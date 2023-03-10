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
  const [goal, setGoal] = useState(getGoal());
  const [progress, setProgress] = useState(getProgress());
  const [isGoalAchieved, setIsGoalAchieved] = useState(getIsGoalAchieved());
  // Timer states.
  const [isPaused, setIsPaused] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(getTime());
  // RefId for intervals.
  const cdInterval = useRef(null);
  const progressInterval = useRef(null);

  function getTime() {
    const storageSessionTime = localStorage.getItem("sessionTime");
    const storageBreakTime = localStorage.getItem("breakTime");
    return {
      sessionTime: storageSessionTime ? storageSessionTime : 25 * 60,
      breakTime: storageBreakTime ? storageBreakTime : 5 * 60,
      displayTime: storageSessionTime ? storageSessionTime : 25 * 60,
    };
  }

  function getGoal() {
    const storageGoal = localStorage.getItem("goal");
    return storageGoal ? storageGoal : 1;
  }

  function getProgress() {
    const localProgress = JSON.parse(localStorage.getItem("progress"));
    if (localProgress) {
      return localProgress.progress;
    } else {
      return 0;
    }
  }

  function getIsGoalAchieved() {
    if (progress / (goal * 3600) >= 1) {
      return true;
    } else {
      return false;
    }
  }

  // Update progress every second.
  useEffect(() => {
    localStorage.setItem(
      "progress",
      JSON.stringify({
        createdTime: new Date().getTime(),
        progress,
      })
    );
  }, [progress]);

  // Change state, styles when goal is achieved.
  useEffect(() => {
    if (progress / (goal * 3600) >= 1) {
      setIsGoalAchieved(true);
    } else {
      setIsGoalAchieved(false);
    }
  }, [progress, goal]);

  // Reset progress daily.
  useEffect(() => {
    const currentProgress = JSON.parse(localStorage.getItem("progress"));
    if (currentProgress) {
      const currentProgressDate = Math.floor(
        currentProgress.createdTime / (1000 * 60 * 60 * 24)
      );
      const now = new Date().getTime();
      const todayDate = Math.floor(now / (1000 * 60 * 60 * 24));
      if (todayDate - currentProgressDate >= 1) {
        localStorage.removeItem("progress");
      }
    }
  }, []);

  // Timer.
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

  // Progress timer.
  const progressTimer = () => {
    progressInterval.current = setInterval(() => {
      setProgress((prev) => prev * 1 + 1);
    }, 1000);
  };

  // Countdown logic when pressing pause button.s
  const countdown = () => {
    if (isPaused) {
      timer();
      progressTimer();
    } else {
      clearInterval(cdInterval.current);
      clearInterval(progressInterval.current);
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
    clearInterval(progressInterval.current);
  };

  // Change page title dynamically.
  useEffect(() => {
    if (!isPaused && !isBreak) {
      document.title = `${formatTime(time.displayTime)} 🔥 Focusing!`;
    } else if (!isPaused && isBreak) {
      document.title = `${formatTime(time.displayTime)} 💙 Take a break!`;
      let faviconLight = document.querySelector(
        'link[rel="icon"][media="(prefers-color-scheme: light)"]'
      );
      let faviconDark = document.querySelector(
        'link[rel="icon"][media="(prefers-color-scheme: dark)"]'
      );
      faviconLight.href = "/favicon-light-break.svg";
      faviconDark.href = "/favicon-dark-break.svg";
    }
  }, [time.displayTime]);

  // Change to break time when session timer hits zero and vice versa.
  useEffect(() => {
    if (time.displayTime < 0) {
      if (!isBreak) {
        clearInterval(cdInterval.current);
        clearInterval(progressInterval.current);
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
        document.title = "Simple Pomodoro";
        let faviconLight = document.querySelector(
          'link[rel="icon"][media="(prefers-color-scheme: light)"]'
        );
        let faviconDark = document.querySelector(
          'link[rel="icon"][media="(prefers-color-scheme: dark)"]'
        );
        faviconLight.href = "/favicon-light.svg";
        faviconDark.href = "/favicon-dark.svg";
      }
    }
  }, [time]);

  // Set display time to session time on render and on change.
  useEffect(() => {
    if (!isBreak) {
      setTime((prev) => {
        return {
          ...prev,
          displayTime: prev.sessionTime,
        };
      });
    }
  }, [time.sessionTime]);

  // Set display time to break time on change.
  useEffect(() => {
    if (isBreak) {
      setTime((prev) => {
        return {
          ...prev,
          displayTime: prev.breakTime,
        };
      });
    }
  }, [time.breakTime]);

  // Fortmatters.
  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }

  const formatGoal = () => {
    const goalInHour = goal * 60;
    const hour = Math.floor(goalInHour / 60);
    const minute = goalInHour % 60;
    return `${hour != 0 ? `${hour} hour${hour > 1 ? "s" : ""}` : ""} ${
      minute != 0 ? `${minute} minute${minute > 1 ? "s" : ""}` : ""
    }`;
  };

  return (
    <div
      className={`${
        isBreak ? "bg-blue-400 dark:bg-blue-900" : ""
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
          className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 dark:bg-slate-300 dark:hover:bg-slate-100"
          onClick={() => {
            setIsPaused((prev) => !prev);
            countdown();
          }}
        >
          {isPaused ? (
            <PlayIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          ) : (
            <PauseIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          )}
        </div>
        <div
          className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:bg-gray-700 dark:bg-slate-300 dark:hover:bg-slate-100"
          onClick={() => {
            resetTimer();
          }}
        >
          {isBreak ? (
            <ArrowRightOnRectangleIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          ) : (
            <ArrowPathRoundedSquareIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div
          className="cursor-pointer rounded bg-gray-900 py-2 px-4 text-slate-100 transition-colors hover:bg-gray-700 dark:bg-slate-300 dark:text-gray-900 dark:hover:bg-slate-100"
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
          className={`h-2 w-full overflow-hidden rounded-full transition-colors duration-500 ${
            isBreak ? "bg-slate-100" : "bg-gray-300"
          }`}
        >
          <div
            className={`h-2 max-w-full rounded-full transition-colors duration-300 ${
              isGoalAchieved
                ? "bg-yellow-300"
                : `bg-gray-800 ${
                    isBreak ? "dark:bg-gray-900" : "dark:bg-gray-600"
                  }`
            }`}
            style={{ width: `${(progress / (goal * 3600)) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-end gap-2 self-end">
          <p className="flex items-center text-sm sm:text-base">
            {formatGoal(goal)}
          </p>
          <div
            className="relative flex aspect-square w-6 cursor-pointer items-center justify-center rounded bg-gray-900 hover:bg-gray-700 dark:bg-slate-300 dark:hover:bg-slate-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsGoalOpen((prev) => !prev);
            }}
          >
            <PencilIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
            <GoalDropDownn
              isGoalOpen={isGoalOpen}
              goal={goal}
              setGoal={setGoal}
            />
          </div>
        </div>

        <h3
          className={`text-center text-xl font-bold transition-transform duration-500 sm:text-2xl ${
            isGoalAchieved ? "scale-100" : "scale-0"
          } `}
        >
          Yay! You made it! 🎉
        </h3>
      </div>

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
