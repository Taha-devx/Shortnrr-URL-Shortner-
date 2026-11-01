import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputtChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
          {/* <CardAction>Card Action</CardAction> */}
          <Error message={"Invalid credentials"} />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email"
              onChange={handleInputtChange}
            />
            <Error message={"Invalid email address"} />
          </div>
          <div className="space-y-1">
            <Input
              name="password"
              type="password"
              placeholder="Enter your Password"
              onChange={handleInputtChange}
            />
            <Error message={"Invalid password"} />
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            {true ? <BeatLoader color="#36d7d7" size={10} /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
