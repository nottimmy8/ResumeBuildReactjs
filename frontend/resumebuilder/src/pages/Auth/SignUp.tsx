import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";

interface Props {
  setCurrentPage: (page: "login" | "signup") => void;
}

const SignUp = ({ setCurrentPage }: Props) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    try {
      // Add your signup logic here (e.g., API call)
    } catch (error) {
      setError("An error occurred during signup");
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector
          image={profilePic}
          setImage={setProfilePic}
          preview={preview}
          setPreview={setPreview}
        />
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullName(e.target.value)
            }
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />
          <Input
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          SIGN UP
        </button>
        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
