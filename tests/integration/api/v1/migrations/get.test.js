test("GET /api/v1/migrations returns 200 and the updated_at on format ISO8601", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations")
    expect(response.status).toBe(200)

    const responseBody = await response.json()

    expect(Array.isArray(responseBody)).toBe(true)
})