import { useEffect, useState, useRef } from "react";
import { setInterval, clearInterval } from "worker-timers";
import { Modal } from "./components/Modal";
import { Timer } from "./components/Timer";
import { GoalDisplay } from "./components/GoalDisplay";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathRoundedSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

function App() {
  // Modal and Drop-down states.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  // Daily goal display states.
  const [goal, setGoal] = useState(getGoal());
  const [progress, setProgress] = useState(getProgress());
  // Timer states.
  const [isPaused, setIsPaused] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(getTime());
  // Sound state.
  const [notificationSound] = useState(new Audio("./notification-sound.mp3"));
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

  // Reset progress daily (Follow UTC time).
  useEffect(() => {
    const currentProgress = JSON.parse(localStorage.getItem("progress"));
    if (currentProgress) {
      const currentProgressDate = Math.floor(
        currentProgress.createdTime / (1000 * 60 * 60 * 24)
      );
      const now = new Date().getTime();
      const todayDate = now / (1000 * 60 * 60 * 24);

      if (todayDate - currentProgressDate >= 1) {
        localStorage.removeItem("progress");
        setProgress(getProgress());
      }
    }
  }, []);

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

  // Countdown logic when pressing pause button.
  const countdown = () => {
    if (isPaused) {
      timer();
      progressTimer();
    } else {
      clearInterval(cdInterval.current);
      clearInterval(progressInterval.current);
    }
  };

  // Reset and skip function
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
    document.title = "Simple Pomodoro";
    changeDocumentIcon("");
  };

  function playNotification() {
    notificationSound.currentTime = 0;
    notificationSound.play();
  }

  function changeDocumentIcon(suffix) {
    let faviconLight = document.querySelector(
      'link[rel="icon"][media="(prefers-color-scheme: light)"]'
    );
    let faviconDark = document.querySelector(
      'link[rel="icon"][media="(prefers-color-scheme: dark)"]'
    );
    faviconLight.href = `/favicon-light${suffix}.svg`;
    faviconDark.href = `/favicon-dark${suffix}.svg`;
  }

  // Change page title dynamically.
  useEffect(() => {
    if (!isPaused && !isBreak) {
      document.title = `${formatTime(time.displayTime)} 🔥 Focusing!`;
    } else if (!isPaused && isBreak) {
      document.title = `${formatTime(time.displayTime)} 💙 Take a break!`;
      changeDocumentIcon("-break");
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
        playNotification();
      } else {
        clearInterval(cdInterval.current);

        setTime((prev) => ({
          ...prev,
          displayTime: prev.sessionTime,
        }));
        setIsBreak(false);
        setIsPaused(true);
        document.title = "Simple Pomodoro";
        changeDocumentIcon("");
        playNotification();
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

  return (
    <div
      className={`${
        isBreak ? "bg-blue-400 dark:bg-blue-900" : ""
      } flex h-screen select-none flex-col items-center justify-center gap-4 p-4 transition-colors duration-500`}
      onClick={() => {
        setIsGoalOpen(false);
      }}
    >
      <Timer isBreak={isBreak} formatTime={formatTime} time={time} />
      <div className="mb-4 flex gap-2">
        <button
          className={`relative flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 outline-none after:pointer-events-none after:absolute after:right-[115%] after:rounded after:bg-gray-900 after:p-2 after:text-xs after:text-slate-100 after:opacity-0 after:transition-opacity after:duration-300 hover:bg-gray-700 hover:after:opacity-100  dark:bg-slate-100 dark:after:bg-slate-100 dark:after:text-gray-900 dark:hover:bg-slate-300  sm:after:right-[130%] sm:after:text-base  ${
            isPaused
              ? "after:content-['Start/Resume']"
              : "after:content-['Stop']"
          }`}
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
        </button>
        <button
          className={`relative after:absolute ${
            isBreak
              ? "after:content-['Skip_Break']"
              : "after:content-['Reset_Timer']"
          } flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 outline-none after:pointer-events-none after:left-[115%] after:whitespace-nowrap after:rounded after:bg-gray-900 after:p-2 after:text-xs after:text-slate-100 after:opacity-0 after:transition-opacity after:duration-300 hover:bg-gray-700 hover:after:opacity-100  dark:bg-slate-100 dark:after:bg-slate-100 dark:after:text-gray-900 dark:hover:bg-slate-300  sm:after:left-[130%] sm:after:text-base `}
          onClick={() => {
            resetTimer();
          }}
        >
          {isBreak ? (
            <ArrowRightOnRectangleIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          ) : (
            <ArrowPathRoundedSquareIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="cursor-pointer rounded bg-gray-900 py-2 px-4 text-sm text-slate-100 transition-colors hover:bg-gray-700  dark:bg-slate-100 dark:text-gray-900 dark:hover:bg-slate-300  sm:text-base"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen((prev) => !prev);
          }}
        >
          Set Duration.
        </button>
      </div>

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
