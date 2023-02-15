const memeModel = require("../models/meme.model");

const getMemes = async (req, res, next) => {
  try {
    const allMemes = await memeModel.find({}).lean().exec();

    res.status(200).send({ status: true, data: allMemes });
  } catch (error) {
    req.status(500).send({ status: false, msg: error.message });
  }
};

const deleteMeme = async (req, res, next) => {
  const { id } = req.params;
  try {
    const meme = await memeModel.findOneAndDelete({ _id: id });

    res.status(200).send({ status: true, data: meme._id });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

// const createMeme = async (req, res, next) => {
//   // const { id } = req.params;
//   const { title, url } = req.body;

//   try {
//     const meme = await memeModel.create({ title, url })
//     await meme.save();
//     res.json(meme);

//     // res.status(200).send({ status: true, data: meme });
//   } catch (error) {
//     res.status(500).send({ status: false, msg: error.message });
//   }
// };

const createMeme = async (req, res) => {
  try {
    const { name, url } = req.body
    if (!name || !url ) {
      res.status(400).send({
        status: false,
        msg: 'campos obligatorios'
      })
    }
    const newGif = new memeModel({ name, url})
    await newGif.save()
    
    res.status(200).send({ status: true, data: newGif })
} catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}

const updateGif = async (req, res) => {
  try {
    const {id} = req.params
    const updateInfo = await memeModel.findByIdAndUpdate({_id: id}, req.body, {new: true, runValidators: true,})
    res.status(200).send({ status: true, data: updateInfo })
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}

module.exports = { getMemes, createMeme, deleteMeme, updateGif };

