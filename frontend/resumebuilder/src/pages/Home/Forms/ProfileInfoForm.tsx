import ProfilePhotoSelector from "../../../components/inputs/ProfilePhotoSelector";
import Input from "../../../components/inputs/Input";

interface ProfileInfoFormProps {
  profileData: {
    profileImg: File | null;
    profilePreview: string;
    profilePreviewUrl: string;
    fullName: string;
    designation: string;
    summary: string;
  };
  updateSection: (section: string, data: any) => void;
  // onNext: () => void;
}
const ProfileInfoForm = ({
  profileData,
  updateSection,
}: // onNext,
ProfileInfoFormProps) => {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h2>
      <div className="mt-4">
        <ProfilePhotoSelector
          image={profileData?.profileImg}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreview", value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
            label=" Full Name"
            placeholder="John"
            type="text"
          />
          <Input
            value={profileData.designation || ""}
            onChange={({ target }) =>
              updateSection("designation", target.value)
            }
            label="Designation"
            placeholder="UI Designer"
            type="text"
          />
          <div className="col-span-2 mt-3">
            <label className="text-xs font-medium text-slate-600">
              Summary
            </label>
            <textarea
              placeholder="Short Introduction"
              className="form-input"
              rows={4}
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm;
