import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TitleInput from "../../components/inputs/TitleInput";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../utils/axiosinstance";
import axios, { AxiosResponse } from "axios";
import { API_PATHS } from "../../utils/apiPaths";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuPalette,
  LuSave,
  LuTrash,
} from "react-icons/lu";
import StepProgress from "../../components/StepProgress";
import ProfileInfoForm from "../Home/Forms/ProfileInfoForm";
import ContactInfoForm from "../Home/Forms/ContactInfoForm";
import WorkExperienceForm from "../Home/Forms/WorkExperienceForm";
import EducationDetailsForm from "../Home/Forms/EducationDetailsForm";
import SkillsInfoFrom from "../Home/Forms/SkillsInfoFrom";
import ProjectsDetailForm from "../Home/Forms/ProjectsDetailForm";
import CertificationForm from "../Home/Forms/CertificationForm";
import AdditionalInfoForm from "../Home/Forms/AdditionalInfoForm";
import RenderResume from "../../components/ResumeTemplate/RenderResume";

interface ProfileInfo {
  profileImg: File | null;
  profilePreviewUrl: string;
  profilePreview: string;
  fullName: string;
  designation: string;
  summary: string;
}

interface Template {
  theme: string;
  colorPalette: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  name: string | null;
  progress: string;
}

interface Project {
  title: string;
  description: string;
  github: string;
  liveDemo: string;
}

interface Certification {
  title: string;
  issuer: string;
  year: string;
}

interface Language {
  name: string;
  progress: number;
}

interface ResumeData {
  title: string;
  thumbnailLink: string;
  profileInfo: ProfileInfo;
  template: Template;
  contactInfo: ContactInfo;
  workExperience: WorkExperience[];
  educationInfo: Education[];
  skillsInfo: Skill[];
  projects: Project[];
  certification: Certification[];
  languages: Language[];
  interests: string[];
  [key: string]: any; // Add index signature to allow string indexing
}

// interface APIPaths {
//   RESUME: {
//     GET_BY_ID: (id: string) => string;
//   };
// }

// const API_PATHS: APIPaths = {
//   RESUME: {
//     GET_BY_ID: (id: string) => `/api/resumes/${id}`,
//   },
// };

const EditResume = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();

  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeDownloadRef = useRef<HTMLDivElement>(null);

  const [baseWidth, setBaseWidth] = useState<number>(800);

  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>("profile-info");
  const [progress, setProgress] = useState<number>(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreview: "",
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ],
    educationInfo: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skillsInfo: [
      {
        name: null,
        progress: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certification: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateAndNext = (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();
    const errors: string[] = [];
    // const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("A valid email is required.");
        if (!phone.trim())
          errors.push("A valid 10-digit phone number is required.");

        break;

      case "work-experience":
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company.trim())
              errors.push(`Company is required in experience ${index + 1}`);
            if (!role.trim())
              errors.push(`Role is required in experience ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in experience ${index + 1}`
              );
          }
        );
        break;

      case "education-info":
        resumeData.educationInfo.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree?.trim())
              errors.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in education ${index + 1}`
              );
          }
        );
        break;

      case "skills":
        resumeData.skillsInfo.forEach(({ name, progress }, index) => {
          if (!name?.trim())
            errors.push(`Skill name is required in skill ${index + 1}`);
          if (
            !progress ||
            isNaN(parseInt(progress)) ||
            parseInt(progress) < 1 ||
            parseInt(progress) > 100
          )
            errors.push(
              `Skill progress must be between 1 and 100  in skill ${index + 1}`
            );
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project title is required in project ${index + 1}`);
          if (!description.trim())
            errors.push(
              `Project description is required in project ${index + 1}`
            );
        });
        break;

      case "certifications":
        resumeData.certification.forEach(({ title, issuer, year }, index) => {
          if (!title.trim())
            errors.push(
              `Certification title is required in certification ${index + 1}`
            );
          if (!issuer.trim())
            errors.push(`Issuer is required in certification ${index + 1}`);
          // if (!year.trim())
          //   errors.push(`Year is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }

        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required");
        }

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    // move to next step
    setErrorMsg(""); // Clear errors if validation passes
    goToNextStep(); // Proceed to the next step
  };

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "skills",
      "education-info",
      "work-experience",
      "contact-info",
      "projects",
      "additionalInfo",
      "certifications",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);
      // Set progress as percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const pages = [
      "profile-info",
      "skills",
      "education-info",
      "work-experience",
      "contact-info",
      "projects",
      "additionalInfo",
      "certifications",
    ];

    if (currentPage === "profile-info") navigate("/dashboard");
    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      // Update progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            // onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactData={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
            // onNext={validateAndNext}
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.educationInfo}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("educationInfo", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("educationInfo", newItem)}
            removeArrayItem={(index) => removeArrayItem("educationInfo", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoFrom
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectsDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationForm
            certificationInfo={resumeData?.certification}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certification", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certification", newItem)}
            removeArrayItem={(index) => removeArrayItem("certification", index)}
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) => {
              updateArrayItem(section, index, key, value);
            }}
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) =>
              removeArrayItem(section, index)
            }
          />
        );
      default:
        return null;
    }
  };

  const updateSection = (section: string, key: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateArrayItem = (
    section: string,
    index: number,
    key: string | null,
    value: any
  ) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      if (key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  const addArrayItem = (section: string, newItem: any) => {
    setResumeData((prev) => {
      if (!Array.isArray(prev[section])) {
        console.error(`Error: ${section} is not an array in resumeData`);
        return prev; // Return unchanged state to avoid crashing
      }
      return {
        ...prev,
        [section]: [...prev[section], newItem],
      };
    });
  };

  const removeArrayItem = (section: string, index: number) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  const fetchResumeDetailsById = async () => {
    if (!resumeId) {
      setErrorMsg("Resume ID is missing");
      return;
    }
    try {
      const response: AxiosResponse<ResumeData> = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );
      if (response.data && response.data.profileInfo) {
        const resumeInfo: ResumeData = response.data;
        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo.title || "Untitled",
          template: resumeInfo.template || prevState?.template,
          profileInfo: resumeInfo.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo.contactInfo || prevState?.contactInfo,
          workExperience:
            resumeInfo.workExperience || prevState?.workExperience,
          education: resumeInfo.education || prevState?.educationInfo || [],
          skills: resumeInfo.skills || prevState?.skillsInfo || [],
          projects: resumeInfo.projects || prevState?.projects,
          certification:
            resumeInfo.certification || prevState?.certification || [],
          languages: resumeInfo.languages || prevState?.languages,
          interests: resumeInfo.interests || prevState?.interests,
        }));
      }
    } catch (error) {
      console.error("Error fetching resume details:", error);
    }
  };

  const uploadResumeImages = async () => {};

  const uploadResumeDetails = async (
    thumbnailLink: string,
    profilePreviewUrl: string
  ) => {};

  const handleDeleteResume = async () => {};

  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef });

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    if (resumeId) {
      fetchResumeDetailsById();
    }
    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, [resumeId]);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4 ">
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />
          <div className="flex items-center gap-4">
            <button
              className="btn-small-light"
              onClick={() => setOpenThemeSelector(true)}
            >
              <LuPalette className="text-[16px] " />
              <span className="hidden md:block">Change Theme</span>
            </button>

            <button className="btn-small-light" onClick={handleDeleteResume}>
              <LuTrash className="text-[16px] " />
              <span className="hidden md:block">Delete</span>
            </button>

            <button
              className="btn-small-light"
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuPalette className="text-[16px]" />
              <span className="hidden md:block">Preview & Download</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
            <StepProgress progress={50} />
            {renderForm()}
            <div className="mx-5">
              {errorMsg && (
                <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded">
                  <LuCircleAlert className="text-md" />
                  {errorMsg}
                </div>
              )}
              <div className="flex items-end justify-end gap-3 mt-3 mb-5">
                <button
                  className="btn-small-light"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <LuArrowLeft className="text-[16px] " />
                  Back
                </button>
                <button
                  className=" btn-small-light"
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  <LuSave className="text-[16px]" />
                  {isLoading ? "Updating..." : "Save & Exit"}
                </button>
                <button
                  className="btn-small"
                  onClick={(e) => validateAndNext(e)}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}{" "}
                  {currentPage !== "additionalInfo" && (
                    <LuArrowLeft className="text-16px rotate-180 " />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div ref={resumeRef} className="">
            {/* Resume Template */}

            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || []}
              containerWidth={baseWidth}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditResume;
