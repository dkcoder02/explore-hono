import { Hono } from "hono";
import dbConnect from "./session-2/db/connect";
import TodoModel from "./session-2/models/todo.model";
import { isValidObjectId } from "mongoose";
const app = new Hono();

app.get("/", (c) => {
  return c.html("<h1>Hello World2</h1>");
});

dbConnect()
  .then(() => {
    app.get("/todos", async (c) => {
      const todos = await TodoModel.find();
      return c.json(todos, 200);
    });

    app.post("/todos", async (c) => {
      try {
        const { title, decsription } = await c.req.json();

        console.log("title,description", title, decsription);
        const savedTodo = await TodoModel.create({ title, decsription });
        return c.json(savedTodo, 201);
      } catch (error: any) {
        throw new Error(error.message);
      }
    });

    app.get("/todo/:id", async (c) => {
      try {
        const id = await c.req.param("id");

        if (!isValidObjectId(id)) {
          return c.json({ error: "Invalid ID" }, 400);
        }

        const todo = await TodoModel.findById(id);

        if (!todo) {
          return c.json({ error: "Todo not found" }, 404);
        }

        return c.json(todo, 200);
      } catch (error: any) {
        return c.json({ error: error.message }, 400);
      }
    });

    app.patch("/todo/:id", async (c) => {
      try {
        const id = await c.req.param("id");

        if (!isValidObjectId(id)) {
          return c.json({ error: "Invalid ID" }, 400);
        }

        const { title, decsription, completed } = await c.req.json();

        if (!title && !decsription && !completed) {
          return c.json(
            { error: "Please provide title, description or completed" },
            400
          );
        }

        const todo = await TodoModel.findById(id);

        if (!todo) {
          return c.json({ error: "Todo not found" }, 404);
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
          id,
          { title, decsription, completed },
          { new: true }
        );

        return c.json(updatedTodo, 200);
      } catch (error: any) {
        return c.json({ error: error.message }, 400);
      }
    });

    app.delete("/todo/:id", async (c) => {
      try {
        const id = await c.req.param("id");

        if (!isValidObjectId(id)) {
          return c.json({ error: "Invalid ID" }, 400);
        }

        const todo = await TodoModel.findById(id);

        if (!todo) {
          return c.json({ error: "Todo not found" }, 404);
        }

        await TodoModel.findByIdAndDelete(id);

        return c.json({ message: "Todo deleted" }, 200);
      } catch (error: any) {
        return c.json({ error: error.message }, 400);
      }
    });
  })
  .catch((err) => console.error(err));

export default {
  port: 8080,
  fetch: app.fetch,
};
