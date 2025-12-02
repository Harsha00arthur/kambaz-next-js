"use client";

import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface User {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  loginId?: string;
  section?: string;
  role?: string;
}

export default function AccountNavigation() {
  // FIXED: explicitly type currentUser to avoid "never" error
  const { currentUser } = useSelector(
    (state: RootState) =>
      state.accountReducer as { currentUser: User | null }
  );

  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();

  return (
    <ListGroup
      id="wd-account-navigation"
      className="wd list-group fs-5 rounded-0"
    >
      {/* Standard links: Profile | Signin | Signup */}
      {links.map((link) => {
        const lower = link.toLowerCase();
        const isActive = pathname.endsWith(lower);
        const linkId = `wd-${lower}-link`;

        return (
          <Link
            key={linkId}
            href={link}
            id={linkId}
            className={`list-group-item border-0 ${
              isActive ? "active" : "text-danger"
            }`}
          >
            {link}
          </Link>
        );
      })}

      {/* ADMIN-ONLY USERS LINK */}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link
          key="wd-users-link"
          href="Users"
          id="wd-users-link"
          className={`list-group-item border-0 ${
            pathname.endsWith("Users") ? "active" : "text-danger"
          }`}
        >
          Users
        </Link>
      )}
    </ListGroup>
  );
}
