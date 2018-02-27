const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const Note = require("../models/Note.js"); Articles = require("../models/Article.js");



router.get("/", function(req, res) {
    Articles.find({}, function(err, data) {
      const hbsObject = {
          articles: data
        };
        res.render("index", hbsObject);
    });
  });

router.get("/saved", function(req, res){
    Article.find({}, function(err, data) {
        const hbsObject = {
            article: data
          };
          res.render("saved", hbsObject);
      });
});

// A GET request 
router.get("/scrape", function(req, res) {
    // grab the html with request
    request("https://www.nba.com/", function(error, response, html) {
      // load it on to cheerio and save to $ for a shorthand selector
      const $ = cheerio.load(html);
      $("articles.contentItem").each(function(i, element) {
  
        
        const results = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        results.title = $(this).find("h1").text();
        results.link = $(this).find("a").attr("href");
        results.about = $(this).find("p").text();
  
       
        const access = new Article(results);
  
    
        access.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            console.log(doc);
          }
        });
  
      });
    });
    // Tell the browser that we finished scraping the text
    Articles.find({}, function(err, data) {
      const hbsObject = {
          articles: data
        };
        res.render("scraping", hbsObject);
    });
  });
  
  // This will get the articles we scraped from the mongoDB
  router.get("/articles", function(req, res) {
  
  
    // TODO: Finish the route so it grabs all of the articles
    Articles.find({}, function(err, data) {
      res.send(data);
    })
    
  
  
  });
  
  // This will grab an article by it's ObjectId
  router.get("/articles/:id", function(req, res) {
  
    // Use our Note model to make a new note from the req.body
    Articles.findOne({"_id":req.params.id}).populate("note")
    
      .exec(function(error, doc) {
    
        if (error) {
          res.send(error);
        }
        else {
          res.send(doc);
        }
      });
    
    });
   
  
  
  // Create a new note or replace an existing note
  router.post("/articles/:id", function(req, res) {
  
    // and update it's "note" property with the _id of the new note
    const newNote = new Note(req.body);
    console.log(newNote);
    
    newNote.save(function(error, doc) {
      
      if (error) {
        res.send(error);
      }
      
      else {
       
        Articles.searchOneAndUpdate({"_id":req.params.id}, { $set: { "note": doc._id } }, { new: true }, function(err, newdoc) {
          
          if (err) {
            res.send(err);
          }
        
          else {
            console.log(newdoc);
            res.send(newdoc);
          }
        });
      }
    });
  
  });

    // Save the article by updating the articles saved to 1(true);
    router.get('/save/:id?', function (req, res) {
        Articles.searchById(id, function (err, article) {
            if (err) return handleError(err);
            articles.saved = 1;
            //save the update in mongoDB
            articles.save(function (err, updatedArticle) {
                if (err) return handleError(err);
                res.redirect("/saved");
            })

        })
    });

    // Bring user to the saved html page showing all their saved articles
    router.get('/saved', function (req, res) {
        //find all articles
        Articles.search({}, function (err, doc) {
            if (err) return handleError (err);
                //set up data to show in handlebars
                const hbsObject = {articles: doc};
                res.render('saved', hbsObject);
        });
    });
    // Delete article from the saved articles page
    router.get('/delete/:id?', function (req, res) {
        const id = req.params.id; // set the _id of the article the user would like to delete from saved to a variable
        // Find the  article by id
        Articles.searchById(id, function (err, articles) {
            article.saved = 0; //set saved to 0(false) so it will be removed from the saved page

           
            articles.save(function (err, updatedArticles) {
                if (err) return handleError(err); 
                res.redirect('/saved'); 
            })
        })
    });

module.exports = router;