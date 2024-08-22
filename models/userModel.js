const { db } = require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (userinfo) => {
    const { password, email } = userinfo;

    const trx = await db.transaction();

    try {
      //hash the password and insert into the' hashpwd table
      const hashPassword = await bcrypt.hash(password + "", 10);

      const [user] = await trx("authusers").insert(
        { email, password: hashPassword },
        ["email", "id"]
      );

      await trx.commit();

      return user;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw error;
    }
  },

  getUserByEmail: async (email = "") => {
    try {
      const user = await db("authusers")
        .select("id", "email", "password")
        .where("email", email)
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const users = await db("authusers");
      return users;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const [user] = await db("authusers").where({ id });
      return user;
    } catch (error) {
      throw error;
    }
  },

  updateRefreshToken: async (refresh, id) => {
    try {
      const user = await db("authusers")
        .update({ token: refresh })
        .where({ id });
      return user;
    } catch (error) {
      throw error;
    }
  },
};
