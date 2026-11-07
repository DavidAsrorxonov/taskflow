import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// 1. GET MY TASKS
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.tokenIdentifier))
      .order("desc")
      .take(100);
  },
});

// 2. CREATE A TASK
export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const title = args.title.trim();

    if (!title || title.length > 120) {
      throw new Error("Title must be 1-120 characters");
    }

    return await ctx.db.insert("tasks", {
      title,
      completed: false,
      ownerId: identity.tokenIdentifier,
    });
  },
});

// 3. UPDATE TASK STATUS
export const setCompleted = mutation({
  args: {
    id: v.id("tasks"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.id);

    if (!task || task.ownerId !== identity.tokenIdentifier) {
      throw new Error("Task not found or access denied");
    }

    await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});

// 4. DELETE A TASK
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.id);

    if (!task || task.ownerId !== identity.tokenIdentifier) {
      throw new Error("Task not found or access denied");
    }

    await ctx.db.delete(args.id);
  },
});
