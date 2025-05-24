import { useState } from "react";
import DropdownInput from "../../components/DropdownInput";
import Input from "../../components/Input";
import Button from "../../components/Button";

const TestPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        country: ""
    });
    const [errors, setErrors] = useState({});

    const countries = [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "uk", label: "United Kingdom" }
    ];

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.country) {
            newErrors.country = "Please select a country";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            // Form is valid, proceed with submission
            console.log("Form submitted:", formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing/selecting
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <Input
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
            />

            <DropdownInput
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                options={countries}
                required
                error={errors.country}
            />

            <Button type="submit">
                Submit
            </Button>
        </form>
    );
};

export default TestPage;