import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  ChevronDown,
  MoreVertical,
  UserRoundCog,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  Trash2,
} from "lucide-react";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const USERS_PER_PAGE = 6;


function UserManagement() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  // Action popup

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const actionMenuRef =
    useRef(null);

  const actionButtonRef =
    useRef(null);

  const [menuPosition, setMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });


  // Modals

  const [roleModal, setRoleModal] =
    useState(null);

  const [selectedRole, setSelectedRole] =
    useState("");

  const [
    confirmationModal,
    setConfirmationModal,
  ] = useState(null);

  const [deleteModal, setDeleteModal] =
    useState(null);


  // Pagination

  const [currentPage, setCurrentPage] =
    useState(1);


  // Saving state

  const [saving, setSaving] =
    useState(false);


  // Current logged-in user

  const currentUserId =
    localStorage.getItem("userId");


  // --------------------------------------------------
  // Fetch users on page load
  // --------------------------------------------------

  useEffect(() => {
    fetchUsers();
  }, []);


  // --------------------------------------------------
  // Close action popup when clicking outside
  // --------------------------------------------------

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      // Click inside popup
      if (
        actionMenuRef.current &&
        actionMenuRef.current.contains(
          event.target
        )
      ) {
        return;
      }


      // Click on action button
      if (
        actionButtonRef.current &&
        actionButtonRef.current.contains(
          event.target
        )
      ) {
        return;
      }


      // Otherwise close popup

      setOpenMenuId(null);
    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // --------------------------------------------------
  // Update popup position
  // --------------------------------------------------

  useEffect(() => {

    if (!openMenuId) {
      return;
    }


    const updateMenuPosition = () => {

      if (!actionButtonRef.current) {
        return;
      }


      const rect =
        actionButtonRef.current.getBoundingClientRect();


      const menuWidth = 190;

      const menuHeight = 125;

      const gap = 6;


      // Default position:
      // below the action button

      let top =
        rect.bottom + gap;

      let left =
        rect.right - menuWidth;


      // Keep popup inside right side

      if (
        left + menuWidth >
        window.innerWidth - 10
      ) {

        left =
          window.innerWidth -
          menuWidth -
          10;

      }


      // Keep popup inside left side

      if (left < 10) {
        left = 10;
      }


      // If there isn't enough room below,
      // open the popup above the button

      if (
        top + menuHeight >
        window.innerHeight - 10
      ) {

        top =
          rect.top -
          menuHeight -
          gap;

      }


      // Make sure it doesn't go above
      // the viewport

      if (top < 10) {
        top = 10;
      }


      setMenuPosition({
        top,
        left,
      });

    };


    // Initial position

    updateMenuPosition();


    // Listen for page/table scrolling

    window.addEventListener(
      "scroll",
      updateMenuPosition,
      true
    );


    // Listen for browser resize

    window.addEventListener(
      "resize",
      updateMenuPosition
    );


    return () => {

      window.removeEventListener(
        "scroll",
        updateMenuPosition,
        true
      );

      window.removeEventListener(
        "resize",
        updateMenuPosition
      );

    };

  }, [openMenuId]);


  // --------------------------------------------------
  // Fetch users
  // --------------------------------------------------

  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const token =
        localStorage.getItem(
          "cvision_token"
        );


      const response =
        await fetch(
          `${API_BASE_URL}/admin/users`,
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
            "Failed to load users"
        );

      }


      setUsers(
        data.users || []
      );

    } catch (error) {

      console.error(
        "Fetch users error:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------------------------
  // Format date
  // --------------------------------------------------

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "Unknown";
    }


    return new Date(
      date
    ).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalUsers =
    users.length;


  const activeUsers =
    users.filter(
      (user) =>
        (user.status ||
          "Active") ===
        "Active"
    ).length;


  const inactiveUsers =
    users.filter(
      (user) =>
        (user.status ||
          "Active") ===
        "Inactive"
    ).length;


  const adminUsers =
    users.filter(
      (user) =>
        user.role ===
        "Admin"
    ).length;


  // --------------------------------------------------
  // Filter users
  // --------------------------------------------------

  const filteredUsers =
    useMemo(() => {

      return users.filter(
        (user) => {

          const search =
            searchTerm.toLowerCase();


          const name =
            user.name || "";


          const email =
            user.email || "";


          const matchesSearch =
            name
              .toLowerCase()
              .includes(search) ||
            email
              .toLowerCase()
              .includes(search);


          const userStatus =
            user.status ||
            "Active";


          const matchesStatus =
            statusFilter ===
              "All" ||
            userStatus ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      users,
      searchTerm,
      statusFilter,
    ]);


  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredUsers.length /
          USERS_PER_PAGE
      )
    );


  const startIndex =
    (currentPage - 1) *
    USERS_PER_PAGE;


  const displayedUsers =
    filteredUsers.slice(
      startIndex,
      startIndex +
        USERS_PER_PAGE
    );


  // --------------------------------------------------
  // Currently selected popup user
  // --------------------------------------------------

  const activeMenuUser =
    users.find(
      (user) =>
        user.id ===
        openMenuId
    );


  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearch = (
    event
  ) => {

    setSearchTerm(
      event.target.value
    );

    setCurrentPage(1);

  };


  // --------------------------------------------------
  // Status filter
  // --------------------------------------------------

  const handleStatusFilter = (
    event
  ) => {

    setStatusFilter(
      event.target.value
    );

    setCurrentPage(1);

  };


  // --------------------------------------------------
  // Open role modal
  // --------------------------------------------------

  const openRoleModal = (
    user
  ) => {

    setOpenMenuId(null);


    if (
      String(user.id) ===
      String(currentUserId)
    ) {

      alert(
        "You cannot change your own role."
      );

      return;

    }


    setRoleModal(user);

    setSelectedRole(
      user.role
    );

  };


  // --------------------------------------------------
  // Save role
  // --------------------------------------------------

  const saveRole = async () => {

    if (!roleModal) {
      return;
    }


    try {

      setSaving(true);


      const token =
        localStorage.getItem(
          "cvision_token"
        );


      const response =
        await fetch(
          `${API_BASE_URL}/admin/users/${roleModal.id}/role`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              role:
                selectedRole,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
            "Failed to update role"
        );

      }


      setUsers(
        (prevUsers) =>
          prevUsers.map(
            (user) =>
              user.id ===
              roleModal.id
                ? {
                    ...user,
                    role:
                      selectedRole,
                  }
                : user
          )
      );


      setRoleModal(null);

    } catch (error) {

      console.error(
        "Change role error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setSaving(false);

    }

  };


  // --------------------------------------------------
  // Open activate/deactivate confirmation
  // --------------------------------------------------

  const openConfirmation = (
    user
  ) => {

    setOpenMenuId(null);


    const userStatus =
      user.status ||
      "Active";


    if (
      String(user.id) ===
        String(currentUserId) &&
      userStatus ===
        "Active"
    ) {

      alert(
        "You cannot deactivate your own account."
      );

      return;

    }


    setConfirmationModal(
      user
    );

  };


  // --------------------------------------------------
  // Confirm status change
  // --------------------------------------------------

  const confirmStatusChange =
    async () => {

      if (
        !confirmationModal
      ) {
        return;
      }


      const currentStatus =
        confirmationModal.status ||
        "Active";


      const newStatus =
        currentStatus ===
          "Active"
          ? "Inactive"
          : "Active";


      try {

        setSaving(true);


        const token =
          localStorage.getItem(
            "cvision_token"
          );


        const response =
          await fetch(
            `${API_BASE_URL}/admin/users/${confirmationModal.id}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status:
                  newStatus,
              }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
              "Failed to update user status"
          );

        }


        setUsers(
          (prevUsers) =>
            prevUsers.map(
              (user) =>
                user.id ===
                confirmationModal.id
                  ? {
                      ...user,
                      status:
                        newStatus,
                    }
                  : user
            )
        );


        setConfirmationModal(
          null
        );

    } catch (error) {

        console.error(
          "Change status error:",
          error
        );

        alert(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  // --------------------------------------------------
  // Open delete confirmation
  // --------------------------------------------------

  const openDeleteModal = (
    user
  ) => {

    setOpenMenuId(null);


    if (
      String(user.id) ===
      String(currentUserId)
    ) {

      alert(
        "You cannot delete your own account."
      );

      return;

    }


    setDeleteModal(user);

  };


  // --------------------------------------------------
  // Delete user
  // --------------------------------------------------

  const deleteUser = async () => {

    if (!deleteModal) {
      return;
    }


    try {

      setSaving(true);


      const token =
        localStorage.getItem(
          "cvision_token"
        );


      const response =
        await fetch(
          `${API_BASE_URL}/admin/users/${deleteModal.id}`,
          {
            method: "DELETE",

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
            "Failed to delete user"
        );

      }


      setUsers(
        (prevUsers) =>
          prevUsers.filter(
            (user) =>
              user.id !==
              deleteModal.id
          )
      );


      setDeleteModal(null);


      // Keep pagination valid

      setCurrentPage(
        (page) => {

          const remainingUsers =
            users.length - 1;


          const remainingPages =
            Math.max(
              1,
              Math.ceil(
                remainingUsers /
                  USERS_PER_PAGE
              )
            );


          return Math.min(
            page,
            remainingPages
          );

        }
      );

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      alert(
        error.message
      );

    } finally {

      setSaving(false);

    }

  };


  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const goToPage = (
    page
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }


    setCurrentPage(
      page
    );

  };


  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (loading) {

    return (
      <div className="w-full pb-10">

        <div className="mb-8">

          <h1 className="text-[28px] font-semibold leading-9 text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Manage accounts and access
          </p>

        </div>


        <div className="rounded-[14px] bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3 text-sm text-slate-500">

            <RefreshCw
              size={18}
              className="animate-spin text-[#19295F]"
            />

            Loading users...

          </div>

        </div>

      </div>
    );

  }


  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  if (error) {

    return (
      <div className="w-full pb-10">

        <div className="mb-8">

          <h1 className="text-[28px] font-semibold leading-9 text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Manage accounts and access
          </p>

        </div>


        <div className="rounded-[14px] bg-white p-8 shadow-sm">

          <div className="flex items-start gap-3">

            <AlertCircle
              size={20}
              className="mt-0.5 text-red-600"
            />

            <div>

              <p className="text-sm font-medium text-red-600">
                Failed to load users
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>


              <button
                onClick={
                  fetchUsers
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#19295F] px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
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
    );

  }


  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (

    <div className="w-full pb-10">


      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-8">

        <div>

          <h1 className="text-[28px] font-semibold leading-9 text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Manage accounts and access
          </p>

        </div>

      </div>


      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Users"
          value={totalUsers}
          description="Registered users"
          icon={Users}
          iconBg="#EEF2FF"
          iconColor="text-[#4338CA]"
          valueColor="text-[#4338CA]"
        />


        <StatCard
          title="Active users"
          value={activeUsers}
          description="Currently active"
          icon={UserCheck}
          iconBg="#ECFDF5"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />


        <StatCard
          title="Inactive users"
          value={inactiveUsers}
          description="Currently inactive"
          icon={UserX}
          iconBg="#FEF2F2"
          iconColor="text-red-500"
          valueColor="text-red-500"
        />


        <StatCard
          title="Admins"
          value={adminUsers}
          description="System administrator"
          icon={ShieldCheck}
          iconBg="#F5F3FF"
          iconColor="text-[#19295F]"
          valueColor="text-[#19295F]"
        />

      </div>


      {/* ==========================================
          SEARCH & FILTER
      ========================================== */}

      <div className="mb-5 flex items-center gap-10">

        {/* Search */}

        <div className="relative w-[337px]">

          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />


          <input
            type="text"
            value={
              searchTerm
            }
            onChange={
              handleSearch
            }
            placeholder="Search by name or email"
            className="h-[45px] w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 shadow-sm focus:border-blue-500"
          />

        </div>


        {/* Status filter */}

        <div className="relative">

          <select
            value={
              statusFilter
            }
            onChange={
              handleStatusFilter
            }
            className="h-[45px] w-[134px] appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-900 outline-none shadow-sm focus:border-blue-500"
          >

            <option value="All">
              Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>


          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

        </div>

      </div>


      {/* ==========================================
          USERS TABLE
      ========================================== */}

      <div className="overflow-visible rounded-[14px] border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] border-collapse">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="px-7 py-6 text-left text-sm font-medium text-slate-400">
                  Name
                </th>


                <th className="px-7 py-6 text-left text-sm font-medium text-slate-400">
                  Email
                </th>


                <th className="px-7 py-6 text-left text-sm font-medium text-slate-400">
                  Role
                </th>


                <th className="px-7 py-6 text-left text-sm font-medium text-slate-400">
                  Status
                </th>


                <th className="px-7 py-6 text-left text-sm font-medium text-slate-400">
                  Joined
                </th>


                <th className="w-12 px-3 py-6"></th>

              </tr>

            </thead>


            <tbody>

              {displayedUsers.length >
              0 ? (

                displayedUsers.map(
                  (user) => {

                    const userStatus =
                      user.status ||
                      "Active";


                    return (

                      <tr
                        key={
                          user.id
                        }
                        className="border-b border-slate-200 last:border-b-0"
                      >


                        {/* Name */}

                        <td className="px-7 py-4 text-sm text-slate-900">

                          {user.name}

                        </td>


                        {/* Email */}

                        <td className="px-7 py-4 text-sm text-slate-900">

                          {user.email}

                        </td>


                        {/* Role */}

                        <td className="px-7 py-4 text-sm text-slate-900">

                          {user.role}

                        </td>


                        {/* Status */}

                        <td className="px-7 py-4">

                          <span
                            className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${
                              userStatus ===
                              "Active"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >

                            {
                              userStatus
                            }

                          </span>

                        </td>


                        {/* Joined */}

                        <td className="px-7 py-4 text-sm text-slate-900">

                          {formatDate(
                            user.joined
                          )}

                        </td>


                        {/* Actions */}

                        <td className="px-3 py-4">

                          <button
                            ref={(element) => {

                              if (
                                openMenuId ===
                                user.id
                              ) {

                                actionButtonRef.current =
                                  element;

                              }

                            }}
                            type="button"
                            onClick={() => {

                              setOpenMenuId(
                                (
                                  currentId
                                ) =>
                                  currentId ===
                                  user.id
                                    ? null
                                    : user.id
                              );

                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >

                            <MoreVertical
                              size={20}
                            />

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >

                    No users found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==========================================
          PAGINATION
      ========================================== */}

      <div className="mt-6 flex justify-end gap-1.5">

        <button
          type="button"
          onClick={() =>
            goToPage(
              currentPage - 1
            )
          }
          disabled={
            currentPage === 1
          }
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >

          <ChevronLeft
            size={20}
          />

        </button>


        {Array.from(
          {
            length:
              totalPages,
          },
          (_, index) =>
            index + 1
        ).map(
          (page) => (

            <button
              key={page}
              type="button"
              onClick={() =>
                goToPage(
                  page
                )
              }
              className={`h-10 w-10 rounded-md border text-sm font-medium ${
                currentPage ===
                page
                  ? "border-[#19295F] bg-[#19295F] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >

              {page}

            </button>

          )
        )}


        <button
          type="button"
          onClick={() =>
            goToPage(
              currentPage + 1
            )
          }
          disabled={
            currentPage ===
            totalPages
          }
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >

          <ChevronRight
            size={20}
          />

        </button>

      </div>


      {/* ==========================================
          CHANGE ROLE MODAL
      ========================================== */}

      {roleModal && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">

          <div className="relative w-[420px] rounded-xl bg-white p-7 shadow-2xl">


            <button
              type="button"
              onClick={() =>
                setRoleModal(
                  null
                )
              }
              disabled={saving}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >

              <X size={19} />

            </button>


            <h2 className="text-lg font-semibold text-slate-900">

              Change Role

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              Change the role for{" "}

              {roleModal.name}.

            </p>


            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium text-slate-700">

                Role

              </label>


              <div className="relative">

                <select
                  value={
                    selectedRole
                  }
                  onChange={(
                    event
                  ) =>
                    setSelectedRole(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500"
                >

                  <option value="HR Manager">
                    HR Manager
                  </option>

                  <option value="Recruiter">
                    Recruiter
                  </option>

                  <option value="Admin">
                    Admin
                  </option>

                </select>


                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

            </div>


            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setRoleModal(
                    null
                  )
                }
                disabled={saving}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >

                Cancel

              </button>


              <button
                type="button"
                onClick={
                  saveRole
                }
                disabled={saving}
                className="h-10 rounded-lg bg-[#19295F] px-5 text-sm font-medium text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==========================================
          ACTIVATE / DEACTIVATE MODAL
      ========================================== */}

      {confirmationModal && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">

          <div className="relative w-[420px] rounded-xl bg-white p-7 shadow-2xl">


            <button
              type="button"
              onClick={() =>
                setConfirmationModal(
                  null
                )
              }
              disabled={saving}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >

              <X size={19} />

            </button>


            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${
                (confirmationModal.status ||
                  "Active") ===
                "Active"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >

              {(confirmationModal.status ||
                "Active") ===
              "Active" ? (

                <AlertTriangle
                  size={24}
                />

              ) : (

                <Check
                  size={25}
                />

              )}

            </div>


            <h2 className="text-lg font-semibold text-slate-900">

              {(confirmationModal.status ||
                "Active") ===
              "Active"
                ? "Deactivate User?"
                : "Activate User?"}

            </h2>


            <p className="mt-2 text-sm leading-5 text-slate-500">

              {(confirmationModal.status ||
                "Active") ===
              "Active"
                ? `${confirmationModal.name} will no longer be able to access the system.`
                : `${confirmationModal.name} will regain access to the system.`}

            </p>


            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setConfirmationModal(
                    null
                  )
                }
                disabled={saving}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >

                Cancel

              </button>


              <button
                type="button"
                onClick={
                  confirmStatusChange
                }
                disabled={saving}
                className={`h-10 rounded-lg px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  (confirmationModal.status ||
                    "Active") ===
                  "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >

                {saving
                  ? "Saving..."
                  : (confirmationModal.status ||
                      "Active") ===
                    "Active"
                  ? "Deactivate"
                  : "Activate"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==========================================
          DELETE USER MODAL
      ========================================== */}

      {deleteModal && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">

          <div className="relative w-[420px] rounded-xl bg-white p-7 shadow-2xl">


            {/* Close */}

            <button
              type="button"
              onClick={() =>
                setDeleteModal(
                  null
                )
              }
              disabled={saving}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >

              <X size={19} />

            </button>


            {/* Icon */}

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">

              <Trash2
                size={24}
              />

            </div>


            {/* Title */}

            <h2 className="text-lg font-semibold text-slate-900">

              Delete User?

            </h2>


            {/* Description */}

            <p className="mt-2 text-sm leading-5 text-slate-500">

              Are you sure you want to permanently
              delete{" "}

              <span className="font-medium text-slate-700">

                {deleteModal.name}

              </span>

              ? This action cannot be undone.

            </p>


            {/* User information */}

            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">

              <p className="text-sm font-medium text-slate-800">

                {deleteModal.name}

              </p>


              <p className="mt-1 text-xs text-slate-500">

                {deleteModal.email}

              </p>

            </div>


            {/* Buttons */}

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeleteModal(
                    null
                  )
                }
                disabled={saving}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >

                Cancel

              </button>


              <button
                type="button"
                onClick={
                  deleteUser
                }
                disabled={saving}
                className="h-10 rounded-lg bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "Deleting..."
                  : "Delete User"}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==========================================
          ACTION POPUP
      ========================================== */}

      {openMenuId &&
        activeMenuUser &&
        createPortal(

          <div
            ref={
              actionMenuRef
            }
            className="fixed z-[99999] w-[190px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.10)]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >


            {/* Change Role */}

            <button
              type="button"
              onClick={() =>
                openRoleModal(
                  activeMenuUser
                )
              }
              className="flex h-[38px] w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >

              <UserRoundCog
                size={18}
                className="text-slate-500"
              />

              Change Role

            </button>


            {/* Activate / Deactivate */}

            <button
              type="button"
              onClick={() =>
                openConfirmation(
                  activeMenuUser
                )
              }
              className={`flex h-[38px] w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium ${
                (activeMenuUser.status ||
                  "Active") ===
                "Active"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >

              {(activeMenuUser.status ||
                "Active") ===
              "Active" ? (

                <>
                  <UserX
                    size={18}
                  />

                  Deactivate User
                </>

              ) : (

                <>
                  <UserCheck
                    size={18}
                  />

                  Activate User
                </>

              )}

            </button>


            {/* Divider */}

            <div className="my-1 border-t border-slate-100" />


            {/* Delete User */}

            <button
              type="button"
              onClick={() =>
                openDeleteModal(
                  activeMenuUser
                )
              }
              className="flex h-[38px] w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >

              <Trash2
                size={18}
              />

              Delete User

            </button>

          </div>,

          document.body

        )}

    </div>

  );

}


// ==================================================
// STAT CARD COMPONENT
// ==================================================

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  valueColor =
    "text-[#19295F]",
}) {

  return (

    <div className="flex h-[140px] flex-col justify-between rounded-[14px] bg-white px-5 py-4 shadow-sm">


      <div className="flex items-center gap-2">

        <div
          className="flex items-center justify-center rounded-xl p-2"
          style={{
            backgroundColor:
              iconBg,
          }}
        >

          <Icon
            size={20}
            className={
              iconColor
            }
          />

        </div>


        <span className="text-sm text-slate-700">

          {title}

        </span>

      </div>


      <span
        className={`ml-12 text-[20px] font-medium ${valueColor}`}
      >

        {value}

      </span>


      <p className="text-xs text-slate-400">

        {description}

      </p>

    </div>

  );

}


export default UserManagement;
