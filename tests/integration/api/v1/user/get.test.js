import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`http://localhost:3000/api/v1/user`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithValidSession",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    // test("With case mismatch", async () => {
    //   const user = await orchestrator.createUser();

    //   const response = await fetch(
    //     `http://localhost:3000/api/v1/users/${user.username.toLowerCase()}`,
    //   );

    //   expect(response.status).toBe(200);
    //   const responseBody = await response.json();
    //   expect(responseBody).toEqual({
    //     id: responseBody.id,
    //     username: user.username,
    //     email: user.email,
    //     password: responseBody.password,
    //     created_at: responseBody.created_at,
    //     updated_at: responseBody.updated_at,
    //   });

    //   expect(uuidVersion(responseBody.id)).toBe(4);
    //   expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    //   expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    // });

    // test("With nonexistent username", async () => {
    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/users/UsuarioInexistente",
    //   );

    //   expect(response.status).toBe(404);
    //   const responseBody = await response.json();
    //   expect(responseBody).toEqual({
    //     name: "NotFoundError",
    //     message: "O username informado não foi encontrado.",
    //     action: "Por favor, verifique se o username informado está correto.",
    //     status_code: 404,
    //   });
    // });
  });
});
