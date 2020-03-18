const express = require('express');
const userHubs = require('./userDb')
const postHubs = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  userHubs.insert(req.body)
      .then(users => {
        res.status(201).json(users)
      })
      .catch(error => {
        res.status(500).json({
          message: 'Error retrieving the hubs',
        });
      });
});

router.post('/:id/posts', validateUser, async (req, res, next) => {
  const newPosts = { ...req.body, post_id: req.params.id}
  postHubs.insert(newPosts)
          .then(posts => {
            if(posts) {
              res.status(201).json(posts)
            } else {
                res.status(404).json({
                  message: "The post with the specified ID doen not exist.",
                })
            }
          })
          .catch(error => {
            res.json(500).json({
              error: "There was an error while saving the comment to the database", 
            })
          })
})

router.get('/', (req, res) => {
  userHubs.get(req.query)
          .then(users => {
            res.json(users);  
          })
          .catch(error => {
            res.status(500).json({
              message: 'Error retrieving the hubs',
            });
          });
});

router.get('/:id', validateUserId, (req, res, next) => {
    res.status(200).json(req.user)
  // userHubs.getById(req.params.id)
  //         .then(user => {
  //             if(user) {
  //               res.json(user)
  //             } else {
  //               res.status(404).json({ 
  //                 message: "The post with the specified ID does not exist." 
  //               });
  //             }
  //         })
  //         .catch(error => {
  //             res.status(500).json({
  //               message: 'Error retrieving the hubs',
  //             });
  //           });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userHubs.getUserPosts(req.params.id)
          .then(posts => {
            if(posts) {
              res.json(posts)
            } else {
                res.status(404).json({ 
                  message: "The post with the specified ID doen not exist.",
                })
            }
          })
          .catch(error => {
            res.status(500).json({
              message: 'Error retrieving the hubs',
            });
          });
});

router.delete('/:id', validateUserId, (req, res) => {
  userHubs.remove(req.params.id)
          .then(user => {
            if(user) {
              return res.status(204).end()
            } else {
                res.status(404).json({ 
                  message: "The post with the specified ID does not exist." 
                })
            }
          })
          .catch(error => {
            res.status(500).json({
              message: 'Error retrieving the hubs',
            });
          });
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  const changes = req.body;
  userHubs.update(req.params.id, changes)
          .then(users => {
            if(users) {
                res.json(users)
            } else {
                res.status(404).json({ 
                  message: "The post with the specified ID doen not exist.",
                })
            }
          })
          .catch(error => {
            res.status(500).json({
              message: 'Error retrieving the hubs',
            });
          });
});

//custom middleware

function validateUserId(req, res, next) {
  userHubs.getById(req.params.id)
          .then(user => {
              if(user) {
                req.user = user

                next()
              } else {
                res.status(404).json({ 
                  message: "The post with the specified ID does not exist." 
                });
              }
          })
          .catch(error => {
              res.status(500).json({
                message: 'Error retrieving the hubs',
              });
            });
}

function validateUser(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({
      message: "Please provide name.", 
    })
  }
    next();
}

function validatePost(req, res, next) {
  if(!req.body.text) {
    return res.status(400).json({
      message: "Please provide text.", 
    })
  }
    next();
}

module.exports = router;
