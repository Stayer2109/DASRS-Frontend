import React, { useRef, useState } from "react";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Textarea } from "@/AtomicComponents/atoms/shadcn/textarea";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { LoadingSpinner } from "@/AtomicComponents/atoms/LoadingSpinner/LoadingSpinner";
import { FirebaseStorage } from "@/utils/FirebaseStorage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/AtomicComponents/atoms/shadcn/select";
import { DialogFooter } from "@/AtomicComponents/atoms/shadcn/dialog";

export const SceneForm = ({
  formData,
  formMode,
  isSubmitting,
  onInputChange,
  onTypeChange,
  onSubmit,
  onCancel,
}) => {
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(formData.resource_image || "");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);

      // Create preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      // Generate unique path for the image
      const path = FirebaseStorage.generateUniquePath(file.name, 'scenes');
      
      // Upload image to Firebase (5MB limit)
      const imageURL = await FirebaseStorage.uploadImage(file, path, 5);

      // Update form data with the new image URL
      onInputChange({
        target: {
          name: 'resource_image',
          value: imageURL
        }
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to add error handling here
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="grid w-full gap-2">
        <Label htmlFor="resource_name">Scene Name</Label>
        <Input
          id="resource_name"
          name="resource_name"
          value={formData.resource_name}
          onChange={onInputChange}
          required
          placeholder="Enter scene name"
        />
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="resource_type">Resource Type</Label>
        <Select
          name="resource_type"
          value={formData.resource_type}
          onValueChange={onTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MAP">MAP</SelectItem>
            <SelectItem value="UI">UI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="resource_image">Scene Image</Label>
        <div className="relative">
          <div 
            onClick={handleImageClick}
            className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors"
          >
            {previewUrl ? (
              <div className="relative group">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-gray-500">Click to upload image</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          {isUploadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
              <LoadingSpinner size="small" />
            </div>
          )}
        </div>
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onInputChange}
          required
          placeholder="Enter scene description"
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploadingImage}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              {formMode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : formMode === "create" ? (
            "Create Scene"
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
