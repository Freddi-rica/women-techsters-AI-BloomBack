const mongoose = require("mongoose");
const { Schema } = mongoose;

// 1. Community Topic
const CommunityTopicSchema = new Schema({
    name: {
        type: String,
        enum: ['preparing', 'on_leave', 'returning'],
        required: true,
        unique: true
    },
    description: { type: String },
    memberCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// 2. Discussion Post
const DiscussionPostSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Null if fully anonymous and we don't store user? Or just for display? User requirement says: "authorId: ObjectId (ref: User) — null if anonymous".
    // Actually, usually we store authorId even for anonymous posts for moderation, but the requirement says "null if anonymous". 
    // Wait, requirement 1 says: "when isAnonymous=true, never expose authorId in API responses." implies we might store it. 
    // But Data Model section says "authorId: ObjectId (ref: User) — null if anonymous". 
    // This is conflicting. If I store null, I can't let the user delete it later or see their own anonymous posts. 
    // Requirement "DELETE /api/community/posts/:id — delete post (author only)" implies I MUST know the author.
    // So "null if anonymous" in Data Models likely refers to the "API Response" or "Public Projection", NOT the database storage.
    // HOWEVER, the schema description specifically says "Data Models (Mongoose Schemas)... authorId... — null if anonymous".
    // If I strictly follow "null if anonymous" in DB, then "delete post (author only)" is impossible for anonymous posts.
    // I will assume for now that I should store the authorId but maybe the requirements meant "when returning to client".
    // Let's re-read Carefully: "authorId: ObjectId (ref: User) — null if anonymous" is listed under Data Models. 
    // If it literally means null in DB, then anonymous posts are orphaned.
    // But "DELETE ... (author only)" requires ownership.
    // I will store the authorId even if isAnonymous is true, because otherwise moderation and ownership is impossible. 
    // I will treat "null if anonymous" as a rule for the API response serialization.

    // update: I'll store authorId regardless.

    isAnonymous: { type: Boolean, default: false },
    displayName: { type: String }, // User req says "derived: show 'Anonymous' or user's name". If derived, maybe I don't store it? But schema list says "displayName: String". I'll store it for performance or snapshotting.

    topic: {
        type: String,
        enum: ['preparing', 'on_leave', 'returning'],
        required: true
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 3. Reply
const ReplySchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'DiscussionPost', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    isAnonymous: { type: Boolean, default: false },
    displayName: { type: String },
    body: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

// 4. Community Member
const CommunityMemberSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic: {
        type: String,
        enum: ['preparing', 'on_leave', 'returning'],
        required: true
    },
    joinedAt: { type: Date, default: Date.now }
});

// Index for ensuring a user joins a topic only once
CommunityMemberSchema.index({ userId: 1, topic: 1 }, { unique: true });

module.exports = {
    CommunityTopic: mongoose.model('CommunityTopic', CommunityTopicSchema),
    DiscussionPost: mongoose.model('DiscussionPost', DiscussionPostSchema),
    Reply: mongoose.model('Reply', ReplySchema),
    CommunityMember: mongoose.model('CommunityMember', CommunityMemberSchema)
};
