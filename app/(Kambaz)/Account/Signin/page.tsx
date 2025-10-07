"use client";
import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signin() {
  return (
    <div id="wd-signin-screen" className="p-3" style={{ maxWidth: "320px" }}>
      <h2 className="mb-3">Signin</h2>
      <Form>
        {/* Username */}
        <Form.Group className="mb-2">
          <Form.Control id="wd-username" placeholder="username" type="text" />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-2">
          <Form.Control id="wd-password" placeholder="password" type="password" />
        </Form.Group>

        {/* Sign in button */}
        <Link
          id="wd-signin-btn"
          href="/Account/Profile"
          className="btn btn-primary w-100 mb-2"
        >
          Signin
        </Link>

        {/* Signup link */}
        <Link id="wd-signup-link" href="/Account/Signup">
          Signup
        </Link>
      </Form>
    </div>
  );
}
