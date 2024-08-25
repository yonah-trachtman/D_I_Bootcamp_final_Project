const { db } = require("../config/db.js");
const bcrypt = require("bcrypt");
module.exports = {
  createUser: async (userinfo) => {
    const { password, board_user } = userinfo; // Make sure `board_user` is destructured here

    const trx = await db.transaction();

    try {
      const hashPassword = await bcrypt.hash(password, 10);

      const [user] = await trx("whiteboardusers").insert(
        { board_user, password: hashPassword },
        ["id", "board_user"]
      );

      await trx.commit();

      return user;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw error;
    }
  },

  getUserByName: async (board_user = "") => {
    try {
      const user = await db("whiteboardusers")
        .select("id", "board_user", "password")
        .where("board_user", board_user)
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  updateRefreshToken: async (refresh, id) => {
    try {
      const user = await db("whiteboardusers")
        .update({ token: refresh })
        .where({ id });
      return user;
    } catch (error) {
      throw error;
    }
  },
};