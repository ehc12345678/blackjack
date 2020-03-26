var express = require('express');
var router = express.Router();

const todoLists = [
    {
	"name": "My Todo List",
	"id": "my_todo_list",
	"items": [
	    { "text": "Task 1" },
    	    { "text": "Task 2" },
	    { "text": "Task 1", "complete": "true" },	    
	]
    },
    {
	"name": "My Other Todo List",
	"id": "my_other_list",
	"items": []
    }
];

router.get('/', function(req, res, next) {
    res.end(JSON.stringify(todoLists));
});

router.get('/:id', function(req, res, next) {
    const found = todoLists.find(list => list.id === req.params.id);
    if (found)
	res.end(JSON.stringify(found));
});

module.exports = router;
