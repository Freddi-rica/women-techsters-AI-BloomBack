const router = require("express").Router();
const controller = require("./community.controller");
const { authRequired, optionalAuth } = require("../../middleware/auth.middleware");

// Topics
router.get("/topics", optionalAuth, controller.getTopics);
router.post("/topics/:topic/join", authRequired, controller.joinTopic);
router.get("/topics/:topic/discussions", optionalAuth, controller.getTopicDiscussions);

// Validations could be added here using a middleware if needed

// Search must be before /posts/:id to avoid conflict if :id is generic string
router.get("/posts/search", optionalAuth, controller.getPosts);

// Posts
router.get("/posts", optionalAuth, controller.getPosts);
router.post("/posts", authRequired, controller.createPost);
router.get("/posts/:id", optionalAuth, controller.getPost);
router.delete("/posts/:id", authRequired, controller.deletePost); // Author only check in controller

// Replies
router.get("/posts/:id/replies", optionalAuth, controller.getReplies);
router.post("/posts/:id/replies", authRequired, controller.createReply);
router.delete("/posts/:id/replies/:replyId", authRequired, controller.deleteReply);

// Likes
router.post("/posts/:id/like", authRequired, controller.likePost);
router.post("/posts/:id/replies/:replyId/like", authRequired, controller.likeReply);

module.exports = router;
