import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";
import { Loader2 } from "lucide-react";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

  if (isGetLoading) {
    return (
      <span className="flex justify-center items-center -mt-[85px] w-full h-[100vh]">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </span>
    );
  }

  if (!currentUser) {
    return <span>Unble to load user profile</span>;
  }
  return (
    <UserProfileForm
      onSave={updateUser}
      currentUser={currentUser}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;
