import { useState } from "react";
import { CustomCheckbox, FormsContainer, showToast, Input } from "../../components";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../api/services/TicketService";

// FileInput Component
const FileInput = ({ name, label, value, onChange, error, accept }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-medium capitalize text-dark">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div
          className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white transition-colors ${
            isFocused
              ? "border-primary ring-1 ring-primary"
              : error
              ? "border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <span className="text-sm text-gray-500 truncate">
            {value ? value.name : "Choose file"}
          </span>
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {value && !error && (
          <p className="text-sm text-green-600 mt-1">
            File selected: {value.name}
          </p>
        )}
      </div>
    </div>
  );
};

const CreateReport = ({ ticketId }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: "",
    dateTime: "",
    defectsFound: "",
    solutionsProvided: "",
    checklist: {
      "Data Cables (Cat6/RJ45)": "X",
      "Power Cable": "OK",
      "Power Supplies": "X",
      "LED Modules": "OK",
      "Cooling Systems": "X",
      "Service Lights & Sockets": "OK",
      "Operating Computers": "OK",
      "Software": "X",
      "Power DBs": "X",
      "Media Converters": "OK",
      "Control Systems": "X",
      "Video Processors": "OK",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [solutionImage, setSolutionImage] = useState(null);

  const checklistItems = Object.keys(form.checklist);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setSolutionImage(files[0]);
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleCheckboxChange = (checklistItem) => {
    setForm((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [checklistItem]:
          prev.checklist[checklistItem] === "OK" ? "X" : "OK",
      },
    }));
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return "";
    const dateTime = new Date(`${dateString}T${timeString}`);
    return dateTime.toISOString();
  };

  
  const validateForm = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = "Date is required";
    if (!form.dateTime) newErrors.dateTime = "Time is required";
    if (!form.defectsFound.trim())
      newErrors.defectsFound = "Defects found is required";
    if (!form.solutionsProvided.trim())
      newErrors.solutionsProvided = "Solutions provided is required";
    if (!solutionImage) newErrors.solutionImage = "Solution image is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please fill in all required fields", "error");
      return;
    }

    const formData = new FormData();
    formData.append("date", form.date);
    formData.append("checklist", JSON.stringify(form.checklist));
    formData.append("date_time", formatDateTime(form.date, form.dateTime));
    formData.append("defects_found", form.defectsFound);
    formData.append("solutions_provided", form.solutionsProvided);
    if (solutionImage) {
      formData.append("solution_image", solutionImage);
    }

    setIsLoading(true);
    try {
      await createReport(ticketId, formData);
      showToast("Report created successfully", "success");
      setTimeout(() => navigate("/companies"), 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error creating report";
      showToast(errorMessage, "error");
      console.error("Error details:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormsContainer
      title={"Create Ticket Report"}
      actionTitle={"Create Report"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <Input
        label="Date"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <Input
        label="Time"
        name="dateTime"
        type="time"
        value={form.dateTime}
        onChange={handleChange}
        error={errors.dateTime}
        required
      />

      <div className="space-y-2 w-full">
        <label className="block text-sm font-medium text-dark">
          Defects Found <span className="text-red-500">*</span>
        </label>
        <textarea
          name="defectsFound"
          value={form.defectsFound}
          onChange={handleChange}
          placeholder="Enter defects found"
          className={`w-full min-w-0 px-3 py-2 border rounded-md shadow-sm resize-none transition-colors focus:outline-none ${
            errors.defectsFound
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
          }`}
          rows={3}
        />
        {errors.defectsFound && (
          <p className="text-sm text-red-600">{errors.defectsFound}</p>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-dark">Check List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checklistItems.map((item) => (
            <CustomCheckbox
              key={item}
              label={item}
              checked={form.checklist[item] === "OK"}
              onChange={() => handleCheckboxChange(item)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 w-full">
        <label className="block text-sm font-medium text-dark">
          Solutions Provided <span className="text-red-500">*</span>
        </label>
        <textarea
          name="solutionsProvided"
          value={form.solutionsProvided}
          onChange={handleChange}
          placeholder="Enter solutions provided"
          className={`w-full min-w-0 px-3 py-2 border rounded-md shadow-sm resize-none transition-colors focus:outline-none ${
            errors.solutionsProvided
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
          }`}
          rows={3}
        />
        {errors.solutionsProvided && (
          <p className="text-sm text-red-600">{errors.solutionsProvided}</p>
        )}
      </div>

      <FileInput
        name="solutionImage"
        label="Solution Image"
        value={solutionImage}
        onChange={handleFileChange}
        error={errors.solutionImage}
        accept="image/*"
      />
    </FormsContainer>
  );
};

export default CreateReport;
