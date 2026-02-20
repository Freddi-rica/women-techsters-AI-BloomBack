const { CommunityTopic, DiscussionPost, Reply, CommunityMember } = require("./community.models");
const User = require("../users/user_model"); // Adjust path if necessary

// Helper to format timeAgo
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// Helper to format post for response
const formatPost = (post, currentUserId) => {
    const p = post.toObject ? post.toObject() : post;

    // Author details
    if (p.isAnonymous) {
        p.author = {
            id: null,
            displayName: "Anonymous",
            avatar: null // could be anonymous avatar url
        };
        // Remove raw authorId if present from DB for extra safety
        p.authorId = null;
    } else {
        // If authorId was populated, it's an object
        if (p.authorId && typeof p.authorId === 'object') {
            p.author = {
                id: p.authorId._id,
                displayName: p.authorId.fullName,
                avatar: p.authorId.avatar || null
            };
        } else {
            // Fallback if not populated or null
            p.author = {
                id: p.authorId,
                displayName: p.displayName || "Unknown",
                avatar: null
            };
        }
    }

    // Clean up flat fields that are now in author object
    delete p.authorId;
    delete p.displayName;

    // TimeAgo
    p.timeAgo = timeAgo(p.createdAt);

    // Is Liked
    if (currentUserId && p.likedBy && Array.isArray(p.likedBy)) {
        p.isLiked = p.likedBy.some(id => id.toString() === currentUserId.toString());
    } else {
        p.isLiked = false;
    }

    // Remove likedBy
    delete p.likedBy;

    return p;
};


// GET /community/posts
exports.getPosts = async (req, res, next) => {
    try {
        const { topic, tab, page = 1, limit = 10, q } = req.query;
        const query = {};

        if (topic) {
            query.topic = topic;
        } else if (tab && tab !== 'all') {
            if (['preparing', 'on_leave', 'returning'].includes(tab)) {
                query.topic = tab;
            }
        }

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { body: { $regex: q, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const total = await DiscussionPost.countDocuments(query);
        const posts = await DiscussionPost.find(query)
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('authorId', 'fullName avatar')
            .lean();

        const currentUserId = req.user ? req.user.id : null;

        const formattedPosts = posts.map(post => {
            const formatted = formatPost(post, currentUserId);
            if (formatted.body && formatted.body.length > 120) {
                formatted.body = formatted.body.substring(0, 120) + "...";
            }
            return formatted;
        });

        res.json({
            success: true,
            data: formattedPosts,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                count: formattedPosts.length,
                total
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /community/posts
exports.createPost = async (req, res, next) => {
    try {
        const { topic, title, body, isAnonymous } = req.body;
        const userId = req.user.id;

        // Fetch user for initial display name snapshot if needed, 
        // but now we rely on population mostly. 
        // However logic used to store displayName... let's keep it consistent.
        let displayName = "Anonymous";
        if (!isAnonymous) {
            const user = await User.findById(userId);
            if (user) {
                displayName = user.fullName;
            }
        }

        const newPost = await DiscussionPost.create({
            authorId: userId,
            isAnonymous,
            displayName,
            topic,
            title,
            body,
            likesCount: 0,
            repliesCount: 0,
            likedBy: []
        });

        // We need to populate to return consistent format or just mock it since we just created it
        // Let's re-fetch to be safe and simple
        const populatedPost = await DiscussionPost.findById(newPost._id).populate('authorId', 'fullName avatar').lean();

        res.status(201).json({
            success: true,
            data: formatPost(populatedPost, userId)
        });
    } catch (error) {
        next(error);
    }
};

// GET /community/posts/:id
exports.getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user ? req.user.id : null;

        const post = await DiscussionPost.findById(id).populate('authorId', 'fullName avatar').lean();

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Get replies
        const replies = await Reply.find({ postId: id })
            .sort({ createdAt: 1 })
            .populate('authorId', 'fullName avatar')
            .lean();

        const formattedPost = formatPost(post, currentUserId);
        formattedPost.replies = replies.map(r => formatPost(r, currentUserId));

        res.json({
            success: true,
            data: formattedPost
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /community/posts/:id
exports.deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await DiscussionPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.authorId && post.authorId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await DiscussionPost.findByIdAndDelete(id);
        await Reply.deleteMany({ postId: id });

        res.json({ success: true, message: "Post deleted" });
    } catch (error) {
        next(error);
    }
};

// GET /community/posts/:id/replies
exports.getReplies = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user ? req.user.id : null;

        const replies = await Reply.find({ postId: id })
            .sort({ createdAt: 1 })
            .populate('authorId', 'fullName avatar')
            .lean();

        const formattedReplies = replies.map(r => formatPost(r, currentUserId));

        res.json({ success: true, data: formattedReplies });
    } catch (error) {
        next(error);
    }
};

// POST /community/posts/:id/replies
exports.createReply = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body, isAnonymous } = req.body;
        const userId = req.user.id;

        const post = await DiscussionPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        let displayName = "Anonymous";
        if (!isAnonymous) {
            const user = await User.findById(userId);
            if (user) {
                displayName = user.fullName;
            }
        }

        const newReply = await Reply.create({
            postId: id,
            authorId: userId,
            isAnonymous,
            displayName,
            body,
            likesCount: 0,
            likedBy: []
        });

        await DiscussionPost.findByIdAndUpdate(id, { $inc: { repliesCount: 1 } });

        const populatedReply = await Reply.findById(newReply._id).populate('authorId', 'fullName avatar').lean();

        res.status(201).json({ success: true, data: formatPost(populatedReply, userId) });
    } catch (error) {
        next(error);
    }
};

// DELETE /community/posts/:id/replies/:replyId
exports.deleteReply = async (req, res, next) => {
    try {
        const { id, replyId } = req.params;
        const userId = req.user.id;

        const reply = await Reply.findById(replyId);
        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        if (reply.authorId && reply.authorId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Reply.findByIdAndDelete(replyId);
        await DiscussionPost.findByIdAndUpdate(id, { $inc: { repliesCount: -1 } });

        res.json({ success: true, message: "Reply deleted" });
    } catch (error) {
        next(error);
    }
};

// POST /community/posts/:id/like
exports.likePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await DiscussionPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const isLiked = post.likedBy.some(uid => uid.toString() === userId);
        let update;

        if (isLiked) {
            update = {
                $pull: { likedBy: userId },
                $inc: { likesCount: -1 }
            };
        } else {
            update = {
                $addToSet: { likedBy: userId },
                $inc: { likesCount: 1 }
            };
        }

        const updatedPost = await DiscussionPost.findByIdAndUpdate(id, update, { new: true }).populate('authorId', 'fullName avatar').lean();

        // Return full post structure or just likes? Usually full structure helps updates, but requirements said "Return updated count".
        // But for consistency let's return relevant info.
        res.json({
            success: true,
            likesCount: updatedPost.likesCount,
            isLiked: !isLiked
        });
    } catch (error) {
        next(error);
    }
};

// POST /community/posts/:id/replies/:replyId/like
exports.likeReply = async (req, res, next) => {
    try {
        const { replyId } = req.params;
        const userId = req.user.id;

        const reply = await Reply.findById(replyId);
        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found" });
        }

        const isLiked = reply.likedBy.some(uid => uid.toString() === userId);
        let update;

        if (isLiked) {
            update = {
                $pull: { likedBy: userId },
                $inc: { likesCount: -1 }
            };
        } else {
            update = {
                $addToSet: { likedBy: userId },
                $inc: { likesCount: 1 }
            };
        }

        const updatedReply = await Reply.findByIdAndUpdate(replyId, update, { new: true }).lean();

        res.json({
            success: true,
            likesCount: updatedReply.likesCount,
            isLiked: !isLiked
        });
    } catch (error) {
        next(error);
    }
};

// GET /community/topics
exports.getTopics = async (req, res, next) => {
    try {
        const currentUserId = req.user ? req.user.id : null;

        let topics = await CommunityTopic.find().lean();

        if (topics.length === 0) {
            const seed = [
                { name: 'preparing', description: 'Preparing for Maternity', memberCount: 0 },
                { name: 'on_leave', description: 'On Leave', memberCount: 0 },
                { name: 'returning', description: 'Returning to Work', memberCount: 0 }
            ];
            await CommunityTopic.insertMany(seed);
            topics = await CommunityTopic.find().lean();
        }

        // Add isMember
        if (currentUserId) {
            // Find all topic memberships for this user
            const memberships = await CommunityMember.find({ userId: currentUserId }).lean();
            const joinedTopics = new Set(memberships.map(m => m.topic));

            topics = topics.map(t => ({
                ...t,
                isMember: joinedTopics.has(t.name)
            }));
        } else {
            topics = topics.map(t => ({
                ...t,
                isMember: false
            }));
        }

        res.json({ success: true, data: topics });
    } catch (error) {
        next(error);
    }
};

// POST /community/topics/:topic/join
exports.joinTopic = async (req, res, next) => {
    try {
        const { topic } = req.params;
        const userId = req.user.id;

        const validTopics = ['preparing', 'on_leave', 'returning'];
        if (!validTopics.includes(topic)) {
            return res.status(400).json({ success: false, message: "Invalid topic" });
        }

        const existingMember = await CommunityMember.findOne({ userId, topic });
        if (existingMember) {
            return res.status(400).json({ success: false, message: "Already joined this topic" });
        }

        await CommunityMember.create({ userId, topic });
        await CommunityTopic.findOneAndUpdate({ name: topic }, { $inc: { memberCount: 1 } });

        res.json({ success: true, message: "Joined topic successfully" });
    } catch (error) {
        next(error);
    }
};

// GET /community/topics/:topic/discussions
exports.getTopicDiscussions = async (req, res, next) => {
    try {
        const { topic } = req.params;
        const currentUserId = req.user ? req.user.id : null;

        const posts = await DiscussionPost.find({ topic })
            .sort({ likesCount: -1 })
            .limit(5)
            .populate('authorId', 'fullName avatar')
            .lean();

        const formattedPosts = posts.map(p => formatPost(p, currentUserId));

        res.json({ success: true, data: formattedPosts });
    } catch (error) {
        next(error);
    }
};

exports.searchPosts = exports.getPosts; 
