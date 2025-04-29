/** @format */
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white px-6 min-h-screen">
      <div className="text-center">
        <h1 className="font-bold text-gray-900 text-8xl">404</h1>
        <h2 className="mt-4 font-semibold text-gray-700 text-2xl">
          Oops! Page not found
        </h2>
        <p className="mt-2 text-gray-500">
          The page you&apos;re looking for doesn’t exist or has been moved.
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
          src="https://illustrations.popsy.co/amber/crashed-error.svg"
          alt="404 Illustration"
          className="w-72 h-auto"
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
