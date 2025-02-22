import getBasicProfile, {
  getMyComments,
  getMyFollowers,
  getMyFollowing,
  getMyPosts,
  getMySavedPosts,
  getMyVotedPosts,
} from "@/actions/getProfile";
import ImageProblemPost from "./ImageProblemPost";
import Comment from "./Comment";
import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import FollowCard from "./FollowCard";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { cache } from "react";

export default async function ProfileGroup({
  username,
  id,
  query,
}: {
  username: string;
  id: number;
  query: string;
}) {
  const userIdFromUserName = cache(
    async () =>
      await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, username))
        .limit(1)
  );
  const userId = await userIdFromUserName();
  console.log(userIdFromUserName);
  if (!userId || userId.length === 0)
    return <div className="text-center">Error</div>;
  switch (query) {
    case "general":
      return <DisplayUserCard id={userId[0].id} />;
    case "posts":
      return <DisplayMyPosts id={userId[0].id} />;
    case "following":
      if (userId[0].id !== id) return <div>Error</div>;
      return <DisplayMyFollowing id={userId[0].id} />;
    case "followers":
      if (userId[0].id !== id) return <div>Error</div>;
      return <DisplayMyFollowers id={userId[0].id} />;
    case "upvoted":
      if (userId[0].id !== id) return <div>Error</div>;
      return <DisplayMyVotedPosts id={userId[0].id} voteType={true} />;
    case "downvoted":
      if (userId[0].id !== id) return <div>Error</div>;
      return <DisplayMyVotedPosts id={userId[0].id} voteType={false} />;
    case "comments":
      return <DisplayMyComments id={userId[0].id} />;
    case "saved":
      if (userId[0].id !== id) return <div>Error</div>;
      return <DisplayMySavedPosts id={userId[0].id} />;
    default:
      return <DisplayUserCard id={userId[0].id} />;
  }
}

export async function DisplayUserCard({ id }: { id: number }) {
  const basicUserData = await getBasicProfile(id);
  if (!basicUserData) return <div>Error</div>;
  return (
    <div className="flex flex-col max-w-96 gap-4 px-4 py-6 bg-zinc-800 rounded-md ">
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
          {formatDistanceToNow(basicUserData.createdAt)} ago
        </p>
      </div>
    </div>
  );
}

export async function DisplayMyPosts({ id }: { id: number }) {
  const myPosts = await getMyPosts(id);
  // console.log(myPosts);
  if (!myPosts) return <div>Error</div>;
  if (myPosts.length === 0)
    return <div className="p-4 text-center">You have not posted any posts</div>;
  return (
    <div className="flex flex-col divide-y divide-zinc-700 max-w-[44rem]">
      {myPosts.map((post) => (
        <div className="pt-[1px]" key={post.id}>
          <ImageProblemPost data={post} />
        </div>
      ))}
    </div>
  );
}

export async function DisplayMyFollowing({ id }: { id: number }) {
  const following = await getMyFollowing(id);
  if (!following) return <div>Error</div>;
  if (following.length === 0)
    return <div className="p-4 text-center">You are not following anyone</div>;
  return following.map((follow) => (
    <div
      key={follow.id}
      className="flex flex-col divide-y divide-zinc-700  max-w-[44rem]"
    >
      <FollowCard
        type="following"
        // followerId={follow.followerId}
        // userId={id}
        name={follow.username}
      />
      {/* <FollowCard
        followerId={follow.followerId}
        userId={id}
        name={follow.username}
      /> */}
    </div>
  ));
}

export async function DisplayMyFollowers({ id }: { id: number }) {
  const myFollowers = await getMyFollowers(id);
  if (!myFollowers) return <div>Error</div>;
  if (myFollowers.length === 0)
    return <div className="p-4 text-center">You have no followers</div>;
  return myFollowers.map((follower) => (
    <div
      key={follower.id}
      className="flex flex-col divide-y divide-zinc-700  max-w-[44rem]"
    >
      <FollowCard
        type="follower"
        // followerId={follower.followerId}
        // userId={id}
        name={follower.username}
      />
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
  return (
    <div className="flex flex-col divide-y divide-zinc-700 max-w-[44rem]">
      {votedPosts.map((post) => (
        <div className="pt-[1px]" key={post.id}>
          <ImageProblemPost data={post} />
        </div>
      ))}
    </div>
  );
}

export async function DisplayMyComments({ id }: { id: number }) {
  const myComments = await getMyComments(id);
  if (!myComments) return <div>Error</div>;
  if (myComments.length === 0)
    return (
      <div className="p-4 text-center">You have not commented on any post</div>
    );
  return myComments.map((comment) => (
    <div key={comment.id} className="relative flex flex-col  max-w-[44rem]">
      <Link
        href={`/problem/${comment.problemPostId}`}
        className="absolute z-20 hover:underline underline-offset-1 text-violet-400 flex top-4 right-2 gap-1 items-center"
      >
        <p className="text-sm">visit post</p>
        <FaExternalLinkSquareAlt className="h-3 w-3 mt-[2.5px]" />
      </Link>
      <Comment data={comment} problemPostId={comment.problemPostId} />
    </div>
  ));
}

export async function DisplayMySavedPosts({ id }: { id: number }) {
  const savedPosts = await getMySavedPosts(id);
  console.log(savedPosts);
  if (savedPosts.length === 0)
    return <div className="p-4 text-center">You have not saved any post</div>;
  return savedPosts.map((post) => (
    <div key={post.id} className="flex flex-col  max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
}
