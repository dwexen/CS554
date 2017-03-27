const taskRoutes = require("./tasks");

let constructorMethod = (app) => {
    app.use("/tasks", taskRoutes);
};

module.exports = {
    tasks: require("./tasks")
};