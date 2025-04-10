import Button from "@/AtomicComponents/atoms/Button/Button";
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
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "@/AtomicComponents/organisms/Modal/Modal";
import { apiClient } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import { ConvertDate } from "@/utils/DateConvert";
import { trimText } from "@/utils/InputProces";
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
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
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
    setUpdateProfileShow(true);
  };

  const updateProfileModalClose = () => {
    setUpdateProfileShow(false);
  };
  //#endregion

  // HANDLE UPDATE PROFILE DATA
  const handleUpdateProfileData = (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
    } catch (error) {
      console.error("Error updating profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // GET PLAYER DATA FROM API
  useEffect(() => {
    if (!auth?.id) return;

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
          console.log("Player data:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Spinner />}

      <div className="flex justify-center items-center min-h-[80vh]">
        {player ? (
          <Card className="w-full max-w-md p-6 rounded-xl shadow-md bg-white">
            <CardHeader className="flex flex-col items-center gap-4 pb-2">
              <Avatar className="w-24 h-24 ring-2 ring-blue-500 mb-2">
                <AvatarImage src={player.avatar || ""} />
                <AvatarFallback className="text-4xl bg-gray-200 text-gray-600">
                  {player.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold">
                {player.first_name + " " + player.last_name}
              </CardTitle>
              <Badge
                className="text-xs"
                variant={player.is_leader ? "default" : "secondary"}
              >
                {player.is_leader ? "👑 Leader" : "Player"}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-muted-foreground text-center">
              <div className="mt-4 space-y-1 text-sm text-center text-muted-foreground">
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  {player.phoneNumber}
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
                className="mt-6 w-auto !px-6"
                bgColor="black"
                content="Update Profile"
                onClick={updateProfileModalShow}
              />
            </div>
          </Card>
        ) : null}

        <Modal
          show={updateProfileShow}
          onHide={updateProfileModalClose}
          size="md"
        >
          <ModalHeader content={"Update Profile"} />
          <ModalBody>
            <form onSubmit={handleUpdateProfileData} className="space-y-4">
              <div
                className="inf-input-container sm:grid grid-cols-[1fr_3fr] 
                          gap-y-5 items-center sm:mb-5 mb-3"
              >
                {/* Address */}
                <label htmlFor="email">Address</label>
                <div className="sm:mb-0 mb-3">
                  <Input
                    className={inputCommonClassname}
                    type="email"
                    placeholder="Address..."
                    autoComplete=""
                    onChange={(e) => {
                      setUpdateProfileData({
                        ...updateProfileData,
                        address: trimText(e.target.value),
                      });
                    }}
                  />

                  {updateProfileErrors.address && (
                    <p className="text-red-500 text-xs">
                      {updateProfileErrors.address}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <label htmlFor="password">Gender</label>
                <div className="relative">
                  <Select
                    options={genderOptions}
                    placeHolder={"Select gender"}
                  />

                  {updateProfileErrors.gender && (
                    <p className="text-red-500 text-xs">
                      {updateProfileErrors.gender}
                    </p>
                  )}
                </div>

                {/* DoB */}
                <label htmlFor="password">Date of Birth</label>
                <div className="relative">
                  <Input type="date" placeholder="Date of Birth..." />

                  {updateProfileErrors.dob && (
                    <p className="text-red-500 text-xs">
                      {updateProfileErrors.dob}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <label htmlFor="password">Phone</label>
                <div className="relative">
                  <Input type="phone" placeholder="Phone..." />

                  {updateProfileErrors.dob && (
                    <p className="text-red-500 text-xs">
                      {updateProfileErrors.dob}
                    </p>
                  )}
                </div>

                {/* First Name */}
                <label htmlFor="password">First name</label>
                <div className="relative">
                  <Input type="phone" placeholder="First name..." />

                  {updateProfileErrors.first_name && (
                    <p className="text-red-500 text-xs">
                      {updateProfileErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <label htmlFor="password">Last name</label>
                <div className="relative">
                  <Input type="phone" placeholder="Last name..." />

                  {updateProfileErrors.last_name && (
                    <p className="text-red-500 text-xs">
                      {updateProfileErrors.last_name}
                    </p>
                  )}
                </div>
              </div>
            </form>
            <div className="text-center">
              <Button
                className="mt-6 w-auto !px-6"
                content="Update"
                onClick={() => handleUpdateProfileValidation(updateProfileData)}
                bgColor="black"
                type="submit"
              />
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default PlayerProfile;
