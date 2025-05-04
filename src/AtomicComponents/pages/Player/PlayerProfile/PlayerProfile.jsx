import { Button } from "@/AtomicComponents/atoms/Button/Button";
import Input from "@/AtomicComponents/atoms/Input/Input";
import Select from "@/AtomicComponents/atoms/Select/Select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/AtomicComponents/atoms/shadcn/avatar";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import { apiClient } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import { ConvertDate } from "@/utils/DateConvert";
import { NormalizeData } from "@/utils/InputProces";
import { NormalizeServerErrors } from "@/utils/NormalizeError";
import { UpdateProfileValidation } from "@/utils/Validation";
import { useEffect, useState, useRef } from "react";
import { FirebaseStorage } from "@/utils/FirebaseStorage";
const inputCommonClassname = "w-full mb-1";

const PlayerProfile = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [player, setPlayer] = useState(null);
  const [updateProfileShow, setUpdateProfileShow] = useState(false);
  const [updateProfileErrors, setUpdateProfileErrors] = useState({});
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  const [updateProfileData, setUpdateProfileData] = useState({
    address: "",
    gender: "",
    dob: "",
    phone: "",
    first_name: "",
    last_name: "",
  });
  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // HANDLE UPDATE PROFILE DATA VALIDATION
  const handleUpdateProfileValidation = (data) => {
    const errors = UpdateProfileValidation(data);
    setUpdateProfileErrors(errors);
  };

  // Handle avatar click to trigger file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar upload
  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);

      const path = FirebaseStorage.generateUniquePath(file.name, 'avatars');
      
      // Upload image to Firebase
      const imageURL = await FirebaseStorage.uploadImage(file, path, 2); // 2MB limit

      // Update avatar URL in backend
      const response = await apiClient.put(
        `accounts/update-profile-picture?id=${auth?.id}&imageURL=${encodeURIComponent(imageURL)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        }
      );

      if (response.data.http_status === 200) {
        // Refresh player data to show new avatar
        await fetchPlayerData();
        Toast({
          title: "Success",
          message: "Avatar updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      Toast({
        title: "Error",
        message: error.message || "Failed to update avatar",
        type: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  //#region MODAL CONTROL
  const updateProfileModalShow = () => {
    if (!player) return;

    setUpdateProfileData({
      address: player.address || "",
      gender: player.gender || "",
      dob: player.dob || "",
      phone: player.phone || "",
      first_name: player.first_name || "",
      last_name: player.last_name || "",
    });

    setUpdateProfileErrors({});
    setUpdateProfileShow(true);
  };

  const updateProfileModalClose = () => {
    setUpdateProfileShow(false);
  };
  //#endregion

  // GET PLAYER DATA FROM API
  const fetchPlayerData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`accounts/current-account`, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
        },
      });

      if (response.data.http_status === 200) {
        setPlayer(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching player data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLE UPDATE PROFILE DATA
  const handleUpdateProfileDataSubmit = async (e) => {
    e.preventDefault();

    const normalizedData = NormalizeData(updateProfileData);
    if (Object.keys(updateProfileErrors).length > 0) return;

    try {
      setIsLoading(true);
      const response = await apiClient.put(
        `accounts/update-info?id=${auth?.id}`,
        normalizedData
      );

      if (response.data.http_status === 200) {
        await fetchPlayerData(); // refresh the card with new info
        Toast({
          title: "Success",
          message: response.data.message,
          type: "success",
        });
        setUpdateProfileShow(false); // close the modal
      }
    } catch (error) {
      // Check for 400 error code + field errors
      if (error.response?.status === 400 && error.response.data?.data) {
        const serverErrors = NormalizeServerErrors(error.response.data.data);

        // Merge existing and new errors
        setUpdateProfileErrors((prev) => ({
          ...prev,
          ...serverErrors,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // GET PLAYER DATA FROM API
  useEffect(() => {
    if (!auth?.id) return;

    fetchPlayerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {isUploadingAvatar && <Spinner />}

      <div className="flex justify-center items-center min-h-[80vh]">
        {player ? (
          <Card className="bg-white shadow-md p-6 rounded-xl w-full max-w-md">
            <CardHeader className="flex flex-col items-center gap-4">
              <div
                className="group relative cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Avatar className="group-hover:opacity-75 ring-2 ring-blue-500 group-hover:ring-blue-600 w-34 h-34 transition-all duration-300">
                  <AvatarImage src={player.avatar || ""} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-4xl">
                    {player.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Hidden overlay text */}
                <div className="z-10 absolute inset-0 flex justify-center items-center group-hover:bg-black/45 rounded-full transition-all duration-300">
                  <span className="flex items-center gap-2 opacity-0 group-hover:opacity-100 font-medium text-white text-sm transition-opacity duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>
                    Change Avatar
                  </span>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <CardTitle className="font-bold text-xl">
                {player.first_name + " " + player.last_name}
              </CardTitle>
              <Badge
                className="text-xs"
                variant={player.is_leader ? "default" : "secondary"}
              >
                {player.is_leader ? "👑 Leader" : "Player"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2 text-muted-foreground text-sm text-center">
              <div className="space-y-1 mt-4 text-muted-foreground text-sm text-center">
                <div>
                  <span className="font-medium text-gray-700">Gender:</span>{" "}
                  {player.gender}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  {player.phone}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Birthday:</span>{" "}
                  {ConvertDate(player.dob)}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address:</span>{" "}
                  {player.address}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <a
                    className="text-blue-600 underline"
                    href={`mailto:${player.email}`}
                  >
                    {player.email}
                  </a>
                </div>
              </div>
            </CardContent>

            <div className="text-center">
              <Button
                className="mt-6 !px-6 w-auto"
                bgColor="#000"
                content="Update Profile"
                onClick={updateProfileModalShow}
              />
            </div>
          </Card>
        ) : null}

        {/* Update Profile Modal */}
        <Modal
          show={updateProfileShow}
          onHide={updateProfileModalClose}
          size="sm"
        >
          <Modal.Header content={"Update Profile"} />
          <Modal.Body>
            <form
              onSubmit={handleUpdateProfileDataSubmit}
              className="space-y-6"
            >
              <div className="gap-5 grid grid-cols-1">
                {/* Address */}
                <div className="flex flex-col">
                  <label
                    htmlFor="address"
                    className="mb-1 font-medium text-gray-700 text-sm"
                  >
                    Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    value={updateProfileData.address}
                    placeholder="Enter your address"
                    className={inputCommonClassname}
                    onChange={(e) =>
                      setUpdateProfileData({
                        ...updateProfileData,
                        address: e.target.value,
                      })
                    }
                  />
                  {updateProfileErrors.address && (
                    <p className="mt-1 text-red-500 text-xs">
                      {updateProfileErrors.address}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                  <label
                    htmlFor="gender"
                    className="mb-1 font-medium text-gray-700 text-sm"
                  >
                    Gender
                  </label>
                  <Select
                    options={genderOptions}
                    placeHolder={"Select gender"}
                    value={updateProfileData.gender}
                    onChange={(e) =>
                      setUpdateProfileData({
                        ...updateProfileData,
                        gender: e.target.value,
                      })
                    }
                  />
                  {updateProfileErrors.gender && (
                    <p className="mt-1 text-red-500 text-xs">
                      {updateProfileErrors.gender}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col">
                  <label
                    htmlFor="dob"
                    className="mb-1 font-medium text-gray-700 text-sm"
                  >
                    Date of Birth
                  </label>
                  <Input
                    id="dob"
                    type="date"
                    value={updateProfileData.dob}
                    placeholder="Select date"
                    onChange={(e) =>
                      setUpdateProfileData({
                        ...updateProfileData,
                        dob: e.target.value,
                      })
                    }
                  />
                  {updateProfileErrors.dob && (
                    <p className="mt-1 text-red-500 text-xs">
                      {updateProfileErrors.dob}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="mb-1 font-medium text-gray-700 text-sm"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    type="text"
                    value={updateProfileData.phone}
                    placeholder="Enter your phone"
                    onChange={(e) =>
                      setUpdateProfileData({
                        ...updateProfileData,
                        phone: e.target.value,
                      })
                    }
                  />
                  {updateProfileErrors.phone && (
                    <p className="mt-1 text-red-500 text-xs">
                      {updateProfileErrors.phone}
                    </p>
                  )}
                </div>

                {/* First Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="first_name"
                    className="mb-1 font-medium text-gray-700 text-sm"
                  >
                    First Name
                  </label>
                  <Input
                    id="first_name"
                    type="text"
                    value={updateProfileData.first_name}
                    placeholder="First name"
                    onChange={(e) =>
                      setUpdateProfileData({
                        ...updateProfileData,
                        first_name: e.target.value,
                      })
                    }
                  />
                  {updateProfileErrors.first_name && (
                    <p className="mt-1 text-red-500 text-xs">
                      {updateProfileErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="last_name"
                    className="mb-1 font-medium text-gray-700 text-sm"
                  >
                    Last Name
                  </label>
                  <Input
                    id="last_name"
                    type="text"
                    value={updateProfileData.last_name}
                    placeholder="Last name"
                    onChange={(e) =>
                      setUpdateProfileData({
                        ...updateProfileData,
                        last_name: e.target.value,
                      })
                    }
                  />
                  {updateProfileErrors.last_name && (
                    <p className="mt-1 text-red-500 text-xs">
                      {updateProfileErrors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center">
                <Button
                  className="!px-6 py-2 w-full font-semibold text-white"
                  content="Update"
                  onClick={() =>
                    handleUpdateProfileValidation(updateProfileData)
                  }
                  bgColor="#000"
                  type="submit"
                />
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default PlayerProfile;
