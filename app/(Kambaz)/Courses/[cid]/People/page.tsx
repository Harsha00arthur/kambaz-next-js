"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Table";
import * as client from "../../client";  // <-- Courses client (correct)

export default function PeoplePage() {
  const { cid } = useParams<{ cid: string }>();
  const [users, setUsers] = useState([]);

  // Load only users enrolled in this course
  const fetchUsersForCourse = async () => {
    if (!cid) return;
    try {
      const data = await client.findUsersForCourse(cid);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load enrolled users:", err);
    }
  };

  useEffect(() => {
    fetchUsersForCourse();
  }, [cid]);

  return (
    <div id="wd-people-page">
      <h2 className="mb-3">People</h2>

      {/* Pass the enrolled users + refresh handler */}
      <PeopleTable users={users} fetchUsers={fetchUsersForCourse} />
    </div>
  );
}
