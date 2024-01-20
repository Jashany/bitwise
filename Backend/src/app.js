import express from 'express';
import { Parent } from './models/parent.model.js';
import { Doctor } from './models/doctor.model.js';
import { Post } from './models/post.model.js';
import session from 'express-session';


const app = express();
app.use(express.json());

app.use(session({
  secret: 'Jas han',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your using https
}));

// Parent signup
app.post("/signup/parent", async (req, res) => {
    const { username, password } = req.body;

    try {
        const newParent = new Parent({ username, password });
        await newParent.save();
        res.status(201).send('User created!');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send("User creation failed");
    }
});

// Doctor signup
app.post("/signup/doctor", async (req, res) => {
    const { name, email, password, qualification } = req.body;

    try {
        const newDoctor = new Doctor({ name, email, password, qualification });
        await newDoctor.save();
        res.status(201).send('User created!');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send("User creation failed");
    }
});

// Add post
app.post("/addPost", async (req, res) => {
    const { title, content } = req.body;
    const owner = req.session.user._id; // Corrected session property name

    if (!owner) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const newPost = new Post({ title, content, owner });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error during post creation:', error);
        res.status(500).send("Error creating post");
    }
});

// Get post by ID
app.get("/getPost/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        console.error('Error during post retrieval:', error);
        res.status(500).send("Error retrieving post");
    }
});

// Parent login
app.post("/login/parent", async (req, res) => {
    const { username, password } = req.body;

    try {
        const parentUser = await Parent.findOne({ username });

        if (parentUser && (password === parentUser.password)) {
            req.session.user = parentUser;
            res.send('You are authenticated!');
        } else {
            res.status(401).send('Username or password incorrect!');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Login failed");
    }
});


export { app };
