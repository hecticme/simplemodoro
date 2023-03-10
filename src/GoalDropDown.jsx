export function GoalDropDownn({ isGoalOpen, goal, setGoal }) {
  const handleChange = (e) => {
    if (e.target.value > 16) {
      setGoal(16);
      localStorage.setItem("goal", 16);
    } else {
      setGoal(e.target.value);
      localStorage.setItem("goal", e.target.value);
    }
  };

  return (
    <div
      className={`absolute top-[120%] right-0 h-24 w-32 rounded bg-gray-900 text-sm shadow-md shadow-slate-700 sm:h-28 sm:w-40 sm:text-base ${
        isGoalOpen ? "block" : "hidden"
      }`}
      onClick={(e) => {
        // Make drop-down menu not close when click on itself.
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col justify-center gap-2 px-3 py-2">
        <label htmlFor="goal" className=" text-slate-100">
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
          className="rounded-sm bg-slate-100 px-2 py-1 text-gray-900"
        />
      </div>
    </div>
  );
}
