test("GET /api/v1/status returns 200 and the updated_at on format ISO8601", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status")
    expect(response.status).toBe(200)

    const responseBody = await response.json()
    expect(responseBody.updated_at).toBeDefined()
    
    const parsedDate = new Date(responseBody.updated_at)
    
    expect(parsedDate.toISOString()).toBe(responseBody.updated_at)
    expect(responseBody.dependencies.database.version).toBe("16.0")
    expect(responseBody.dependencies.database.max_connections).toBe(100)
    expect(responseBody.dependencies.database.connections_opened).toBe(1) 
})