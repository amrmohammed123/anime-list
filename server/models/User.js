module.exports = mongoose => {
  const userSchema = new mongoose.Schema({
    username: { type: String, index: true },
    password: String,
    email: String,
    animeList: [],
    mangaList: [],
    resetToken: String,
    resetTokenExpire: Date
  });
  const User = mongoose.model("User", userSchema);
  return User;
};
