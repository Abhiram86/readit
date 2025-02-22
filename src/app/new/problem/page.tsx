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
    if (!user) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("userId", user.id.toString());
    try {
      const res = await axios.post("/api/newpost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        toast.success("Post created", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
            border: "1px solid #52525b",
          },
        });
      } else
        toast.error("Something went wrong", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
            border: "1px solid #52525b",
          },
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
            border: "1px solid #52525b",
          },
        });
      }
      console.log(error);
    }
    // console.log(res);
  };

  return (
    <div className="font-san p-2">
      <h1 className="pl-2 font-bold text-zinc-400">Create Problem Post</h1>
      <PostForm onSubmit={handleSubmit}>
        <Input name="title" placeholder="Title" />
        <ImageOrVideo name="file" />
        <Input name="tags" placeholder="Tags ex: #tag1, #tag2" />
        <TextArea placeholder="Description" />
      </PostForm>
    </div>
  );
}
