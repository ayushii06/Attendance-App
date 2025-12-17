import React, { useState } from "react";
import iconLogo from "../../../public/logo.png";
import { toast } from "react-hot-toast";
import ManageBranches from "./dashboard/admin/ManageBranches";
import ManageCourses from "./dashboard/admin/ManageCourses";
import ManageStudents from "./dashboard/admin/ManageStudents";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slice/authSlice";
const IconGrid = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
  </svg>
);
const IconGitBranch = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="6" y1="3" x2="6" y2="15"></line>
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <path d="M18 9a9 9 0 0 1-9 9"></path>
  </svg>
);
const IconBookOpen = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
const IconUsers = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const IconChevronsLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="11 17 6 12 11 7"></polyline>
    <polyline points="18 17 13 12 18 7"></polyline>
  </svg>
);
const IconChevronsRight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="13 17 18 12 13 7"></polyline>
    <polyline points="6 17 11 12 6 7"></polyline>
  </svg>
);
const LogoutIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);

// --- Component Definitions ---

// 1. Sidebar Component (Updated with Toggle Functionality)
const Sidebar = ({
  setActiveComponent,
  activeComponent,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  const navItems = [
    { name: "DashboardHome", label: "Dashboard", icon: IconGrid },
    { name: "ManageBranches", label: "Manage Branches", icon: IconGitBranch },
    { name: "ManageCourses", label: "Manage Courses", icon: IconBookOpen },
    { name: "ManageStudents", label: "Manage Students", icon: IconUsers },
    { name: "Logout", label: "Logout", icon: FiLogOut },
  ];

  return (
    <aside
      className={`hidden md:flex relative flex-col bg-white shadow-md flex-shrink-0 transition-all duration-300
  ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
      <div
        className={`p-4 flex items-center ${
          isSidebarCollapsed ? "justify-center" : "justify-start"
        }`}
      >
        <div className="bg-indigo-600 p-2 rounded-lg">
          <img
            src={iconLogo}
            className={`h-12 ${
              isSidebarCollapsed ? "w-20" : "w-auto"
            } text-white`}
          />
        </div>
        <div
          className={`ml-3 overflow-hidden transition-all ${
            isSidebarCollapsed ? "w-0" : "w-auto"
          }`}
        >
          <h1 className="text-xl font-bold text-indigo-600 whitespace-nowrap">
            RGIPT Admin
          </h1>
        </div>
      </div>

      <nav className="mt-6 px-2 flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => setActiveComponent(item.name)}
                title={item.label}
                className={`flex bg-white focus:outline-none items-center w-full p-3 rounded-lg text-left text-base font-medium transition-colors ${
                  isSidebarCollapsed ? "justify-center" : ""
                }
                                    ${
                                      activeComponent === item.name
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
              >
                <item.icon className="h-6 w-6 flex-shrink-0" />
                <span
                  className={`ml-3 whitespace-nowrap ${
                    isSidebarCollapsed ? "hidden" : "block"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 border-t border-gray-200">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex items-center focus:outline-none justify-center w-full p-3 rounded-lg text-gray-600 bg-white outline-none border-none hover:bg-gray-100"
        >
          {isSidebarCollapsed ? (
            <IconChevronsRight className="h-6 w-6" title="Show Sidebar" />
          ) : (
            <div className="flex items-center w-full">
              <IconChevronsLeft className="h-6 w-6 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap">Hide Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

// 2. Default Dashboard View Component
const DashboardHome = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
    <p className="mt-2 text-gray-600">
      Welcome back! Select a category from the sidebar to get started.
    </p>
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Total Faculty</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">56</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Branches</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Courses</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">4</p>
      </div>
    </div>
  </div>
);

const MobileBottomTabs = ({ activeComponent, setActiveComponent }) => {
  const navItems = [
    { name: "DashboardHome", label: "Home", icon: IconGrid },
    { name: "ManageBranches", label: "Branches", icon: IconGitBranch },
    { name: "ManageCourses", label: "Courses", icon: IconBookOpen },
    { name: "ManageStudents", label: "Students", icon: IconUsers },
    { name: "Logout", label: "Logout", icon: FiLogOut },
  ];

  return (
    <nav className="fixed py-2 bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:hidden w-auto">
      <ul className="flex justify-evenly">
        {navItems.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => setActiveComponent(item.name)}
              className={`flex flex-col items-center w-full text-sm px-2 py-2    bg-white outline-none focus:outline-none focus-visible:outline-none   ${
                activeComponent === item.name
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-500"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1 " />
           <span className="sm:block hidden">
              {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch the logout action to clear the state
    dispatch(logout());

    // Show a success message
    toast.success("Logged Out Successfully!");

    // Navigate the user to the login page
    navigate("/signup");
  };

  return (
    <>
      <div className="text-center flex-row justify-center items-center flex-wrap mx-auto text-black">
        <div className="">Are you sure you want to logout?</div>
        <div className="flex justify-center mt-4 items-center flex-wrap gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4  text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogoutIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
          <button
            onClick={() => setActiveComponent("DashboardHome")}
            className=" bg-gray-600 text-white px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

// --- Main Admin Dashboard Component (Updated with Toggle State) ---
const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("DashboardHome");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case "ManageBranches":
        return <ManageBranches />;
      case "ManageCourses":
        return <ManageCourses />;
      case "ManageStudents":
        return <ManageStudents />;
      case "Logout":
        return <Logout />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
        {renderComponent()}
      </main>

      <MobileBottomTabs
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
    </div>
  );
};

export default AdminDashboard;
