import { useEffect, useRef, useState } from "react";
import { getGoal, getProgress, getTime, formatTime } from "../functions";

export function useTimer() {
  // Daily goal display states.
  const [goal, setGoal] = useState(getGoal());
  const [progress, setProgress] = useState(getProgress());
  // Timer states.
  const [isPaused, setIsPaused] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(getTime());
  // Sound ref.
  const notificationSound = useRef(new Audio("./notification-sound.mp3"));
  // RefId for intervals.
  const cdInterval = useRef(null);

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

  // Update progress every time progress changes.
  //   useEffect(() => {
  //     localStorage.setItem(
  //       "progress",
  //       JSON.stringify({
  //         createdTime: new Date().getTime(),
  //         progress,
  //       })
  //     );
  //   }, [progress]);

  // Timer.
  function timer() {
    cdInterval.current = setInterval(() => {
      setTime((prev) => {
        return {
          ...prev,
          displayTime: prev.displayTime - 1,
        };
      });
    }, 1000);
  }

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

  // Countdown logic when pressing pause button.
  function countdown() {
    if (!isBreak && isPaused) {
      timer();
    } else {
      clearInterval(cdInterval.current);
    }
  }

  // Reset and skip function
  function resetTimer() {
    setTime((prev) => {
      return {
        ...prev,
        displayTime: prev.sessionTime,
      };
    });
    clearInterval(cdInterval.current);
    setIsPaused(true);
    setIsBreak(false);
    document.title = "Simple Pomodoro";
    changeDocumentIcon("");
  }

  // Change page title dynamically.
  useEffect(() => {
    if (!isPaused && !isBreak) {
      document.title = `${formatTime(time.displayTime)} Focusing!`;
    } else if (!isPaused && isBreak) {
      document.title = `${formatTime(time.displayTime)} Take a break!`;
      changeDocumentIcon("-break");
    }
  }, [time.displayTime]);

  // Change to break time when session timer hits zero and vice versa.
  useEffect(() => {
    if (time.displayTime < 0) {
      if (!isBreak) {
        setTime((prev) => ({
          ...prev,
          displayTime: prev.breakTime,
        }));
        setIsBreak(true);
        clearInterval(cdInterval.current);
        timer();
        playNotification();
      } else {
        setTime((prev) => ({
          ...prev,
          displayTime: prev.sessionTime,
        }));
        setIsBreak(false);
        setIsPaused(true);
        clearInterval(cdInterval.current);
        document.title = "Simple Pomodoro";
        changeDocumentIcon("");
        playNotification();
      }
    }
  }, [time.displayTime]);

  return {
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
  };
}
