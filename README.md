# Nest.js + GraphQL + minIO

**To authenticate requests to the GraphQL API, JWT (JSON Web Token) is used. Here's how to use JWT for authentication:**

1. Create an .env file based on the provided example.env file.

2. Start the Docker containers for the project's database and file storage by running the following commands in the terminal:

```
docker-compose -f ./docker-compose.db.yml up -d
docker-compose -f ./docker-compose.minio.yml up -d
```

3. Start the project's development server by running the command `yarn start:dev` in the terminal.

4. Use Altair, a GraphQL client, to interact with the API. You can access Altair by navigating to http://localhost:3000 in your web browser.

5. To create a new user, execute the following mutation in Altair:

```
mutation {
  signup(data:{email:"saeed@gmail.com", firstname:"saeed", lastname:"kargosha", password:"12345678"}){
    accessToken
  }
}
```

This will create a new user with the specified information and return an access token for that user.

6. To authenticate subsequent requests, include the access token in the "Authorization" header of the request, like this:

```
Authorization: Bearer <access_token>
```

Replace <access_token> with the actual access token returned by the signup mutation.

7. To upload an image for a user, execute the following mutation in Altair, replacing $file with the actual file to be uploaded:

```
mutation ($file: Upload!) {
  uploadAvatar(file: $file) {
    id
    email
    avatar
    firstname
  }
}
```

This will upload the specified image for the authenticated user and return the updated user object with the new avatar image.

![Upload.](/upload-file.png)

8. To check the uploaded image, navigate to http://localhost:9001 in your web browser. This will bring up the MinIO web interface, which is used for managing the file storage system. You should be able to find the uploaded image under the appropriate bucket and folder.

9. To retrieve a user's information, execute the following query in Altair:

```
{
 user{
  id
  email
  firstname
  lastname
   avatar
 }
}
```

This will retrieve the current user's information, including their avatar image if they have one. Make sure to include the appropriate authentication headers as described in step 6.
