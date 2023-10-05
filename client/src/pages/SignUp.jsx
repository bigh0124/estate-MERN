import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequset from "../utils/request";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await newRequset.post("/auth/signup", { ...formData });
      if (data.success === false) {
        setIsLoading(false);
        setError(data.message);
        return;
      }
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          type="text"
          placeholder="username"
          className="p-3 border rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input type="email" placeholder="email" className="p-3 border rounded-lg" id="email" onChange={handleChange} />
        <input
          type="password"
          placeholder="password"
          className="p-3 border rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="text-white p-3 border rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 uppercase"
        >
          {isLoading ? "loading..." : "Sing Up"}
        </button>
      </form>
      <div className="flex mt-3 gap-3">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default SignUp;
