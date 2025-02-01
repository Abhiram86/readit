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
  (table) => {
    return {
      userIdProblemPostUnique: uniqueIndex("user_id_problem_post_id_unique").on(
        table.userId,
        table.problemPostId
      ),
    };
  }
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
  (table) => {
    return {
      userIdCommentUnique: uniqueIndex("user_id_comment_id_unique").on(
        table.userId,
        table.commentId
      ),
    };
  }
);

export const userRelations = relations(users, ({ many }) => ({
  problemPosts: many(problemPost),
  comments: many(comments),
  postVotes: many(postVotes),
  commentVotes: many(commentVotes),
}));

export const problemPostRelations = relations(problemPost, ({ one, many }) => ({
  user: one(users, {
    fields: [problemPost.userId],
    references: [users.id],
  }),
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
