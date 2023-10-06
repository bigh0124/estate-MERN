import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {};

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4 ">
        <img
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center"
          src={currentUser.avatar}
          alt="photo"
        />
        <input
          type="text"
          placeholder="username"
          className="p-3 border rounded-lg"
          id="username"
          onChange={handleChange}
          // value={username}
        />
        <input type="email" placeholder="email" className="p-3 border rounded-lg" id="email" onChange={handleChange} />
        <input
          type="password"
          placeholder="password"
          className="p-3 border rounded-lg"
          id="password"
          onChange={handleChange}
          // value={email}
        />
        <button className="text-white p-3 border rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 uppercase">
          update
        </button>
        <button className="text-white p-3 border rounded-lg bg-green-700 hover:opacity-95 disabled:opacity-80 uppercase">
          create listing
        </button>
        <div className="flex justify-between">
          <button className="text-red-500">Delete Account</button>
          <button className="text-red-500">Sign Out</button>
        </div>
        <Link to="/" className="text-green-800 text-center">
          <span>Show listings</span>
        </Link>
      </form>
    </div>
  );
};

export default Profile;
