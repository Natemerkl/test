
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-4">
        <Link to="/" className="mb-8 text-2xl font-bold text-primary">
          YegnaBoost 🚀
        </Link>
        <div className="w-full bg-white rounded-lg shadow-md p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
