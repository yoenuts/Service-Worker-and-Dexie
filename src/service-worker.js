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
        getData(db);
    }
}

function sendData(message) {
    const formData = new FormData();
    formData.append('message', message.message);
    let formDataObj = {};
    for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }
    console.log('FormData contents:', formDataObj);


    fetch('https://indigo-caribou-270666.hostingersite.com/api/addMessage', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
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