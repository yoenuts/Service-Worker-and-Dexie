importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
    if(event.tag === 'post-data') {
        console.log("this is from post hehe")
        //waituntil is used to wait for the promise to resolve
        event.waitUntil(getDataAndSend());
    }
});

self.addEventListener('sync', (event) => {
    if(event.tag === 'delete-data') {
        console.log("this is from delete hehe")
        //waituntil is used to wait for the promise to resolve
        event.waitUntil(deleteData());
    }
});

function getAllDataAndSend(db) {
    const transaction = db.transaction(['requestList'], 'readwrite');
    const objectStore = transaction.objectStore('requestList');
    const getAllRequest = objectStore.getAll();
    getAllRequest.onerror = (event) => {
        console.log('Error occurred while getting all data');
    };
    getAllRequest.onsuccess = (event) => {
        const allData = getAllRequest.result;
        console.log(" all requests in database: ", allData)
        allData.forEach((data) => {
            sendData(data).then(() => {
                // delete after
                deleteDataFromStore(db, data.id);
            });
        });
    };
}

function deleteDataFromStore(db, id) {
    const transaction = db.transaction(['requestList'], 'readwrite');
    const objectStore = transaction.objectStore('requestList');
    objectStore.delete(id);
}

function getDataAndSend() {
    let db;
    const request = indexedDB.open('888-Hardware-DB');
    request.onerror = (event) => {
        console.log('Error occurred while opening the database');
    }
    request.onsuccess = (event) => {
        db = event.target.result;
        getAllDataAndSend(db);
    }
}

function sendData(message) {


    const jsonData = JSON.stringify(message);


    fetch('https://indigo-caribou-270666.hostingersite.com/api/addMessage', {
        method: 'POST',
        body: jsonData
    })
    .then(data => {
        console.log('Message sent successfully', data);
    })
    .catch(error => {
        console.log('Error occurred, retrying...', error);
    });
}

function deleteData() {
    console.log("i attempted to delete data!")
}