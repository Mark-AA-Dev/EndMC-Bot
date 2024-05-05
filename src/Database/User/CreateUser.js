const User = require("../../Schemas/User");
const { Schema } = require("mongoose");

async function createUser(member) {
  let createUser = await User.findOne({
    userId: member.user.id,
    guildId: member.guild.id,
  });
  if (!createUser) {
    createUser = await new User({
      userId: member.user.id,
      guildId: member.guild.id,
    });

    await createUser.save().catch(console.error);
  }
}

module.exports = createUser;
