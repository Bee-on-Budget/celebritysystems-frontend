import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { createCompany } from "./CompanyService";

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
            alert("Company created successfully");
            setForm({ name: "", email: "", phone: "", location: "" });
        } catch (err) {
            alert("Error creating company");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Create New Company</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Name" id="name" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <Input label="Phone" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                <Input label="Location" id="location" name="location" value={form.location} onChange={handleChange} required />
                <Button isLoading={loading} type="submit">Create Company</Button>
            </form>
        </div>
    );
};

export default CreateCompany;
