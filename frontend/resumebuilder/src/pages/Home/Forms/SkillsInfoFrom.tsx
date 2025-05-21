import { LuPlus, LuTrash2 } from "react-icons/lu";
import Input from "../../../components/inputs/Input";

interface skillsProps {
  skillsInfo: {
    name: string;
    progress: number;
  }[];
  updateArrayItem: (
    index: number,
    field: keyof skillsProps["skillsInfo"][number],
    value: string
  ) => void;
  addArrayItem: (item: skillsProps["skillsInfo"][number]) => void;
  removeArrayItem: (index: number) => void;
}
const SkillsInfoFrom = ({
  skillsInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: skillsProps) => {
  return (
    <div className="">
      <h2 className="">Skills</h2>

      <div className="">
        {skillsInfo.map((skill, index) => (
          <div key={index} className="">
            <div className="">
              <Input
                label="Skill Name"
                placeholder="javaScript"
                type="text"
                value={skill.name || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "name", target.value)
                }
              />
              <div className="">
                <label className="">
                  Proficiency ({skill.progress / 20 || 0}/5)
                </label>
                <div className=""></div>
              </div>
            </div>
            {skillsInfo.length > 1 && (
              <button
                type="button"
                className=""
                onClick={() => removeArrayItem(index)}
              >
                <LuTrash2 />
              </button>
            )}
          </div>
        ))}
        <button
          className=""
          onClick={() =>
            addArrayItem({
              name: "",
              progress: 0,
            })
          }
        >
          <LuPlus /> Add Skill
        </button>
      </div>
    </div>
  );
};

export default SkillsInfoFrom;
