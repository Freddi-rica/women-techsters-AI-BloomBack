function errorHandler(err, req, res, next) {
    console.error("❌ Error:", err);
    return res.status(500).json({
        success: false,
        error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
}

module.exports = { errorHandler };
