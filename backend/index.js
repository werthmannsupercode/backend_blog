import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { nanoid } from 'nanoid';

const beitragsArray = []

const app = express();
const PORT = 9000;

app.use((req, _, next) => {
    console.log("new request", req.method, req.url)
    next()
})

app.use(cors())
app.use(express.json())
app.use(express.static("uploads"))

app.get("/beitraege", (req, res) => {
    res.json(beitragsArray)
})

app.get("/beitraege/:id", (req, res) => {
    const beitragsId = req.params.id
    const foundBeitrag = beitragsArray.find(b => b.id === beitragsId)
    if (foundBeitrag) {
        res.json(foundBeitrag)
    } else {
        res.status(404).send({ error: "Beitrag not found!" })
    }
})

const upload = multer({ dest: 'uploads/' })
const uploadFilesMiddleware = upload.single('beitragsbild')
app.post("/createBeitrag",
    uploadFilesMiddleware,
    (req, res) => {
        console.log(req.body)
        console.log(req.file)
        console.log(req.files)

        const neuerBeitrag = {
            id: nanoid(),
            beitragstitel: req.body.beitragstitel,
            beitragstext: req.body.beitragstext,
            beitragsbildSrc: req.file.filename
        }

        beitragsArray.push(neuerBeitrag)
        res.json(beitragsArray)
    }
)

// app.delete("/beitraege/:id", (req, res) => {
//     const beitragsId = req.params.id
//     const zulöschenderBeitrag = beitragsArray.find(b => b.id === beitragsId)
//     const deletedArray = beitragsArray.filter(!zulöschenderBeitrag)
//     console.log(deletedArray)

//     res.json(deletedArray)
// })
