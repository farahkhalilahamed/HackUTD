import React from "react";
import { Link } from "react-router-dom";
 
function Navbar() {
  return (
    <>
        <div className="flex flex-row justify-between items-center px-20 py-4 bg-darkteal">

            {/* TITLE */}
            <Link to='/dashboard' className="text-white text-3xl poppins-bold transition duration-300">
                EcoData
            </Link>

            {/* MENU */}
            <div className="flex flex-row gap-8 poppins-semibold text-2xl text-white">
                <Link to='/dashboard' className="hover:text-darkblue transition duration-300">Dashboard</Link>
                <Link to='/upload' className="hover:text-darkblue transition duration-300">Upload</Link>
                <Link to='/profile' className="hover:text-darkblue transition duration-300">Profile</Link>
            </div>
        </div>

        {/* DIVIDER */}
        <hr className="w-full border-t-2 border-teal border-opacity-50"/>
    </>
  );
}
 
export default Navbar;