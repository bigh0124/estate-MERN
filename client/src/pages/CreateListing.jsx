import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  console.log(formData);
  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setIsUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadFile(files[i]));
      }

      Promise.all(promises)
        .then((url) => {
          setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.concat(url) }));
          setIsUploading(false);
        })
        .catch((err) => {
          setImageUploadErrorMessage("Image upload failed (2 mb max per image)");
          setIsUploading(false);
        });
    } else {
      setImageUploadErrorMessage("One listing only can upload 1 ~ 6 images");
      setIsUploading(false);
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url, i) => i !== index),
    }));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required />
          <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>

                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>

                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleImageUpload}
            >
              {isUploading ? "Uploading..." : "upload"}
            </button>
          </div>
          {imageUploadErrorMessage && <span className="text-red-700">{imageUploadErrorMessage}</span>}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => {
              return (
                <div key={i} className="flex justify-between items-center border p-3">
                  <img src={url} alt="listing img" className="w-20 h-20 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="text-red-700 p-3 uppercase hover:opacity-95"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
