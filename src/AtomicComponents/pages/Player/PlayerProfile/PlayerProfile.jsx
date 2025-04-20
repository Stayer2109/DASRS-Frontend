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
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "@/AtomicComponents/organisms/Modal/Modal";
import { apiClient } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import { ConvertDate } from "@/utils/DateConvert";
import { NormalizeData } from "@/utils/InputProces";
import { NormalizeServerErrors } from "@/utils/NormalizeError";
import { UpdateProfileValidation } from "@/utils/Validation";
import { useEffect, useState } from "react";
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

  // HANDLE UPDATE PROFILE DATA VALIDATION
  const handleUpdateProfileValidation = (data) => {
    const errors = UpdateProfileValidation(data);
    setUpdateProfileErrors(errors);
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

      <div className="flex justify-center items-center min-h-[80vh]">
        {player ? (
          <Card className="bg-white shadow-md p-6 rounded-xl w-full max-w-md">
            <CardHeader className="flex flex-col items-center gap-4 pb-2">
              <Avatar className="mb-2 ring-2 ring-blue-500 w-24 h-24">
                <AvatarImage src={player.avatar || ""} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-4xl">
                  {player.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
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
          <ModalHeader content={"Update Profile"} />
          <ModalBody>
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
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default PlayerProfile;
