const express = require('express');
const userDb = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, async (req, res, next) => {
  try {
    const user = await userDb.insert(req.body)
    res.status(201).json(user)
  } catch(err) {
    next(err)
  }
})

router.post('/:id/posts', validateUserId, async(req, res, next) => {
  const newPosts = { ...req.body, user_id: req.params.id}
  try {
    const post = await postDb.insert(newPosts)
    res.status(201).json(post)
  } catch(err) {
    next(err)
  }
})  

router.get('/', async(req, res, next) => {
  try {
    const users =  await userDb.get(req.query)
    res.json(users);  
  } catch(err) {
    next(err)
  }
})  
  
router.get('/:id', validateUserId(), (req, res) => {
    res.status(200).json(req.user)  
});

router.get('/:id/posts', validateUserId, async(req, res, next) => {
  try {
    const posts = await userDb.getUserPosts(req.params.id)
    if (posts) {
      res.json(posts)
    } else {
        res.status(404).json({ 
          message: "The post with the specified ID doen not exist.",
        })
    }
  } catch(err) {
    next(err)
  }
})          

router.delete('/:id', validateUserId, async(req, res, next) => {
  try {
    const user = await userDb.remove(req.params.id)
    if(user > 0 ) {
      return res.status(204).json({ messsage: "The user has been deleted"  })
    } else {
        res.status(404).json({ 
          message: "The post with the specified ID does not exist." 
        })
    }
  }  catch(err) {
    next(err)
  }
})    

router.put('/:id', validateUserId, validateUser, async(req, res, next) => {
  const changes = req.body;
  try {
    user = await userDb.update(req.params.id, changes)
    if(user) {
      return res.json(user)
    } else {
        res.status(404).json({ 
          message: "The post with the specified ID doen not exist.",
        })
    }
  } catch(err) {
    next(err)
  }
})   

//custom middleware

function validateUserId() {
  return  async(req, res, next) => {
    try {
      const user = await  userDb.getById(req.params.id)
      if(user) {
        req.user = user

        next()
      } else {
        res.status(404).json({ 
          message: "The post with the specified ID does not exist." 
        });
      }
    } catch(err) {
      next(err)
    }
  }
} 

function validateUser(req, res, next) {
  if (!req.body || Object.keys(req.body).length ===0) {
      res.status(400).json({ message: "missing user data" })
  } else if(!req.body.name) {
      res.status(400).json({ message: "missing required name field." })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body || Object.keys(req.body).length ===0) {
    res.status(400).json({ message: "missing post data" })
  } else if(!req.body.text) {
      res.status(400).json({ message: "missing required text field." })
  } else {
    next();
  }
}

module.exports = router;
