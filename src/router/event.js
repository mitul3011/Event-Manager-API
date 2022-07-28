const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const db = require('../db/mongodb');
const { ObjectID } = require('bson');

const router = new express.Router();

router.get('/events', async (req, res) => {

    try {
        if (req.query.id) {
            const dbConnect = db.getDB();

            const event = await dbConnect.collection('events').findOne({ _id: new ObjectID(req.query.id) });

            if(!event){
                throw new Error('Event not found!');
            }

            res.send(event);
        }else{
            const dbConnect = db.getDB();
            const sortBy = (req.query.type === "latest") ? 1 : -1;
            const limitEvents = Number(req.query.limit);
            const skipEvents = limitEvents * (Number(req.query.page) - 1);

            const events = await dbConnect.collection('events').find({}).sort({ schedule: sortBy }).limit(limitEvents).skip(skipEvents).toArray();

            res.send(events);
        }
    } catch (error) {
        res.status(404).send({ 'Error': error.message });
    }

});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){                                    // cb = callback
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'));
        }

        cb(undefined, true);
    }
});

router.post('/events', upload.fields([ { name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 } ]), async (req, res) => {

    try {
        const dbConnect = db.getDB();

        const newEvent = {};

        for (const key in req.body) {
            if (req.body[key] !== '') {
                newEvent[key] = req.body[key];
            }
        }

        if(('image' in req.files) && (req.body.image !== '')){
            const imageBuffer = await sharp(req.files.image[0].buffer).resize({ width: 500, height: 500 }).png().toBuffer();
            newEvent.image = imageBuffer;
        }

        if(('icon' in req.files) && (req.body.icon !== '')){
            const iconBuffer = await sharp(req.files.icon[0].buffer).resize({ width: 250, height: 250 }).png().toBuffer();
            newEvent.icon = iconBuffer;
        }

        if('schedule' in req.body){
            const scheduleDateAndTime = new Date(req.body.schedule);
            newEvent.schedule = scheduleDateAndTime;
        }

        const event = await dbConnect.collection('events').insertOne(newEvent);

        res.send({ "EventID": event.insertedId });
    } catch (error) {
        res.status(404).send({ 'Error': error.message });
    }

}, (error, req, res, next) => {
    res.status(400).send({ 'Error': error.message });
});

router.put('/events/:id', upload.fields([ { name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 } ]), async (req, res) => {
    
    try {
        const id = req.params.id;
        const dbConnect = db.getDB();

        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'tagline', 'icon', 'schedule', 'description', 'image', 'moderator', 'category', 'sub_category', 'rigor_rank'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if(!isValidOperation){
            throw new Error('Invalid Updates!');
        }

        let imageBuffer, iconBuffer;
        const updateObject = {};

        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            
            if(update in req.body && req.body[update] !== ''){
                updateObject[update] = req.body[update];
            }
        }

        if(('image' in req.files) && (req.body.image !== '')){
            imageBuffer = await sharp(req.files.image[0].buffer).resize({ width: 500, height: 500 }).png().toBuffer();
            updateObject.image = imageBuffer;
        }

        if(('icon' in req.files) && (req.body.icon !== '')){
            iconBuffer = await sharp(req.files.icon[0].buffer).resize({ width: 250, height: 250 }).png().toBuffer();
            updateObject.icon = iconBuffer
        }

        if(updates.includes('schedule')){
            const scheduleDateAndTime = new Date(req.body.schedule);
            updateObject.schedule = scheduleDateAndTime;
        }

        const event = await dbConnect.collection('events').updateOne({ _id: new ObjectID(id) }, 
        {
            $set: updateObject
        });

        if(!event.matchedCount){
            throw new Error('Event does not exists!');
        }
        
        res.send();
    } catch (error) {
        res.status(404).send({ 'Error': error.message });
    }

}, (error, req, res, next) => {
    res.status(400).send({ 'Error': error.message });
});

router.delete('/events/:id', async (req, res) => {

    try {
        const id = req.params.id;
        const dbConnect = db.getDB();

        const event = await dbConnect.collection('events').deleteOne({ _id: new ObjectID(id) });

        if(!event.deletedCount){
            throw new Error('Event does not exists!');
        }
        
        res.send();
    } catch (error) {
        res.status(404).send({ 'Error': error.message });
    }
});

module.exports = router;