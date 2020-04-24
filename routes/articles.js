const express = require("express");
const Article = require("./../models/article");
const router = express.Router();

router.get("/create", (req, res) => {
  res.render("articles/create", { article: new Article() });
});

router.get("/update/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/update", { article: article });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/view", { article: article });
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("create")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("update")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.image = req.body.image;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

//Tell app to use this router
module.exports = router;
