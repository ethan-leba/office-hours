import { createConnection, Connection } from "typeorm";
import { init } from "./server";
import path from "path";
import { Server, ServerInjectOptions, AuthCredentials } from "@hapi/hapi";
import { CourseModel } from "../../nest-server/src/entities/CourseModel";
import { QueueModel } from "../../nest-server/src/entities/QueueModel";
import { UserModel } from "../../nest-server/src/entities/UserModel";
import { UserFactory } from "../../nest-server/src/factory";
import { UserCourseModel } from "../../nest-server/src/entities/UserCourseModel";
import { QuestionModel } from "../../nest-server/src/entities/QuestionModel";
import { QuestionType } from "@template/common";
import hapiAuthCookie from "@hapi/cookie";

export function setupServerTest(): () => Server {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  return () => server;
}

export function setupDBTest() {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection({
      type: "postgres",
      url: "postgres://postgres@localhost:5432/test",
      synchronize: true,
      logging: false,
      entities: [path.resolve(__dirname, "entity/**/*{.js,.ts}")],
      migrations: [path.resolve(__dirname, "migration/**/*{.js,.ts}")],
      subscribers: [path.resolve(__dirname, "subscriber/**/*{.js,.ts}")],
    });
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await connection.close();
  });
}

// TODO: Remove this
// An abstraction for testing server request responsese
export function withServer(server) {
  return async ({
    method,
    url,
    payload,
    statusCode = 200,
    result,
  }: {
    method: "get" | "post" | "patch";
    url: string;
    payload?: any;
    statusCode?: number;
    result;
  }) => {
    const user = await UserFactory.create();
    const request = await server().inject({
      method,
      url,
      payload,
      auth: { strategy: "session", credentials: user as AuthCredentials },
    });
    expect(request.statusCode).toEqual(statusCode);
    expect(request.result).toStrictEqual(result);
  };
}

export async function injectAsUser(
  server: Server,
  user: UserModel,
  opts: ServerInjectOptions
) {
  return await server.inject({
    auth: { strategy: "session", credentials: user as AuthCredentials },
    ...opts,
  });
}
