import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
  text,
  AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  profileImgSrc: varchar("profile_img_src", { length: 256 }),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const problemPost = pgTable("problem_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  contentFileType: varchar("content_file_type", { length: 8 }),
  imgSrcs: varchar("img_srcs", { length: 256 }).array(),
  vidSrc: varchar("vid_src", { length: 256 }).array(),
  tags: varchar("tags", { length: 256 }).array(),
  commentCount: integer("comment_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  problemPostId: integer("problem_post_id")
    .notNull()
    .references(() => problemPost.id, { onDelete: "cascade" }),
  parentCommentId: integer("parent_comment_id").references(
    (): AnyPgColumn => comments.id,
    {
      onDelete: "cascade",
    }
  ),
  content: text("content").notNull(),
  commentCount: integer("comment_count").notNull().default(0),
  level: integer("level").notNull().default(0),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postVotes = pgTable(
  "post_votes",
  {
    id: serial("id").primaryKey(),
    problemPostId: integer("problem_post_id")
      .notNull()
      .references(() => problemPost.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    voteType: boolean("is_upvote").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_id_problem_post_id_unique").on(
      table.userId,
      table.problemPostId
    ),
  ]
);

export const commentVotes = pgTable(
  "comment_votes",
  {
    id: serial("id").primaryKey(),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    voteType: boolean("is_upvote").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_id_comment_id_unique").on(table.userId, table.commentId),
  ]
);

export const savedPosts = pgTable(
  "saved_posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    problemPostId: integer("problem_post_id")
      .notNull()
      .references(() => problemPost.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_id_saved_problem_post_id_unique").on(
      table.userId,
      table.problemPostId
    ),
  ]
);

export const search = pgTable("search", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 256 }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const followers = pgTable(
  "followers",
  {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("follower_id_user_id_unique").on(
      table.followerId,
      table.userId
    ),
  ]
);

export const community = pgTable("community", {
  id: serial("id").primaryKey(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  imgSrcs: varchar("img_srcs", { length: 256 }).array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const communityMembers = pgTable(
  "community_members",
  {
    id: serial("id").primaryKey(),
    communityId: integer("community_id")
      .notNull()
      .references(() => community.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("community_id_user_id_unique").on(
      table.communityId,
      table.userId
    ),
  ]
);

export const userRelations = relations(users, ({ many }) => ({
  problemPosts: many(problemPost),
  communities: many(community),
  communityMembers: many(communityMembers),
  comments: many(comments),
  followers: many(followers, { relationName: "followed" }),
  following: many(followers, { relationName: "follower" }),
  savedPosts: many(savedPosts),
  postVotes: many(postVotes),
  commentVotes: many(commentVotes),
  search: many(search),
}));

export const problemPostRelations = relations(problemPost, ({ one, many }) => ({
  user: one(users, {
    fields: [problemPost.userId],
    references: [users.id],
  }),
  savedBy: many(savedPosts),
  comments: many(comments),
  votes: many(postVotes),
}));

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  problemPost: one(problemPost, {
    fields: [comments.problemPostId],
    references: [problemPost.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "comment_parent",
  }),
  childComments: many(comments, {
    relationName: "comment_parent",
  }),
  votes: many(commentVotes),
}));

export const postVotesRelations = relations(postVotes, ({ one }) => ({
  user: one(users, {
    fields: [postVotes.userId],
    references: [users.id],
  }),
  problemPost: one(problemPost, {
    fields: [postVotes.problemPostId],
    references: [problemPost.id],
  }),
}));

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
  }),
}));

export const savedPostsRelations = relations(savedPosts, ({ one }) => ({
  user: one(users, {
    fields: [savedPosts.userId],
    references: [users.id],
  }),
  problemPost: one(problemPost, {
    fields: [savedPosts.problemPostId],
    references: [problemPost.id],
  }),
}));

export const searchRelations = relations(search, ({ one }) => ({
  user: one(users, {
    fields: [search.userId],
    references: [users.id],
  }),
}));

export const followerRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  user: one(users, {
    fields: [followers.userId],
    references: [users.id],
    relationName: "followed",
  }),
}));

export const communityRelations = relations(community, ({ one, many }) => ({
  communityMembers: many(communityMembers),
  user: one(users, {
    fields: [community.createdBy],
    references: [users.id],
  }),
}));

export const communityMembersRelations = relations(
  communityMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [communityMembers.userId],
      references: [users.id],
    }),
    community: one(community, {
      fields: [communityMembers.communityId],
      references: [community.id],
    }),
  })
);
