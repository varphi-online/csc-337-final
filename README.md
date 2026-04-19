# csc-337-final
Final project for the CSC337 course through the University of Arizona

### Running
#### Docker
Use `docker compose up` (or `docker-compose up` if on older versions)
to run Node.js, MongoDB, and a web interface for it.

If you are using docker and get "module not found" after adding it to the package.json, run `docker system prune` to clear all docker related cache and then `docker compose up` like normal to rebuild with deps.

The application will run at http://localhost:8080

The MongoDB interface will run at http://localhost:8081 with username and password `admin`

#### Native
1. `npm install mongodb`
2. `npm install express`
3. 
    - Windows: `set MONGO_URI=mongodb://localhost:27017`
    - Mac/Linux: `export MONGO_URI=mongodb://localhost:27017`

    > if you're running on a different port change as needed
4. `node index.js`

The application will run at http://localhost:8080

### Notes for Devs
Including `/layout.js` in the header with `<script defer src="/layout.js"></script>` will make the page
have the sitewide header, and if you may need to rerender it for whatever reason, `layout()` will do so.
Note `defer` here, which runs *after* the window loads the DOM.

Including `/util.js` without defer will give access to helpful functions to reduce tedious-ness.

To get mongo uri, use `process.env.MONGO_URI` within node so we can switch it out
depending on the context (subject to change with however ahmed wants us to access mongo)