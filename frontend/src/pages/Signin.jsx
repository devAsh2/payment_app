import { ButtonWarning } from "../components/ButtonWarning";
import { Button } from "../components/SignupButton";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from 'recoil'; // 1. Import the hook
import { userState } from '../store/atom'; // 2. Import your atom

export const Signin = () => {
  // State variables for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userState); // 3. Get the setter function
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            placeholder="ash@gmail.com"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            label={"Email"}
          />
          <InputBox
            placeholder="123456"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/signin",
                  {
                    username,
                    password,
                  }
                );
                console.log(response.data);
                // 4. Update the global state with the user's data
                setUser({
                  isLoading: false,
                  user: {
                    username: username,
                  },
                });

                // Also store the token separately
                localStorage.setItem("token", response.data.token);

                
                navigate("/dashboard");
              }}
              label={"Sign in"}
            />
          </div>
          <ButtonWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
