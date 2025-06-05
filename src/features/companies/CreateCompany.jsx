import React, { useState } from "react";
import { createCompany } from "./CompanyService";
import { Button, Input, showToast, FormsContainer } from "../../components";

const CreateCompany = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(form);
        try {
            await createCompany(form);
            showToast("Company created successfully");
            setForm({ name: "", email: "", phone: "", location: "" });
        } catch (err) {
            showToast("Error creating company", "error");
        }
        setLoading(false);
    };

    return (
        <FormsContainer>
            <h1 className="text-2xl font-semibold mb-4">Create New Company</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Name" id="name" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Input label="Phone" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                <Input label="Location" id="location" name="location" value={form.location} onChange={handleChange} required />
                <Button isLoading={loading} type="submit">Create Company</Button>
            </form>
        </FormsContainer>
    );
};

export default CreateCompany;
