const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leader = require('../model/leader');
var authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        Leader.find({})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Leader.create(req.body)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end("PUT not supported!");

    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Leader.remove({})
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json( resp );
        },(err)=> next(err))
        .catch((err)=>next(err));
    });

    leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Promotion.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end("PUT not supported!");

    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Leader.findByIdAndUpdate(req.params.leaderId,{$set: req.body},{new:true})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Leader.findByIdAndRemove(req.params.leaderId)
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json( resp );
        },(err)=> next(err))
        .catch((err)=>next(err));
    });

    module.exports = leaderRouter;