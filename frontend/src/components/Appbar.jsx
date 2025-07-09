import { useRecoilValue } from "recoil"; // 1. Import the hook
import { userState } from "../store/atom"; // 2. Import your atom

export const Appbar = () => {
  const { user, isLoading } = useRecoilValue(userState);
  
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">PayTM App</div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">Hello</div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user?.username ? user.username[0].toUpperCase() : "?"}
          </div>
        </div>
      </div>
    </div>
  );
};
