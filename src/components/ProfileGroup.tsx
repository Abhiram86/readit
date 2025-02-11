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
    case "posts":
      return <DisplayMyPosts id={id} />;
    case "following":
      return <DisplayMyFollowing id={id} />;
    case "followers":
      return <DisplayMyFollowers id={id} />;
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
  return myPosts.map((post) => (
    <div key={post.id} className="flex flex-col  max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
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
        followerId={follow.followerId}
        userId={id}
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
        followerId={follower.followerId}
        userId={id}
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
  return votedPosts.map((post) => (
    <div key={post.id} className="flex flex-col  max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
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
  if (savedPosts.length === 0)
    return <div className="p-4 text-center">You have not saved any post</div>;
  return savedPosts.map((post) => (
    <div key={post.id} className="flex flex-col  max-w-[44rem]">
      <ImageProblemPost data={post} />
    </div>
  ));
}
