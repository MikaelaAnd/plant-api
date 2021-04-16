window.addEventListener('load', initSite);

async function initSite() {
    const btnAddNewPlant = document.getElementById('addNewPlant');
    btnAddNewPlant.addEventListener('click', addNewPlant);
    const btnShowAllPlants = document.getElementById('showPlants');
    btnShowAllPlants.addEventListener('click', showAllPlants);
}

async function showAllPlants() {
    const plants = await  makeRequest('/api', 'GET');
    const fillData = document.getElementById('printDataHere');
    fillData.innerHTML = '';
    for (const plant of plants) {
        displayPlant(plant, fillData)
    }
}

function displayPlant(plant, fillData) {
    const plantCard = document.createElement('div');
    plantCard.classList.add('plant-card');
    plantCard.addEventListener('click', () => {
        displaySpecificPlant(plant, fillData)
    });
    
    const title = document.createElement('h3');
    title.innerHTML = plant.name;

    fillData.append(plantCard);
    plantCard.append(title);

}

async function addNewPlant() {
    const fillData = document.getElementById('printDataHere');
    fillData.innerHTML = '';
    const addNewTitle = document.createElement('input');
    const addNewColor = document.createElement('input');
    const addNewStatus = document.createElement('input');
    const btnAddNewPlant = document.createElement('button');
    btnAddNewPlant.classList.add('root-button')
    addNewTitle.placeholder = 'Plant name';
    addNewColor.placeholder = 'Plant color';
    addNewStatus.placeholder = 'indoor/outdoor';
    btnAddNewPlant.innerHTML = 'add'
    fillData.append(addNewTitle, addNewColor, addNewStatus, btnAddNewPlant);
    btnAddNewPlant.addEventListener('click', async () => {
        const body = {
            "name": addNewTitle.value,
            "color": addNewColor.value,
            "status": addNewStatus.value,
        }
        await makeRequest('/api', 'POST', body);
        showAllPlants();
    });
}

function displaySpecificPlant(plant, fillData) {
    fillData.innerHTML = '';

    const plantData = document.createElement('div');
    plantData.classList.add('plant-data');
    
    const title = document.createElement('h4');
    title.innerHTML = plant.name;

    const color = document.createElement('h5');
    color.innerHTML = plant.color;

    const status = document.createElement('h5');
    status.innerHTML = plant.status;

    const btnUpdatePlant = document.createElement('button')
    btnUpdatePlant.classList.add('root-button');
    btnUpdatePlant.innerHTML = 'Update'
    btnUpdatePlant.addEventListener('click', () => {
        updatePlant(plant.id, fillData, plantData)
    });

    const btnDeletePlant = document.createElement('button');
    btnDeletePlant.classList.add('root-button');
    btnDeletePlant.innerHTML = 'Delete';
    btnDeletePlant.addEventListener('click', () => {
        deletePlant(plant.id);
    })

    fillData.append(plantData);
    plantData.append(title, color, status, btnUpdatePlant, btnDeletePlant);
}

async function updatePlant(plant, fillData, plantData) {
    const plantDataDiv = document.createElement('div');
    plantDataDiv.classList.add('update-plant-wrapper')
    const updateName = document.createElement('input');
    updateName.placeholder = 'plant name';
    updateName.classList.add('input')
    const updateColor = document.createElement('input');
    updateColor.placeholder = 'plant color';
    updateColor.classList.add('input');
    const updateStatus = document.createElement('input');
    updateStatus.placeholder = 'indoor/outdoor';
    updateStatus.classList.add('input');
    
    const btnUpdate = document.createElement('button');
    btnUpdate.classList.add('root-button');
    btnUpdate.innerHTML = 'OK';
    plantDataDiv.append(updateName, updateColor, updateStatus, btnUpdate, plantData);
    fillData.append(plantDataDiv);
    btnUpdate.addEventListener('click', async () => {
        const body = {
            "name": updateName.value,
            "color": updateColor.value,
            "status": updateStatus.value
        }
        await makeRequest(`/api/${plant}`, 'PUT', body);
        showAllPlants();
    });
}

async function deletePlant(plant) {
    await makeRequest(`/api/${plant}`, 'DELETE');
    showAllPlants();
}

function clearData() {
    const emptyData = document.getElementById('printDataHere');
    emptyData.innerHTML = '';
}

async function makeRequest(url, method, body) {
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
        }
    });
    const result = await response.json();
    return result;
}