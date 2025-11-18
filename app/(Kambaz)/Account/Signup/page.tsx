"use client";
import Link from "next/link";
import { useState } from "react";
import * as client from "../client";
import { useRouter } from "next/navigation";
import { FormControl, Button, Form } from "react-bootstrap";

interface SignupUser {
  username: string;
  password: string;
  [key: string]: unknown;
}

export default function Signup() {
  const router = useRouter();

  const [user, setUser] = useState<SignupUser>({
    username: "",
    password: "",
  });

  const [verify, setVerify] = useState("");
  
  const signup = async () => {
    if (user.password !== verify) {
      alert("Passwords do not match");
      return;
    }

    try {
      await client.signup(user);        // <-- REAL SIGNUP CALL
      alert("Signup successful!");
      router.push("/Account/Signin");   // redirect to signin
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        alert(axiosError.response?.data?.message || "Signup failed");
      } else {
        alert("Signup failed");
      }
    }
  };

  return (
    <div id="wd-signup-screen" className="p-3" style={{ maxWidth: "320px" }}>
      <h2 className="mb-3">Signup</h2>

      <Form>
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control
            placeholder="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control
            placeholder="verify password"
            type="password"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
          />
        </Form.Group>

        <Button className="w-100 mb-2" onClick={signup}>
          Signup
        </Button>

        <Link href="/Account/Signin">Signin</Link>
      </Form>
    </div>
  );
}
