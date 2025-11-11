"use client";

import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

  const pathname = usePathname();

  return (
    <ListGroup
      id="wd-account-navigation"
      className="wd list-group fs-5 rounded-0"
    >
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
    </ListGroup>
  );
}
