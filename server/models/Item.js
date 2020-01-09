module.exports = mongoose => {
  const itemSchema = new mongoose.Schema({
    _id: String, //path
    reviews: []
  });
  const Item = mongoose.model("Item", itemSchema);
  return Item;
};
