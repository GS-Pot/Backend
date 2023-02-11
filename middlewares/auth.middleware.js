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

async function isFaculty(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    const user = verifyToken(token);
    if (
      !user ||
      !(
        user.role === "faculty" ||
        user.role === "panel_head" ||
        user.role === "admin"
      )
    ) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(Response(500, "Internal Server Error", error));
  }
}

async function isPanelHead(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    const user = verifyToken(token);
    if (!user || !(user.role === "panel_head" || user.role === "admin")) {
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
  isFaculty,
  isPanelHead,
  isAdmin,
  isStudent,
};
