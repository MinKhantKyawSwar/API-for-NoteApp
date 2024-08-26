const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const noteController = require("../controllers/note");

//middleware
const authMiddleware = require("../middlewares/is-auth");

//GET /notes
router.get("/notes", noteController.getNotes);

//POst / create
router.post(
  "/create",
  authMiddleware,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title is too short")
      .isLength({ max: 100 })
      .withMessage("Title is too long."),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Content is too short"),
  ],
  noteController.createNotes
);

//GET /notes/:id
router.get("/notes/:id", noteController.getNote);

//DELETE /delete.:id
router.delete("/delete/:id", authMiddleware, noteController.deleteNote);

//GET /edit/:id
router.get("/edit/:id", authMiddleware, noteController.getOldNote);

//PUT /edit
router.put("/edit", authMiddleware, noteController.updateNote);

module.exports = router;
