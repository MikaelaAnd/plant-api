import express from 'express';
import fs from 'fs';
const app = express();
const port = 3000;
const data = fs.readFileSync('plants.json');
let plants = JSON.parse(data);


app.use(express.json());
app.use(express.static('./public'));

app.get('/api', (req, res) => {
    res.status(200).json(plants)
});

app.get('/api/:id', (req, res) => {
    const { id } = req.params;
    const foundPlant = plants.find((plant) => {
        return plant.id == id;
    });
    if (!foundPlant) {
        res.status(404).json(`Plant with id:${id} does not exist`);
    }
    res.status(200).json(foundPlant);
})

app.post('/api', (req,res) => {
    const newPlant = req.body;
    let newId = 0;

    plants.forEach(plant => {
        if (plant.id > newId) {
            newId = plant.id;
        }
    });
    newId++;
    plants.push({
        ...newPlant,
        id: newId
    });

    fs.writeFile('plants.json', JSON.stringify(plants, null, 2), () => {
        res.status(201).json(newPlant);
    });
});


app.put('/api/:id', (req, res) => {
    const { id } = req.params;
    const index = plants.findIndex((plant) => plant.id == id);
    if (index === -1) {
        return res.status(404).json(`Plant with id:${id} does not exist`);
    } 
    const updatePlant = {
        ...req.body,
        id: parseInt(id)
    }
    plants.splice(index, 1, updatePlant);
    fs.writeFile('plants.json', JSON.stringify(plants, null, 2), () => {
        res.status(201).json(`Plant with id:${id} has been updated!`);
    });
});

app.delete('/api/:id', (req, res) => {
    const { id } = req.params;
    const index = plants.findIndex(plant => plant.id == id);
    if (index === -1) {
        return res.status(404).json('This plant does not exists');
    }
    const deletedPlant = plants.splice(index, 1);
    fs.writeFile('plants.json', JSON.stringify(plants, null, 2), () => {
        res.status(200).json(deletedPlant);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});