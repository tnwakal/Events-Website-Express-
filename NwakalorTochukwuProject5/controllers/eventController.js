// eventController.js

// Assuming you have an 'events' array or a data source where event information is stored

/*const model = require('../models/events');

exports.index = (req, res)=>{
    //res.send('send all stories');
    model.find()
    .then(events=>res.render('./event/events', {events}))
    .catch(err=>next(err));
   
};

exports.new = (req, res)=>{
    res.render('./event/new');
};

exports.create = (req, res)=>{
    //res.send('Created a new story');
    let event = req.body;
    model.save(events);
    res.redirect('/events');
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(event=>{
        if(events){
            res.render('./event/show', {events});
            }else{
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }

    })
    .catch(err=>next(err));
    
};

exports.edit =(req,res, next) =>{
    res.send('send the edit form');
};
exports.update =(req,res) =>{
    res.send('update event with id ' + req.params.id);
};


exports.delete =(req,res) =>{
    res.send('delete event with id ' + req.params.id);
};
*/
const model = require('../models/event');
const {isLoggedIn} = require('../middleware/auth');
const rsvpModel = require('../models/rsvp');


exports.index = (req, res, next)=>{
    model.find()
    .then(events=>res.render('./event/index', {events}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./event/new');
};

exports.create = (req, res, next)=>{
    let event = new model(req.body);//create a new event document
    event.host = req.session.user;
    if(req.file)
        event.eventImage = "/images/" + req.file.filename;
    event.save()//insert the document to the database
    .then(event=> res.redirect('/events'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
   
    model.findById(id).populate('host', 'firstName lastName')
    .then(event=>{
        if(event) {    
            console.log(event);   
            return res.render('./event/show', {event});
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(event=>{
            return res.render('./event/edit', {event});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;

    if(req.file)
        event.eventImage = "/images/" + req.file.filename;

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event=>{
            res.redirect('/events/'+id);
        
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event =>{
            res.redirect('/events');
        
    })
    .catch(err=>next(err));
};


exports.rsvpCreate = (req,res, next) =>{
    let rsvp = new model(req.body);//create a new event document

    let eventId = req.params.id;
    let user = req.session.user;

    rsvp.user = user;
    rsvp.event = eventId;
    rsvpModel.findOneAndUpdate(rsvp, {user: rsvp.user, event: rsvp.event}, {useFindAndModify: false, new: true})
    .then(rsvp=> {
        if(rsvp){
        req.flash('success')
        res.redirect('/event/' + eventId);
}else{
    let err = new Error('Cannot find an event with id' + id);
    err.status=404;
    
        next(err);
}
    })
    

.catch(err=>next(err))
};