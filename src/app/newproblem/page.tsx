"use client";
import { Input } from "@/components/Form";
import PostForm, { ImageOrVideo, TextArea } from "@/components/PostForm";
import { useUserStore } from "@/store/user";
import axios from "axios";

export default function CreatePost() {
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("userId", user.id.toString());
    const res = await axios.post("/api/newpost", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res);
  };

  return (
    <div className="font-san p-2">
      <h1 className="pl-2 font-bold text-zinc-400">Create Problem Post</h1>
      <PostForm onSubmit={handleSubmit}>
        <Input name="title" placeholder="Title" />
        <ImageOrVideo />
        <Input name="tags" placeholder="Tags ex: #tag1, #tag2" />
        <TextArea placeholder="Description" />
      </PostForm>
    </div>
  );
}
