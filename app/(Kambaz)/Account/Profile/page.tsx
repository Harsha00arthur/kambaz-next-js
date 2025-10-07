"use client";
import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="p-3" style={{ maxWidth: "320px" }}>
      <h2 className="mb-3">Profile</h2>
      <Form>
        {/* Username */}
        <Form.Group className="mb-2">
          <Form.Control
            defaultValue="alice"
            placeholder="username"
            className="wd-username"
            type="text"
          />
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-2">
          <Form.Control
            defaultValue="123"
            placeholder="password"
            type="password"
            className="wd-password"
          />
        </Form.Group>

        {/* First name */}
        <Form.Group className="mb-2">
          <Form.Control
            defaultValue="Alice"
            placeholder="First Name"
            id="wd-firstname"
            type="text"
          />
        </Form.Group>

        {/* Last name */}
        <Form.Group className="mb-2">
          <Form.Control
            defaultValue="Wonderland"
            placeholder="Last Name"
            id="wd-lastname"
            type="text"
          />
        </Form.Group>

        {/* Date of Birth */}
        <Form.Group className="mb-2">
          <Form.Control
            defaultValue="2000-01-01"
            id="wd-dob"
            type="date"
          />
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-2">
          <Form.Control
            defaultValue="alice@wonderland.com"
            type="email"
            id="wd-email"
          />
        </Form.Group>

        {/* Role */}
        <Form.Group className="mb-2">
          <Form.Select defaultValue="FACULTY" id="wd-role">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>
        </Form.Group>

        {/* Signout button */}
        <Link
          href="Signin"
          id="wd-signout-btn"
          className="btn btn-danger w-100"
        >
          Signout
        </Link>
      </Form>
    </div>
  );
}
