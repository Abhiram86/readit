import getBasicProfile, {
  getMyComments,
  getMyPosts,
  getMySavedPosts,
  getMyVotedPosts,
} from "@/actions/getProfile";
import ImageProblemPost from "./ImageProblemPost";
import Comment from "./Comment";
import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

export default function ProfileGroup({
  id,
  query,
}: {
  id: number;
  query: string;
}) {
  switch (query) {
    case "general":
      return <DisplayUserCard id={id} />;
    case "myposts":
      return <DisplayMyPosts id={id} />;
    case "upvoted":
      return <DisplayMyVotedPosts id={id} voteType={true} />;
    case "downvoted":
      return <DisplayMyVotedPosts id={id} voteType={false} />;
    case "mycomments":
      return <DisplayMyComments id={id} />;
    case "saved":
      return <DisplayMySavedPosts id={id} />;
    default:
      return <DisplayUserCard id={id} />;
  }
}

export async function DisplayUserCard({ id }: { id: number }) {
  const basicUserData = await getBasicProfile(id);
  if (!basicUserData) return <div>Error</div>;
  return (
    <div className="flex flex-col max-w-96 mt-4 gap-4 px-4 py-6 bg-zinc-800 rounded-md mx-auto">
      <div className="flex flex-wrap truncate">
        <label className="font-medium text-zinc-500 w-24" htmlFor="username">
          username :-
        </label>
        <p className="font-medium text-zinc-300" id="username">
          {basicUserData.name}
        </p>
      </div>
      <div className="flex flex-wrap truncate">
        <label
          className="font-medium text-zinc-500 w-24 truncate"
          htmlFor="email"
        >
          email :-
        </label>
        <p className="font-medium text-zinc-300" id="email">
          {basicUserData.email}
        </p>
      </div>
      <div className="flex flex-wrap">
        <label className="font-medium text-zinc-500 w-24" htmlFor="posts">
          posts :-
        </label>
        <p className="font-medium text-zinc-300" id="posts">
          {basicUserData.posts}
        </p>
      </div>
      <div className="flex flex-wrap">
        <label className="font-medium text-zinc-500 w-24" htmlFor="comments">
          comments :-
        </label>
        <p className="font-medium text-zinc-300" id="comments">
          {basicUserData.comments}
        </p>
      </div>
      <div className="flex flex-wrap">
        <label className="font-medium text-zinc-500 w-24" htmlFor="createdAt">
          created at :-
        </label>
        <p className="font-medium text-zinc-300" id="createdAt">
          {basicUserData.createdAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export async function DisplayMyPosts({ id }: { id: number }) {
  const myPosts = await getMyPosts(id);
  // console.log(myPosts);
  if (!myPosts) return <div>Error</div>;
  return myPosts.map((post) => (
    <div key={post.id} className="flex flex-col mx-auto max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
}

export async function DisplayMyVotedPosts({
  id,
  voteType,
}: {
  id: number;
  voteType: boolean;
}) {
  const votedPosts = await getMyVotedPosts(id, voteType);
  if (!votedPosts) return <div>Error</div>;
  if (votedPosts.length === 0)
    return (
      <div className="p-4 text-center">
        You have not {voteType ? "upvoted" : "downvoted"} any posts
      </div>
    );
  return votedPosts.map((post) => (
    <div key={post.id} className="flex flex-col mx-auto max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
}

export async function DisplayMyComments({ id }: { id: number }) {
  const myComments = await getMyComments(id);
  if (!myComments) return <div>Error</div>;
  return myComments.map((comment) => (
    <div
      key={comment.id}
      className="relative flex flex-col mx-auto max-w-[44rem]"
    >
      <Link
        href={`/problem/${comment.problemPostId}`}
        className="absolute z-20 hover:underline underline-offset-1 text-violet-400 flex top-4 right-2 gap-1 items-center"
      >
        <p className="text-sm">visit post</p>
        <FaExternalLinkSquareAlt className="h-3 w-3 mt-[2.5px]" />
      </Link>
      <Comment
        data={{ ...comment, level: 0 }}
        problemPostId={comment.problemPostId}
      />
    </div>
  ));
}

export async function DisplayMySavedPosts({ id }: { id: number }) {
  const savedPosts = await getMySavedPosts(id);
  console.log(savedPosts);
  return savedPosts.map((post) => (
    <div key={post.id} className="flex flex-col mx-auto max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
}
