const { hash, compare } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
  async create(req, res) {
    const { name, email, password, isAdmin = false } = req.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email],
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashPassword = await hash(password, 4);

    await database.run(
      `INSERT INTO users (NAME, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [name, email, hashPassword, isAdmin],
    );

    return res.status(201).json();
  }

  async update(req, res) {
    try {
      const { name, email, password, old_password } = req.body;
      const { id } = req.params;

      const database = await sqliteConnection();

      const user = await database.get("SELECT * FROM users WHERE id = (?)", [
        id,
      ]);

      if (!user) {
        throw new AppError("Usuario não encontrado");
      }

      const userWithUpdatedEmail = await database.get(
        "SELECT * FROM users WHERE  email = (?)",
        [email],
      );

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError("Email já está em uso.");
      }

      if (password && !old_password) {
        throw new AppError("Você deve informar a senha antiga");
      }

      if (password && old_password) {
        const checkOldPassword = await compare(old_password, user.password);

        if (!checkOldPassword) {
          throw new AppError("Senha antiga está incorreta");
        }

        user.password = await hash(password, 4);
      }

      user.name = name ?? user.name;
      user.email = email ?? user.email;

      await database.run(
        `
  UPDATE users SET
  name = ?,
  email = ?,
  password = ?,
  updated_at = DATETIME("now")
  WHERE id = ?`,
        [user.name, user.email, user.password, id],
      );

      return res.json({});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UsersController;
