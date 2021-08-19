// variable holds db connection
let db;
// establish a connection to IndexedDB database called 'budget' and set it to verison 1
const request = indexedDB.open('budget', 1);

// this event will emit database changes
request.onupgradeneeded = function (event) {
	// save reference to the database
	const db = event.target.result;
	// create an object store called 'new_input', set it to have an auto incrementing primary key
	db.createObjectStore('new_input', { autoIncrement: true });
};

// upon a successful request
request.onsuccess = function (event) {
	// when db is successfully created with it's object store (from onupgradedneeded event) or an established connection happens, save reference to db in global variable
	db = event.target.result;

	// check if app is online, if yes run updateBudget() function to send all local db data to api
	if (navigator.onLine) {
		updateBudget();
	}
};

request.onerror = function (event) {
	// log error here
	console.log(event.target.errorCode);
};

// This function will execute if we attempt to submit a new record and there's no internet connection
function saveRecord(record) {
	// open a new transaction with the database with read and write permissions
	const transaction = db.transaction(['new_input'], 'readwrite');

	// access the object store for `new_input`
	const inputObjectStore = transaction.objectStore('new_input');

	// add record to your store with add method
	inputObjectStore.add(record)
}

function updateBudget() {
	// open a tarnsaction on your db
	const transaction = db.transaction(['new_input'], 'readwrite');

	// access your object store
	const inputObjectStore = transaction.objectStore('new_input');

	// get all records from store and set to variable
	const getAll = inputObjectStore.getAll();

	// upon successful .getAll() execution, run this function
	getAll.onsuccess - function () {
		// if there was data in indexedDb's store, send it to the api server
		if (getAll.result.length > 0) {

			// TODO: NEED TO CHECK CODE HERE  !!!!!
			fetch('/routes/api.js', {
				method: 'POST',
				body: JSON.stringify(getAll.result),
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
				.then(response => response.json())
				.then(serverResponse => {
					if (serverResponse.message) {
						throw new Error(serverResponse);
					}
					// open one more transaction
					const transaction = db.transaction(['new_input'], 'readwrite');
					// access the new_input object store
					const inputObjectStore = transaction.objectStore('new_input');
					// clear all items in your store
					inputObjectStore.clear();

					alert('All saved transactions has been submitted!');
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	// listen for app coming back online
	window.addEventListener('online', updateBudget);

}

