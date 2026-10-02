import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";


export default function Profile() {

  // ==================================================
  // PROFILE STATE
  // ==================================================

  const [profile, setProfile] =
    useState({
      fullName: "",
      email: "",
      role: "",
    });


  const [loading, setLoading] =
    useState(true);


  const [savingProfile, setSavingProfile] =
    useState(false);


  const [savingPassword, setSavingPassword] =
    useState(false);


  // ==================================================
  // PASSWORD STATE
  // ==================================================

  const [passwords, setPasswords] =
    useState({
      current: "",
      next: "",
      confirm: "",
    });


  const [visible, setVisible] =
    useState({
      current: false,
      next: false,
      confirm: false,
    });


  // ==================================================
  // MESSAGE STATE
  // ==================================================

  const [message, setMessage] =
    useState("");


  const [messageType, setMessageType] =
    useState("success");


  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        localStorage.getItem(
          "cvision_token"
        );


      const response =
        await fetch(
          `${API_BASE_URL}/profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load profile"
        );
      }


      setProfile({
        fullName:
          data.user.name || "",
        email:
          data.user.email || "",
        role:
          data.user.role || "",
      });


    } catch (error) {

      console.error(
        "Fetch profile error:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // SHOW MESSAGE
  // ==================================================

  const showMessage = (
    text,
    type = "success"
  ) => {

    setMessage(text);
    setMessageType(type);


    setTimeout(() => {
      setMessage("");
    }, 4000);

  };


  // ==================================================
  // UPDATE PROFILE
  // ==================================================

  const updateProfile = async (
    event
  ) => {

    event.preventDefault();


    if (
      !profile.fullName.trim()
    ) {

      showMessage(
        "Full name is required.",
        "error"
      );

      return;

    }


    try {

      setSavingProfile(true);


      const token =
        localStorage.getItem(
          "cvision_token"
        );


      const response =
        await fetch(
          `${API_BASE_URL}/profile`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name:
                profile.fullName.trim(),
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }


      setProfile({
        fullName:
          data.user.name,
        email:
          data.user.email,
        role:
          data.user.role,
      });


      showMessage(
        "Profile changes saved successfully.",
        "success"
      );


    } catch (error) {

      console.error(
        "Update profile error:",
        error
      );

      showMessage(
        error.message,
        "error"
      );

    } finally {

      setSavingProfile(false);

    }

  };


  // ==================================================
  // UPDATE PASSWORD
  // ==================================================

  const updatePassword = async (
    event
  ) => {

    event.preventDefault();


    if (
      passwords.next.length < 6
    ) {

      showMessage(
        "Your new password must have at least 6 characters.",
        "error"
      );

      return;

    }


    if (
      passwords.next !==
      passwords.confirm
    ) {

      showMessage(
        "New password and confirmation do not match.",
        "error"
      );

      return;

    }


    try {

      setSavingPassword(true);


      const token =
        localStorage.getItem(
          "cvision_token"
        );


      const response =
        await fetch(
          `${API_BASE_URL}/profile/password`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              currentPassword:
                passwords.current,

              newPassword:
                passwords.next,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update password"
        );
      }


      // Clear password fields

      setPasswords({
        current: "",
        next: "",
        confirm: "",
      });


      // Hide passwords

      setVisible({
        current: false,
        next: false,
        confirm: false,
      });


      showMessage(
        "Password updated successfully.",
        "success"
      );


    } catch (error) {

      console.error(
        "Update password error:",
        error
      );

      showMessage(
        error.message,
        "error"
      );

    } finally {

      setSavingPassword(false);

    }

  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="w-full pb-8 text-slate-950">

        <div className="mb-11">

          <h1 className="text-[28px] font-semibold leading-9">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your account details and update your password.
          </p>

        </div>


        <div className="max-w-[818px] lg:ml-16">

          <div className="flex items-center gap-3 rounded-[14px] border border-slate-200 bg-white px-9 py-6 text-sm text-slate-500">

            <RefreshCw
              size={18}
              className="animate-spin text-[#172554]"
            />

            Loading profile...

          </div>

        </div>

      </div>
    );

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (
      <div className="w-full pb-8 text-slate-950">

        <div className="mb-11">

          <h1 className="text-[28px] font-semibold leading-9">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your account details and update your password.
          </p>

        </div>


        <div className="max-w-[818px] lg:ml-16">

          <div className="rounded-[14px] border border-red-200 bg-red-50 px-6 py-5">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={20}
                className="mt-0.5 text-red-600"
              />

              <div>

                <p className="text-sm font-medium text-red-700">
                  Failed to load profile
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>


                <button
                  type="button"
                  onClick={
                    fetchProfile
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e316b]"
                >

                  <RefreshCw
                    size={16}
                  />

                  Retry

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    );

  }


  // ==================================================
  // MAIN PROFILE
  // ==================================================

  return (

    <div className="w-full pb-8 text-slate-950">


      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-11">

        <h1 className="text-[28px] font-semibold leading-9">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your account details and update your password.
        </p>

      </div>


      <div className="max-w-[818px] lg:ml-16">


        {/* ==========================================
            MESSAGE
        ========================================== */}

        {message && (

          <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${
              messageType ===
              "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
            role="status"
          >

            {messageType ===
            "success" ? (

              <CheckCircle2
                size={17}
              />

            ) : (

              <AlertCircle
                size={17}
              />

            )}

            {message}

          </div>

        )}


        {/* ==========================================
            USER DETAILS
        ========================================== */}

        <form
          onSubmit={
            updateProfile
          }
          className="rounded-[14px] border border-slate-200 bg-white px-9 py-[22px]"
        >


          {/* Profile header */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#172554] text-sm font-medium text-white">

              {getInitials(
                profile.fullName
              )}

            </div>


            <div>

              <p className="text-base font-medium">

                {profile.fullName ||
                  "User"}

              </p>


              <p className="mt-0.5 text-sm text-[#172554]">

                {profile.role}

              </p>

            </div>

          </div>


          {/* Fields */}

          <div className="mt-12 space-y-7">


            <Field
              label="Full Name"
              value={
                profile.fullName
              }
              onChange={(
                value
              ) =>
                setProfile({
                  ...profile,
                  fullName:
                    value,
                })
              }
            />


            <Field
              label="Email"
              type="email"
              value={
                profile.email
              }
              readOnly
            />

          </div>


          {/* Save */}

          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={
                savingProfile
              }
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#172554] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#1e316b] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {savingProfile && (
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
              )}

              {savingProfile
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>


        {/* ==========================================
            UPDATE PASSWORD
        ========================================== */}

        <form
          onSubmit={
            updatePassword
          }
          className="mt-9 rounded-[14px] border border-slate-200 bg-white px-9 py-4"
        >


          {/* Heading */}

          <div className="flex items-center gap-3 text-base font-medium">

            <LockKeyhole
              size={20}
              strokeWidth={2.25}
            />

            Update Password

          </div>


          {/* Current password */}

          <div className="mt-7">

            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              value={
                passwords.current
              }
              visible={
                visible.current
              }
              onChange={(
                value
              ) =>
                setPasswords({
                  ...passwords,
                  current:
                    value,
                })
              }
              onToggle={() =>
                setVisible({
                  ...visible,
                  current:
                    !visible.current,
                })
              }
            />

          </div>


          {/* New + confirm */}

          <div className="mt-7 grid grid-cols-1 gap-10 sm:grid-cols-2">

            <PasswordField
              label="New Password"
              placeholder="Minimum 6 characters"
              value={
                passwords.next
              }
              visible={
                visible.next
              }
              onChange={(
                value
              ) =>
                setPasswords({
                  ...passwords,
                  next:
                    value,
                })
              }
              onToggle={() =>
                setVisible({
                  ...visible,
                  next:
                    !visible.next,
                })
              }
            />


            <PasswordField
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={
                passwords.confirm
              }
              visible={
                visible.confirm
              }
              onChange={(
                value
              ) =>
                setPasswords({
                  ...passwords,
                  confirm:
                    value,
                })
              }
              onToggle={() =>
                setVisible({
                  ...visible,
                  confirm:
                    !visible.confirm,
                })
              }
            />

          </div>


          {/* Update button */}

          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={
                savingPassword
              }
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#172554] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#1e316b] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {savingPassword && (
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
              )}

              {savingPassword
                ? "Updating..."
                : "Update Password"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}


// ==================================================
// FIELD COMPONENT
// ==================================================

function Field({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
}) {

  return (

    <label className="block text-sm">

      <span>
        {label}
      </span>


      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) =>
          onChange?.(
            event.target.value
          )
        }
        className={`mt-1.5 h-10 w-full rounded-lg border px-4 text-sm outline-none transition-colors focus:border-[#1E2A4A] ${
          readOnly
            ? "border-0 bg-[#f1f7ff]"
            : "border-slate-200 bg-slate-50"
        }`}
      />

    </label>

  );

}


// ==================================================
// PASSWORD FIELD COMPONENT
// ==================================================

function PasswordField({
  label,
  placeholder,
  value,
  visible,
  onChange,
  onToggle,
}) {

  return (

    <label className="block text-sm">

      <span>
        {label}
      </span>


      <span className="relative mt-1.5 block">

        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          required
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#1E2A4A]"
        />


        <button
          type="button"
          onClick={
            onToggle
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-950"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >

          {visible ? (
            <EyeOff
              size={20}
            />
          ) : (
            <Eye
              size={20}
            />
          )}

        </button>

      </span>

    </label>

  );

}


// ==================================================
// GET INITIALS
// ==================================================

function getInitials(
  name
) {

  if (!name) {
    return "U";
  }


  const parts =
    name.trim().split(
      /\s+/
    );


  if (parts.length === 1) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }


  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();

}