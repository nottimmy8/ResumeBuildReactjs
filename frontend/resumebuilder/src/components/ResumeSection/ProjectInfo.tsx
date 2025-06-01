import { LuExternalLink, LuGithub } from "react-icons/lu";
import ActionLink from "./ActionLink";
interface ProjectProps {
  title: string;
  description: string;
  githubLink: string;
  liveDemoUrl: string;
  bgColor: string;
  isPreview?: boolean;
}

const ProjectInfo = ({
  title,
  description,
  githubLink,
  liveDemoUrl,
  bgColor,
  isPreview,
}: ProjectProps) => {
  return (
    <div className="mb-5">
      <h3
        className={`${
          isPreview ? "text-xs" : "text-base"
        } font-semibold text-gray-900`}
      >
        {title}{" "}
      </h3>
      <p className="text-sm text-gray-700 font-medium mt-1">{description} </p>
      <div className="flex items-center gap-3 mt-2">
        {githubLink && (
          <ActionLink icon={<LuGithub />} link={githubLink} bgColor={bgColor} />
        )}

        {liveDemoUrl && (
          <ActionLink
            icon={<LuExternalLink />}
            link={liveDemoUrl}
            bgColor={bgColor}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
