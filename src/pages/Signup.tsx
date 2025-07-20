import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { name, email, mobile, password, confirmPassword } = formData;
    if (!name || !email || !mobile || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast({
        title: "Error",
        description: "Mobile must be a 10-digit number",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const sendVerificationCode = async () => {
    if (!validateForm()) return;
    // generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);

    try {
      const res = await fetch(
        "https://dhanalaxmi-backend.onrender.com/api/auth/send-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, code }),
        }
      );
      if (res.ok) {
        toast({
          title: "Code Sent",
          description: "Check your email for the code",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send code",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not send code",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (enteredCode.trim() !== verificationCode) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://dhanalaxmi-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
            isVerified: true,
          }),
        }
      );
      if (res.ok) {
        toast({ title: "Registered", description: "Redirecting to login…" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const { message } = await res.json();
        toast({
          title: "Error",
          description: message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Server error, please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isCodeValid =
    verificationCode !== "" && enteredCode.trim() === verificationCode;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/20">
      {/* Optional left graphic / hero */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/close-up-hands_1048944-14356993.jpg')",
        }}
      >
        <div className="h-full bg-black/30 flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold px-4">
            Join DhanaLaxmi Foods Family!
          </h2>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 animate-slideIn">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-green-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-green-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-green-700 mb-1">
                Mobile
              </label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-green-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-green-700 mb-1"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>

            <Button
              type="button"
              onClick={sendVerificationCode}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
            >
              Send Verification Code
            </Button>

            <div>
              <label htmlFor="code" className="block text-green-700 mb-1">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="Enter code from email"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 text-white font-semibold rounded-lg"
              disabled={!isCodeValid || loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-800 underline hover:text-green-600"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
