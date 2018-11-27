/*=============================================
=         Read Full Standing Table            =
=============================================*/

//Prepare initial settings
const leagueID = 62; // this indicates the Premier League of the England
const apiKey = "8dde7051c8249c2e42fd66d5c6df2d6ff6c8a4cb82077d7a3181d4d8a870f43b"
let url = "https://apifootball.com/api/?action=get_standings&league_id=" + leagueID + "&APIkey=" + apiKey;

// create request object and open this request
let request = new XMLHttpRequest();
request.open('GET', url, false);
let clubTableJSON;
request.onreadystatechange = function () {
    if (request.readyState == 4 & request.status == 200) {
        clubTableJSON = JSON.parse(request.responseText);
    } 
} 
request.send();


/*=============================================
=         Read all games informations         =
=============================================*/
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1; //January is 0!
let yyyy = today.getFullYear();
let thisday = yyyy +'-' + mm + '-' + dd;
let newUrl = "https://apifootball.com/api/?action=get_events&from=2018-08-08&to=" + thisday + "&league_id=" + leagueID + "&APIkey=" + apiKey;
let request2 = new XMLHttpRequest();
request2.open('GET', newUrl, true);
let allGames;
request2.onreadystatechange = function () {
    if (request2.readyState == 4 & request2.status == 200) {
        allGames = JSON.parse(request2.responseText);
        console.log(allGames);
        localStorage.setItem('test', JSON.stringify(allGames));
    } 
} 
request2.send();


// The drop-down side bar meu
// feed the drop-down with football club names
let arrayClubs = [];
for (let index = 0; index < clubTableJSON.length; index++) {
    arrayClubs.push(clubTableJSON[index].team_name);
}
arrayClubs.sort();

stringClubs = '';
for (let index = 0; index < arrayClubs.length; index++) {
    stringClubs += '<a class="dropdown-item" href="charts.html" id="shahab">' + arrayClubs[index] + '</a>';
}
document.getElementById('footballClubsName').innerHTML = stringClubs;

// creating the standing table
let clubTableString = "";
for (let index = 0; index < clubTableJSON.length; index++) {
    clubTableString += '<tr><td>' + clubTableJSON[index].overall_league_position + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].team_name + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_payed + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_W + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_D + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_L + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_GF + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_GA + '</td>';
    clubTableString += '<td>' + clubTableJSON[index].overall_league_PTS + '</td></tr>';
}
document.getElementById('standingTable').innerHTML = clubTableString;

/*=======================================================================
=         A section to add event listener for each club name            =
=======================================================================*/
let theParent = document.querySelectorAll('#shahab');
let teamSelected;
theParent.forEach(function (elem) {
    elem.addEventListener("click", function () {
        // document.getElementById('#chartPageIdName').innerHTML = elem.innerHTML;
        console.log(elem.innerHTML);
        teamSelected = elem.innerHTML;
        sessionStorage.myObject = JSON.stringify(teamSelected); //will set object to the stringified myObject
    });
});
localStorage.setItem('clubNames', stringClubs);
for (let index = 0; index < clubTableJSON.length; index++) {
    localStorage.setItem(clubTableJSON[index].team_name, JSON.stringify(clubTableJSON[index]));
}