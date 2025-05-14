import { Album } from "../models/album.model.js";
export const getAllAlbums = async (req, res, next) => {
  try {
    const album = await Album.find();
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId).populate("songs");
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json(album);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
