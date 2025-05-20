import Input from "../../../components/inputs/Input";

interface ContactInfoFormProps {
  contactData: {
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
  updateSection: (section: string, data: any) => void;
}

const ContactInfoForm = ({
  contactData,
  updateSection,
}: ContactInfoFormProps) => {
  return (
    <div className="px-5 pt-5">
      <h2 className=" text-lg font-semibold text-gray-900 ">
        {" "}
        Contact Information
      </h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 ">
          <Input
            label="Address"
            placeholder="Short Address"
            type="text"
            value={contactData.location || ""}
            onChange={({ target }) => updateSection("location", target.value)}
          />
        </div>
        <Input
          label="Email"
          placeholder="john@example.com"
          type="email"
          value={contactData.email || ""}
          onChange={({ target }) => updateSection("email", target.value)}
        />
        <Input
          label="Phone Number"
          placeholder="(123) 456-7890"
          type="text"
          value={contactData.phone || ""}
          onChange={({ target }) => updateSection("phone", target.value)}
        />
        <Input
          label="Linkedln"
          placeholder="https://www.linkedin.com/in/username"
          type="text"
          value={contactData.linkedin || ""}
          onChange={({ target }) => updateSection("linkedin", target.value)}
        />
        <Input
          label="Github"
          placeholder="https://www.github.com/in/username"
          type="text"
          value={contactData.github || ""}
          onChange={({ target }) => updateSection("github", target.value)}
        />
        <div className="col-span-2">
          {" "}
          <Input
            label="Portfolio / Website"
            placeholder="https://yourwebsite.com"
            type="text"
            value={contactData.website || ""}
            onChange={({ target }) => updateSection("website", target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm;
