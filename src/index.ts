import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { usersRoute } from "./routes/users-route";
import { subjectsRoute } from "./routes/subjects-route";
import { modulesRoute } from "./routes/modules-route";
import { lessonsRoute } from "./routes/lessons-route";
import { enrollmentsRoute } from "./routes/enrollments-route";
import { assignmentsRoute } from "./routes/assignments-route";
import { reviewsRoute } from "./routes/reviews";
import { notificationsRoute } from "./routes/notifications";
import { progressRoute } from "./routes/progress";

const documentation = {
  info: {
    title: "LMS API",
    version: "1.0.0",
  },
};

const app = new Elysia()
  .use(cors())
  .use(swagger({ path: "/docs", documentation }))
  .use(swagger({ path: "/swagger", documentation }))
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .get("/", () => ({ status: "ok" }))
  .use(usersRoute)
  .use(subjectsRoute)
  .use(modulesRoute)
  .use(lessonsRoute)
  .use(enrollmentsRoute)
  .use(assignmentsRoute)
  .use(reviewsRoute)
  .use(notificationsRoute)
  .use(progressRoute)
  .listen(Number(process.env.PORT) || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
