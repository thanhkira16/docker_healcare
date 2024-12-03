import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Email and password are required",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMsg,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  let users = await userService.getAllUsers();
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "No user ID provided",
      users: [],
    });
  }
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    users: users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  // console.log(message);
  return res.status(200).json({ ...message });
};

let handleDeleteUser = async (req, res) => {
  if (!req.query.id) {
    return res.status(500).json({
      errCode: 1,
      message: "No user ID provided",
    });
  }

  let message = await userService.deleteUser(req.query.id);
  console.log(message);
  return res.status(200).json({ ...message });
};

let handleEditUser = async (req, res) => {
  try {
    let message = await userService.updateUserData(req.body);
    return res.status(200).json({ ...message });
  } catch (error) {
    console.error("An error occurred:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);

    return res.status(200).json(data);
  } catch (err) {
    console.log("get all code service error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getting all code service",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
