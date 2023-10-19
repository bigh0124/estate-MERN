import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import newRequset from "../utils/request";
import { useEffect, useState } from "react";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-slate-200 shadow-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Estate</span>
            <span className="text-slate-700">M</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg p-3 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <nav>
          <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline underline-offset-4">Home</li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline underline-offset-4">About</li>
            </Link>
            {currentUser ? (
              <Link to="profile">
                <img
                  className="rounded-full w-7 h-7 object-cover ml-12 cursor-pointer"
                  src={currentUser.avatar}
                  alt="photo"
                />
              </Link>
            ) : (
              <Link to="sign-in">
                <li className=" text-slate-700 hover:underline underline-offset-4">Sing in</li>
              </Link>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
