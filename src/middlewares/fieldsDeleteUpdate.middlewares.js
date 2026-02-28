// const fieldsDeleteUpdate = (req, res, next) => {

//   const fildsDelete = ['email', 'password', 'role']

//   fildsDelete.forEach((field) => {
//     return delete req.body[field]
//   })

//   next()

// }


const fieldsDeleteUpdate = (req, res, next) => {

  const allowedFields = ['firstName', 'lastName', 'role'];

  const filteredBody = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      filteredBody[field] = req.body[field];
    }
  });

  req.body = filteredBody;

  next();
};

module.exports = fieldsDeleteUpdate
