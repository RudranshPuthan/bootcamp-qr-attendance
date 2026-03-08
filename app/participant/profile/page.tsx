"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileForm = {
  full_name: string;
  phone: string;
  year: string;
  branch: string;
  division: string;
  roll_no: string;
  email: string;
};

export default function ParticipantProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    phone: "",
    year: "",
    branch: "",
    division: "",
    roll_no: "",
    email: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setForm({
        full_name: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        year: profile?.year ?? "",
        branch: profile?.branch ?? "",
        division: profile?.division ?? "",
        roll_no: profile?.roll_no ?? "",
        email: user.email ?? "",
      });

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  function setField(key: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please login again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      year: form.year.trim(),
      branch: form.branch.trim(),
      division: form.division.trim(),
      roll_no: form.roll_no.trim(),
      email: user.email,
      qr_token: user.id,
      role: "participant",
    });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully.");

    setTimeout(() => {
      router.push("/participant/dashboard");
      router.refresh();
    }, 700);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl py-1 sm:py-2">
      <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Fill these details once to generate your attendance QR code.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              value={form.full_name}
              onChange={(e) => setField("full_name", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Year
            </label>
            <select
              value={form.year}
              onChange={(e) => setField("year", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Select Year</option>
              <option value="FY">FY</option>
              <option value="SY">SY</option>
              <option value="TY">TY</option>
              <option value="BE">BE</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Branch
            </label>
            <input
              value={form.branch}
              onChange={(e) => setField("branch", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Division
            </label>
            <input
              value={form.division}
              onChange={(e) => setField("division", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Roll Number
            </label>
            <input
              value={form.roll_no}
              onChange={(e) => setField("roll_no", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email ID
            </label>
            <input
              value={form.email}
              disabled
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
            />
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="md:col-span-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}