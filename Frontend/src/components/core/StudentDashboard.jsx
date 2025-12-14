import { useState } from 'react';
import iconLogo from '../../../public/logo.png'
import { toast } from 'react-hot-toast';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slice/authSlice';
import FaceRegistration from './attendance/FaceRegistration';
import MarkAttendance from './attendance/MarkAttendance';
import StudentAttendanceRecords from './attendance/StudentAttendanceRecords';

// --- SVG Icons (to replace react-icons dependency) ---
const IconGrid = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>
    </svg>
);
const IconGitBranch = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
);
const IconBookOpen = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);
const IconUsers = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const IconChevronsLeft = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>
    </svg>
);
const IconChevronsRight = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>
    </svg>
);


// --- Component Definitions ---

// 1. Sidebar Component (Updated with Toggle Functionality)
const Sidebar = ({userName, setActiveComponent, activeComponent, isSidebarCollapsed, setIsSidebarCollapsed }) => {
    const navItems = [
        { name: 'DashboardHome', label: 'Dashboard', icon: IconGrid },
        { name: 'MarkAttendance', label: 'Mark Attendance', icon: IconGitBranch },
        { name: 'AttendanceRecords', label: 'Attendance Records', icon: IconBookOpen },
        { name: 'ManageFaceRegistration', label: 'Manage Face Registration', icon: IconUsers },
        { name: 'Logout', label: 'Logout', icon: FiLogOut },
    ];

    return (
        <aside className={`relative flex flex-col bg-white shadow-md flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`p-4 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                <div className="bg-indigo-600 p-2 rounded-lg">
                   <img src={iconLogo} className={`h-12 ${isSidebarCollapsed ? 'w-20' : 'w-auto'} text-white`}/>
                </div>
                <div className={`ml-3 overflow-hidden transition-all ${isSidebarCollapsed ? 'w-0' : 'w-auto'}`}>
                    <h1 className="text-xl font-bold text-indigo-600 whitespace-nowrap">Hi, {userName}</h1>
                </div>
            </div>
            
            <nav className="mt-6 px-2 flex-grow">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name} className="mb-2">
                            <button
                                onClick={() => setActiveComponent(item.name)}
                                title={item.label}
                                className={`flex bg-white focus:outline-none items-center w-full p-3 rounded-lg text-left text-base font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}
                                    ${activeComponent === item.name
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <item.icon className="h-6 w-6 flex-shrink-0" />
                                <span className={`ml-3 whitespace-nowrap ${isSidebarCollapsed ? 'hidden' : 'block'}`}>{item.label}</span>
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
                    {isSidebarCollapsed 
                        ? <IconChevronsRight className="h-6 w-6" title="Show Sidebar"/> 
                        : <div className="flex items-center w-full"><IconChevronsLeft className="h-6 w-6 flex-shrink-0" /><span className="ml-3 whitespace-nowrap">Hide Sidebar</span></div>
                    }
                </button>
            </div>
        </aside>
    );
};


// 2. Default Dashboard View Component
const DashboardHome = ({user}) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Select a category from the sidebar to get started.</p>
        <div className="max-w-7xl my-4 mx-auto">
          {/* Profile Card */}
          <div className="lg:col-span-1 my-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            <div className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-lg mr-2">👤</span> Profile Details
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center">
                <span className="font-semibold text-gray-900 mr-2 min-w-[100px]">Name:</span>
                <span className="flex-1">{user?.firstName} {user?.lastName}</span>
              </p>
              <p className="flex items-center">
                <span className="font-semibold text-gray-900 mr-2 min-w-[100px]">Roll No:</span>
                <span className="flex-1">{user.rollNo}</span>
              </p>
              <p className="flex items-center">
                <span className="font-semibold text-gray-900 mr-2 min-w-[100px]">Branch:</span>
                <span className="flex-1">{user.branch}</span>
              </p>
              <p className="flex items-center">
                <span className="font-semibold text-gray-900 mr-2 min-w-[100px]">Year:</span>
                <span className="flex-1">{user.year}</span>
              </p>
            </div>
          </div>

          {/* Courses Section */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-lg mr-2">📚</span> Courses Enrolled
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white px-4 py-4 rounded-2xl shadow-md border border-gray-200 transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  <h3 className="text-md font-semibold text-gray-900">{course.courseName}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
);

const LogoutIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

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
        <div className="text-center flex-row justify-center items-center w-72 mx-auto text-black">
            <div className="">Are you sure you want to logout?</div>
            <div className="flex justify-center space-x-4 mt-4 items-center">
            <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4  text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            <LogoutIcon className="w-5 h-5" />
            <span>Logout</span>
        </button>
                <button onClick={() => setActiveComponent('DashboardHome')} className=" bg-gray-600 text-white px-4 rounded">Cancel</button>
            </div>
        </div>
        </>
    );
};





// --- Main Admin Dashboard Component (Updated with Toggle State) ---
const StudentDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('DashboardHome');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'MarkAttendance':
                return <MarkAttendance user={user}/>;
            case 'AttendanceRecords':
                return <StudentAttendanceRecords />;
            case 'ManageFaceRegistration':
                return <FaceRegistration isFaceRegistered={isFaceRegistered} user_id={user?._id} />;
            case 'Logout':
                return <Logout />;
            default:
                return <DashboardHome user={user} />;
        }
    };

    console.log("User in Student Dashboard:", user);

    const isFaceRegistered = user?.isFaceRegistered;

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
            userName={user?.firstName + " " + user?.lastName}
                setActiveComponent={setActiveComponent} 
                activeComponent={activeComponent} 
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
            />
            <main className="flex-1 overflow-y-auto p-8">
                {renderComponent()}
            </main>
        </div>
    );
};

export default StudentDashboard;

