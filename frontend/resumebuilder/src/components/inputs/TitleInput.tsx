import { useState } from "react";
import { LuCheck, LuPencil } from "react-icons/lu";

interface TitleInputProps {
  title: string;
  setTitle: (value: string) => void;
}

const TitleInput = ({ title, setTitle }: TitleInputProps) => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className=" flex items-center gap-3">
      {showInput ? (
        <>
          <input
            type="text"
            placeholder="Resume title"
            className="text-sm md:text-[17px] bg-transparent outline-none text-black font-semibold border-b border-gray-300 pb-1
                 "
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <button className="cursor-pointer">
            <LuCheck
              className="text-[16px] text-purple-600"
              onClick={() => setShowInput((prevState) => !prevState)}
            />
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-sm md:text-[17px] font-semibold ">{title} </h2>
          <button className="cursor-pointer">
            <LuPencil
              className="text-sm text-purple-600"
              onClick={() => setShowInput((prevState) => !prevState)}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleInput;
