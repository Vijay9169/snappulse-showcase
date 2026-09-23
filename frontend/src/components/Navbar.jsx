import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, PlusSquare, Image as ImageIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 tracking-tight">
          <ImageIcon className="w-6 h-6" />
          <span>SnapPulse</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/create"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                <PlusSquare className="w-4 h-4" />
                Upload Project
              </Link>
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-100 border" />
                <span className="text-sm font-semibold hidden sm:inline-block">{user.name}</span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-slate-500 hover:text-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}