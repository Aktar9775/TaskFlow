import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Account created ✅ Now login");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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
          <h1 className="text-3xl font-bold leading-tight">Create your TaskFlow account</h1>
          <p className="mt-4 text-white/80">
            Build a workspace and start managing your tasks with a clean UI.
          </p>

          <div className="mt-10 space-y-3 text-sm text-white/70">
            <ul typeof="disc" className="list-disc list-inside space-y-2">
              <li>Create your project </li>
              <li>Link with your github</li>
              <li>Modern and Fast UI Experience </li>
              </ul>
          </div>
        </div>

        {/* Right Form */}
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-1 text-sm text-gray-500">Start your journey with TaskFlow</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

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
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button loading={loading} type="submit">
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-black hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
