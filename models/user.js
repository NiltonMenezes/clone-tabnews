import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUserName(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT
              email
          FROM
              users
          WHERE
              LOWER(email) = LOWER($1)
          ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está em uso.",
        action: "Por favor, utilize outro email para se cadastrar.",
      });
    }
  }

  async function validateUniqueUserName(userName) {
    const results = await database.query({
      text: `
        SELECT
              username
          FROM
              users
          WHERE
              LOWER(username) = LOWER($1)
          ;`,
      values: [userName],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O nome de usuário informado já está em uso.",
        action: "Por favor, utilize outro nome de usuário para se cadastrar.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
          INSERT INTO 
              users (username, email, password) 
          VALUES 
              ($1, $2, $3)
          RETURNING
              *
          ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
