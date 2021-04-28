const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotion = require('../model/promotion');
var authenticate = require('../authenticate');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Promotion.create(req.body)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end("PUT not supported!");

    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotion.remove({})
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json( resp );
        },(err)=> next(err))
        .catch((err)=>next(err));
    });

    promotionRouter.route('/:promotionId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end("PUT not supported!");

    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promotionId,{$set: req.body},{new:true})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promotionId)
        .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json( resp );
        },(err)=> next(err))
        .catch((err)=>next(err));
    });

    module.exports = promotionRouter;