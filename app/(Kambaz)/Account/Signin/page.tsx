"use client";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";

interface Credentials {
  username: string;
  password: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      router.push("/Dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        alert(axiosError.response?.data?.message || "Signin failed");
      } else {
        alert("Signin failed");
      }
    }
  };

  return (
    <div id="wd-signin-screen" className="p-3" style={{ maxWidth: "320px" }}>
      <h2 className="mb-3">Signin</h2>

      <FormControl
        value={credentials.username}   // ← FIXED
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />

      <FormControl
        value={credentials.password}   // ← FIXED
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />

      <Button
        onClick={signin}
        id="wd-signin-btn"
        className="w-100 mb-2 btn btn-primary"
      >
        Sign in
      </Button>

      <Link id="wd-signup-link" href="/Account/Signup">
        Signup
      </Link>
    </div>
  );
}
