import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const images = [
    "https://www.tripsavvy.com/thmb/48Rd83vdWHc3HddPANJxzSvgW_k=/3865x2576/filters:no_upscale():max_bytes(150000):strip_icc()/european-painting-gallery--museum-of-fine-arts--boston--ma-141818702-5a77b8048e1b6e0037f6ebf8.jpg",
    "https://s3.mortarr.com/images/project_gallery_images/mma-2917.jpeg",
    "https://coolwallpapers.me/picsup/5716827-museum-wallpapers.jpg",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the Museum Ticket Booking</h1>

       <div className="mb-8 h-64 w-full max-w-4xl mx-auto">
  <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
    {images.map((src, index) => (
      <div key={index} className="overflow-hidden rounded-2xl shadow-lg">
        <img
          src={src}
          alt={`Slide ${index + 1}`}
          className="w-full h-64 object-cover"
        />
      </div>
    ))}
  </Carousel>
</div>


        <div className="flex justify-center">
          <Link to='chatbot' className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md">
            Chat with Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
