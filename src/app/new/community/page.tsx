"use client";
import { Input } from "@/components/Form";
import PostForm, { ImageOrVideo, TextArea } from "@/components/PostForm";
import { useUserStore } from "@/store/user";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreatePost() {
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
      return;
    }
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("userId", user.id.toString());
    const res = await axios.post("/api/newcommunity", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.status === 200) {
      toast.success("Community created", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
    }
    console.log(res);
  };

  return (
    <div className="font-san p-2">
      <h1 className="pl-2 font-bold text-zinc-400">Create New Community</h1>
      <PostForm submitText="create new community" onSubmit={handleSubmit}>
        <Input name="title" placeholder="Title" />
        <div className="flex">
          <div className="flex flex-col">
            <p className="text-zinc-400 pl-1">Community Avatar</p>
            <ImageOrVideo name="avatar" />
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-400 pl-1">Community Banner</p>
            <ImageOrVideo name="banner" />
          </div>
        </div>
        <TextArea placeholder="Description" />
      </PostForm>
    </div>
  );
}
