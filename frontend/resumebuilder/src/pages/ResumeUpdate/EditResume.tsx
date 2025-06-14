import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TitleInput from "../../components/inputs/TitleInput";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../utils/axiosinstance";
import { AxiosResponse } from "axios";
import { API_PATHS } from "../../utils/apiPaths";
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
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
import toast from "react-hot-toast";
import {
  captureElementAsImage,
  dataURLtoFile,
  fixTailwindColors,
} from "../../utils/helper";
import Modal from "../../components/Modal";
import ThemeSelector from "../Home/Forms/ThemeSelector";

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
  colorPalette: string[];
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
  name: string;
  progress: number;
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
  skills: Skill[];
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

  const [openThemeSelector, setOpenThemeSelector] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<string>("profile-info");

  const [_progress, setProgress] = useState<number>(0);

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
      colorPalette: [],
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
    skills: [
      {
        name: "",
        progress: 0,
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

  const validateAndNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const errors: string[] = [];

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
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name?.trim())
            errors.push(`Skill name is required in skill ${index + 1}`);
          if (!progress || isNaN(progress) || progress < 1 || progress > 100)
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
          if (!year.trim())
            errors.push(`Year is required in certification ${index + 1}`);
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
        break;

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
      "certifications",
      "additionalInfo",
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
            skills={resumeData?.skills}
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
          template: {
            theme: resumeInfo.template?.theme || prevState?.template.theme,
            colorPalette: Array.isArray(resumeInfo.template?.colorPalette)
              ? resumeInfo.template.colorPalette
              : [],
          },
          profileInfo: resumeInfo.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo.contactInfo || prevState?.contactInfo,
          workExperience:
            resumeInfo.workExperience || prevState?.workExperience,
          education: resumeInfo.education || prevState?.educationInfo || [],
          skills: resumeInfo.skills || prevState?.skills || [],
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

  // const uploadResumeImages = async () => {
  //   try {
  //     setIsLoading(true);

  //     fixTailwindColors(resumeRef.current);
  //     const imgaeDataUrl = await captureElementAsImage(resumeRef.current);

  //     // Convert base64 to File
  //     const thumbnailFile = dataURLtoFile(
  //       imgaeDataUrl,
  //       `resume-${resumeId}.png`
  //     );

  //     const profileImageFile = resumeData.profileInfo.profileImg || null;

  //     const formData = new FormData();
  //     if (profileImageFile) formData.append("profileImage", profileImageFile);
  //     if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

  //     const uploadResponse = await axiosInstance.put(
  //       API_PATHS.RESUME.UPLOAD_IMAGES(resumeId!),
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  //     const { thumbnailLink, profilePreviewUrl } = uploadResponse.data;

  //     console.log("RESUME_DATA___", resumeData);

  //     // call the second API to update other resume data
  //     await uploadResumeDetails(thumbnailLink, profilePreviewUrl);

  //     toast.success("Resume updated successfully");
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("Error uploading resume images:", error);
  //     toast.error("Failed to upload resume images");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);
      if (!resumeId) {
        throw new Error("Resume ID is missing");
      }
      if (!resumeRef.current) {
        throw new Error("Resume element is not available");
      }

      console.log("Axios baseURL:", axiosInstance.defaults.baseURL); // Log base URL
      console.log("resumeId:", resumeId); // Log resumeId
      console.log("resumeRef.current:", resumeRef.current);
      fixTailwindColors(resumeRef.current);
      const imageDataUrl = await captureElementAsImage(resumeRef.current);
      console.log("imageDataUrl:", imageDataUrl);
      if (!imageDataUrl.startsWith("data:image/png")) {
        throw new Error("Invalid image data URL");
      }

      const thumbnailFile = dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );
      const profileImageFile = resumeData.profileInfo.profileImg || null;

      const formData = new FormData();
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      console.log("formData entries:", Array.from(formData.entries()));
      const url = `${axiosInstance.defaults.baseURL}${API_PATHS.IMAGE.UPLOAD_IMAGE}`;
      console.log("Full API URL:", url); // Log full URL

      const uploadResponse = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_IMAGE, // Use /api/auth/upload-image
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("uploadResponse:", uploadResponse.data);
      // Adjust response handling based on /api/auth/upload-image response format
      const { thumbnailLink, profilePreviewUrl } = uploadResponse.data; // Update if response differs

      await uploadResumeDetails(thumbnailLink || "", profilePreviewUrl || "");

      toast.success("Resume updated successfully");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading resume images:", error.message, error);
        toast.error(
          `Failed to upload resume images: ${
            (error as any).response?.data?.message || error.message
          }`
        );
        // Fallback: Save resume without images
        await uploadResumeDetails("", "");
        // toast.warn("Resume saved without images");
        navigate("/dashboard");
      } else {
        console.error("Error uploading resume images:", error);
        toast.error("Failed to upload resume images");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadResumeDetails = async (
    thumbnailLink: string,
    profilePreviewUrl: string
  ) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId!), {
        ...resumeData,
        thumbnailLink: thumbnailLink || "",
        profileInfo: {
          ...resumeData.profileInfo,
          profilePreviewUrl: profilePreviewUrl || "",
        },
      });
    } catch (err) {
      console.error("Error capturing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      if (!resumeId) {
        throw new Error("Resume ID is missing");
      }
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId!));
      toast.success("Resume Deleted Successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error capturing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
              <LuDownload className="text-[16px]" />
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

      <Modal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        title="Change Theme"
      >
        <div className="w-[90vw] h-[80vh] ">
          {/* <ThemeSelector
            selectedTheme={resumeData?.template}
            setSelectedTheme={(value) => {
              setResumeData((prevState) => ({
                ...prevState,
                template: value || prevState.template,
              }));
            }}
            resumeData={null}
            onClose={() => setOpenThemeSelector(false)}
          /> */}
          <ThemeSelector
            selectedTheme={resumeData.template}
            setSelectedTheme={(
              value: Template | null | ((prev: Template) => Template)
            ) =>
              setResumeData((prevState) => ({
                ...prevState,
                template:
                  typeof value === "function"
                    ? value(prevState.template)
                    : value || prevState.template,
              }))
            }
            resumeData={resumeData}
            onClose={() => setOpenThemeSelector(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText="Download"
        actionBtnIcon={<LuDownload className="text-[16px] " />}
        onActionClick={() => reactToPrintFn()}
      >
        <div ref={resumeDownloadRef} className="w-[90vw] h-[90vh] ">
          <RenderResume
            templateId={resumeData?.template?.theme || ""}
            resumeData={resumeData}
            colorPalette={resumeData?.template?.colorPalette || []}
            containerWidth={baseWidth}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EditResume;
