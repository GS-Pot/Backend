const { Response, verifyToken } = require("../utils");

async function allowAll(req, res, next) {
  next();
}

async function isAuthenticated(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(Response(500, "Internal Server Error", error));
  }
}

async function isExpert(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    const user = verifyToken(token);
    if (!user || !(user.role === "expert" || user.role === "admin")) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(Response(500, "Internal Server Error", error));
  }
}

async function isAdmin(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(Response(500, "Internal Server Error", error));
  }
}

async function isStudent(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json(Response(401, "Unauthorized"));
    }
    const user = verifyToken(token);
    if (!user || user.role !== "student") {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(Response(500, "Internal Server Error", error));
  }
}

module.exports = {
  isAuthenticated,
  isExpert,
  isAdmin,
  isStudent,
};
