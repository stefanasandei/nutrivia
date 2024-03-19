# Project Structure

Here is a diagram explaining the main directories:

```js
.
├── docs
├── prisma // the prisma scheme
├── public // static resources
└── src
   ├── app // the route handlers
   ├── components
   ├── config // title, description, etc.
   ├── hooks // custom hooks
   ├── lib // utility functions
   ├── server // code meant to run only on the backend
   ├── styles
   ├── trpc // utils for the tRPC library
   └── types
```

The main code lives inside the `src` directory.
