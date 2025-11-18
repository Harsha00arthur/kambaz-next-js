"use client";

import * as client from "../client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { FormControl, Button } from "react-bootstrap";

interface ProfileType {
  _id: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    const user = await client.profile();
    if (!user) return redirect("/Account/Signin");

    setProfile(user as ProfileType);
    dispatch(setCurrentUser(user));
  };

  const updateProfile = async () => {
    if (!profile) return;
    const updatedProfile = await client.updateUser(profile);
    setProfile(updatedProfile);                  // FIX 1
    dispatch(setCurrentUser(updatedProfile));    // FIX 2
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    redirect("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div id="wd-profile-screen" className="p-3" style={{ maxWidth: "320px" }}>
      <h2 className="mb-3">Profile</h2>

      <FormControl
        id="wd-username"
        className="mb-2"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />

      <FormControl
        id="wd-password"
        className="mb-2"
        type="password"
        value={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />

      <FormControl
        id="wd-firstname"
        className="mb-2"
        value={profile.firstName || ""}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />

      <FormControl
        id="wd-lastname"
        className="mb-2"
        value={profile.lastName || ""}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />

      <FormControl
        id="wd-dob"
        className="mb-2"
        type="date"
        value={profile.dob || ""}
        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
      />

      <FormControl
        id="wd-email"
        className="mb-2"
        type="email"
        value={profile.email || ""}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />

      <select
        className="form-control mb-2"
        id="wd-role"
        value={profile.role || "USER"}
        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>

      <button onClick={updateProfile} className="btn btn-primary w-100 mb-2">
        Update
      </button>

      <Button
        onClick={signout}
        className="w-100 mb-2"
        id="wd-signout-btn"
        variant="danger"
      >
        Sign out
      </Button>
    </div>
  );
}
