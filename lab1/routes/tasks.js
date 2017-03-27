const express = require('express');
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

router.get("/:id", (req, res) => {
	taskData.getTaskById(req.params.id).then((task) => {
		res.json(task);
	}).catch(() => {
		res.status(404).json({error: "task not found"});
	});
});

router.get("/", (req, res) => {
	taskData.getAllTasks().then((task) => {
		if(task.length > 100)
		{
			var newArr = [];
			for(var i = 0; i < 100; i++)
			{
				newArr.push(task[i]);
			}
			res.json(newArr);
		}
		else
		{
			res.json(task);
		}
	});
});

router.post("/", (req, res) => {
	let newTaskdata = req.body;
	if(!newTaskdata.title || !(typeof newTaskdata.title === "string"))
	{
		res.status(400).json({error: "must provide a valid title"});
		return;
	}
	if(!newTaskdata.description || !(typeof newTaskdata.description === 'string'))
	{
		res.status(400).json({error: "must provide a valid description"});
		return;
	}
	if(!newTaskdata.hoursEstimated || isNaN(newTaskdata.hoursEstimated))
	{
		res.status(400).json({error: "must provide a valid  number of hours"});
		return;
	}
	if(!newTaskdata.completed || !(typeof newTaskdata.completed === "boolean"))
	{
		res.status(400).json({error: "must provide a valid completed state"});
		return;
	}

	taskData.addTask(newTaskdata.title, newTaskdata.description, newTaskdata.hoursEstimated, newTaskdata.completed, newTaskdata.comments).then((newTask) => {
		res.json(newTask);
	}).catch((e) => {
		res.status(500).json({error: e});
	});
	
});

router.put("/:id", (req, res) => {
	let updatedTaskData = req.body;

	let getTask = taskData.getTaskById(req.params.id);

	getTask.then(() => {
		return taskData.updateTask(req.params.id, updatedTaskData)
				.then((updatedTask) => {
					res.json(updatedTask);
				}).catch((e) => {
					res.status(500).json({error: e});
				});
	});
});

router.patch("/:id", (req, res) => {
	let updatedTaskData = req.body;

	let getTask = taskData.getTaskById(req.params.id);

	getTask.then(() => {
		return taskData.updateTaskDeltas(req.params.id, updatedTaskData)
				.then((updatedTask) => {
					res.json(updatedTask);
				}).catch((e) => {
					res.status(500).json({error: e});
				});
	});
});

router.post("/:id/comments", (req, res) => {
	let commentData = req.body;
	if(!commentData.name || !(typeof commentData.name === "string"))
	{
		res.status(400).json({error: "must provide a valid name"});
	}
	if(!commentData.comment || !(typeof commentData.comment === "string"))
	{
		res.status(400).json({error: "must provide a valid comment"});
	}

	taskData.addComment(req.params.id, commentData.name, commentData.comment)
		.then((newComment) => {
			res.json(newComment);
		}).catch((e) => {
			res.status(500).json({error: e});
		});
});

router.delete("/:taskId/:commentId", (req, res) => {
	let getComment = taskData.getCommentById(req.params.taskId, req.params.commentId);

	getComment.then(() => {
		return taskData.removeComment(req.params.taskId, req.params.commentId)
			.then(() => {
				res.sendStatus(200);
			}).catch((e) => {
				res.status(500).json({error: e});
			});
	});
});
module.exports = router;