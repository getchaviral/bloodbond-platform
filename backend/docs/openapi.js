const openapi = {
  openapi: "3.0.3",
  info: {
    title: "BloodBond API",
    version: "1.0.0",
    description: "API documentation for BloodBond full stack application",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Registration successful" },
          400: { description: "Validation error" },
          409: { description: "Email already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/user/request": {
      post: {
        summary: "Create blood request",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["bloodGroup", "units"],
                properties: {
                  bloodGroup: { type: "string", example: "A+" },
                  units: { type: "integer", minimum: 1, example: 2 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Request created" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/admin/stats": {
      get: {
        summary: "Get admin dashboard stats",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Stats fetched" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/events": {
      get: {
        summary: "List events",
        responses: {
          200: { description: "Events fetched" },
        },
      },
      post: {
        summary: "Create event (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "date", "location", "city", "organizer"],
                properties: {
                  title: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  location: { type: "string" },
                  city: { type: "string" },
                  organizer: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Event created" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/ai/assistant": {
      post: {
        summary: "Ask the BloodBond AI assistant",
        description:
          "Answers questions about donation, blood requests, stock, events and rewards. Returns a local rule based answer when no AI provider is configured.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["question"],
                properties: {
                  question: { type: "string", maxLength: 1000 },
                  history: {
                    type: "array",
                    maxItems: 6,
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string", enum: ["user", "assistant"] },
                        content: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Assistant reply" },
          400: { description: "Missing or too long question" },
          429: { description: "Too many requests" },
          504: { description: "Assistant timed out" },
        },
      },
    },
    "/api/public/blood-stock": {
      get: {
        summary: "Search blood availability by group/location",
        parameters: [
          { in: "query", name: "bloodGroup", schema: { type: "string" } },
          { in: "query", name: "state", schema: { type: "string" } },
          { in: "query", name: "district", schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Stock results fetched" },
        },
      },
    },
  },
};

module.exports = openapi;
