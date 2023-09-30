# airtribe - task manager api

## Solution

Start with an env var PORT to start on a specific port, or app will run on port 3000.
eg: `PORT=4000 bun src/index.js`, `bun src/index.js`

`cURL requests for all endpoints`

- **GET /tasks**: Retrieve all tasks.
  `curl --location 'http://localhost:3000/tasks'`
- **GET /tasks/:id**: Retrieve a single task by its ID.
  `curl --location 'http://localhost:3000/tasks/2'`
- **POST /tasks**: Create a new task.
  ```
  curl --location 'http://localhost:3000/tasks' \
    --header 'Content-Type: application/json' \
    --data '{
        "title": "Title A",
        "description": "Description A"
    }'
  ```
- **PUT /tasks/:id**: Update an existing task by its ID.
  ```
  curl --location --request PUT 'http://localhost:3000/tasks/2' \
    --header 'Content-Type: application/json' \
    --data '{
        "title": "Title A2",
        "description": "Description A2",
        "done": true
    }'
  ```
- **DELETE /tasks/:id**: Delete a task by its ID.
  `curl --location --request DELETE 'http://localhost:3000/tasks/3'`

**Optional extension**

```
filter_done: true / false
filter_priority: low / medium / high
sort_field: created_at / updated_at
sort_order: asc / desc
```

```curl --location 'http://localhost:3000/tasks?sort_field=updated_at&sort_order=desc&filter_done=true&filter_priority=medium```

### Objective:

Build a RESTful API for a simple task manager application.

### Project Description:

In this project, we will create a RESTful API using Node.js, Express.js, and NPM packages. The API will allow users to perform CRUD operations (Create, Read, Update, and Delete) on tasks. The tasks should have a title, description, and a flag for completion status. The API should be tested using Postman or Curl.

Set up a basic Node.js project with Express.js and other necessary NPM packages.

Implement a RESTful API with the following endpoints:

- **GET /tasks**: Retrieve all tasks.
- **GET /tasks/:id**: Retrieve a single task by its ID.
- **POST /tasks**: Create a new task.
- **PUT /tasks/:id**: Update an existing task by its ID.
- **DELETE /tasks/:id**: Delete a task by its ID.

1. Use an in-memory data store (e.g., an array) to store the tasks.
2. Implement proper error handling for invalid requests.
3. Add input validation for task creation and updates. Validate that the title and description are not empty, and that the completion status is a boolean value.
4. Test the API using Postman or Curl to ensure it works as expected.

### Optional Extension:

Implement filtering and sorting for the **GET /tasks** endpoint. For example, users should be able to filter tasks based on completion status and sort them by creation date.

Allow users to assign a priority level (e.g., low, medium, high) to each task. Update the API to support this new attribute in task creation, updates, and retrieval.

Implement an endpoint to retrieve tasks based on priority level: **GET /tasks/priority/:level**.
