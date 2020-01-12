const path = require('path'),
  express = require('express');
(router = express.Router()),
    (camp_controller = require('../controllers/CampController')),
    
//implementation pending
router.get('/campgrounds/index', camp_controller.campground_index);
router.get('/campgrounds/show/:id', camp_controller.campground_show);


module.exports = router;
