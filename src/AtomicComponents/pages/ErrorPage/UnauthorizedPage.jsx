/** @format */
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white px-6 min-h-screen">
      <div className="text-center">
        <h1 className="font-bold text-gray-900 text-8xl">401</h1>
        <h2 className="mt-4 font-semibold text-gray-700 text-2xl">
          Unauthorized Access
        </h2>
        <p className="mt-2 text-gray-500">
          You don&apos;t have permission to view this page.
        </p>

        <Link
          to="/"
          className="inline-block bg-black hover:bg-gray-800 mt-6 px-6 py-3 rounded-lg text-white transition-all"
        >
          Go back home
        </Link>
      </div>

      <div className="mt-10">
        <img
          src="https://illustrations.popsy.co/amber/timed-out-error.svg"
          alt="Unauthorized Illustration"
          className="w-72 h-auto"
        />
      </div>
    </div>
  );
};

export default UnauthorizedPage;
