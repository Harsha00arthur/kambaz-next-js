"use client";
import { useEffect, useState } from "react";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { FormControl } from "react-bootstrap";
import * as client from "../../../Account/client";

// ✅ Use backend's User type instead of redefining it
type User = client.User;

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const deleteUser = async (id: string) => {
    await client.deleteUser(id);
    onClose();
  };

  const fetchUser = async () => {
    if (!uid) return;
    const fetchedUser = await client.findUserById(uid);
    setUser(fetchedUser);

    setName(
      `${String(fetchedUser.firstName ?? "")} ${String(
        fetchedUser.lastName ?? ""
      )}`
    );
  };

  const saveUser = async () => {
    if (!user) return;
    const [firstName, lastName] = name.split(" ");

    const updatedUser: User = {
      ...user,
      firstName,
      lastName,
    };

    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    onClose();
  };

  useEffect(() => {
    if (uid) fetchUser();
    else setUser(null);
  }, [uid]);

  if (!uid || !user) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      {/* CLOSE (X) BUTTON */}
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>

      <hr />

      {/* NAME + EDIT MODE */}
      <div className="text-danger fs-4">

        {!editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="float-end fs-5 mt-2 wd-edit"
            style={{ cursor: "pointer" }}
          />
        )}

        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
            style={{ cursor: "pointer" }}
          />
        )}

        {!editing && (
          <div
            className="wd-name"
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {String(user.firstName)} {String(user.lastName)}
          </div>
        )}

        {editing && (
          <FormControl
            className="w-50 wd-edit-name"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
      </div>

      <br />

      <b>Roles:</b> <span className="wd-roles">{String(user.role)}</span> <br />
      <b>Login ID:</b>{" "}
      <span className="wd-login-id">{String(user.loginId)}</span> <br />
      <b>Section:</b>{" "}
      <span className="wd-section">{String(user.section)}</span> <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">
        {String(user.totalActivity)}
      </span>

      <hr />

      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>

      <button
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}
