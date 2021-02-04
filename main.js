var timer = 256
var tickRate = 16
var visualRate = 256
var resources = {
  "money": 0,
	"determination" : 0,
  "shovel": 1
}
var costs = {
  "shovel": 15,
  "prisonmate": 200,
  "prisonmate_shovel": 15
}
var growthRate = {
  "shovel": 1.25,
  "prisonmate": 1.25,
  "prisonmate_shovel": 1.75
}

var increments = [{
  "input": ["prisonmate", "prisonmate_shovel"],
  "output": "money"
}]

var unlocks = {
  "shovel": {
    "money": 10
  },
  "prisonmate": {
    "money": 100
  },
  "prisonmate_shovel": {
    "prisonmate": 1
  }
}

function dig(num) {
  resources.money += num * resources.shovel
	//randomize warden appearance while slowly decrementing determination.
	// too long before click then ose money
	wardenAppearance()
  updateText()
}


function upgradePrisonmateShovel(num) {
  if (resources.money >= costs.prisonmate_shovel * num) {
    resources.prisonmate_shovel += num
    resources.money -= num * costs.prisonmate_shovel

    costs.prisonmate_shovel *= growthRate.prisonmate_shovel

    updateText()
  }
}

function upgradeShovel(num) {
  if (resources.money >= costs.shovel * num) {
    resources.shovel += num
    resources.money -= num * costs.shovel

    costs.shovel *= growthRate.shovel

    updateText()
  }
}

function hirePrisonmate(num) {
  if (resources.money >= costs.prisonmate * num) {
    if (!resources.prisonmate) {
      resources.prisonmate = 0
    }
    if (!resources.prisonmate_shovel) {
      resources.prisonmate_shovel = 1
    }
    resources.prisonmate += num
    resources.money -= num * costs.prisonmate

    costs.prisonmate *= growthRate.prisonmate

    updateText()


  }
}

function wardenAppearance(){
	document.getElementById("hideTools").style.visibility = "visible"
	document.getElementById("hideTools").innerHTML = '<button onClick = "hide()">Hide Tools!</button>'

}
function hide(){
	document.getElementById("hideTools").style.visibility = "hidden"
}

function updateText() {
  for (var key in unlocks) {
    var unlocked = true
    for (var criterion in unlocks[key]) {
      unlocked = unlocked && resources[criterion] >= unlocks[key][criterion]
    }
    if (unlocked) {
      for (var element of document.getElementsByClassName("show_" + key)) {
        element.style.display = "block"
      }
    }
  }

  for (var key in resources) {
    for (var element of document.getElementsByClassName(key)) {
      element.innerHTML = resources[key].toFixed(2)
    }
  }
  for (var key in costs) {
    for (var element of document.getElementsByClassName(key + "_cost")) {
      element.innerHTML = costs[key].toFixed(2)
    }
  }
}


window.setInterval(function() {
  timer += tickRate


  for (var increment of increments) {
    total = 1
    for (var input of increment.input) {
      total *= resources[input]

    }
    if (total) {
      console.log(total)
      resources[increment.output] += total / tickRate
    }
  }

  if (timer > visualRate) {
    timer -= visualRate
    updateText()
  }


}, tickRate);
