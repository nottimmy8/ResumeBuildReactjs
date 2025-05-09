import  { useState } from "react";
import { LuCheck } from "react-icons/lu";

const TitleInput = ({ tittle, setTitle }) => {
  const [showInput, setShowInput] = useState(false);
    return <div className="">
        {showInput ? (<>
            <input
                type="text"
                placeholder="Resume title"
                className=""
                value={title}
                onChange={({ target }) => setTitle(target.value)} />
            <button className="">
                <LuCheck className="" />
            </button>
        </>
        )}
  </div>;
};

export default TitleInput;
