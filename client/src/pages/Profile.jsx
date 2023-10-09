import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePrec, setFilePrec] = useState(0);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    if (file) uploadFile(file);
  }, [file]);
  console.log(formData, filePrec, fileUploadError);

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },
      (err) => {
        setFileUploadError(true);
      },
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        })
    );
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4 ">
        <input type="file" accept="image/*" hidden ref={fileRef} onChange={(e) => setFile(e.target.files[0])} />
        <img
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center"
          src={formData.avatar || currentUser.avatar}
          alt="photo"
          onClick={() => fileRef.current.click()}
        />
        {fileUploadError ? (
          <span className="text-red-700 text-center">Upload error</span>
        ) : filePrec > 0 && filePrec < 100 ? (
          <span className="text-slate-700 text-center">{`Uploading ${filePrec}%`}</span>
        ) : filePrec == 100 ? (
          <span className="text-green-700 text-center">Image successfully uploaded!</span>
        ) : (
          ""
        )}
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
