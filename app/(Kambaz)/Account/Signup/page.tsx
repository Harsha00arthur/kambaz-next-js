"use client";
import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-3" style={{ maxWidth: "320px" }}>
      <h2 className="mb-3">Signup</h2>
      <Form>
        {/* Username */}
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="username"
            className="wd-username"
            type="text"
          />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="password"
            className="wd-password"
            type="password"
          />
        </Form.Group>

        {/* Verify Password */}
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="verify password"
            className="wd-password-verify"
            type="password"
          />
        </Form.Group>

        {/* Signup button */}
        <Link
          href="Profile"
          className="btn btn-primary w-100 mb-2"
        >
          Signup
        </Link>

        {/* Signin link */}
        <div>
          <Link href="Signin">Signin</Link>
        </div>
      </Form>
    </div>
  );
}
