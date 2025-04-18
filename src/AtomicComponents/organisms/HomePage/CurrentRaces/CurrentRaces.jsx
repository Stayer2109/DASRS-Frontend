/** @format */
import { LeftArrowIcon, RightArrowIcon } from "@/assets/icon-svg";
import F1Racers from "../../../../assets/img/f1-racers.jpg";
import Racing1 from "../../../../assets/img/racing-cinematic1.jpg";
import Racing2 from "../../../../assets/img/racing-cinematic2.jpg";
import Racing3 from "../../../../assets/img/racing-cinematic3.jpg";
import './CurrentRaces.scss';
import { useCallback, useEffect, useState } from "react";

const CurrentRaces = () => {
  // IMAGES CHANGE BUTTON STYLE
  const imagesChangeStyle =
    "p-2.5 transform rotate-180 group-hover:scale-130 transition ease-linear duration-150";

  // IMAGES LIST WITH CLONED ELEMENTS FOR INFINITE SLIDE
  const imagesList = [Racing1, Racing2, Racing3, F1Racers];
  const extendedImages = [
    imagesList[imagesList.length - 1],
    ...imagesList,
    imagesList[0],
  ];
  const [currentImage, setCurrentImage] = useState(1); // Start at first real image
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isClickable, setIsClickable] = useState(true); // Prevent rapid clicks

  // HANDLE NEXT IMAGE
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNextImage = useCallback(() => {
    if (!isClickable) return; // Prevents spam clicks
    setIsClickable(false);
    setCurrentImage((prev) => prev + 1);
  });

  // HANDLE PREVIOUS IMAGE
  const handlePreviousImage = () => {
    if (!isClickable) return;
    setIsClickable(false);
    setCurrentImage((prev) => prev - 1);
  };

  // HANDLE INDICATOR CLICK
  const goToImage = (index) => {
    if (!isClickable) return;
    setIsClickable(false);
    setCurrentImage(index + 1); // Offset because of cloned first & last images
  };

  // RESET POSITION WHEN SLIDING TO CLONED IMAGES
  useEffect(() => {
    const transitionEndHandler = () => {
      if (currentImage === extendedImages.length - 1) {
        setIsTransitioning(false);
        setCurrentImage(1);
      } else if (currentImage === 0) {
        setIsTransitioning(false);
        setCurrentImage(imagesList.length);
      } else {
        setIsTransitioning(true);
      }
      setTimeout(() => setIsClickable(true), 450); // Allow next click after animation
    };

    const timeout = setTimeout(transitionEndHandler, 450); // Match animation duration
    return () => clearTimeout(timeout);
  }, [currentImage, extendedImages.length, imagesList.length]);

  // AUTO-CHANGE IMAGE EVERY 3 SECONDS
  useEffect(() => {
    const autoSlide = setInterval(() => {
      handleNextImage();
    }, 3000);
    return () => clearInterval(autoSlide);
  }, [handleNextImage, isClickable]); // dependency can be adjusted based on your needs

  return (
    <div className="current-races-container pt-3 relative select-none h-[250px] sm:h-[900px] flex justify-center items-center overflow-hidden w-full">
      {/* Image Slider */}
      <div
        className={`flex w-full h-full transition-transform ${
          isTransitioning
            ? "duration-600 ease-[cubic-bezier(0.24, 0.55, 0.91, 0.84)]"
            : "duration-0"
        }`}
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {extendedImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Racing Image"
            className="border-blue-600 border-8 border-solid rounded-[12px] object-cover w-full h-full flex-shrink-0"
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-main sm:p-1 rounded-full group ${
          !isClickable
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-lightgray-main-hover"
        }`}
        onClick={handlePreviousImage}
        disabled={!isClickable}
      >
        <RightArrowIcon
          color="white"
          width={40}
          height={40}
          className={`${imagesChangeStyle} left-arrow-icon`}
        />
      </button>

      {/* Right Arrow */}
      <button
        className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-main sm:p-1 rounded-full group ${
          !isClickable
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-lightgray-main-hover"
        }`}
        onClick={handleNextImage}
        disabled={!isClickable}
      >
        <LeftArrowIcon
          color="white"
          width={40}
          height={40}
          className={`${imagesChangeStyle} right-arrow-icon`}
        />
      </button>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-4 flex gap-2">
        {imagesList.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              currentImage === index + 1 ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentRaces;
