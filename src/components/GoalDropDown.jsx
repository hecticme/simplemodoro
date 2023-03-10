export function GoalDropDown({ isGoalOpen, goal, setGoal }) {
  const handleChange = (e) => {
    if (e.target.value > 16) {
      setGoal(16);
      localStorage.setItem("goal", 16);
    } else if (e.target.value < 0) {
      setGoal(0.5);
      localStorage.setItem("goal", 0.5);
    } else {
      setGoal(e.target.value);
      localStorage.setItem("goal", e.target.value);
    }
  };

  return (
    <div
      className={`absolute top-[120%] right-0 z-10 h-auto w-36 rounded bg-gray-900 p-2 text-sm dark:bg-slate-300 sm:w-40 sm:p-3 sm:text-base ${
        isGoalOpen ? "block" : "hidden"
      }`}
      onClick={(e) => {
        // Make drop-down menu not close when click on itself.
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col justify-center gap-2 ">
        <label
          htmlFor="goal"
          className="text-sm text-slate-100 dark:text-gray-900 sm:text-base"
        >
          Set your goal for the day!
        </label>
        <input
          type="number"
          name="goal"
          id="goal"
          max="16"
          min="0.5"
          step="0.25"
          value={goal}
          onChange={(e) => {
            handleChange(e);
          }}
          className="rounded-sm bg-slate-100 px-2 py-1 text-gray-900 dark:bg-gray-900 dark:text-slate-100"
        />
      </div>
    </div>
  );
}
