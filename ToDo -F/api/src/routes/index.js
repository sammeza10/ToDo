const { Router } = require("express");
const router = Router();
const { get, run } = require("./../services/db");
const { patchValidator } = require("./../middlewares/validators");
// api/
router.get("/", async (req, res, next) => {
  try {
    const toDos = await get("SELECT * FROM todos");
    const data = toDos.map((toDo) => {
      return {
        id: toDo.id,
        title: toDo.title,
        description: toDo.description,
        created_at: toDo.created_at,
        edited_at: toDo.edited_at,
        isDone: Boolean(toDo.isDone),
      };
    });
    res.status(200).json({ message: "To-dos retrieved successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor", error });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const data = await run(
      "INSERT INTO todos (title, description) VALUES (?,?) ",
      [title, description]
    );

    const toDo = await get("SELECT * FROM todos WHERE id = ?", [data.lastID]);
    console.log(toDo, "data");
    res.status(200).json({
      message: "To-do created successfully",
      toDo: {
        id: data.lastID,
        title,
        description,
        isDone: false,
        created_at: toDo[0].created_at,
        edited_at: toDo[0].edited_at,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor", error });
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const toDo = await get("SELECT * FROM todos WHERE id = ?", [id]);

    if (toDo.length === 0) {
      return res
        .status(404)
        .json({ message: `El ID no se encuentra en la base de datos` });
    }

    let { title, description, isDone } = req.body;

    if (typeof title == "undefined") {
      title = toDo[0].title;
    }
    if (typeof description == "undefined") {
      description = toDo[0].description;
    }
    // console.log(isDone)
    if (typeof isDone == "undefined") {
      isDone = toDo[0].isDone;
    }

    const isDoneNumber = Number(isDone);

    console.log(isDone);
    await run(
      `UPDATE todos
      SET title = ?, description = ?, isDone = ?, edited_at = datetime('now', 'localtime')
      WHERE id = ?`,
      [title, description, isDoneNumber, id]
    );

    const updatedToDo = await get("SELECT * FROM todos WHERE id = ?", [id]);

    res.status(200).json({
      message: `To-do updated successfully`,
      toDo: {
        id: updatedToDo[0].id,
        title: updatedToDo[0].title,
        description: updatedToDo[0].description,
        isDone: Boolean(updatedToDo[0].isDone),
        edited_at: updatedToDo[0].edited_at,
        created_at: updatedToDo[0].created_at,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const toDo = await get("SELECT * FROM todos WHERE id = ?", [id]); // [{}]
    if (toDo.length === 0) {
      return res
        .status(404)
        .json({ message: `el ID no se encuentra en la db` });
    }
    await run("DELETE FROM todos WHERE id = ?", [id]);
    res.status(200).json({
      message: `To-do deleted successfully`,
      toDo: {
        id: toDo[0].id,
        title: toDo[0].title,
        description: toDo[0].description,
        isDone: Boolean(toDo[0].isDone),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor", error });
  }
});

module.exports = router;
