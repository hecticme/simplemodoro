import { useState, useEffect } from "react";
import { GoalDropDown } from "./GoalDropDown";
import { PencilIcon } from "@heroicons/react/24/solid";

export function GoalDisplay({
  isBreak,
  progress,
  goal,
  isGoalOpen,
  setGoal,
  setIsGoalOpen,
}) {
  const [isGoalAchieved, setIsGoalAchieved] = useState(getIsGoalAchieved());

  function getIsGoalAchieved() {
    if (progress / (goal * 3600) >= 1) {
      return true;
    } else {
      return false;
    }
  }

  // Change state, styles when goal is achieved.
  useEffect(() => {
    if (progress / (goal * 3600) >= 1) {
      setIsGoalAchieved(true);
    } else {
      setIsGoalAchieved(false);
    }
  }, [progress, goal]);

  const formatGoal = (goal) => {
    const goalInHour = goal * 60;
    const hour = Math.floor(goalInHour / 60);
    const minute = goalInHour % 60;
    return `${hour != 0 ? `${hour} hour${hour > 1 ? "s" : ""}` : ""} ${
      minute != 0 ? `${minute} minute${minute > 1 ? "s" : ""}` : ""
    }`;
  };

  return (
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
        <div className="relative flex flex-col gap-2 ">
          <button
            className="flex aspect-square w-6 cursor-pointer items-center justify-center rounded bg-gray-900 hover:bg-gray-700 dark:bg-slate-100 dark:hover:bg-slate-300"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsGoalOpen((prev) => !prev);
            }}
          >
            <PencilIcon className="w-1/2 text-slate-100 dark:text-gray-900" />
          </button>
          <GoalDropDown isGoalOpen={isGoalOpen} goal={goal} setGoal={setGoal} />
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
  );
}
