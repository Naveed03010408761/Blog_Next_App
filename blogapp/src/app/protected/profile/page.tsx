"use client";
import { useState } from "react";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <ProfileForm onCancel={() => setEditing(false)} />
  ) : (
    <ProfileView onEdit={() => setEditing(true)} />
  );
}
