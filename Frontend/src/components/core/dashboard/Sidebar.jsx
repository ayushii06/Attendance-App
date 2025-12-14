import React from 'react';
// Using a simple icon library for demonstration
// You might need to install it: `npm install react-icons`
import { 
    FiGrid, 
    FiGitBranch, 
    FiBookOpen, 
    FiUsers, 
    FiBriefcase 
} from 'react-icons/fi';

const Sidebar = ({ setActiveComponent, activeComponent }) => {
    const navItems = [
        { name: 'DashboardHome', label: 'Dashboard', icon: FiGrid },
        { name: 'ManageBranches', label: 'Manage Branches', icon: FiGitBranch },
        { name: 'ManageCourses', label: 'Manage Courses', icon: FiBookOpen },
        { name: 'ManageStudents', label: 'Manage Students', icon: FiUsers },
        { name: 'ManageFaculty', label: 'Manage Faculty', icon: FiBriefcase },
    ];

    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-600">College Admin</h1>
                <p className="text-sm text-gray-500">Pro Plan</p>
            </div>
            <nav className="mt-6 px-4">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name} className="mb-2">
                            <button
                                onClick={() => setActiveComponent(item.name)}
                                className={`flex items-center w-full p-3 rounded-lg text-left text-base font-medium transition-colors
                                    ${activeComponent === item.name
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <item.icon className="mr-3 h-6 w-6" />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
