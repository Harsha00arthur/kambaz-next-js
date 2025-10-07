"use client";

import Link from "next/link";
import { ListGroup } from "react-bootstrap";

export default function CourseNavigation() {
  return (
    <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <ListGroup.Item action as={Link} href="/Courses/1234/Home" id="wd-course-home-link"
        className="list-group-item active border-0">
        Home
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="/Courses/1234/Modules" id="wd-course-modules-link"
        className="list-group-item text-danger border-0">
        Modules
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="https://piazza.com/northeastern" id="wd-course-piazza-link"
        className="list-group-item text-danger border-0">
        Piazza
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="https://www.zoom.com/" id="wd-course-zoom-link"
        className="list-group-item text-danger border-0">
        Zoom
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="/Courses/1234/Assignments" id="wd-course-assignments-link"
        className="list-group-item text-danger border-0">
        Assignments
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="https://northeastern.instructure.com/courses/225988/quizzes" id="wd-course-quizzes-link"
        className="list-group-item text-danger border-0">
        Quizzes
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="https://northeastern.instructure.com/courses/225988/grades" id="wd-course-grades-link"
        className="list-group-item text-danger border-0">
        Grades
      </ListGroup.Item>

      <ListGroup.Item action as={Link} href="/Courses/1234/People/Table" id="wd-course-people-link"
        className="list-group-item text-danger border-0">
        People
      </ListGroup.Item>
    </ListGroup>
  );
}
