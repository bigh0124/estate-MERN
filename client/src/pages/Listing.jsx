import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../utils/request";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
const Listing = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(false);
  SwiperCore.use([Navigation]);
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsloading(true);
        setError(false);
        const { data } = await newRequest.get(`/listing/fetchListing/${id}`);
        if (data.success === false) {
          setError(true);
          return;
        }
        setListing(data);
        setIsloading(false);
      } catch (err) {
        setError(true);
        setIsloading(false);
      }
    };

    fetchListing();
  }, [id]);

  return (
    <main>
      {isLoading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {listing && !isLoading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;
