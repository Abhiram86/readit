"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type ToggleButtonProps = {
  userId: number | null;
  communityId: number;
  data: {
    toggler: boolean;
    beforeToggle: string;
    afterToggle: string;
  };
};

export default function ToggleButton({
  userId,
  data,
  communityId,
}: ToggleButtonProps) {
  const [toggle, setToggle] = useState(data.toggler);
  const handleToggle = async () => {
    if (!userId) {
      toast.error("You must be logged in to join a community", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
      return;
    }
    const res = await axios.post("/api/communityjoin", {
      userId: userId,
      communityId: communityId,
    });
    if (res.status === 200) {
      setToggle(!toggle);
      toast.success(res.data.message, {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
    }
  };
  return (
    <button
      className={`px-3 ${
        toggle
          ? "bg-zinc-900 ring-zinc-700 hover:ring-zinc-500"
          : "hover:bg-zinc-900 ring-zinc-500 text-zinc-900 hover:text-zinc-100 bg-zinc-200"
      } ring-1 rounded-3xl transition-all`}
      type="button"
      onClick={handleToggle}
    >
      <p>{toggle ? data.afterToggle : data.beforeToggle}</p>
    </button>
  );
}
