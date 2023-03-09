export function Modal({ isModalOpen }) {
  return (
    <div
      className={`fixed ${
        isModalOpen ? "flex" : "hidden"
      } h-[70%] w-1/2 items-center justify-center rounded-md bg-slate-900`}
    >
      <h1>Set your timer</h1>
    </div>
  );
}
