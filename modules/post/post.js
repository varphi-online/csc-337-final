// Uncomment the below lines if you need linting
const {MongoClient, ObjectId} = require('mongodb');
// const express = require('express');
// const client = new MongoClient(process.env.MONGO_URI);
// const db = client.db();
// const app = express()

const user = require('../user/user');
const posts = db.collection('posts');
exports.posts = posts;

app.get('/dashboard', (_,res)=>res.sendFile(__dirname+"/dashboard.html"));
app.get('/posts/edit/:id', (_,res)=>res.sendFile(__dirname+"/edit.html"));

app.get('/api/dashboard', async (req, res)=>{
    if (!user.loggedIn(req,res)) return;
    res.status(200).json(await posts.find({user: req.get('username')}).toArray());
})

app.post('/posts/new',async (req,res)=>{
    if (!user.loggedIn(req,res)) return;
    const post = await posts.insertOne({
        user: req.get('username'),
        created: new Date(),
        updated: new Date(),
        title: "",
        content: "",
        published: false
    })
    res.status(200).json({id: post.insertedId})
})

app.delete('/posts/delete/:id',async (req,res)=>{
    if (!user.loggedIn(req, res)) return;
    const result = await posts.deleteOne({
        _id: new ObjectId(req.params.id),
        user: req.get('username')
    });
    if (result.deletedCount == 0){ // fail
        res.status(400).end();
        return;
    }
    res.status(200).end();
})

app.get('/posts/:id', async (req,res)=>{
    const post = await posts.findOne({
        _id: new ObjectId(req.params.id),
        user: req.get('username')
    });
    if(post.published){
        res.status(200).json(post);
    } else {
        if (!user.loggedIn(req, res)) return;
        res.status(200).json(post);
    }
})

app.patch('/posts/:id', async (req,res)=>{
    if (!user.loggedIn(req, res)) return;

    const result = await posts.updateOne({
        _id: new ObjectId(req.params.id),
        user: req.get('username')
    }, { $set: {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        updated: new Date()
    }})

    if(result.matchedCount == 0){ // fail
        res.status(400).end();
        return;
    }
    res.status(200).end();
})