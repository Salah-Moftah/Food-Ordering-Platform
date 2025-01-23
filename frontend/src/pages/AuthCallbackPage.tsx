import { useAuth0 } from "@auth0/auth0-react";
import { useCreateMyUser } from "@/api/MyUserApi";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { createUser } = useCreateMyUser();

  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (user?.sub && user?.email && !hasCreatedUser.current) {
      createUser({ auth0Id: user.sub, email: user.email });
      hasCreatedUser.current = true;
    }
    navigate("/");
  }, [user, createUser, navigate]);

  return (
    <span className="flex justify-center items-center -mt-[85px] w-full h-[100vh]">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
    </span>
  );
};

export default AuthCallbackPage;
