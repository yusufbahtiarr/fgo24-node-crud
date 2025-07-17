let users = [
  {
    id: 1,
    username: "yusuf1",
    email: "yusuf1@gmail.com",
    password: "111111",
  },
  {
    id: 2,
    username: "ganri1",
    email: "ganri1@gmail.com",
    password: "111111",
  },
  {
    id: 3,
    username: "sandi1",
    email: "sandi1@gmail.com",
    password: "111111",
  },
  {
    id: 4,
    username: "ulfa1",
    email: "ulfa1@gmail.com",
    password: "111111",
  },
  {
    id: 5,
    username: "dimas2",
    email: "dimas2@gmail.com",
    password: "111111",
  },
  {
    id: 6,
    username: "damar",
    email: "damar@gmail.com",
    password: "111111",
  },
];

exports.findAllUsers = function (search, sort, page = 1) {
  let resultView = users.map((user) => {
    const { password, ...userView } = user;
    return userView;
  });

  if (search) {
    lowerSearch = search.toLowerCase();
    resultView = resultView.filter((user) =>
      user.email.toLowerCase().includes(lowerSearch)
    );
  }

  if (sort === "ascending") {
    resultView.sort((a, b) => a.email.localeCompare(b.email));
  } else if (sort === "descending") {
    resultView.sort((a, b) => b.email.localeCompare(a.email));
  }
  const limit = 5;
  const totalData = resultView.length;
  const totalPages = Math.ceil(totalData / limit);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalData);

  const paginatedResults = resultView.slice(startIndex, endIndex);

  return {
    pagination: {
      totalData,
      totalPages,
      currentPage,
      limit,
    },
    data: paginatedResults,
  };
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
  users = users.filter((user) => user.id !== parseInt(id));
  return users.length !== lengthUser;
};

exports.updateUser = function (id, userData) {
  const index = users.findIndex((user) => user.id === parseInt(id));
  if (index !== -1) {
    users[index] = { ...users[index], ...userData, id: parseInt(id) };
    return users[index];
  }
  return null;
};

exports.updatePassword = function (id, newPassword) {
  parsedId = parseInt(id);
  const index = users.findIndex((user) => user.id === parsedId);
  if (index !== -1) {
    users[index] = { ...users[index], password: newPassword, id: parsedId };
    return users[index];
  }
  return null;
};
