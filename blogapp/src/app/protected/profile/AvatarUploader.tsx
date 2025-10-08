"use client";
import { useState } from "react";

export default function AvatarUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();
      if (data.url) onChange(data.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <img
        src={value || "/default-avatar.png"}
        alt=""
        className="rounded-full w-20 h-20 border mb-2"
      />
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
