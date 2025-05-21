import { LuPlus } from "react-icons/lu";
import Input from "../../../components/inputs/Input";

interface EducationProps {
  educationInfo: {
    institution: string;

    degree: string;

    startDate: string;
    endDate: string;
  }[];
  updateArrayItem: (
    index: number,
    field: keyof EducationProps["educationInfo"][number],
    value: string
  ) => void;
  addArrayItem: (item: EducationProps["educationInfo"][number]) => void;
  removeArrayItem: (index: number) => void;
}

const EducationDetailsForm = ({
  educationInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: EducationProps) => {
  return (
    <div className="px-5 pt-5">
      <h2 className=" text-lg font-semibold text-gray-900 ">Education</h2>
      <div className="mt-4 flex flex-col gap-4 mb-3">
        {educationInfo.map((education, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                placeholder="B.Tech in Computer Science"
                type="text"
                value={education.degree || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "degree", target.value)
                }
              />
              <Input
                label="Institution"
                placeholder="XYZ University"
                type="text"
                value={education.institution || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "institution", target.value)
                }
              />
              <Input
                label="Start Date"
                type="month"
                value={education.startDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "startDate", target.value)
                }
              />
              <Input
                label="End Date"
                type="month"
                value={education.endDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "endDate", target.value)
                }
              />
            </div>
            {educationInfo.length > 1 && (
              <button
                type="button"
                className=" absolute top-3 right-3 text-sm text-red-500 hover:underline"
                onClick={() => removeArrayItem(index)}
              >
                <LuPlus />
              </button>
            )}
          </div>
        ))}
        <button
          className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-semibold hover:bg-purple-200  cursor-pointer transition duration-200"
          onClick={() =>
            addArrayItem({
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <LuPlus />
          Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
