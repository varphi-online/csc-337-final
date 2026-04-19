// Uncomment the below lines if you need linting
const { MongoClient, ObjectId } = require('mongodb');
// const express = require('express');
// const client = new MongoClient(process.env.MONGO_URI);
// const db = client.db();
// const app = express()

const post = require('../post/post');
const user = require('../user/user');
const comments = db.collection('comments');

// Create a comment under post with ID id 
app.post('/comments/:id', async (req, res) => {
    if (!user.loggedIn(req, res)) return; // UNAUTHORIZED
    await comments.insertOne({
        postid: new ObjectId(req.params.id),
        user: req.get('username'),
        content: req.body.content,
        created: new Date()
    })
    res.status(200).end();
})

// get comments for a specific post
app.get('/comments/:id', async (req, res) => {
    res.status(200).json(await comments.find({
        postid: new ObjectId(req.params.id),
    }).sort({ created: -1 }).toArray());
})

// comments are public - no matter what
app.get('/comments/user/:user', async (req, res) => {
    const coms = await comments.find({
        user: req.params.user,
    }).sort({ created: -1 }).toArray();

    // n+1 :coldface: - used in dashboard to give context to a comment outside of the post itsself
    for (let i = 0; i < coms.length; i++) {
        const postDoc = await post.posts.findOne({
            _id: new ObjectId(coms[i].postid),
        });
        coms[i].posttitle = postDoc?.title ?? "Untitled";
    }
    res.status(200).json(coms);
})