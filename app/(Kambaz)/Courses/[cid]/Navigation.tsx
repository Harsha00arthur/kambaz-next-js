"use client";

import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import { usePathname } from "next/navigation";

interface CourseNavigationProps {
  cid: string; 
}

export default function CourseNavigation({ cid }: CourseNavigationProps) {
  const pathname = usePathname();

  const links = [
    { label: "Home", path: `/Courses/${cid}/Home` },
    { label: "Modules", path: `/Courses/${cid}/Modules` },
    { label: "Piazza", path: "https://piazza.com/northeastern", external: true },
    { label: "Zoom", path: "https://www.zoom.com/", external: true },
    { label: "Assignments", path: `/Courses/${cid}/Assignments` },
    { label: "Quizzes", path: "https://northeastern.instructure.com/courses/225988/quizzes", external: true },
    { label: "Grades", path: "https://northeastern.instructure.com/courses/225988/grades", external: true },
    { label: "People", path: `/Courses/${cid}/People/Table` },
  ];

  return (
    <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const isActive = pathname === link.path || pathname.includes(link.label);

        return link.external ? (
          <ListGroup.Item
            key={link.label}
            action
            as="a"
            href={link.path}
            target="_blank"
            rel="noopener noreferrer"
            className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
          >
            {link.label}
          </ListGroup.Item>
        ) : (
          <ListGroup.Item
            key={link.label}
            action
            as={Link}
            href={link.path}
            className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
          >
            {link.label}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
