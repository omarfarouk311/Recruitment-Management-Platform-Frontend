import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  Upload,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  File,
  FileInput,
} from "lucide-react";
import Select from "react-select";
import { Country, City } from "country-state-city";
import PhoneInput, { Value } from "react-phone-number-input"; // Import Value type
import "react-phone-number-input/style.css"; // Import the styles

interface Experience {
  jobTitle: string;
  company: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    jobTitle: "",
    company: "",
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<Value>(); // Use Value type here

  // Fetch countries and cities dynamically
  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  // Fetch cities for the selected country in the experience form
  const [experienceCities, setExperienceCities] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (selectedCountry) {
      const countryCities =
        City.getCitiesOfCountry(selectedCountry.value) || [];
      setCities(
        countryCities.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      );
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (currentExperience.country) {
      const countryCities =
        City.getCitiesOfCountry(currentExperience.country) || [];
      setExperienceCities(
        countryCities.map((city) => ({
          value: city.name,
          label: city.name,
        }))
      );
    } else {
      setExperienceCities([]);
    }
  }, [currentExperience.country]);

  // Calculate progress based on filled sections
  React.useEffect(() => {
    let filled = 0;
    if (selectedSkills.length > 0) filled++;
    if (experiences.length > 0) filled++;
    if (gender) filled++;
    if (cvFile) filled++;
    if (profilePhoto) filled++;
    if (selectedCountry) filled++;
    if (selectedCity) filled++;
    if (phoneNumber) filled++;
    setProgress(Math.round((filled / 8) * 100));
  }, [
    selectedSkills,
    experiences,
    gender,
    cvFile,
    profilePhoto,
    selectedCountry,
    selectedCity,
    phoneNumber,
  ]);

  const handleAddSkill = () => {
    if (newSkill && !selectedSkills.includes(newSkill)) {
      setSelectedSkills([...selectedSkills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleAddExperience = () => {
    if (currentExperience.jobTitle && currentExperience.company) {
      setExperiences([...experiences, currentExperience]);
      setCurrentExperience({
        jobTitle: "",
        company: "",
        country: "",
        city: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setShowExperienceForm(false);
    }
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCvFile(event.target.files[0]);
    }
  };

  const handleProfilePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add profile setup logic here
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) {
      return (
        <img
          src="https://th.bing.com/th/id/OIP.ZpfRSZQmY7TTSOOGwZm1PAHaJS?w=162&h=203&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          alt="PDF Icon"
          className="w-10 h-10"
        />
      );
    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      return (
        <img
          src="https://cdn0.iconfinder.com/data/icons/logos-microsoft-office-365/128/Microsoft_Office_Mesa_de_trabajo_1-1024.png"
          alt="Word Icon"
          className="w-10 h-10"
        />
      );
    } else {
      return <FileInput className="w-10 h-10 text-gray-400" />; // Fallback for other file types
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-orange-500 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Complete your profile
            </h1>
            <p className="mt-2 text-gray-600">Tell us more about yourself</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 text-right">
              {progress}% Complete
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="flex items-center justify-center mb-20 gap-20">
                {" "}
                {/* Increased gap */}
                {/* Profile Photo Upload */}
                <div className="text-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                      {profilePhoto ? (
                        <img
                          src={URL.createObjectURL(profilePhoto)}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      id="profileUpload"
                      onChange={handleProfilePhotoUpload}
                      accept="image/*"
                    />
                    <label
                      htmlFor="profileUpload"
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-5 h-5" />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Upload Profile Photo
                  </p>
                </div>
                {/* CV Upload */}
                <div className="text-center relative">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                      {cvFile ? (
                        getFileIcon(cvFile.name)
                      ) : (
                        <FileText className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      id="cvUpload"
                      onChange={handleCvUpload}
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="cvUpload"
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-5 h-5" />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Upload CV</p>
                  {cvFile && (
                    <p className="text-sm text-gray-600 truncate w-32 absolute left-1/2 transform -translate-x-1/2 mt-2">
                      {cvFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Enter phone number"
                    className="react-phone-input w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <Input label="Date of Birth" type="date" required />
                {/* Country Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Select
                    options={countries}
                    value={selectedCountry}
                    onChange={(selectedOption) =>
                      setSelectedCountry(selectedOption)
                    }
                    placeholder="Select country"
                  />
                </div>
                {/* City Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Select
                    options={cities}
                    value={selectedCity}
                    onChange={(selectedOption) =>
                      setSelectedCity(selectedOption)
                    }
                    placeholder="Select city"
                    isDisabled={!selectedCountry}
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) =>
                        setGender(e.target.value as "male" | "female")
                      }
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) =>
                        setGender(e.target.value as "male" | "female")
                      }
                    />
                    <span className="ml-2">Female</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    label=""
                    placeholder="Add more skills"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-6 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Experience</h2>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{exp.jobTitle}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {exp.city}, {exp.country}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {showExperienceForm ? (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        value={currentExperience.jobTitle}
                        onChange={(e) =>
                          setCurrentExperience({
                            ...currentExperience,
                            jobTitle: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        label="Company Name"
                        value={currentExperience.company}
                        onChange={(e) =>
                          setCurrentExperience({
                            ...currentExperience,
                            company: e.target.value,
                          })
                        }
                        required
                      />
                      {/* Country Select for Experience */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <Select
                          options={countries}
                          value={countries.find(
                            (c) => c.value === currentExperience.country
                          )}
                          onChange={(selectedOption) =>
                            setCurrentExperience({
                              ...currentExperience,
                              country: selectedOption?.value || "",
                              city: "", // Reset city when country changes
                            })
                          }
                          placeholder="Select country"
                        />
                      </div>
                      {/* City Select for Experience */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <Select
                          options={experienceCities}
                          value={experienceCities.find(
                            (c) => c.value === currentExperience.city
                          )}
                          onChange={(selectedOption) =>
                            setCurrentExperience({
                              ...currentExperience,
                              city: selectedOption?.value || "",
                            })
                          }
                          placeholder="Select city"
                          isDisabled={!currentExperience.country}
                        />
                      </div>
                      <Input
                        label="Start Date"
                        type="date"
                        value={currentExperience.startDate}
                        onChange={(e) =>
                          setCurrentExperience({
                            ...currentExperience,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        label="End Date"
                        type="date"
                        value={currentExperience.endDate}
                        onChange={(e) =>
                          setCurrentExperience({
                            ...currentExperience,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        rows={4}
                        value={currentExperience.description}
                        onChange={(e) =>
                          setCurrentExperience({
                            ...currentExperience,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        onClick={() => setShowExperienceForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddExperience}>
                        Add Experience
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExperienceForm(true)}
                  >
                    Add New Experience
                  </Button>
                )}
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button type="submit" loading={loading}>
                Complete Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
