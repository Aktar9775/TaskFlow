import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function GithubModal({ open, onClose, onSubmit }) {
  const [username, setUsername] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">Connect GitHub</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your GitHub username to import repositories and README.
        </p>

        <div className="mt-5 space-y-4">
          <Input
            label="GitHub Username"
            placeholder="eg: sohel-aktar"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>

            <Button
              onClick={() => onSubmit(username)}
              disabled={!username.trim()}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
