export default function Landing() {
  return (
    <div className="h-screen w-full bg-[#F5E5D3] flex flex-col justify-center items-center gap-6">

      <h1 className="text-4xl font-bold text-black">
        Welcome to Clean Street
      </h1>

      <div className="flex gap-6 mt-4">
        <a
          href="/login"
          className="px-8 py-3 bg-[#A46622] text-white rounded-md text-xl font-semibold hover:brightness-90"
        >
          Login
        </a>

        <a
          href="/register"
          className="px-8 py-3 bg-[#BD8234] text-white rounded-md text-xl font-semibold hover:brightness-90"
        >
          Register
        </a>
      </div>
    </div>
  );
}
