const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes= require('../model/dishes');
var authenticate = require('../authenticate');
var passport = require('passport');
var jwt = require('jsonwebtoken');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.get('/',(req,res,next)=>{
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err)=> next(err))
    .catch((err)=>next(err));
})

dishRouter.post( '/',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    console.log('called....................');
   Dishes.create(req.body)
   .then((dish)=>{
    console.log('called....................'+dish);
       res.statusCode = 200;
       res.setHeader('Content-Type','application/json');
       res.json(dish);
   },(err)=> next(err))
   .catch((err)=>next(err));
})

dishRouter.put('/',authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT not supported!");
})

dishRouter.delete('/',authenticate.verifyUser,(req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json( resp );
    },(err)=> next(err))
    .catch((err)=>next(err));
})


dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=> next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST not supported!");
})

.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{$set: req.body},{new:true})
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=> next(err))
    .catch((err)=>next(err));
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=> next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId/comments')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comment);
        }
        else{
            var err = new Error(req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
    },(err)=> next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            dish.comment.push(req.body);
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            })
           
        }
        else{
            var err = new Error(req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
   },(err)=> next(err))
   .catch((err)=>next(err));
})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT not supported in /dishes/"+req.params.dishId+'/comments');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            for(var i=0;i <= dish.comment.length-1;i++){
                dish.comment.id(dish.comment[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            })
        }
        else{
            var err = new Error(req.params.dishId + 'not found');
            res.statusCode = 404;
            return next(err);
        }
    },(err)=> next(err))
    .catch((err)=>next(err));
})


dishRouter.route('/:dishId/comment/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
    if(dish != null && dish.comment.id(req.params.commentId)!=null){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish.comment.id(req.params.commentId));
    }
    else if(dish == null){
        var err = new Error(req.params.dishId + 'not found');
        res.statusCode = 404;
        return next(err);
    }
    else{
        var err = new Error('comment '+req.params.commentId + ' not found');
        res.statusCode = 404;
        return next(err);
    }
},(err)=> next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST not supported!");
})
.put((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
    if(dish != null && dish.comment.id(req.params.commentId) != null){
        if(req.body.ratting){
            dish.comment.id(req.params.commentId).ratting = req.body.ratting;
        }
        if(req.body.comment){
            dish.comment.id(req.params.commentId).comment = req.body.comment;
        }
        dish.save()
        .then((dish)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comment.id(req.params.commentId));
        },(err)=>next(err));
        
    }
    else if(dish == null){
        var err = new Error(req.params.dishId + 'not found');
        res.statusCode = 404;
        return next(err);
    }
    else{
        var err = new Error('comment '+req.params.commentId + ' not found');
        res.statusCode = 404;
        return next(err);
    }
},(err)=> next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
    if(dish != null && dish.comment.id(req.params.commentId)!=null){
        dish.comment.id(req.params.commentId).remove();
        dish.save()
        .then((dish)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comment.id(req.params.commentId));
        },(err)=>next(err));
    }
    else if(dish == null){
        var err = new Error(req.params.dishId + 'not found');
        res.statusCode = 404;
        return next(err);
    }
    else{
        var err = new Error('comment '+req.params.commentId + ' not found');
        res.statusCode = 404;
        return next(err);
    }
    },(err)=> next(err))
    .catch((err)=>next(err));
});


module.exports = dishRouter;
