import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
              TF
            </div>
            <span className="font-extrabold text-gray-900 text-lg">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
              <Sparkles size={16} />
              AI-ready • GitHub integration • SaaS
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Manage Projects & Tasks in a
              <span className="text-black"> modern SaaS dashboard</span>
            </h1>

            <p className="mt-5 text-gray-600 text-base leading-relaxed">
              TaskFlow helps you create projects, organize tasks with Kanban workflow,
              track performance, and even import GitHub Projects and repositories with README and tech stack —
              all in one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-white font-semibold hover:opacity-90 transition"
              >
                Start Free <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Open Dashboard <LayoutDashboard size={18} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <MiniStat value="Fast" label="Performance UI" />
              <MiniStat value="Secure" label="Authentication" />
              <MiniStat value="GitHub" label="Repo Import" />
            </div>
          </div>

          {/* Right mock UI */}
          <div className="relative">
            <div className="absolute -top-10 -right-8 h-40 w-40 rounded-full bg-gray-100 blur-2xl" />
            <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-gray-100 blur-2xl" />

            <div className="relative rounded-3xl border bg-white shadow-xl overflow-hidden">
              <div className="p-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                </div>
                <span className="text-xs font-semibold text-gray-500">TaskFlow Preview</span>
              </div>

              <div className="p-6 space-y-4">
                <PreviewCard title="Project: TaskFlow SaaS" tag="ACTIVE" />
                <PreviewCard title="Task: Design Dashboard UI" tag="IN_PROGRESS" />
                <PreviewCard title="GitHub: Import README + Tech Stack" tag="DONE" />
              </div>

              <div className="p-6 bg-gray-50 border-t">
                <p className="text-sm text-gray-600">
                  ✔ Kanban • ✔ Analytics • ✔ GitHub Integration • ✔ Responsive
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Everything you need in one dashboard
          </h2>
          <p className="mt-3 text-gray-600">
            Built for real-world applications and job-ready projects explore.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={<ShieldCheck />}
            title="Secure Authentication"
            desc="Secure login with refresh token & protected routes."
          />
          <Feature
            icon={<CheckCircle2 />}
            title="Task Kanban Workflow"
            desc="Track tasks in TODO / In Progress / Done with clean UI."
          />
          <Feature
            icon={<Github />}
            title="GitHub Repo Import"
            desc="Connect GitHub and shows projects and repositories with README and tech stack."
          />
          <Feature
            icon={<LayoutDashboard />}
            title="Analytics Dashboard"
            desc="Performance tracking, completion rate & project insights."
          />
          <Feature
            icon={<Sparkles />}
            title="Modern UI/UX"
            desc="Responsive design using modern layouts."
          />
          <Feature
            icon={<ArrowRight />}
            title="Explore Project"
            desc="It's visually appealing and easy to navigate."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl border bg-gray-50 p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-gray-900">
            How TaskFlow works
          </h2>
          <p className="mt-2 text-gray-600">
            Simple steps to start organizing your workflow.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Step number="01" title="Create account" desc="Register and login securely " />
            <Step number="02" title="Create projects" desc="Add projects and organize tasks inside them." />
            <Step number="03" title="Connect GitHub" desc="Import repos and projects" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm font-semibold">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover:underline">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------ UI Components ------------ */

function MiniStat({ value, label }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-lg font-extrabold text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function PreviewCard({ title, tag }) {
  return (
    <div className="rounded-2xl border p-4 flex items-center justify-between gap-4">
      <p className="font-semibold text-gray-900">{title}</p>
      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100">
        {tag}
      </span>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="h-11 w-11 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900">
        {icon}
      </div>
      <h3 className="mt-4 font-extrabold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-extrabold text-gray-500">{number}</p>
      <h3 className="mt-2 text-lg font-extrabold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}
