import React from "react";
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import newRequest from "../utils/request";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OAuth = ({ text }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async (e) => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const { displayName, email, photoURL } = result.user;
      const { data } = await newRequest.post("auth/google", { username: displayName, email, avatar: photoURL });
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("can't auth with google", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 p-3 text-white rounded-lg uppercase hover:opacity-95"
    >
      {text}
    </button>
  );
};

export default OAuth;
