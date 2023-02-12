const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
// import db from "../utils/Dynamo";
// const DB = require('../utils/Dynamo');
const db = require("../utils/Dynamo");
const { isExpert } = require("../middlewares/auth.middleware");
require("dotenv").config();
const razorpay_instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const TABLE_NAME = process.env.TABLE_NAME;

function searchBlogs(posts, term) {
  let results = [];

  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];

    let score = 0;
    if (post.title.toLowerCase().includes(term.toLowerCase())) {
      score += 5;
    }
    if (post.content.toLowerCase().includes(term.toLowerCase())) {
      score += 3;
    }

    if (score > 0) {
      results.push({
        post: post,
        score: score,
      });
    }
  }

  results.sort((a, b) => {
    return b.score - a.score;
  });

  return results;
}

router.post("/forum/search", async (req, res) => {
  try {
    const { context } = req.body;
    // console.log(req.body);
    const posts = await db.queryBeginsWith("gspot", `forum#`, TABLE_NAME);
    const data = await searchBlogs(posts, context);
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/forum", async (req, res) => {
  try {
    const posts = await db.queryBeginsWith("gspot", `forum#`, TABLE_NAME);

    const data = [];
    posts.forEach((post) => {
      if (post.sk.split("#").length > 2) {
        console.log();
      } else {
        data.push(post);
      }
    });

    return res.status(200).json({ posts: data });
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/forum/:id", async (req, res) => {
  const { id } = req.params;
  const post = await db.get("gspot", `forum#${id}`, TABLE_NAME);
  const comments = await db.queryBeginsWith(
    "gspot",
    `forum#${id}#comment#`,
    TABLE_NAME
  );
  if (post) {
    return res.status(200).json({ ...post, comments });
  } else {
    return res.status(404).json({ message: "Post not found!" });
  }
});

router.post("/forum/:id/comment", async (req, res) => {
  const { body, userId } = req.body;
  const { id } = req.params;
  // const { userId } = req.body;
  const commentId = "comment_" + crypto.randomBytes(8).toString("hex");
  const post = await db.get("gspot", `forum#${id}`, TABLE_NAME);
  const user = await db.get("gspot", `user#${userId}`, TABLE_NAME);
  if (post) {
    try {
      const params = {
        pk: "gspot",
        sk: `forum#${id}#comment#${commentId}`,
        body,
        commentId,
        user: {
          id: user.email,
          name: user.name,
          role: user.role,
        },
        created: Date.now(),
      };
      await db.put(params, TABLE_NAME);
      return res.status(200).json({ message: "Post updated successfully!" });
    } catch (err) {
      return res.status(403).json({ message: "Forbidden!" });
    }
  } else {
    return res.status(404).json({ message: "Post not found!" });
  }
});

router.post("/forum", async (req, res) => {
  const { userId, body, role, title } = req.body;
  // const { userId } = req.body;
  const id = "post_" + crypto.randomBytes(8).toString("hex");
  //   const post = await db.get("gspot", `forum#${id}`, TABLE_NAME);

  //   if (!post) {
  try {
    const params = {
      pk: "gspot",
      sk: `forum#${id}`,
      id,
      userId,
      body,
      title,
      status: true,
      role,
      comments: [],
      created: Date.now(),
    };
    await db.put(params, TABLE_NAME);
    return res.status(200).json({ message: "Post updated successfully!" });
  } catch (err) {
    return res.status(403).json({ message: "Forbidden!" });
  }
  //   } else {
  //     return res.status(404).json({ message: "Post exists!" });
  //   }
});

router.post("/forum/:id/close", isExpert, async (req, res) => {
  const { id } = req.params;
  const post = await db.get("gspot", `forum#${id}`, TABLE_NAME);
  if (post) {
    try {
      const params = {
        pk: "gspot",
        sk: `forum#${id}`,
        status: false,
      };
      await db.put(params, TABLE_NAME);
      return res.status(200).json({ message: "Post updated successfully!" });
    } catch (err) {
      return res.status(403).json({ message: "Forbidden!" });
    }
  } else {
    return res.status(404).json({ message: "Post not found!" });
  }
});
module.exports = router;
