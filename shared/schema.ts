import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user, admin
  ecoPoints: integer("eco_points").notNull().default(0),
  level: text("level").notNull().default("Beginner"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wasteClassifications = pgTable("waste_classifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  confidence: integer("confidence").notNull(),
  instructions: jsonb("instructions"),
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  organizerId: integer("organizer_id").references(() => users.id),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  participantCount: integer("participant_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaignParticipants = pgTable("campaign_participants", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  userId: integer("user_id").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").references(() => blogs.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const disposalCenters = pgTable("disposal_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  types: jsonb("types"), // types of waste accepted
  phone: text("phone"),
  hours: text("hours"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  ecoPoints: true,
  level: true,
  createdAt: true,
});

export const insertWasteClassificationSchema = createInsertSchema(wasteClassifications).omit({
  id: true,
  createdAt: true,
});

export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  status: true,
  participantCount: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WasteClassification = typeof wasteClassifications.$inferSelect;
export type InsertWasteClassification = z.infer<typeof insertWasteClassificationSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type DisposalCenter = typeof disposalCenters.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  campaigns: many(campaigns),
  wasteClassifications: many(wasteClassifications),
  comments: many(comments),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  organizer: one(users, {
    fields: [campaigns.organizerId],
    references: [users.id],
  }),
}));

export const wasteClassificationsRelations = relations(wasteClassifications, ({ one }) => ({
  user: one(users, {
    fields: [wasteClassifications.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [comments.blogId],
    references: [blogs.id],
  }),
}));
