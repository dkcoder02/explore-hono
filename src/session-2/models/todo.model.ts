import { Schema, model } from "mongoose";

export interface Todo {
  title: string;
  decsription: string;
  completed: boolean;
}

const TodoSchema = new Schema<Todo>(
  {
    title: { type: String, required: true },
    decsription: { type: String, required: true },
    completed: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// top of the age run
const TodoModel = model("todos", TodoSchema);

export default TodoModel;
