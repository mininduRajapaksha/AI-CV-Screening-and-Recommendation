import { useMemo, useState } from "react";
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
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
    joined: "26 Jan 2026",
  },
  {
    id: 2,
    name: "Laura Harshani",
    email: "hrmanager@example.com",
    role: "HR Manager",
    status: "Active",
    joined: "15 Feb 2026",
  },
  {
    id: 3,
    name: "Nirmal Senevirathna",
    email: "nirmal@example.com",
    role: "HR Manager",
    status: "Active",
    joined: "05 May 2026",
  },
  {
    id: 4,
    name: "Dilani Fernando",
    email: "dilani@example.com",
    role: "HR Manager",
    status: "Inactive",
    joined: "10 Jun 2026",
  },
  {
    id: 5,
    name: "Harshani Silva",
    email: "harshani@example.com",
    role: "HR Manager",
    status: "Inactive",
    joined: "21 Jul 2026",
  },
  {
    id: 6,
    name: "Kasun Malshan",
    email: "kasun@example.com",
    role: "HR Manager",
    status: "Inactive",
    joined: "28 Dec 2025",
  },
  {
    id: 7,
    name: "Amal Perera",
    email: "amal@example.com",
    role: "Recruiter",
    status: "Active",
    joined: "02 Aug 2026",
  },
  {
    id: 8,
    name: "Sarah Fernando",
    email: "sarah@example.com",
    role: "Recruiter",
    status: "Active",
    joined: "08 Aug 2026",
  },
];

const USERS_PER_PAGE = 6;

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [roleModal, setRoleModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [confirmationModal, setConfirmationModal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Statics

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  // Filter users

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  // Pagination

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  );

  const startIndex =
    (currentPage - 1) * USERS_PER_PAGE;

  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  // Search

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Status filter

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // Change role

  const openRoleModal = (user) => {
    setOpenMenuId(null);

    setRoleModal(user);
    setSelectedRole(user.role);
  };

  const saveRole = () => {
    if (!roleModal) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === roleModal.id
          ? {
              ...user,
              role: selectedRole,
            }
          : user
      )
    );

    setRoleModal(null);
  };

  // Open activation / deactivation

  const openConfirmation = (user) => {
    setOpenMenuId(null);
    setConfirmationModal(user);
  };

  // Confirm activation / deactivation

  const confirmStatusChange = () => {
    if (!confirmationModal) return;

    const newStatus =
      confirmationModal.status === "Active"
        ? "Inactive"
        : "Active";

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === confirmationModal.id
          ? {
              ...user,
              status: newStatus,
            }
          : user
      )
    );

    setConfirmationModal(null);
  };

//pagination

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  return (
    <div className="w-full pb-10">

      {/* page header */}

      <div className="mb-8">
        <h1 className="text-[28px] font-semibold leading-9 text-slate-900">
          User Management
        </h1>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Manage accounts and access
        </p>
      </div>

      {/* stat cards */}

      <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL USERS */}

        <StatCard
          title="Total Users"
          value={totalUsers}
          description="Registered users"
          icon={Users}
          iconColor="text-[#19295F]"
        />

        {/* ACTIVE USERS */}

        <StatCard
          title="Active users"
          value={activeUsers}
          description="Currently active"
          icon={UserCheck}
          iconColor="text-green-600"
          valueColor="text-green-600"
        />

        {/* INACTIVE USERS */}

        <StatCard
          title="Inactive users"
          value={inactiveUsers}
          description="Currently inactive"
          icon={UserX}
          iconColor="text-red-500"
          valueColor="text-red-500"
        />

        {/* ADMINS */}

        <StatCard
          title="Admins"
          value={adminUsers}
          description="System administrator"
          icon={ShieldCheck}
          iconColor="text-[#19295F]"
        />

      </div>

      {/* search & filter */}

      <div className="mb-5 flex items-center gap-10">

        {/* SEARCH */}

        <div className="relative w-[337px]">

          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name or email"
            className="h-[50px] w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
          />

        </div>

        {/* STATUS FILTER */}

        <div className="relative">

          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="h-[50px] w-[134px] appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-900 outline-none focus:border-blue-500"
          >
            <option value="All">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

        </div>

      </div>

      {/* users table */}

      <div className="overflow-visible rounded-[14px] border border-slate-200 bg-white">

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

              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200 last:border-b-0"
                  >

                    {/* NAME */}

                    <td className="px-7 py-4 text-sm text-slate-900">
                      {user.name}
                    </td>

                    {/* EMAIL */}

                    <td className="px-7 py-4 text-sm text-slate-900">
                      {user.email}
                    </td>

                    {/* ROLE */}

                    <td className="px-7 py-4 text-sm text-slate-900">
                      {user.role}
                    </td>

                    {/* STATUS */}

                    <td className="px-7 py-4">

                      <span
                        className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>

                    {/* JOINED */}

                    <td className="px-7 py-4 text-sm text-slate-900">
                      {user.joined}
                    </td>

                    {/* ACTION */}

                    <td className="relative px-3 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === user.id
                              ? null
                              : user.id
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* ACTION MENU */}

                      {openMenuId === user.id && (
                        <div className="absolute right-5 top-[52px] z-30 w-[180px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.10)]">

                          {/* CHANGE ROLE */}

                          <button
                            type="button"
                            onClick={() =>
                              openRoleModal(user)
                            }
                            className="flex h-[38px] w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            <UserRoundCog
                              size={18}
                              className="text-slate-500"
                            />

                            Change Role
                          </button>

                          {/* ACTIVATE / DEACTIVATE */}

                          <button
                            type="button"
                            onClick={() =>
                              openConfirmation(user)
                            }
                            className={`flex h-[38px] w-full items-center gap-3 rounded-md px-2.5 text-left text-sm font-medium ${
                              user.status === "Active"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >

                            {user.status === "Active" ? (
                              <>
                                <UserX size={18} />
                                Deactivate User
                              </>
                            ) : (
                              <>
                                <UserCheck size={18} />
                                Activate User
                              </>
                            )}

                          </button>

                        </div>
                      )}

                    </td>

                  </tr>
                ))
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

      {/*pagination*/}

      <div className="mt-6 flex justify-end gap-1.5">

        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`h-10 w-10 rounded-md border text-sm font-medium ${
              currentPage === page
                ? "border-[#19295F] bg-[#19295F] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>

      </div>

      {/* change role model */}

      {roleModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">

          <div className="relative w-[420px] rounded-xl bg-white p-7 shadow-2xl">

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setRoleModal(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>

            <h2 className="text-lg font-semibold text-slate-900">
              Change Role
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Change the role for {roleModal.name}.
            </p>

            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <div className="relative">

                <select
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="HR Manager">
                    HR Manager
                  </option>

                  <option value="Recruiter">
                    Recruiter
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
                onClick={() => setRoleModal(null)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveRole}
                className="h-10 rounded-lg bg-[#19295F] px-5 text-sm font-medium text-white hover:bg-blue-900"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

      {/* activate / deactivate modal */}

      {confirmationModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">

          <div className="relative w-[420px] rounded-xl bg-white p-7 shadow-2xl">

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setConfirmationModal(null)
              }
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>

            {/* ICON */}

            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${
                confirmationModal.status === "Active"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {confirmationModal.status === "Active" ? (
                <AlertTriangle size={24} />
              ) : (
                <Check size={25} />
              )}
            </div>

            {/* TITLE */}

            <h2 className="text-lg font-semibold text-slate-900">

              {confirmationModal.status === "Active"
                ? "Deactivate User?"
                : "Activate User?"}

            </h2>

            {/* DESCRIPTION */}

            <p className="mt-2 text-sm leading-5 text-slate-500">

              {confirmationModal.status === "Active"
                ? `${confirmationModal.name} will no longer be able to access the system.`
                : `${confirmationModal.name} will regain access to the system.`}

            </p>

            {/* BUTTONS */}

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setConfirmationModal(null)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmStatusChange}
                className={`h-10 rounded-lg px-5 text-sm font-medium text-white ${
                  confirmationModal.status === "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {confirmationModal.status === "Active"
                  ? "Deactivate"
                  : "Activate"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

//stat card component

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  valueColor = "text-[#19295F]",
}) {
  return (
    <div className="h-[132px] rounded-[14px] border border-slate-200 bg-white px-5 py-4">

      <div className="flex items-center gap-2">

        <Icon
          size={22}
          className={iconColor}
        />

        <span className="text-sm text-slate-700">
          {title}
        </span>

      </div>

      <div
        className={`mt-5 text-[20px] font-medium ${valueColor}`}
      >
        {value}
      </div>

      <p className="mt-4 text-xs text-slate-900">
        {description}
      </p>

    </div>
  );
}

export default UserManagement;