export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  year: string;
  branch: string;
  division: string;
  roll_no: string;
  email: string;
  qr_token: string;
  role: "participant" | "admin";
  created_at: string;
  updated_at: string;
};

export type EventDay = {
  id: number;
  label: string;
  attendance_date: string;
};

export type AttendanceRecord = {
  id: number;
  attendance_date: string;
  marked_at: string;
  participant_id: string;
};

export type AttendanceJoinRow = {
  id: number;
  participant_id: string;
  attendance_date: string;
  marked_at: string;
  full_name: string | null;
  phone: string | null;
  year: string | null;
  branch: string | null;
  division: string | null;
  roll_no: string | null;
  email: string | null;
};