const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n\nBanco de dados Postgres iniciado com sucesso!\n");
  }
}

process.stdout.write("\n\nAguardando o banco de dados Postgres iniciar...");
checkPostgres();
