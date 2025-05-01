import React from "react";

export const ResourcePreview = ({ image, description }) => {
  return (
    <>
      <img
        className="w-full h-40 object-cover rounded-md shadow-sm"
        src={image || "https://haieng.com/wp-content/uploads/2017/10/test-image-500x500.jpg"}
        alt="scene preview"
      />
      <div className="mt-2 text-sm text-muted-foreground">
        {description}
      </div>
    </>
  );
};