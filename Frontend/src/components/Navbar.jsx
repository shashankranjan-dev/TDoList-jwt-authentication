import React, { useState } from "react";
import Lottie from "lottie-react";
import todo from "../assets/lottie/todo.json";

function Navbar() {
  const user = localStorage.getItem("name");
  console.log(user);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <nav className="flex items-center justify-between p-4 bg-white text-white">
      <div className="flex items-center">
        <Lottie className="h-8 w-8 mr-2" animationData={todo} loop={true} />
        <span className="text-lg text-gray-400">To-Do</span>
      </div>

      {/* <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search for todo"
          className="px-4 py-2 rounded-md border-2 border-gray-200 text-black lg:w-96  focus:outline-none"
        />
      </div> */}

      <div className="flex items-center">
        <div className="">
          <span className="mr-2 text-sm text-gray-400">{user}, </span>
          <span
            onClick={handleLogout}
            className="mr-2 text-sm text-red-400 hover:text-red-600 hover:cursor-pointer"
          >
            Logout
          </span>
        </div>
        <img
          src="./assets/profile.jpg"
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
      </div>
    </nav>
  );
}

export default Navbar;
