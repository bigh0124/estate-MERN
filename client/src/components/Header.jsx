import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="bg-slate-200 shadow-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Estate</span>
            <span className="text-slate-700">M</span>
          </h1>
        </Link>
        <form className="bg-slate-100 rounded-lg p-3 flex items-center">
          <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
          <FaSearch className="text-slate-600" />
        </form>
        <nav>
          <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline underline-offset-4">Home</li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline underline-offset-4">About</li>
            </Link>
            <Link to="sign-in">
              <li className=" text-slate-700 hover:underline underline-offset-4">Sing in</li>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
