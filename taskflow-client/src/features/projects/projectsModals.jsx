import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ProjectsModals({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (initialData) setForm({ name: initialData.name, description: initialData.description || "" });
    else setForm({ name: "", description: "" });
  }, [initialData]);
  
  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? "Edit Project" : "Create Project"}
        </h2>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Eg: TaskFlow SaaS"
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short project description..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>

            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
