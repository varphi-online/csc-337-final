// Uncomment the below lines if you need linting
const { MongoClient, ObjectId } = require('mongodb');
// const express = require('express');
// const client = new MongoClient(process.env.MONGO_URI);
// const db = client.db();
// const app = express()

const user = require('./user');
const posts = db.collection('posts');
exports.posts = posts;

// Get all of my posts
app.get('/posts/mine', async (req, res) => {
    if (!user.loggedIn(req, res)) return;
    res.status(200).json(await posts.find({ user: req.get('username') }).sort({ updated: -1 }).toArray());
})

// Does what it says on the tin
app.post('/posts/new', async (req, res) => {
    if (!user.loggedIn(req, res)) return;
    const post = await posts.insertOne({
        user: req.get('username'),
        created: new Date(),
        updated: new Date(),
        title: "",
        content: "",
        published: false
    })
    res.status(200).json({ id: post.insertedId })
})

// Does what it says on the tin 2
app.delete('/posts/delete/:id', async (req, res) => {
    if (!user.loggedIn(req, res)) return;
    const result = await posts.deleteOne({
        _id: new ObjectId(req.params.id),
        user: req.get('username')
    });
    if (result.deletedCount == 0) { // fail
        res.status(400).end();
        return;
    }
    res.status(200).end();
})

// Get post info, if published, it's public, else, check if the user is logged in 
app.get('/post/:id', async (req, res) => {
    const post = await posts.findOne({
        _id: new ObjectId(req.params.id),
    });
    if (post.published) {
        res.status(200).json(post);
    } else {
        if (!user.loggedIn(req, res)) return;
        if (!user.authorized(req, res, post.user)) return; // make sure its their post
        res.status(200).json(post);
    }
})

// Update the post with new info. Pretty crude and inefficient but c'est la vie
app.patch('/post/:id', async (req, res) => {
    if (!user.loggedIn(req, res)) return;

    const result = await posts.updateOne({
        _id: new ObjectId(req.params.id),
        user: req.get('username')
    }, {
        $set: { // $set is unique update operator
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
            updated: new Date()
        }
    })

    if (result.matchedCount == 0) { // fail
        res.status(400).end();
        return;
    }
    res.status(200).end();
})

const PAGELIMIT = 10;

// Pagination -- crude but effective
app.get('/posts', async (req, res) => {
    const all = await posts.find({ published: true }).sort({ created: -1 });
    const count = await posts.countDocuments({ published: true });
    res.status(200).json({
        posts: await all.skip(req.query.page * PAGELIMIT)
            .limit(PAGELIMIT)
            .toArray(),
        pages: count / PAGELIMIT
    });
})

// route params need to be defined after routes that would conflict, otherwise they get eaten
app.get('/dashboard', (_, res) => res.sendFile(__dirname + "/dashboard.html"));
app.get('/posts/edit/:id', (_, res) => res.sendFile(__dirname + "/edit.html"));
app.get('/posts/:id', (_, res) => res.sendFile(__dirname + "/post.html"));
app.get('/', (_, res) => res.sendFile(__dirname + "/home.html"));