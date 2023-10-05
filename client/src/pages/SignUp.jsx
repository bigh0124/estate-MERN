import React from "react";
import { Link } from "react-router-dom";
const SignUp = () => {
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 ">
        <input type="text" placeholder="username" className="p-3 border rounded-lg" id="username" />
        <input type="email" placeholder="email" className="p-3 border rounded-lg" id="email" />
        <input type="password" placeholder="password" className="p-3 border rounded-lg" id="password" />
        <button className="text-white p-3 border rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 uppercase">
          sign up
        </button>
      </form>
      <div className="flex mt-3 gap-3">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
