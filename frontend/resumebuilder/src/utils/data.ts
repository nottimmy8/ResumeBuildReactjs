import TEMPLATE_ONE_IMG from "../assets/image.jpg";
import TEMPLATE_TWO_IMG from "../assets/imgg.png";

export const resumeTemplates = [
  {
    id: "01",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeOne",
  },
  {
    id: "02",
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: "themeTwo",
  },
  {
    id: "03",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeThree",
  },
];

export const themeColorPalette = {
  themeOne: [
    ["EBFDFF", "#A1FAFD", "#CEFAFE", "#00BBDB", "#4A5565"],

    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5F4FF", "#E8DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CFS", "#2D3748"],

    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
    ["#FFF7F0", "#FFE6D9", "#FFD2BA", "#FF9561", "#4C4743"],
    ["#F9FCFF", "#E3F0F9", "#C0DDEE", "#6CA6CF", "#46545E"],
    ["#FFFDF6", "#FFF4D7", "#FFE7A0", "#FFD000", "#57534E"],
    ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],

    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
    ["#E3F2FD", "#90CAF9", "#aBd2f4", "#1EBBE5", "#0D47A1"],
  ],
};

export const DUMMY_RESUME_DATA = {
  profileInfo: {
    profileImg: null,
    previewUrl: "",
    fullName: "John Doe",
    designation: "Senior Software Engineer",
    summary:
      "Passionate developer with 3+ years of experience building responsive web applications using React and TypeScript. ",
  },
  contactInfo: {
    email: "jane.doe@example.com",
    phone: "1234567890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/janedoe",
    github: "github.com/janedoe",
    website: "janedoe.dev",
  },
  workExperience: [
    {
      company: "Tech Solutions Inc.",
      role: "Frontend Developer",
      startDate: "2022-01",
      endDate: "2024-05",
      description:
        "Developed and maintained web applications using React, Redux, and TypeScript. Collaborated with designers and backend developers to deliver high-quality products.",
    },
  ],
  educationInfo: [
    {
      degree: "B.Sc. Computer Science",
      institution: "University of California, Berkeley",
      startDate: "2018-09",
      endDate: "2022-06",
    },
  ],
  skills: [
    {
      name: "JavaScript",
      progress: 90,
    },
    {
      name: "React",
      progress: 85,
    },
    {
      name: "TypeScript",
      progress: 80,
    },
  ],
  projects: [
    {
      title: "Portfolio Website",
      description:
        "A personal portfolio website to showcase my projects and skills.",
      github: "github.com/janedoe/portfolio",
      liveDemo: "https://janedoe.dev",
    },
  ],
  certification: [
    {
      title: "Certified React Developer",
      issuer: "Meta",
      year: "2023",
    },
  ],
  languages: [
    {
      name: "English",
      progress: 100,
    },
    {
      name: "Spanish",
      progress: 70,
    },
  ],
  intrests: ["Reading", "Open Source Contribution", "Hiking"],
};
