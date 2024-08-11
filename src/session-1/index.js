import { Hono } from "hono";
import { logger } from "hono/logger";
import { v4 as uuidv4 } from "uuid";
import { streamText } from "hono/streaming";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.html("<h1>Hello World2</h1>");
});

let videos = [];

app.post("/video", async (c) => {
  const { title, url } = await c.req.json();
  if (!title || !url) {
    return c.json({ error: "Title and URL are required" }, 400);
  }
  const newVideo = { id: uuidv4(), title, url };
  videos.push(newVideo);
  return c.json(newVideo);
});

// with stream
app.get("/videos", (c) => {
  return streamText(c, async (stream) => {
    for (let video of videos) {
      await stream.writeln(JSON.stringify(video));
      await stream.sleep(1000);
    }
  });
});

// get video by id
app.get("/video/:id", (c) => {
  const { id } = c.req.param();
  const video = videos.find((v) => v.id == id);

  if (!video) {
    return c.json({ error: "Video not found" }, 404);
  }
  return c.json(video);
});

// update video by id
app.patch("/video/:id", async (c) => {
  const { title, url } = await c.req.json();
  const { id } = c.req.param();
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return c.json({ error: "Video not found" }, 404);
  }

  video.title = title;
  video.url = url;
  videos.push(video);
  return c.json(video);
});

// delete video by id

app.delete("/video/:id", (c) => {
  const { id } = c.req.param();
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return c.json({ error: "Video not found" }, 404);
  }

  videos = videos.filter((v) => v.id !== id);
  return c.json({ message: "Video deleted successfully" });
});

// app.fire()

export default {
  port: 8080,
  fetch: app.fetch,
};
