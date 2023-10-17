import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable } from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import newRequest from "../utils/request";
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePrec, setFilePrec] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listings, setListings] = useState([]);
  const [isShowListings, setIsShowListings] = useState(false);
  const [deleteListingError, setDeletedListingError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(null);
  const fileRef = useRef(null);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) uploadFile(file);
  }, [file]);

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
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    try {
      dispatch(updateUserStart());
      const { data } = await newRequest.post(`/user/update/${currentUser._id}`, formData);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.response.data.message));
    }
  };

  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const { data } = await newRequest.delete(`/user/delete/${currentUser._id}`);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(null));
    } catch (err) {
      dispatch(deleteUserFailure(err.response.data.message));
    }
  };

  const handleSignOut = async (e) => {
    try {
      dispatch(signOutStart());
      const { data } = await newRequest.post("/auth/signout");
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(null));
    } catch (err) {
      dispatch(signOutFailure(err.response.data.message));
    }
  };

  const getListings = async () => {
    try {
      setIsShowListings(true);
      setShowListingsError("");
      const { data } = await newRequest.get(`/user/listings/${currentUser._id}`);
      setListings(data);
      if (data.length === 0) {
        setShowListingsError("You have no listing");
      }
      setIsShowListings(false);
    } catch (err) {
      setShowListingsError(err.response.data.message);
      setIsShowListings(false);
    }
  };

  const handleShowListings = async (e) => {
    if (listings.length === 0) {
      await getListings();
    } else {
      setListings([]);
    }
  };

  const handleListingRemove = async (id) => {
    try {
      await newRequest.delete(`/listing/delete/${id}`);
      await getListings();
    } catch (err) {
      setDeletedListingError(err.response.data.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
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
        {error ? <span className="text-red-700 text-center">Email or username has been used</span> : ""}
        {updateSuccess ? <span className="text-green-700 text-center">Update Successful</span> : ""}
        <input
          type="text"
          placeholder="username"
          className="p-3 border rounded-lg"
          id="username"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          className="p-3 border rounded-lg"
          id="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="p-3 border rounded-lg"
          id="password"
          onChange={handleChange}
          defaultValue={""}
        />
        <button
          disabled={loading}
          type="submit"
          className="text-white p-3 border rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 uppercase"
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          to="/create-listing"
          className="text-white p-3 border rounded-lg bg-green-700 hover:opacity-95 disabled:opacity-80 uppercase text-center"
        >
          create listing
        </Link>
        <div className="flex justify-between">
          <button onClick={handleDeleteUser} type="button" className="text-red-500">
            Delete Account
          </button>
          <button onClick={handleSignOut} type="button" className="text-red-500">
            Sign Out
          </button>
        </div>
        <button type="button" onClick={handleShowListings} className="text-green-800 text-center">
          <span>{listings.length > 0 ? "Close listings" : "Show listings"}</span>
        </button>
        {showListingsError && (
          <span className="text-red-700 text-center">
            {showListingsError}
            {listings.length === 0 ? (
              <Link className="text-green-600 uppercase hover:underline ml-4" to="/create-listing">
                create new one?
              </Link>
            ) : (
              ""
            )}
          </span>
        )}
        {deleteListingError && <span className="text-red-700 text-center">{deleteListingError}</span>}
      </form>

      <div className="mt-4">
        {listings.length > 0 && <h1 className="text-3xl text-center font-semibold my-7">Your Listings</h1>}
        {listings.map((listing, i) => {
          return (
            <div key={i} className="p-3 border rounded-lg flex mb-4 justify-between gap-4">
              <Link to={`listing/${listing._id}`} className="flex items-center gap-4 flex-1">
                <img src={listing.imageUrls[0]} alt="" className="h-12 w-20 object-cover" />
                <span className="text-semibold hover:underline">{listing.name}</span>
              </Link>
              <div className="flex flex-col gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => handleListingRemove(listing._id)}
                  className="text-red-700 uppercase"
                >
                  delete
                </button>
                <button className="text-green-700 uppercase">edit</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
