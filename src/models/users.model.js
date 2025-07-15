let users = [
  {
    id: 1,
    username: "yusuf1",
    email: "yusuf1@gmail.com",
    password: "111111",
  },
];

exports.findAllUsers = function () {
  return users;
};

exports.findUserById = function (id) {
  return users.find((user) => user.id === parseInt(id));
};

exports.findUserByEmail = function (email) {
  return users.find((user) => user.email === email);
};

exports.createUser = function (userData) {
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...userData,
  };
  users.push(newUser);
  return newUser;
};

exports.deleteUser = function (id) {
  lengthUser = users.length;
  usersData = users.filter((user) => user.id !== parseInt(id));
  return usersData !== lengthUser;
};
