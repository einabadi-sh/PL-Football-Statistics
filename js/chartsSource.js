/*=============================================
=         Read Full Standing Table            =
=============================================*/
let clubString = localStorage.getItem('clubNames');
document.getElementById('footballClubsName').innerHTML = clubString;
var myObject = JSON.parse(sessionStorage.myObject); //will parse JSON string back to object
let theParent = document.querySelectorAll('#shahab');
theParent.href = '#';
theParent.forEach(function (elem) {
  elem.addEventListener("click", function () {
    document.getElementById('footballClubsName').innerHTML = clubString;
    sessionStorage.myObject = JSON.stringify(elem.innerHTML); //will set object to the stringified myObject
  });
});
document.getElementById('chartPageIdName').innerHTML = myObject;

/*================================================
=         Read all games untill today            =
=================================================*/
let teamResult = JSON.parse(localStorage.getItem(document.getElementById('chartPageIdName').innerHTML));
let allGamesResults = JSON.parse(localStorage.getItem('test'));

/*============================================================
=         Create the club class to store the data            =
=============================================================*/
class club {
  constructor(name, points, diff, gameno, shots_on_target, shots_off_target, possession, corners, offsides, fouls, yellow_cards, goal_kicks, treatments) {
    this.name = name;
    this.points = points;
    this.diff = diff;
    this.gameno = gameno;
    this.shots_on_target = shots_on_target;
    this.shots_off_target = shots_off_target;
    this.possession = possession;
    this.corners = corners;
    this.offsides = offsides;
    this.fouls = fouls;
    this.yellow_cards = yellow_cards;
    this.goal_kicks = goal_kicks;
    this.treatments = treatments;
  }
};

/*=================================================
=         Create the list of all clubs            =
==================================================*/
let clubNames = [];
for (let index = 0; index < 20; index++) {
  clubNames[index] = theParent[index].innerHTML;
}

/*==============================================++++++++++++++++===
=         Assign the club names to the array of bjects            =
==================================================================*/
let clubObjects = [];
for (let index = 0; index < clubNames.length; index++) {
  clubObjects[index] = new club(clubNames[index], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
}

let counter = 0;
let weeklyStanding = [];
let allGames = [];
for (let index = 0; index < allGamesResults.length; index++) {
  let game = allGamesResults[index].match_awayteam_name + "-" + allGamesResults[index].match_hometeam_name;

  if (allGamesResults[index].match_awayteam_name == "Chelsea") {
    allGamesResults[index].match_awayteam_name = "Chelsea FC";
  }
  if (allGamesResults[index].match_hometeam_name == "Chelsea") {
    allGamesResults[index].match_hometeam_name = "Chelsea FC";
  }

  // cleaning data
  if (allGamesResults[index].match_awayteam_score == "?" || allGamesResults[index].match_hometeam_score == "?") {
    console.log("Wrong data: " + game);
    continue;
  }

  // start to complete club objects with real data
  counter++;
  let awayScore = allGamesResults[index].match_awayteam_score;
  let homeScore = allGamesResults[index].match_hometeam_score;
  //if the game draws
  if (awayScore == homeScore) {
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      if (clubObjects[index2].name == allGamesResults[index].match_awayteam_name) {
        clubObjects[index2].points = clubObjects[index2].points + 1;
        clubObjects[index2].gameno = clubObjects[index2].gameno + 1;
      }
      if (clubObjects[index2].name == allGamesResults[index].match_hometeam_name) {
        clubObjects[index2].points = clubObjects[index2].points + 1;
        clubObjects[index2].gameno = clubObjects[index2].gameno + 1;
      }
    }
  }
  // if the away team wins 
  else if (awayScore > homeScore) {
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      if (clubObjects[index2].name == allGamesResults[index].match_awayteam_name) {
        clubObjects[index2].points = clubObjects[index2].points + 3;
        clubObjects[index2].diff = clubObjects[index2].diff + (awayScore - homeScore);
        clubObjects[index2].gameno = clubObjects[index2].gameno + 1;
      }
    }
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      if (clubObjects[index2].name == allGamesResults[index].match_hometeam_name) {
        clubObjects[index2].diff = clubObjects[index2].diff + (homeScore - awayScore);
        clubObjects[index2].gameno = clubObjects[index2].gameno + 1;
      }
    }
  } 
  // if the home team wins 
  else {
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      if (clubObjects[index2].name == allGamesResults[index].match_hometeam_name) {
        clubObjects[index2].points = clubObjects[index2].points + 3;
        clubObjects[index2].diff = clubObjects[index2].diff + (homeScore - awayScore);
        clubObjects[index2].gameno = clubObjects[index2].gameno + 1;
      }
    }
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      if (clubObjects[index2].name == allGamesResults[index].match_awayteam_name) {
        clubObjects[index2].diff = clubObjects[index2].diff + (awayScore - homeScore);
        clubObjects[index2].gameno = clubObjects[index2].gameno + 1;
      }
    }
  }
  //sorting the club objects according to the points and diff
  clubObjects.sort(function (x, y) {
    if (x.points > y.points) return -1;
    if (x.points < y.points) return 1;
    if (x.points == y.points) {
      if (x.diff > y.diff) return -1;
      if (x.diff < y.diff) return 1;
      if (x.diff == y.diff) return 0;
    }
  })

  //saving the ranking of each club in each week
  if (counter % 10 == 0) {
    let a = [];
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      a[index2] = clubObjects[index2].name;
    }
    weeklyStanding[counter / 10 - 1] = a;
  }

  if (index == allGamesResults.length - 1) {
    let b = [];
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      b[index2] = clubObjects[index2].name;
    }
    weeklyStanding[Math.round(counter / 10) - 1] = b;
  }


  //part two, statistics gathering
  if (allGamesResults[index].statistics.length != 0) {
    for (let index2 = 0; index2 < clubObjects.length; index2++) {
      if (clubObjects[index2].name == allGamesResults[index].match_hometeam_name) {
        clubObjects[index2].shots_on_target = Number(clubObjects[index2].shots_on_target) + Number(allGamesResults[index].statistics[0].home);
        clubObjects[index2].shots_off_target = Number(clubObjects[index2].shots_off_target) + Number(allGamesResults[index].statistics[1].home);
        clubObjects[index2].possession = Number(clubObjects[index2].possession) + Number(allGamesResults[index].statistics[2].home);
        clubObjects[index2].corners = Number(clubObjects[index2].corners) + Number(allGamesResults[index].statistics[3].home);
        clubObjects[index2].offsides = Number(clubObjects[index2].offsides) + Number(allGamesResults[index].statistics[4].home);
        clubObjects[index2].fouls = Number(clubObjects[index2].fouls) + Number(allGamesResults[index].statistics[5].home);
      }
      if (clubObjects[index2].name == allGamesResults[index].match_awayteam_name) {
        clubObjects[index2].shots_on_target = Number(clubObjects[index2].shots_on_target) + Number(allGamesResults[index].statistics[0].away);
        clubObjects[index2].shots_off_target = Number(clubObjects[index2].shots_off_target) + Number(allGamesResults[index].statistics[1].away);
        clubObjects[index2].possession = Number(clubObjects[index2].possession) + Number(allGamesResults[index].statistics[2].away);
        clubObjects[index2].corners = Number(clubObjects[index2].corners) + Number(allGamesResults[index].statistics[3].away);
        clubObjects[index2].offsides = Number(clubObjects[index2].offsides) + Number(allGamesResults[index].statistics[4].away);
        clubObjects[index2].fouls = Number(clubObjects[index2].fouls) + Number(allGamesResults[index].statistics[5].away);
      }
    }
  }
}


/*===================================================================
=         complete the four cards at the top of the page            =
====================================================================*/
let counter2 = 4;
// search for the last four games of the each club
// if the result of the game is draw, the card will be yellow with = sign
// if the result of the game is win, the card will be green with thump-up sign
// if the result of the game is loose, the card will be red with thump-down sign
for (let index = allGamesResults.length - 1; index >= 0; index--) {
  if (allGamesResults[index].match_hometeam_name == myObject || allGamesResults[index].match_awayteam_name == myObject) {

    //type the result of the game
    document.getElementById('icon' + counter2).innerHTML = allGamesResults[index].match_hometeam_name + '(' +
      allGamesResults[index].match_hometeam_score + ')' + '  -  ' +
      allGamesResults[index].match_awayteam_name + '(' +
      allGamesResults[index].match_awayteam_score + ')';

    // cahnge the icon of the card and the color
    if (allGamesResults[index].match_hometeam_score == allGamesResults[index].match_awayteam_score) {
      document.getElementById(counter2 + 'icon').className = "fas fa-fw fa-pause";
      document.getElementById(counter2 + 'icon' + counter2).className = "card text-white bg-warning o-hidden h-100";
    } else {
      if (allGamesResults[index].match_hometeam_name == myObject) {

        if (allGamesResults[index].match_hometeam_score > allGamesResults[index].match_awayteam_score) {
          //home winner
          document.getElementById(counter2 + 'icon').className = "fas fa-fw fa-thumbs-up";
          document.getElementById(counter2 + 'icon' + counter2).className = "card text-white bg-success o-hidden h-100";
        } else {
          //home looser
          document.getElementById(counter2 + 'icon').className = "fas fa-fw fa-thumbs-down";
          document.getElementById(counter2 + 'icon' + counter2).className = "card text-white bg-danger o-hidden h-100";
        }
      } else {
        if (allGamesResults[index].match_hometeam_score < allGamesResults[index].match_awayteam_score) {
          //home winner
          document.getElementById(counter2 + 'icon').className = "fas fa-fw fa-thumbs-up";
          document.getElementById(counter2 + 'icon' + counter2).className = "card text-white bg-success o-hidden h-100";
        } else {
          //home looser
          document.getElementById(counter2 + 'icon').className = "fas fa-fw fa-thumbs-down";
          document.getElementById(counter2 + 'icon' + counter2).className = "card text-white bg-danger o-hidden h-100";
        }
      }
    }
    //add the match date to the card
    document.getElementById('date' + counter2).innerHTML = allGamesResults[index].match_date;
    counter2--;
  }
  if (counter2 == 0) break;
}

/*========================================
=         plotting the charts            =
=========================================*/

//doughnut chart which shows the number of Draws, Losses and Wins
var ctxD = document.getElementById("doughnutChart").getContext('2d');
var myLineChart = new Chart(ctxD, {
  type: 'doughnut',
  data: {
    labels: ["Losses", "Wins", "Draws"],
    datasets: [{
      data: [teamResult.overall_league_L, teamResult.overall_league_W, teamResult.overall_league_D],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
      hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
    }]
  },
  options: {
    responsive: true
  }
});

//bar chart which shows some average statistics of each club during the season
let statisticsData = function (team) {
  let statistics;
  for (let index2 = 0; index2 < clubObjects.length; index2++) {
    if (clubObjects[index2].name == team) {
      statistics = [Number(clubObjects[index2].shots_on_target) / Number(clubObjects[index2].gameno),
        Number(clubObjects[index2].shots_off_target) / Number(clubObjects[index2].gameno),
        Number(clubObjects[index2].possession) / Number(clubObjects[index2].gameno) / 10,
        Number(clubObjects[index2].corners) / Number(clubObjects[index2].gameno),
        Number(clubObjects[index2].offsides) / Number(clubObjects[index2].gameno),
        Number(clubObjects[index2].fouls) / Number(clubObjects[index2].gameno),
      ];
      break;
    }
  }
  return statistics;
}

var ctxB = document.getElementById("barChart").getContext('2d');
var myBarChart = new Chart(ctxB, {
  type: 'bar',
  data: {
    labels: ["Shots on targer", "Shots off target", "Possesion / 10", "Corners", "Offsides", "Fouls"],
    datasets: [{
      label: 'Average Game Statistics: ' + myObject,
      data: statisticsData(myObject),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

//line chart which shows the rank of the club during the season
let rankingData = function (team) {
  result = [];
  for (let index = 0; index < weeklyStanding.length; index++) {
    for (let index2 = 0; index2 < weeklyStanding[index].length; index2++) {
      if (team == weeklyStanding[index][index2]) {
        result[index] = index2 + 1;
      }
    }
  }
  return result;
}
let dddd = rankingData(myObject);
let eeee = [];
for (let index = 0; index < dddd.length; index++) {
  eeee = eeee.concat('W' + (index + 1))
}
var ctxL = document.getElementById("lineChart").getContext('2d');
var myLineChart = new Chart(ctxL, {
  type: 'line',
  data: {
    labels: eeee,
    datasets: [{
      label: "Weekly Standing",
      data: dddd,
      backgroundColor: [
        'rgba(0, 0, 0, 0)',
      ],
      borderColor: [
        'rgba(200, 99, 132, .7)',
      ],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 1,
          max: 20,
          stepSize: 1,
          reverse: true,
        }
      }]
    }
  }
});