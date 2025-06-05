export const BASE_URL = "https://resume-build-reactjs-ms1v.vercel.app";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },

  RESUME: {
    CREATE: "/api/resume", // POST - Create a new resumes
    GET_ALL: "/api/resume", // GET - GET all resumes of logged-in-user
    GET_BY_ID: (id: string) => `/api/resume/${id}`, // GET - GET a specific resumes
    UPDATE: (id: string) => `/api/resume/${id}`, // PUT - Update a resume
    DELETE: (id: string) => `/api/resume/${id}`, // DELETE - Delete a resume
    UPLOAD_IMAGES: (id: string) => `/api/resume/${id}/images`, //PUT - Upload Thumbnail and Resume profile
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
