"use client";
import { useState } from "react";
import Link from "next/link";
import * as db from "../Database";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse as deleteCourseAction,
  updateCourse as updateCourseAction,
} from "../Courses/reducer";
import {
  enrollCourse,
  unenrollCourse,
} from "../Enrollments/reducer";
import { RootState } from "../store";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormControl,
} from "react-bootstrap";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

interface User {
  _id: string;
  username: string;
  role?: string;
  [key: string]: unknown;
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);

  const { currentUser } = useSelector(
    (state: RootState) =>
      state.accountReducer as { currentUser: User | null }
  );

  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );

  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const [showAll, setShowAll] = useState(false);

  // ✅ Treat FACULTY role as the flag to show course management features
  const isFaculty = currentUser?.role === "FACULTY";

  const userId = currentUser?._id ?? "";

  const userEnrollments = enrollments.filter((e) => e.user === userId);

  const isEnrolled = (courseId: string) =>
    userEnrollments.some((e) => e.course === courseId);

  // ✅ Toggle: show all vs only enrolled
  const filteredCourses = showAll
    ? courses
    : courses.filter((c) => isEnrolled(c._id));

  const handleEnroll = (courseId: string) => {
    if (!userId) return;
    dispatch(enrollCourse({ user: userId, course: courseId }));
  };

  const handleUnenroll = (courseId: string) => {
    if (!userId) return;
    dispatch(unenrollCourse({ user: userId, course: courseId }));
  };

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {/* 🔵 Enrollments toggle button */}
        <Button
          variant="primary"
          onClick={() => setShowAll(!showAll)}
          id="wd-enrollments-toggle"
        >
          {showAll ? "Show Enrolled" : "Show All"}
        </Button>
      </div>

      <hr />

      {/* 🧑‍🏫 Faculty-only course management (Add / Update) */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() =>
                dispatch(addNewCourse({ ...course, _id: uuidv4() }))
              }
            >
              Add
            </button>

            <button
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourseAction(course))}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) =>
              setCourse({ ...course, name: e.target.value })
            }
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAll ? "All Courses" : "Enrolled Courses"} (
        {filteredCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <CardImg
                  src={course.image}
                  variant="top"
                  width="100%"
                  height={160}
                />
                <CardBody className="card-body">
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    {course.name}
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    {course.description}
                  </CardText>

                  {/* 🔒 Only enrolled users can navigate to course */}
                  {isEnrolled(course._id) ? (
                    <Link
                      href={`/Courses/${course._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark"
                    >
                      <Button className="btn btn-primary me-2">Go</Button>
                    </Link>
                  ) : (
                    <Button className="btn btn-secondary me-2" disabled>
                      Locked
                    </Button>
                  )}

                  {/* 🟢 Enroll / 🔴 Unenroll buttons */}
                  {isEnrolled(course._id) ? (
                    <Button
                      variant="danger"
                      onClick={() => handleUnenroll(course._id)}
                      id={`wd-unenroll-${course._id}`}
                      className="me-2"
                    >
                      Unenroll
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handleEnroll(course._id)}
                      id={`wd-enroll-${course._id}`}
                      className="me-2"
                    >
                      Enroll
                    </Button>
                  )}

                  {/* 🧑‍🏫 Faculty-only Edit/Delete (unchanged IDs/classes) */}
                  {isFaculty && (
                    <>
                      <button
                        id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
                        className="btn btn-warning me-2 float-end"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          dispatch(deleteCourseAction(course._id));
                        }}
                        className="btn btn-danger float-end"
                        id="wd-delete-course-click"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
