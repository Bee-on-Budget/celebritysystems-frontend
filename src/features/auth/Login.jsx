import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../../api/auth";
import { useAuth } from "../../auth/useAuth";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Logo from "../../assets/logo.png";

const Login = () => {
  const { t } = useTranslation();
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
      setError(err.response?.data?.message || t('auth.messages.loginFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-100 to-neutral-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left: Form Section */}
        <div className="p-10 flex flex-col justify-center backdrop-blur-2xl bg-white/60 border border-white/30 shadow-inner shadow-white/10">
          <div className="mb-8">
            <img src={Logo} alt="Logo" className="w-32 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">{t('auth.login')}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {t('auth.loginForm.usernamePlaceholder')}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('auth.loginForm.username')}
              type="email"
              placeholder={t('auth.loginForm.usernamePlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              trainling={
                email && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 absolute right-3 top-9"
                    onClick={() => setEmail("")}
                    aria-label="Clear email"
                  >
                    &times;
                  </button>
                )
              }
              required
            />

            <Input
              label={t('auth.loginForm.password')}
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.loginForm.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              trainling={
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 absolute right-3 top-9"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              }
              required
            />

            <Button className="w-full py-3 text-white font-semibold bg-primary hover:bg-primary-hover rounded-xl transition-all shadow-lg backdrop-blur-sm">
              {t('auth.loginForm.submit')}
            </Button>
          </form>
        </div>

        {/* Right: Visual Section */}
        <div className="hidden md:block relative overflow-hidden backdrop-blur-2xl bg-white/60 border border-white/30 shadow-inner shadow-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-400 opacity-80 brightness-90" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-6 text-white">
              <h2 className="text-3xl font-bold">Celebrity Systems</h2>
              <p className="mt-2 text-sm text-white/80">
                Powering the future of digital displays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
