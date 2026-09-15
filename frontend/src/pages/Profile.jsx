import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

const profiles = {
  user: {
    displayName: "Minindu R.",
    role: "HR Manager",
    fullName: "Minindu Rajapaksha",
    email: "minindurajapaksha@gmail.com",
  },
  admin: {
    displayName: "Minindu R.",
    role: "Admin",
    fullName: "Minindu Rajapaksha",
    email: "admin@cvision.ai",
  },
};

export default function Profile({ accountType = "user" }) {
  const account = profiles[accountType] ?? profiles.user;
  const [profile, setProfile] = useState({ fullName: account.fullName, email: account.email });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [message, setMessage] = useState("");

  {/*update user details name/email*/}
  const updateProfile = (event) => {
    event.preventDefault();
    setMessage("Profile changes saved.");
  };

  {/*Password change*/}
  const updatePassword = (event) => {
    event.preventDefault();
    if (passwords.next.length < 6) return setMessage("Your new password must have at least 6 characters.");
    if (passwords.next !== passwords.confirm) return setMessage("New password and confirmation do not match.");
    setPasswords({ current: "", next: "", confirm: "" });
    setMessage("Password updated successfully.");
  };

  return (
    <div className="w-full pb-8 text-slate-950">
      <div className="mb-11">
        <h1 className="text-[28px] font-semibold leading-9">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">View your account details and update your password.</p>
      </div>

      <div className="max-w-[818px] lg:ml-16">
        {message && <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700" role="status">{message}</p>}

        {/*user details*/}
        <form onSubmit={updateProfile} className="rounded-[14px] border border-slate-200 bg-white px-9 py-[22px]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#172554] text-sm text-white">MR</div>
            <div><p className="text-base font-medium">{account.displayName}</p><p className="mt-0.5 text-sm text-[#172554]">{account.role}</p></div>
          </div>
          <div className="mt-12 space-y-7">
            <Field label="Full Name" value={profile.fullName} onChange={(value) => setProfile({ ...profile, fullName: value })} />
            <Field label="Email" type="email" value={profile.email} readOnly />
          </div>
          <div className="mt-6 flex justify-end"><button type="submit" className="rounded-lg bg-[#172554] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#1e316b]">Save Changes</button></div>
        </form>

        {/*update password*/}
        <form onSubmit={updatePassword} className="mt-9 rounded-[14px] border border-slate-200 bg-white px-9 py-4">
          <div className="flex items-center gap-3 text-base font-medium"><LockKeyhole size={20} strokeWidth={2.25} />Update Password</div>
          <div className="mt-7"><PasswordField label="Current Password" placeholder="Enter current password" value={passwords.current} visible={visible.current} onChange={(value) => setPasswords({ ...passwords, current: value })} onToggle={() => setVisible({ ...visible, current: !visible.current })} /></div>
          <div className="mt-7 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <PasswordField label="New Password" placeholder="Minimum 6 characters" value={passwords.next} visible={visible.next} onChange={(value) => setPasswords({ ...passwords, next: value })} onToggle={() => setVisible({ ...visible, next: !visible.next })} />
            <PasswordField label="Confirm New Password" placeholder="Re-enter your new password" value={passwords.confirm} visible={visible.confirm} onChange={(value) => setPasswords({ ...passwords, confirm: value })} onToggle={() => setVisible({ ...visible, confirm: !visible.confirm })} />
          </div>
          <div className="mt-6 flex justify-end"><button type="submit" className="rounded-lg bg-[#172554] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#1e316b]">Update Password</button></div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, readOnly = false }) {
  return <label className="block text-sm"><span>{label}</span><input type={type} value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} className={`mt-1.5 h-10 w-full rounded-lg border border-[#172554] px-4 text-sm outline-none focus:ring-1 focus:ring-[#172554] ${readOnly ? "border-0 bg-[#f1f7ff]" : "bg-white"}`} /></label>;
}

function PasswordField({ label, placeholder, value, visible, onChange, onToggle }) {
  return <label className="block text-sm"><span>{label}</span><span className="relative mt-1.5 block"><input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required className="h-10 w-full rounded-lg border border-[#172554] bg-white px-4 pr-11 text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#172554]" /><button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-950" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={20} /> : <Eye size={20} />}</button></span></label>;
}
