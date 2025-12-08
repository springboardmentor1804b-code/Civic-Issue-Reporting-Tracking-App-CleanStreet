import React from "react";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-[#F5E5D3] flex flex-col">

      {/* TOP LOGO */}
      <div className="flex items-center gap-3 px-6 py-4">
        <img src="/street-light-icon.svg" alt="logo" className="w-8 sm:w-10" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-black">
          clean street
        </h1>
      </div>

      {/* CENTER WRAPPER */}
      <div className="flex flex-1 justify-center items-center px-4">

        {/* LOGIN BOX (SIZE UNCHANGED) */}
        <div
          className="
            bg-[#BD8234]
            w-full max-w-[550px]
            rounded-xl
            shadow-xl
            px-6 sm:px-10
            py-8
            border border-black/10
          "
        >
          {/* TITLE */}
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold underline mb-6">
            Login
          </h2>

          {/* FORM */}
          <form className="space-y-8">

            {/* USERNAME */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-lg sm:text-xl font-semibold text-black">
                  User Name
                </label>
                <FaUser className="text-2xl sm:text-3xl" />
              </div>

              <input
                type="text"
                className="
                  w-full border-b-2 border-black bg-transparent
                  py-2 mt-1 text-lg sm:text-xl focus:outline-none
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-lg sm:text-xl font-semibold text-black">
                  Password
                </label>
                <FaLock className="text-2xl sm:text-3xl" />
              </div>

              <input
                type="password"
                className="
                  w-full border-b-2 border-black bg-transparent
                  py-2 mt-1 text-lg sm:text-xl focus:outline-none
                "
              />
            </div>

            {/* LINKS */}
            <div className="flex justify-between text-sm sm:text-base font-medium">
              <a href="/register" className="hover:underline">
                New user? Create an account.
              </a>
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="
                  bg-[#A46622]
                  text-white
                  rounded-lg
                  px-10 py-2
                  text-lg font-semibold
                  hover:brightness-90
                  shadow-md
                "
              >
                Login
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
