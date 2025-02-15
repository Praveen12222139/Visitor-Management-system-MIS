// import { Link } from "react-router-dom";
// import { isAuthenticated, logoutUser } from "../utils/auth";

// const Navbar = () => {
//   return (
//     <nav className="p-4 bg-gray-900 text-white flex items-center justify-between">
//       <h1 className="text-lg font-semibold">MIS Visitor Management</h1>
//       <div className="flex items-center space-x-4">
//         <Link to="/" className="hover:text-gray-300 transition">
//           Book Appointment
//         </Link>
//         {isAuthenticated() ? (
//           <>
//             <Link to="/dashboard" className="hover:text-gray-300 transition">
//               Dashboard
//             </Link>
//             <button
//               onClick={logoutUser}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="hover:text-gray-300 transition">
//               Login
//             </Link>
//             <Link to="/register" className="hover:text-gray-300 transition">
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { Link } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../utils/auth";

const Navbar = () => {
return (
    <nav className="p-4 bg-gradient-to-r from-green-100 via-green-50 to-emerald-100 text-gray-800 flex items-center justify-between shadow-lg backdrop-blur-sm border-b border-green-200/30">
        {/* Branding Section */}
        <div className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-md transform transition duration-300 hover:rotate-12">
                <svg
                    className="w-8 h-8 text-white drop-shadow"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7l6 6-6 6M21 7l-6 6 6 6"
                    />
                </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent transition-all duration-500 hover:brightness-125">
                MIS Visitor Management
            </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
            <Link
                to="/"
                className="relative group px-3 py-2 transition-all"
            >
                <span className="flex items-center gap-2 hover:text-green-700 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>Book Appointment</span>
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-500 group-hover:w-4/5 transition-all duration-300 -translate-x-1/2"></span>
            </Link>

            {isAuthenticated() ? (
                <>
                    <Link
                        to="/dashboard"
                        className="relative group px-3 py-2 transition-all"
                    >
                        <span className="flex items-center gap-2 hover:text-green-700 transition-colors">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            <span>Dashboard</span>
                        </span>
                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-500 group-hover:w-4/5 transition-all duration-300 -translate-x-1/2"></span>
                    </Link>
                    <button
                        onClick={logoutUser}
                        className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-2.5 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-white"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        <span>Logout</span>
                    </button>
                </>
            ) : (
                <>
                    <Link
                        to="/login"
                        className="relative group px-3 py-2 transition-all"
                    >
                        <span className="flex items-center gap-2 hover:text-green-700 transition-colors">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                            </svg>
                            <span>Login</span>
                        </span>
                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-500 group-hover:w-4/5 transition-all duration-300 -translate-x-1/2"></span>
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center gap-2 bg-gradient-to-br from-green-400 to-emerald-500 px-6 py-2.5 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-white"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                        </svg>
                        <span>Register</span>
                    </Link>
                </>
            )}
        </div>
    </nav>
);
};

export default Navbar;
