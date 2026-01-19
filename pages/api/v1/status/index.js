import database from 'infra/database.js'

async function statusHandler(req, res) {
  const updatedAt = new Date().toISOString()
  
  const databaseVersionRequest = await database.query("SHOW server_version;")
  const databaseVersionValue = databaseVersionRequest.rows[0].server_version
  
  const databaseMaxConnetionsRequest = await database.query("SHOW max_connections;")
  const databaseMaxConnectionsValue = parseInt(databaseMaxConnetionsRequest.rows[0].max_connections, 10)

  const databaseName = process.env.POSTGRES_DB
  const databaseConnectionsOpenedRequest = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  })

  res.status(200).json({ 
    updated_at: updatedAt, 
    dependencies: { 
      database: { 
        version: databaseVersionValue, 
        max_connections: databaseMaxConnectionsValue,
        connections_opened: databaseConnectionsOpenedRequest.rows[0].count 
      } 
    } 
  })
}

export default statusHandler