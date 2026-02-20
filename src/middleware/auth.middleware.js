const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            error: { code: "UNAUTHORIZED", message: "Missing or invalid token" },
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.sub, email: payload.email };
        return next();
    } catch {
        return res.status(401).json({
            success: false,
            error: { code: "UNAUTHORIZED", message: "Invalid token" },
        });
    }
}

function optionalAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type === "Bearer" && token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: payload.sub, email: payload.email };
        } catch {
            // Invalid token but optional, so just don't set user
        }
    }
    next();
}

module.exports = { authRequired, optionalAuth };
