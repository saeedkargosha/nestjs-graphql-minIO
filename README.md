# Nest.js + GraphQL + JWT Example

This is an example project that demonstrates how to use Nest.js with GraphQL and JWT authentication. The project includes a simple GraphQL API that allows users to login and query user, and requires users to be authenticated via JWT to get user data.

# Getting Started

To get started, clone the repository and install the dependencies:

```
git clone https://github.com/saeedkargosha/graphql-auth-nest.git
cd graphql-auth-nest
yarn install
```

Create a .env file at the root of the project and set the following environment variables:

```
PLAYGROUND_ENABLED=boolean
GRAPHQL_INTROSPECTION=boolean
JWT_SECRET=your-secret-here
ACCESS_TOKEN_EXPIRE_IN=your-secret-expire
```

This will be the secret used to sign and verify JWTs.

# Start the development server:

```
yarn start:dev
```

The GraphQL API will be available at http://localhost:3000/graphql.
