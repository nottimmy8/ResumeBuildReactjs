import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

interface Props {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProfilePhotoSelector = ({
  image,
  setImage,
  preview,
  setPreview,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreview(preview);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-purple-500" />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-8 h-8 flex justify-center bg-linear-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          >
            <LuUpload className="" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl || ""}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
