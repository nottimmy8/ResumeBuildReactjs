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

interface ProfileInfo {
  profileImg: File | null;
  profilePreviewUrl: string | null;
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
  degree: string | null;
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
  education: Education[];
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
  const [currentPage, setCurrentPage] = useState<string>("contact-info");
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
      website: "",
    },
    workExperience: [
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ],
    education: [
      {
        degree: null,
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
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

  const validateAndNext = (e: React.FormEvent<HTMLFormElement>) => {};
  const goToNextStep = () => {};
  const goBack = () => {};
  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactData={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
            onNext={validateAndNext}
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

  const updateArrayItem = () => {};

  const addArrayItem = () => {};

  const removeArrayItem = () => {};

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
          education: resumeInfo.education || prevState?.education,
          skills: resumeInfo.skills || prevState?.skills,
          projects: resumeInfo.projects || prevState?.projects,
          certification: resumeInfo.certification || prevState?.certification,
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
  const updateBaseWidth = () => {};

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
                  onClick={validateAndNext}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditResume;
