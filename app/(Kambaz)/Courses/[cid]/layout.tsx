"use client";
import { useState } from "react";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course: Course) => course._id === cid);

  // ✅ Sidebar toggle state
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div id="wd-courses">
      <h2 className="text-danger d-flex align-items-center">
        {/* ✅ Sandwich icon toggles sidebar visibility */}
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          style={{ cursor: "pointer" }}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {course?.name}
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        {showSidebar && (
          <div className="d-none d-md-block">
            <CourseNavigation cid={cid as string} />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
