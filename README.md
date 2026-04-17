# csc-337-final
Final project for the CSC337 course through the University of Arizona

### Running
Use `docker compose up` (or `docker-compose up` if on older versions)
to run Node.js, MongoDB, and a web interface for it.

To get mongo url, use `process.env.MONGO_URL` within node so we can switch it out
depending on the context (subject to change with however ahmed wants us to access mongo)

If you are using docker and get "module not found" after adding it to the package.json, run `docker system prune` to clear all docker related cache and then `docker compose up` like normal to rebuild with deps.