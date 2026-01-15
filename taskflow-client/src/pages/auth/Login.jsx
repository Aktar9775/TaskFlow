import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error, isAuth } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === "fulfilled") toast.success("Login successful ✅");
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (isAuth) navigate("/dashboard");
  }, [isAuth]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="pt-4 m-10 absolute top-0 left-0 ">
         <button onClick={() => navigate("/")} className="flex items-center gap-2">
      <ArrowLeft size={28} />
      
    </button>

          </div>
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6">
        {/* Left Branding */}
        <div className="hidden lg:flex flex-col justify-center rounded-3xl bg-black p-10 text-white shadow-xl">

          <h1 className="text-3xl font-bold leading-tight">Welcome back to TaskFlow</h1>
          <p className="mt-4 text-white/80">
            Manage projects, assign tasks, and collaborate with teams — faster and smarter.
          </p>

          <div className="mt-10 space-y-3 text-sm text-white/70">
           <ul typeof="disc" className="list-disc list-inside space-y-2">
            <li>
                Role-based Access
            
            </li>
            <li>
              Project + Task Workflow
            </li>
            <li> Modern Dashboard UI
           </li>
           </ul>
          </div>
        </div>

        {/* Right Form */}
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="mt-1 text-sm text-gray-500">Enter your details to continue</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="username@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button loading={loading} type="submit">
              Login
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register" className="font-semibold text-black hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
