import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCrosshair } from 'react-icons/fi';
import { useGetBranchDetailsMutation, useGetBranchesByYearMutation } from '../../../services/branchApi';


const UserIcon = () => (
    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const BookOpenIcon = () => (
    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7z" />
        <path d="M10 14a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);


function ManageStudents() {
    const [getBranches, { isLoading: isGetting }] = useGetBranchesByYearMutation();
    const [ getBranchDetails,{isLoading: isLoadingStudents, isError: isErrorStudents }] = useGetBranchDetailsMutation();

    const [year, setYear] = useState('');
    const [branchId, setBranchId] = useState('');
    const [branches, setBranches] = useState([]);
    const [students, setStudents] = useState([]);

    const handleFindBranches = async (e) => {
            setYear(e);
            console.log(year);

        try {
            const result = await getBranches({ year }).unwrap();
            console.log("Branches fetched:", result);
            setBranches(result);

        } catch (error) {
            toast.error("Failed to fetch branches.");
        }
    }

    const handleFindBranchDetails = async (e) => {
      e.preventDefault();
      if (!branchId) {
              toast.error("Please select a branch.");
                  return;
      }

              try {
            const result = await getBranchDetails({branchId}).unwrap();
            console.log("Branch details fetched:", result);
            setStudents(result.students);
        } catch (error) {
            toast.error("Failed to fetch branches.");
        }
      
    }

    const formFieldStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-2.5";


    return (
        <>
            <div className="">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Students</h1>
                <p className="text-gray-500 mb-4 ">View and manage student details here.</p>
                
            </div>

            <form onSubmit={handleFindBranchDetails} className="flex items-end gap-4 justify-evenly ">
                <div className="md:col-span-1 w-[80%]">

                    <label className="block mb-2 text-sm font-medium text-gray-900">Year <span className="text-red-500">*</span></label>
                    <select name="year" value={year} onChange={(e)=>{handleFindBranches(e.target.value)}} className={formFieldStyle} required>
                        <option value="" disabled>Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>

                </div>
                <div className="md:col-span-1 w-[80%]">

                    <label className="block mb-2 text-sm font-medium text-gray-900">Branch <span className="text-red-500">*</span></label>
                    <select name="branchId" value={branchId} onChange={(e) => setBranchId(e.target.value)} className={formFieldStyle} required>
                        <option value="" disabled>Select Branch</option>
                        {branches.map((b) => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>

                </div>

                <button type='submit' className='w-[30%]'>Find</button>
            </form>

            {isGetting && <p className='text-black font-bold text-2xl text-center my-32'>Loading...</p>}


            {students.length === 0 ? (
                <p className='text-black font-bold text-2xl text-center my-32'>No students found.</p>
            ) : (

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-12'>
                    {students.map((student) => (
                        // Each card is a single linkable element for better accessibility
                        <div key={student._id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 flex flex-col">

                            {/* Student Content */}
                            <div className="p-5 flex-grow flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center">
                                    <UserIcon />
                                    {student.firstName} {student.lastName}
                                </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 ">
                                          
                                          Roll No: {student.rollNo}
                                          </p>


                               
                            </div>

                           
                        </div>
                    ))}
                </div>
            )}

        </>
    );
}

export default ManageStudents