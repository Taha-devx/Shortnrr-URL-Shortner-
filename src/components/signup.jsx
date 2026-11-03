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
import { signup } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const SignUp = () => {
  const [error, setError] = useState(
    /** @type {Record<string, string>} */ ({}),
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputtChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const { data, err, loading, fn: fnSignup } = useFetch(signup);
  const { fetchUser } = UrlState();
  useEffect(() => {
    if (err) {
      console.log("SUPABASE SIGNUP ERROR:", err);
    } 
    if (data && !err) {
      navigate(
        `/dashboard${longLink ? `?createNew=${encodeURIComponent(longLink)}` : ""}`,
      );
      fetchUser();
    }
  }, [data, err, longLink, navigate]);

  const handleSignup = async () => {
    setError({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"), 
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup(
        formData.name,
        formData.email,
        formData.password,
        formData.profile_pic,
      );
    } catch (e) {
      if (!e?.inner) return;
      /** @type {Record<string, string>} */
      const newErrors = {};
      e.inner.forEach(
        (/** @type {{ path: string, message: string }} */ validationIssue) => {
          newErrors[validationIssue.path] = validationIssue.message;
        },
      );
      setError(newErrors);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>SignUp</CardTitle>
          <CardDescription>
            Create a new account if u haven&rsquo;t already
          </CardDescription>
          {/* <CardAction>Card Action</CardAction> */}
          {err && <Error message={err.message} />}
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Input
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleInputtChange}
            />
            {error.name && <Error message={error.name} />}
          </div>
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
          <div className="space-y-1">
            <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputtChange}
            />
            {error.profile_pic && <Error message={error.profile_pic} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup} disabled={loading}>
            {loading ? (
              <BeatLoader color="#36d7d7" size={10} />
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
