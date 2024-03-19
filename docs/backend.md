# Backend

Tech stack:

- NextJS
- tRPC
- Prisma
- Firebase Messaging

APIs used:

- OpenFoodFacts
- USDA
- UploadThing
- Ollama

The initial data fetch for each page is done on the server, using React Server Components. This enables a fast user experience (no loading spinners :D) and a rich SEO. Data mutations are done using API routes, called from a tRPC function calls, which facilitates a comprehensive type system communication between the frontend and the backend.
