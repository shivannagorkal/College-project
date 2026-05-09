import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, LockKeyhole, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { validateEmail } from '@/utils/validators';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [errors,   setErrors]           = useState({});
  const [loading,  setLoading]          = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email)                  newErrors.email    = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password)               newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const token = await authService.login(formData.email, formData.password);
      login(token);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrors({ submit: err.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-10">

      {/* Card */}
      <div className="w-full max-w-md bg-background rounded-3xl shadow-xl border border-border p-8 sm:p-10">

        {/* Logo */}
        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Server error */}
        {errors.submit && (
          <div className="flex items-center gap-2.5 mb-6 p-3.5 rounded-xl
            bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Email Address</label>
            <div className={`flex items-center gap-3 rounded-xl border bg-secondary px-4 h-12
              transition-all focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20
              ${errors.email ? 'border-destructive' : 'border-border focus-within:border-primary'}`}>
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type="email" name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">Password</label>
            <div className={`flex items-center gap-3 rounded-xl border bg-secondary px-4 h-12
              transition-all focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20
              ${errors.password ? 'border-destructive' : 'border-border focus-within:border-primary'}`}>
              <LockKeyhole className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                type={showPassword ? 'text' : 'password'} name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm flex-1"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium">{errors.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
              <input type="checkbox"
                className="rounded border-border text-primary focus:ring-primary/30 w-4 h-4" />
              Remember me
            </label>
            <button type="button"
              className="text-primary hover:underline font-semibold text-xs">
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading}
            className="w-full h-12 rounded-xl font-semibold text-sm">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Signing in…
              </span>
            ) : 'Sign in to Dashboard'}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} College Admin Panel
        </p>
      </div>
    </div>
  );
}