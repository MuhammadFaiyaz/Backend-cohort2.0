const id3 = require("node-id3")
const { uploadFile } = require("../services/storage.service")
const songModel = require("../models/song.model")

async function songUpload(req, res) {
    const songBuffer = req.file.buffer
    const tags = id3.read(songBuffer)

    const { mood } = req.body;
    const [songFile, posterFile] = await Promise.all([
        uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })
    ])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        success: true,
        message: "Song uploaded successfully",
        song
    })
}

async function getSong(req, res) {
    const { mood } = req.query;

    const song = await songModel.findOne({ mood });

    return res.status(200).json({
        message: "song fetched successfully.",
        song
    });
}

module.exports = {
    songUpload,
    getSong
}