// Wait for Cordova to load
//

var pictureSource;
var destinationType;

document.addEventListener("deviceready", db_init, false);
document.addEventListener("online", onOnline, false);
// Cordova is ready
//
function db_init() {
    var db = window.openDatabase("oxfam_sims", "1.0", "OxfamSIMS", 60000);
    db.transaction(populateDB, errorCB, successCB);
    navigator.network.isReachable("google.com", reachableCallback, {});
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
//    onOnline();
}

// Populate the database 
//
function populateDB(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS beneficiary_info');
    tx.executeSql('CREATE TABLE IF NOT EXISTS beneficiary_info (b_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mobile TEXT, image TEXT, gps TEXT)');
    //tx.executeSql('INSERT INTO beneficiary_info (name, mobile, image, status) VALUES ("test.qc@gmail.com", "request-info", "test.qc image", "no")');
}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    console.log("success!");
}

function getAll(tx) {
    tx.executeSql('SELECT * FROM beneficiary_info', [], querySuccess, errorCB);
}
function updateMSG()
{

}

function chkErr(msg)
{
    console.log(msg);
}
// Query the success callback // 
function querySuccess(tx, results) {
//    var db = window.openDatabase("tatabase", "2.0", "OxfamSIMS", 60000);
    var lenz = results.rows.length;
    for (var i = 0; i < lenz; i++) {
        authenticateUser(results.rows.item(i).name, results.rows.item(i).mobile, results.rows.item(i).image, results.rows.item(i).b_id);
        console.log('querySuccess ID : ' + results.rows.item(i).b_id + ' I val::' + i);
    }


}

function saveData()
{
    var db = window.openDatabase("oxfam_sims", "1.0", "OxfamSIMS", 60000);
    db.transaction(
            function (tx) {
                tx.executeSql('INSERT INTO beneficiary_info (name, mobile, image, gps) VALUES ("dsd name","015948756","' + document.getElementById("smallImage").src + '","' + document.getElementById("lat").value + ',' + document.getElementById("lon").value + '")');
            }, errorCB, showData);
}

function showData() {

    var db = window.openDatabase("oxfam_sims", "1.0", "OxfamSIMS", 60000);
    db.transaction(queryMock, errorCB);

}

function mockSuccess(tx, results) {
    var dtx = '';
    var len = results.rows.length;
    //dtx += "EMSG table: " + len + " rows found.<hr><hr><br><br>";
    for (var i = 0; i < len; i++) {
        dtx += "GPS: " + results.rows.item(i).gps + "<br\>";
        dtx += "Name : " + results.rows.item(i).name + "<br\>";
        dtx += "Mobile : " + results.rows.item(i).mobile + "<br\>";
        //dtx += "Subject : " + results.rows.item(i).subject + "\r\n";
        dtx += "Image : " + results.rows.item(i).image + "<br\>";
        dtx += "<hr>";
    }
    //$('.data').html(dtx);
    document.getElementById('show_details').innerHTML = dtx;
}
function queryMock(tx) {
    tx.executeSql('SELECT * FROM beneficiary_info ORDER BY b_id DESC', [], mockSuccess, errorCB);
}

// sets the format of returned value
//camera part
function cameraINI() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The in-line CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50,
        destinationType: destinationType.DATA_URL});
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL});
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source});
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}


//gps

function getLocationPos() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
// onSuccess Geolocation  
function onSuccess(position) {
    document.getElementById('lat').value = position.coords.latitude;
    document.getElementById('lon').value = position.coords.longitude;
}
function onError(error) {
    alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}





