const mongoCollections = require("../config/mongoCollections");
const task = mongoCollections.tasks;
const uuid = require('node-uuid');

let exportedMethods = {
	getAllTasks() {
		return task().then((taskCollection) => {
			return taskCollection.find({}).toArray();
		});
	},

	getTaskById(id) {
		return task().then((taskCollection) => {
			return taskCollection.findOne({_id: id}).then((task) => {
				if(!task) throw "Task not found";
				return task;
			});
		});
	},

	addTask(title, desc, hoursEst, completed, comments)
	{
		return task().then((taskCol) => {
			let newTask = {
				_id: uuid.v4(),
				title: title,
				description: desc,
				hoursEstimated: hoursEst,
				completed: completed,
				comments: comments

			};

			return taskCol.insertOne(newTask).then((newInsertInfo) => {
				return newInsertInfo.insertedId;
			}).then((newId) => {
				return this.getTaskById(newId);
			});
		});
		
	},

	updateTask(id, updatedTask) {
		return task().then((taskCol) => {
			let updatedTaskData = {};

			if(updatedTask.title) {
				updatedTaskData.title = updatedTask.title;
			}

			if(updatedTask.description) {
				updatedTaskData.description = updatedTask.description;
			}

			if(updatedTask.hoursEstimated) {
				updatedTaskData.hoursEstimated = updatedTask.hoursEstimated; 
			}

			if(updatedTask.completed)
			{
				updatedTaskData.completed = updatedTask.completed;
			}

			if(updatedTask.comments)
			{
				updatedTaskData.comments = updatedTask.comments;
			}

			let updateCommand = {
				$set: updatedTaskData
			}

			return taskCol.updateOne({_id: id}, updateCommand).then((result) => {
				return this.getTaskById(id);
			});
		});
	},

	updateTaskDeltas(id, updatedTask) {
		return task().then((taskCol) => {
			let updatedTaskData = {};

			if(updatedTask.title) {
				updatedTaskData.title = updatedTask.title;
			}

			if(updatedTask.description) {
				updatedTaskData.description = updatedTask.description;
			}

			if(updatedTask.hoursEstimated) {
				updatedTaskData.hoursEstimated = updatedTask.hoursEstimated; 
			}

			if(updatedTask.completed)
			{
				updatedTaskData.completed = updatedTask.completed;
			}

			if(updatedTask.comments)
			{
				updatedTaskData.comments = updatedTask.comments;
			}

			let updateCommand = {
				$set: updatedTaskData
			}

			return taskCol.updateOne({_id: id}, updateCommand).then((result) => {
				return updatedTaskData.toArray();
			});
		});
	},

	addComment(id, name, comment) {
		return task().then((taskCol) => {
			let newComment = {
				_id: uuid.v4(),
				name: name,
				comment: comment
			};

			return taskCol.update({"_id": id}, {$addToSet: {"comments": newComment}}).then((result) => {
				return this.getTaskById(id);
			});
		});
	},

	removeComment(taskId, commentId) {
		return task().then((taskCol) => {
			return taskCol.update({"_id": taskId}, {$pull: {"comments": {"_id": commentId}}}).then((result) => {
				return this.getTaskById(taskId);
			});
		});
	},

	getCommentById(id) {
		return task().then((taskCol) => {
			return taskCol.findOne({}, {comments: {$elemMatch: {_id: id}}}).then((comment) => {
				if(!comment) throw "comment not found";
				return comment;
			});
		});
	}
}
module.exports = exportedMethods;