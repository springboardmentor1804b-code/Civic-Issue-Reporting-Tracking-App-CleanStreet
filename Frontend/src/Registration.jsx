import React from "react";

export default function Registration() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.36fr_0.64fr] h-screen w-full overflow-hidden bg-white">

      {/* LEFT PANEL */}
      <div className="flex flex-col h-full bg-[#C2873B]">

        {/* TOP TEXT */}
        <div className="mt-6">
          <img
            src="/street-light-icon.svg"
            alt="Logo"
            className="w-12 sm:w-14"
          />

          {/* Text aligned under logo */}
          <div className="mt-4 ml-2">
            <h1 className="text-3xl font-extrabold text-black sm:text-4xl">
              Join CleanStreet
            </h1>

            <p className="text-sm font-medium leading-5 text-black sm:text-base mt-1">
              Be a part of making your city cleaner and smarter....
            </p>
          </div>
        </div>

        {/* IMAGE - vertically centered */}
        <div className="flex-grow flex justify-center items-center">
          <img
            src="/street.jpg"
            alt="Street"
            className="w-full max-h-[50vh] object-cover rounded-md mt-4"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col justify-start h-full px-6 sm:px-10 py-6 overflow-hidden">
        <div className="mx-auto w-full max-w-[420px]">
          
          <h2 className="text-center text-3xl font-extrabold text-black sm:text-4xl mb-4">
            Sign Up
          </h2>

          {/* FORM */}
          <form className="space-y-2">
            {[
              "User Name",
              "Email",
              "Password",
              "Confirm password",
              "Location",
              "Gender(He/She)",
              "Role(User/Volunteer/admin)",
            ].map((label) => (
              <div className="space-y-[2px]" key={label}>
                <label className="block text-sm font-medium text-black">{label}</label>

                <input
                  type="text"
                  className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-1 
                             text-sm font-medium text-black focus:border-black focus:outline-none"
                />
              </div>
            ))}

            {/* Login link */}
            <a href="/login" className="text-sm font-semibold text-[#3F81EA] hover:underline">
  already have an account? Login
</a>


            {/* BUTTON */}
            <div className="flex justify-center pt-1">
              <button
                type="submit"
                className="w-[200px] rounded-full bg-[#C2873B] px-6 py-2.5 text-base font-semibold
                           text-white shadow-sm transition hover:brightness-95"
              >
                Create Account
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

