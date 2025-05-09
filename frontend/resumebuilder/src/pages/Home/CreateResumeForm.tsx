import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle Create Resume
  const handleCreateResume = async (e: any) => {
    e.preventDefault();

    if (!title) {
      setError("Resume title is required.");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });
      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`);
      }
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center ">
      <h3 className="text-lg font-semibold text-black">Create New Resume</h3>
      <p className="text-sm text-slate-700 mt-[5px] mb-3">
        Give your resume a title to get started. You can edit all details later.
      </p>
      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          label="Resume Title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Enter resume title"
          type="text"
        />
        {error && <p className=" text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
