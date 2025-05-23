import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { createUser } from "../../api/creation";
import { showToast } from "../../components/ToastNotifier";

const AddUserToCompany = () => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        companyId: "",
        name: "",
        email: "",
        password: "",
        role: "COMPANY",
    });
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                email: form.email,
                username: form.name, // Map to "username"
                password: form.password,
                role: form.role.toUpperCase(), // Make sure it's like "COMPANY"
                company: {
                    id: parseInt(form.companyId),
                },
            };

            await createUser(payload);
            showToast("User created successfully!");

            setTimeout(() => navigate('/companies'), 1500);
        } catch (error) {
            showToast("Failed to create user", "error");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Add User to Company</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input label="Company ID" id="companyId" name="companyId" value={form.companyId} onChange={handleChange} />
                <Input label="Name" id="name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Email" id="email" name="email" value={form.email} onChange={handleChange} />
                <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} />
                {/* <Input label="Role" id="role" name="role" value={form.role} onChange={handleChange} /> */}
                <Button isLoading={loading} type="submit">Add User</Button>
            </form>
        </div>
    );
};

export default AddUserToCompany;
