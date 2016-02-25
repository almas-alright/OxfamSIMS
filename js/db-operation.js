// Wait for Cordova to load
//
document.addEventListener("deviceready", db_init, false);
document.addEventListener("online", onOnline, false);
// Cordova is ready
//
function db_init() {
    var db = window.openDatabase("oxfam_sims", "1.0", "OxfamSIMS", 60000);
    db.transaction(populateDB, errorCB, successCB);
    navigator.network.isReachable("google.com", reachableCallback, {});
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
        dtx += "GPS: "+results.rows.item(i).gps + "\r\n";
		dtx += "Name : " + results.rows.item(i).name + "\r\n";
		dtx += "Mobile : " + results.rows.item(i).mobile + "\r\n";
		//dtx += "Subject : " + results.rows.item(i).subject + "\r\n";
		dtx += "Image : " + results.rows.item(i).image + "\r\n";
		dtx += "---------------------------------\r\n";
    }
    //$('.data').html(dtx);
	document.getElementById('show_details').innerHTML = dtx;
}
function queryMock(tx) {
    tx.executeSql('SELECT * FROM beneficiary_info ORDER BY b_id DESC', [], mockSuccess, errorCB);	
}






