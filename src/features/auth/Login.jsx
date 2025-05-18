import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useAuth } from "../../auth/useAuth";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Logo from "../../assets/logo.png";

// const Logo = () => (
//   <div className="flex items-center space-x-2">
//     <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600">
//       <span className="text-white font-bold text-xl">CS</span>
//     </div>
//     <div>
//       <span className="block text-xl font-bold text-gray-900">Celebrity</span>
//       <span className="block text-xl font-bold text-red-600 -mt-2">Systems</span>
//     </div>
//   </div>
// );

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      authLogin(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Logo and Login Card */}
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="absolute top-10 left-10">
          <img src={Logo} alt="Celebrity Systems Logo" className="w-32 h-auto" />
        </div>
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input label="Email"
                type="email"
                id="login-email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                trainling=
                {email && (
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setEmail("")}
                  >
                    &#10005;
                  </button>
                )}
                required />
              <Input label="Password"
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                trainling=
                {
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>}
                required />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="\#" className="text-sm text-primary hover:underline font-semibold">
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 rounded">
              Log in
            </Button>
          </form>
        </div>
      </div>
      {/* Right: Gradient Box */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div
          className="w-4/5 h-4/5 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #ffe084 0%, #f76a6a 40%, #5a9fff 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;

