import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import hero from "../../src/assets/heroimg.png";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProileInfoCard from "../components/Cards/ProileInfoCard";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<"login" | "signup">("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <div className="w-full min-h-full bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-xl font-bold ">Resume Builder</div>
          {user ? (
            <ProileInfoCard />
          ) : (
            <Button
              variant="secondary"
              rounded="lg"
              size="sm"
              onClick={() => setOpenAuthModal(true)}
            >
              Login / SignUp
            </Button>
          )}
        </div>
        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Build Your{" "}
              <span className="gradient-text animate-text-shine">
                Resume Effortlessly
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Craft a standout resume in minures with our smart and intultive
              resume builder
            </p>
            <Button
              onClick={() => handleCTA()}
              variant="primary"
              className="font-semibold  px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              size="lg"
            >
              Get Started
            </Button>
          </div>
          <div className="w-full md:w-1/2">
            <img src={hero} alt="" className="w-full rounded-lg" />
          </div>
        </div>

        <section className="mt-5">
          <h2 className="text-2xl font-bold text-center mb-12">
            Features That Have You Shine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition ">
              <h3 className="text-lg font-semibold mb-5">Easy Editing</h3>
              <p className=" text-gray-600">
                Update your resume section with live preview and instant
                formailing.
              </p>
            </div>
            <div className=" bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className=" text-lg font-semibold mb-3">
                Beautiful Templates
              </h3>
              <p className="text-gray-600">
                Choose from modern, professional templates that are easy to
                customize
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-3">One-Click Export</h3>
              <p className="text-gray-600">
                Download your resume instantly on a high-quanlity PDF with one
                click.
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5 ">
        Made with Love...Happy Coding
      </div>
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
