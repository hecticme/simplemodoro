import {
  PlayIcon,
  PauseIcon,
  ArrowPathRoundedSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export function TimerControl({
  isPaused,
  setIsPaused,
  countdown,
  isBreak,
  resetTimer,
}) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        className={`relative flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-gray-900 outline-none after:pointer-events-none after:absolute after:right-[115%] after:rounded after:bg-gray-900 after:p-2 after:text-xs after:text-slate-100 after:opacity-0 after:transition-opacity after:duration-300 hover:bg-gray-700 hover:after:opacity-100  dark:bg-slate-100 dark:after:bg-slate-100 dark:after:text-gray-900 dark:hover:bg-slate-300  sm:after:right-[130%] sm:after:text-base  ${
          isPaused ? "after:content-['Start/Resume']" : "after:content-['Stop']"
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
  );
}
