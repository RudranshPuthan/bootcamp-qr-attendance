"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { YEAR_OPTIONS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
};

export default function ProfileForm({ profile }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    phone: profile.phone ?? "",
    year: profile.year ?? "",
    branch: profile.branch ?? "",
    division: profile.division ?? "",
    roll_no: profile.roll_no ?? "",
    email: profile.email ?? ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(name: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        year: form.year,
        branch: form.branch,
        division: form.division,
        roll_no: form.roll_no,
        email: form.email
      })
      .eq("id", profile.id);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile updated successfully.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Update Profile</h2>
        <p className="mt-2 text-sm text-slate-500">Keep your registration data accurate for attendance records.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            className="input"
            value={form.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            className="input"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="year">
            Year
          </label>
          <select
            id="year"
            className="input"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            required
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="branch">
            Branch
          </label>
          <input
            id="branch"
            className="input"
            value={form.branch}
            onChange={(e) => updateField("branch", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="division">
            Division
          </label>
          <input
            id="division"
            className="input"
            value={form.division}
            onChange={(e) => updateField("division", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="roll_no">
            Roll Number
          </label>
          <input
            id="roll_no"
            className="input"
            value={form.roll_no}
            onChange={(e) => updateField("roll_no", e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="email">
            Email ID
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>
      </div>

      {message ? <p className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}

      <button type="submit" className="btn-primary mt-6">
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
