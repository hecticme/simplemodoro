export function TimerDisplay({ isBreak, formatTime, time }) {
  return (
    <>
      <h3
        className={`text-center text-xl font-bold transition-transform duration-500 sm:text-2xl ${
          isBreak ? "scale-100" : "scale-0"
        } `}
      >
        💙 Take a break!
      </h3>
      <h1 className="text-6xl font-bold sm:text-7xl md:text-8xl">
        {formatTime(time.displayTime)}
      </h1>
    </>
  );
}
