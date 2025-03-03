import request from "supertest";
import app from "../app";


describe("User API", () => {
  it("should return a list of users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a new user", async () => {
    const newUser = { name: "John Doe", email: "john@example.com" };
    const response = await request(app).post("/users").send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newUser.name);
  });

  it('should return user by email', async ()=>{
    const email = 'fake@gmail.com'
    const response = await request(app).get(`/users/${email}`)
    if (response.statusCode === 200) {
      expect(response.body.email).toBe(email);
    } else {
      expect(response.statusCode).toBe(404);
    }
  })
});
