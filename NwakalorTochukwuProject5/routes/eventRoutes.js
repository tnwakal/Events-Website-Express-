/*const express = require('express');
//importing the controller to the route
const controller = require('../controllers/eventController');

const router = express.Router();

//GET /events: send all events to the user
router.get('/', controller.index);

//GET /newEvent : send html form for creating a new event
router.get('/new', controller.new);

//POST /events: create a new event
//need a form in order to try
router.post('/',  controller.create);

//GET /events/:id: send details of event identified by id
router.get('/:id',  controller.show);

//UPDATE
//GET /events/:id/edit: send html form for editing an existing event
router.get('/:id/edit',  controller.edit);
//PUT /events/:id: update the event identified by id
router.put('/:id',  controller.update);

//DELETE /event/:id: delete the event identified by id
router.delete('/:id',  controller.delete);


module.exports = router;*/

const express = require('express');
const controller = require('../controllers/eventController');
const { isLoggedIn, isHost } = require('../middleware/auth');
const { validateId } = require('../middleware/validator');
const { fileUpload } = require('../middleware/fileupload');

const router = express.Router();

//GET /events: send all events to the user
router.get('/', controller.index);

//GET /events/new: send html form for creating a new event
router.get('/new', isLoggedIn,  controller.new);

//POST /events: create a new event

router.post('/', isLoggedIn,  fileUpload, controller.create);

//POST /events: create a new rsvp
router.post('/:id/rsvp', isLoggedIn, controller.rsvpCreate);

//GET /events/:id: send details of event identified by id
router.get('/:id', validateId, controller.show);

//GET /events/:id/edit: send html form for editing an exising event
router.get('/:id/edit', isLoggedIn, isHost, validateId, fileUpload, controller.edit);

//PUT /events/:id: update the event identified by id
router.put('/:id', isLoggedIn, isHost, validateId, fileUpload, controller.update);

//DELETE /events/:id, delete the event identified by id
router.delete('/:id', isLoggedIn, isHost, validateId, controller.delete);

module.exports = router;