var timer = 256
var tickRate = 16
var visualRate = 256
var resources = {
  "gold": 0,
  "pickaxe": 1
}
var costs = {
  "pickaxe": 15,
  "miner": 200,
  "miner_pickaxe": 15
}
var growthRate = {
  "pickaxe": 1.25,
  "miner": 1.25,
  "miner_pickaxe": 1.75
}

var increments = [{
  "input": ["miner", "miner_pickaxe"],
  "output": "gold"
}]

var unlocks = {
  "pickaxe": {
    "gold": 10
  },
  "hide": {
    "gold": 5 //placeholder for tracking warden arriving 
  },
  "miner": {
    "gold": 100
  },
  "miner_pickaxe": {
    "miner": 1
  }
}

function mineGold(num) {
  resources["gold"] += num * resources["pickaxe"]
  updateText()
};

function upgradeMinerPickaxe(num) {
  if (resources["gold"] >= costs["miner_pickaxe"] * num) {
    resources["miner_pickaxe"] += num
    resources["gold"] -= num * costs["miner_pickaxe"]

    costs["miner_pickaxe"] *= growthRate["miner_pickaxe"]

    updateText()
  }
};

function upgradePickaxe(num) {
  if (resources["gold"] >= costs["pickaxe"] * num) {
    resources["pickaxe"] += num
    resources["gold"] -= num * costs["pickaxe"]

    costs["pickaxe"] *= growthRate["pickaxe"]

    updateText()
  }
};

function hireMiner(num) {
  if (resources["gold"] >= costs["miner"] * num) {
    if (!resources["miner"]) {
      resources["miner"] = 0
    }
    if (!resources["miner_pickaxe"]) {
      resources["miner_pickaxe"] = 1
    }
    resources["miner"] += num
    resources["gold"] -= num * costs["miner"]

    costs["miner"] *= growthRate["miner"]

    updateText()


  }
};



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
  if (resources["gold"] > 20) { // Test code to learn how I can remove the HIDE prompt without clicking
    for (var element of document.getElementsByClassName("show_" + "hide")) {
      element.style.display = "none"
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
};


window.setInterval(function() {
  timer += tickRate


  for (var increment of increments) {
    total = 1
    for (var input of increment["input"]) {
      total *= resources[input]

    }
    if (total) {
      console.log(total)
      resources[increment["output"]] += total / tickRate
    }
  }

  if (timer > visualRate) {
    timer -= visualRate
    updateText()
  }


}, tickRate);
