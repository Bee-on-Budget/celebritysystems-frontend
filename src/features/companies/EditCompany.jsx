import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input, showToast, FormsContainer } from "../../components";
import { getCompanyById, updateCompany } from "../../api/services/CompanyService";

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

  return (
    <FormsContainer
      title="Edit Company"
      onSubmit={handleSubmit}
      actionTitle="Save Changes"
      isLoading={loading}
    >
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        required
      />
      <Input
        label="Location (Google Maps Link)"
        name="location"
        type="url"
        placeholder="https://www.google.com/maps/place/..."
        value={form.location}
        onChange={handleChange}
        error={errors.location}
        required
      />
    </FormsContainer>
  );
};

export default EditCompany;


