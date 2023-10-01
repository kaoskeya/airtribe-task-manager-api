# airtribe - task manager api

## Solution

Install bun (https://bun.sh/)

Clone this repo and run `bun install` to install all dependencies.

Run `bun src/index.ts` to start the app.

Optionally specify a value for the env var PORT to start on a port other than 3000. `PORT=4000 bun src/index.ts`.

| Purpose                                                                       | Endpoint                                                                                                                                                                                                         |
|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Fetch all tasks                                                               | ```curl --location 'http://localhost:3000/tasks'```                                                                                                                                                              |
| Fetch all tasks, sort by created_at, ascending                                | ```curl --location 'http://localhost:3000/tasks?sort_field=created_at'```                                                                                                                                        |
| Fetch all tasks, sort by created_at, descending                               | ```curl --location 'http://localhost:3000/tasks?sort_field=created_at&sort_order=desc'```                                                                                                                        |
| Fetch tasks that are done                                                     | ```curl --location 'http://localhost:3000/tasks?filter_done=true'```                                                                                                                                             |
| Fetch tasks that are not done                                                 | ```curl --location 'http://localhost:3000/tasks?filter_done=false'```                                                                                                                                            |
| Fetch high priority tasks (all previous sort and filter params are available) | ```curl --location 'http://localhost:3000/tasks/priority/high'```                                                                                                                                                |
| Retrieve a single task by id                                                  | ```curl --location 'http://localhost:3000/tasks/2'```                                                                                                                                                            |
| Create a task                                                                 | ```curl --location 'http://localhost:3000/tasks' --header 'Content-Type: application/json' --data '{ "title": "Title A", "description": "Description A", "priority": "high" }'```                                |
| Update a task                                                                 | ```curl --location --request PUT 'http://localhost:3000/tasks/2' --header 'Content-Type: application/json' --data '{ "title": "Title A2", "description": "Description A2", "done": true, "priority": "high"}'``` |
| Delete a task                                                                 | ```curl --location --request DELETE 'http://localhost:3000/tasks/3'```                                                                                                                                           |


**Optional extension**

```
filter_done: true / false
sort_field: created_at / updated_at
sort_order: asc / desc
```

------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------

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
