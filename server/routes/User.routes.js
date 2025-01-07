const userController = require("../controllers/UserController");
const verifyToken = require("../utils/verifyUser")

module.exports = (app) => {
    app.post("/signout", userController.signout);
    app.patch('/update/:userId', userController.updateUser)
    app.delete('/delete/:userId', userController.deleteUser);
    app.get('/getusers', userController.getUsers);
};
