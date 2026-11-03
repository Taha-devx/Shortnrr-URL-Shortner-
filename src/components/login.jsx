import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { login } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const Login = () => {

  const [error, setError] = useState(/** @type {Record<string, string>} */ ({}));

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputtChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { data, err, loading, fn: fnLogin } = useFetch(login, formData);
  const {fetchUser} = UrlState();
  useEffect(() => {
    if (data && !err) {
      navigate(`/dashboard${longLink ? `?createNew=${encodeURIComponent(longLink)}` : ""}`);
      fetchUser();
    }
  }, [data, err, longLink, navigate]);

  const handleLogin = async () => {
    setError({});
    try{
      const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin(formData.email, formData.password);

    }catch(e){
      if (!e?.inner) return;
      /** @type {Record<string, string>} */
      const newErrors = {};
      e.inner.forEach((/** @type {{ path: string, message: string }} */ validationIssue) => {
        newErrors[validationIssue.path] = validationIssue.message;
      });
      setError(newErrors);
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
          {/* <CardAction>Card Action</CardAction> */}
          {err && <Error message={err.message} />}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email"
              onChange={handleInputtChange}
            />
            {error.email && <Error message={error.email} />}
          </div>
          <div className="space-y-1">
            <Input
              name="password"
              type="password"
              placeholder="Enter your Password"
              onChange={handleInputtChange}
            />
            {error.password && <Error message={error.password} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? <BeatLoader color="#36d7d7" size={10} /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
