import { useState } from "react";
import { Modal } from "./Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="flex h-screen flex-col items-center justify-center gap-4"
      onClick={() => {
        setIsModalOpen((prev) => !prev);
      }}
    >
      <h1 className="text-8xl font-bold">25:00</h1>
      <div className="h-2 w-[20%] rounded-full bg-gray-300">
        <div className="h-2 w-[10%] rounded-full bg-gray-800"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div
          className="cursor-pointer rounded bg-gray-900 py-2 px-4 text-white transition-colors hover:bg-gray-700 hover:shadow-md hover:shadow-slate-300"
          onClick={() => {
            e.stopPropagation();
            setIsModalOpen((prev) => !prev);
          }}
        >
          Choose Duration.
        </div>
      </div>
      <Modal isModalOpen={isModalOpen} />
    </div>
  );
}

export default App;
