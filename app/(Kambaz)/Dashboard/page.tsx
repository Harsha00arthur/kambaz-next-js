"use client";
import * as client from "../Courses/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";

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

/* ----------------------------------------------------------
   LocalCourse type
---------------------------------------------------------- */
interface LocalCourse {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
  [key: string]: unknown; // allows extra fields
}

/* ----------------------------------------------------------
   User type
---------------------------------------------------------- */
interface User {
  _id: string;
  username: string;
  role?: string;
}

export default function Dashboard() {
  const dispatch = useDispatch();

  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer as { currentUser: User | null }
  );

  /* ----------------------------------------------------------
     Local course state for editing/creating
  ---------------------------------------------------------- */
  const [course, setCourse] = useState<LocalCourse>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  /* ----------------------------------------------------------
     Track which courses THIS user is enrolled in (by _id)
  ---------------------------------------------------------- */
  const [myCourseIds, setMyCourseIds] = useState<string[]>([]);

  /* ----------------------------------------------------------
     Faculty: Add New Course
  ---------------------------------------------------------- */
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  /* ----------------------------------------------------------
     Faculty: Delete Course
  ---------------------------------------------------------- */
  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((c) => c._id !== courseId)));
  };

  /* ----------------------------------------------------------
     Faculty: Update Course
  ---------------------------------------------------------- */
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) => (c._id === course._id ? course : c))
      )
    );
  };

  /* ----------------------------------------------------------
     Fetch ALL courses (for the grid)
  ---------------------------------------------------------- */
  const fetchCourses = async () => {
    try {
      const allCourses = await client.fetchAllCourses();
      dispatch(setCourses(allCourses));
    } catch (error) {
      console.error(error);
    }
  };

  /* ----------------------------------------------------------
     Fetch MY courses (enrolled) from the server
     Uses the new client function: findMyCourses()
  ---------------------------------------------------------- */
  const fetchMyCourses = async () => {
    if (!currentUser) {
      setMyCourseIds([]);
      return;
    }
    try {
      const myCourses = await client.findMyCourses();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMyCourseIds(myCourses.map((c: any) => c._id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMyCourses();
  }, [currentUser]);

  /* ----------------------------------------------------------
     Enrollment Logic (based on myCourseIds)
  ---------------------------------------------------------- */
  const [showAll, setShowAll] = useState(false);
  const isFaculty = currentUser?.role === "FACULTY";
  const userId = currentUser?._id ?? "";

  const isEnrolled = (courseId: string) => myCourseIds.includes(courseId);

  /* ----------------------------------------------------------
     Filter Courses: Enrolled OR All
  ---------------------------------------------------------- */
  const filteredCourses = showAll
    ? courses
    : courses.filter((c) => isEnrolled(c._id));

  /* ----------------------------------------------------------
     Enrollment button handlers
     Uses new client functions:
       - enrollIntoCourse(userId, courseId)
       - unenrollFromCourse(userId, courseId)
  ---------------------------------------------------------- */
  const handleEnroll = async (courseId: string) => {
    if (!userId) return;
    try {
      await client.enrollIntoCourse(userId, courseId);
      // Optimistically update local list
      setMyCourseIds((prev) =>
        prev.includes(courseId) ? prev : [...prev, courseId]
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!userId) return;
    try {
      await client.unenrollFromCourse(userId, courseId);
      // Optimistically update local list
      setMyCourseIds((prev) => prev.filter((id) => id !== courseId));
    } catch (error) {
      console.error(error);
    }
  };

  /* ----------------------------------------------------------
     UI Rendering
  ---------------------------------------------------------- */
  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>

        <Button
          variant="primary"
          onClick={() => setShowAll(!showAll)}
          id="wd-enrollments-toggle"
        >
          {showAll ? "Show Enrolled" : "Show All"}
        </Button>
      </div>

      <hr />

      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              onClick={onAddNewCourse}
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
            >
              Add
            </button>

            <button
              onClick={onUpdateCourse}
              className="btn btn-secondary float-end me-2"
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />

          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
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
        All Courses ({filteredCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((c) => (
            <Col key={c._id} style={{ width: "300px" }}>
              <Card>
                <CardImg src={c.image} height={160} />

                <CardBody>
                  <CardTitle className="text-nowrap overflow-hidden">
                    {c.name}
                  </CardTitle>

                  <CardText
                    className="overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    {c.description}
                  </CardText>

                  {isEnrolled(c._id) ? (
                    <Link
                      href={`/Courses/${c._id}/Home`}
                      className="text-decoration-none"
                    >
                      <Button className="btn btn-primary me-2">Go</Button>
                    </Link>
                  ) : (
                    <Button className="btn btn-secondary me-2" disabled>
                      Locked
                    </Button>
                  )}

                  {/* ENROLL / UNENROLL BUTTONS (wired to DB) */}
                  {isEnrolled(c._id) ? (
                    <Button
                      variant="danger"
                      onClick={() => handleUnenroll(c._id)}
                      id={`wd-unenroll-${c._id}`}
                      className="me-2"
                    >
                      Unenroll
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handleEnroll(c._id)}
                      id={`wd-enroll-${c._id}`}
                      className="me-2"
                    >
                      Enroll
                    </Button>
                  )}

                  {isFaculty && (
                    <>
                      <button
                        id="wd-edit-course-click"
                        onClick={() => setCourse(c as LocalCourse)}
                        className="btn btn-warning me-2 float-end"
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger float-end"
                        id="wd-delete-course-click"
                        onClick={() => onDeleteCourse(c._id)}
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
