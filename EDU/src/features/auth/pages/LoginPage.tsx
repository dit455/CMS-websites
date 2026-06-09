import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth-store";
import type { PortalRole } from "../../../shared/types/tis";

const demoOtp = "123456";

const defaultRoute: Record<PortalRole, string> = {
  teacher: "/my/transfer",
  "school-admin": "/teacher",
  department: "/teacher",
  admin: "/admin"
};

const demoAccounts: Record<PortalRole, { label: string; mobile: string; note: string }> = {
  teacher: { label: "Teacher", mobile: "9876543210", note: "Teacher transfer, helpdesk, reports" },
  "school-admin": { label: "School Admin", mobile: "9876501234", note: "School profile, staff records, approvals" },
  department: { label: "Department", mobile: "9888899991", note: "Teacher, transfer, helpdesk, MIS modules" },
  admin: { label: "Admin", mobile: "9898989898", note: "Users, roles, workflows, masters" }
};

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, setRole, login } = useAuthStore();
  const [mobile, setMobile] = useState(demoAccounts[role].mobile);
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  useEffect(() => {
    const requestedRole = searchParams.get("role") as PortalRole | null;
    if (!requestedRole || !demoAccounts[requestedRole]) return;
    setRole(requestedRole);
    setMobile(demoAccounts[requestedRole].mobile);
    setOtp("");
    setOtpRequested(false);
  }, [searchParams, setRole]);

  const selectRole = (nextRole: PortalRole) => {
    setRole(nextRole);
    setMobile(demoAccounts[nextRole].mobile);
    setOtp("");
    setOtpRequested(false);
  };

  const requestOtp = () => {
    if (mobile.trim().length < 10) {
      toast.error("Enter a valid demo mobile number");
      return;
    }
    setOtpRequested(true);
    toast.success(`Demo OTP ${demoOtp} generated`);
  };

  const verifyOtp = () => {
    if (otp !== demoOtp) {
      toast.error("Use demo OTP 123456");
      return;
    }
    login(role);
    toast.success(`${demoAccounts[role].label} demo login successful`);
    navigate(defaultRoute[role], { replace: true });
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-[1fr_440px]">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 rounded-btn border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-primary">Demo OTP access</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">Secure role-based access for TIS</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Use the visible demo OTP to enter as Teacher, School Admin, Department, or Admin while the backend authentication service is not connected.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(Object.keys(demoAccounts) as PortalRole[]).map((accountRole) => (
            <button
              type="button"
              className={`rounded-card border p-4 text-left shadow-sm ${role === accountRole ? "border-primary bg-surface" : "border-slate-200 bg-white"}`}
              onClick={() => selectRole(accountRole)}
              key={accountRole}
            >
              <strong className="block text-slate-950">{demoAccounts[accountRole].label}</strong>
              <span className="mt-1 block text-xs font-bold text-slate-500">{demoAccounts[accountRole].mobile}</span>
              <span className="mt-3 block text-xs leading-5 text-slate-600">{demoAccounts[accountRole].note}</span>
            </button>
          ))}
        </div>
      </div>
      <form
        className="rounded-card border border-slate-200 bg-white p-5 shadow-soft"
        onSubmit={(event) => {
          event.preventDefault();
          otpRequested ? verifyOtp() : requestOtp();
        }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-btn bg-surface text-primary">
          <ShieldCheck size={24} />
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-950">Portal Login</h2>
        <label className="mt-5 block text-sm font-bold text-slate-700">
          Login as
          <select className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" value={role} onChange={(event) => selectRole(event.target.value as PortalRole)}>
            <option value="teacher">Teacher</option>
            <option value="school-admin">School Admin</option>
            <option value="department">Department</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Mobile number
          <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" value={mobile} onChange={(event) => setMobile(event.target.value)} />
        </label>
        {otpRequested ? (
          <label className="mt-4 block text-sm font-bold text-slate-700">
            Enter OTP
            <input className="mt-2 w-full rounded-btn border border-slate-200 px-3 py-3" inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value)} />
          </label>
        ) : null}
        <div className="mt-4 rounded-btn bg-amber-50 p-3 text-sm font-bold text-amber-900">
          Demo OTP: <span className="font-black">{demoOtp}</span>
        </div>
        <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-4 py-3 font-black text-white">
          <KeyRound size={18} /> {otpRequested ? "Verify and Login" : "Request OTP"}
        </button>
      </form>
    </section>
  );
}
