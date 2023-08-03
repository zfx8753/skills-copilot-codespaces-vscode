// Create web server using Express.js
// Load Express.js module
const express = require('express');
// Create express app
const app = express();
// Load path module
const path = require('path');
// Load bodyParser module
const bodyParser = require('body-parser');
// Load mongoose module
const mongoose = require('mongoose');
// Load method-override module
const methodOverride = require('method-override');
// Load express-sanitizer module
const expressSanitizer = require('express-sanitizer');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Set view engine to ejs
app.set('view engine', 'ejs');
// Set path to views
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
// Use methodOverride
app.use(methodOverride('_method'));
// Use expressSanitizer
app.use(expressSanitizer());

// Mongoose/Model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogSchema);

// RESTful Routes

// Index Route
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// New Route
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// Create Route
app.post('/blogs', (req, res) => {
    // Create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err);
            res.render('new');
        }
        else {
            // Redirect to index
            res.redirect('/blogs');
        }
    });
});

// Show Route
app.get('/blogs/:id', (req, res) => {
    // Find blog by id
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err);
            res.redirect('/blogs');
        }
        else {
            // Render show template with blog
            res.render('show', { blog: foundBlog });
        }
    });
});

// Edit