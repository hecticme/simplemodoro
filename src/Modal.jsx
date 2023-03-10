import { XMarkIcon } from "@heroicons/react/24/solid";

export function Modal({ isModalOpen, setIsModalOpen, time, setTime }) {
  function handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    // Revert to maximum number if the value exceed that.
    if (name == "sessionTime" && value > 240) {
      setTime((prev) => {
        return {
          ...prev,
          [name]: 240 * 60,
        };
      });
      localStorage.setItem(`${name}`, 240 * 60);
    } else if (name == "breakTime" && value > 30) {
      setTime((prev) => {
        return {
          ...prev,
          [name]: 30 * 60,
        };
      });
      localStorage.setItem(`${name}`, 30 * 60);
    } else {
      // Else set the value normally.
      setTime((prev) => {
        return {
          ...prev,
          [name]: value * 60,
        };
      });
      localStorage.setItem(`${name}`, value * 60);
    }
  }

  return (
    <div
      className={`fixed ${
        isModalOpen ? "scale-100" : "scale-0"
      } flex h-[70%] w-[90%] flex-col items-center justify-center gap-6 rounded-md bg-slate-900 text-slate-100 transition-transform duration-300 sm:w-[70%] xl:w-1/2`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="absolute top-2 right-2 aspect-square h-6 cursor-pointer rounded-full bg-slate-200 transition-transform hover:scale-110 hover:bg-slate-100"
        onClick={() => {
          setIsModalOpen(false);
        }}
      >
        <XMarkIcon className="scale-75 text-gray-900" />
      </div>
      <h1 className="text-xl font-bold sm:text-2xl">Set your timer</h1>
      <div className="flex w-[70%] flex-col gap-4">
        <label htmlFor="sessionTime" className="text-sm sm:text-base">
          Session Time (minutes)
        </label>
        <input
          type="number"
          id="sessionTime"
          name="sessionTime"
          min="10"
          max="240"
          step="5"
          value={(time.sessionTime / 60).toString()}
          className="w-full rounded bg-slate-100 p-1 text-sm text-gray-900 sm:p-2 sm:text-base"
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </div>
      <div className="flex w-[70%] flex-col gap-4">
        <label htmlFor="breakTime" className="text-sm sm:text-base">
          Break Time (minutes)
        </label>
        <input
          type="number"
          id="breakTime"
          name="breakTime"
          min="5"
          max="30"
          step="1"
          value={(time.breakTime / 60).toString()}
          className="w-full rounded bg-slate-100 p-1 text-sm text-gray-900 sm:p-2 sm:text-base"
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </div>
    </div>
  );
}
