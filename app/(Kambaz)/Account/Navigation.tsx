"use client";

import Link from "next/link";
import { ListGroup } from "react-bootstrap";

export default function AccountNavigation() {
  return (
    <ListGroup
      id="wd-account-navigation"
      className="wd list-group fs-5 rounded-0"
    >
      <Link
        href="Signin"
        id="wd-signin-link"
        className="list-group-item active border-0"
      >
        Signin
      </Link>

      <Link
        href="Signup"
        id="wd-signup-link"
        className="list-group-item text-danger border-0"
      >
        Signup
      </Link>

      <Link
        href="Profile"
        id="wd-profile-link"
        className="list-group-item text-danger border-0"
      >
        Profile
      </Link>
    </ListGroup>
  );
}
