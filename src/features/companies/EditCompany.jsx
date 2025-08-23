import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input, showToast } from "../../components";
import { getCompanyById, updateCompany } from "../../api/services/CompanyService";
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const initialCompany = location.state?.company || null;

  const [form, setForm] = useState({
    name: initialCompany?.name || "",
    email: initialCompany?.email || "",
    phone: initialCompany?.phone || "",
    location: initialCompany?.location || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!initialCompany && id) {
        try {
          setLoading(true);
          const data = await getCompanyById(id);
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
          });
        } catch (err) {
          showToast(err.message || "Failed to load company", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
    const mapsUrlRegex = /^https?:\/\/(www\.)?(google\.)?maps\./i;

    if (!form.name.trim()) newErrors.name = "Company name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(form.phone)) newErrors.phone = "Please enter a valid phone number";

    if (!form.location.trim()) newErrors.location = "Location is required";
    else if (!mapsUrlRegex.test(form.location)) newErrors.location = "Please enter a valid Google Maps link";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await updateCompany(id, form);
      showToast("Company updated successfully", "success");
      setTimeout(() => navigate(`/companies/${id}`), 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error updating company";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile-friendly header with back button */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="mr-3 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FaBuilding className="text-blue-600 hidden sm:inline" />
                Edit Company
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Update company information and details
              </p>
            </div>
          </div>
        </div>

        {/* Responsive form container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 lg:p-8">
            
            {/* Desktop back button */}
            <div className="hidden lg:block mb-6">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to Company Details
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              
              {/* Form fields grid - responsive layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                
                {/* Company Name - Full width on all screens */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400 text-sm" />
                    </div>
                    <Input
                      label="Company Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                      className="pl-10"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 text-sm" />
                    </div>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                      className="pl-10"
                      placeholder="company@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400 text-sm" />
                    </div>
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      required
                      className="pl-10"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Location - Full width */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400 text-sm" />
                    </div>
                    <Input
                      label="Location (Google Maps Link)"
                      name="location"
                      type="url"
                      placeholder="https://www.google.com/maps/place/..."
                      value={form.location}
                      onChange={handleChange}
                      error={errors.location}
                      required
                      className="pl-10"
                    />
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500">
                    Paste a Google Maps link to help customers find your location
                  </p>
                </div>
              </div>

              {/* Action buttons - Responsive layout */}
              <div className="border-t border-gray-200 pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile bottom spacing */}
        <div className="h-6 sm:hidden"></div>
      </div>
    </div>
  );
};

export default EditCompany;