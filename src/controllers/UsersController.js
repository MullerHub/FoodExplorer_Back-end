const { hash } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
 async create(req, res) {
    const  {name, email, password} = req.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.")
    }

    const hashPassword = await hash(password, 4);

    await database.run(
      `INSERT INTO users (NAME, email, password) VALUES (?, ?, ?)`,
    [name, email, hashPassword]  
    )

    return res.status(201).json();
}
}

module.exports = UsersController;