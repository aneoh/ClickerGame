var timer = 256
var tickRate = 16
var tickRate2 = 128
var visualRate = 256
var warden = false
var lossCounter = 2

const progressBarFull = document.getElementById('progressBarFull');

var startTime, endTime;

var detGrowth = .02
var detDecrease = .001

var digTools = ["",
  "Hands",
  "Kitchen Knife",
  "Metal Cup",
  "Digging Claws",
  "Hammer",
  "Crow Bar",
  "Trowel",
  "Digging Bar",
  "Entrenching Tool",
  "Grub Hoe",
  "Shovel",
  "Spade",
  "Auger",
  "mattock",
  "pickaxe (Max)"
]

var resources = {
  "money": 0,
	"determination" : 1,
  "tool": 1,
  "prisonmate": 0
}
var costs = {
  "tool": 20,
  "prisonmate": 150,
  "prisonmate_tool": 25
}
var growthRate = {
  "tool": 5.25,
  "prisonmate": 2.25,
  "prisonmate_tool": 5.75
}

var increments = [{
  "input": ["prisonmate", "prisonmate_tool"],
  "output": "money"
}]

var unlocks = {
  "tool": {
    "money": 10
  },
  "prisonmate": {
    "money": 100
  },
  "prisonmate_tool": {
    "prisonmate": 1
  }
}

function dig(num) {
  resources.money += num * resources.tool
  if(!warden){
    resources.determination += detGrowth
  }

  var y = Math.floor((Math.random() * 1000) + 1)
  if(y == 5){
    alert("You got caught by a security guard but bribe your way through with 50% of your pesos")
    resources.money -= .50 * resources.money
  }

  var z = Math.floor((Math.random() * 1000) + 1)

  if(z == 5 && resources.tool < 15){
    var c = window.confirm("A prisonmate left a " + digTools[resources.tool + 1] + " laying around. Do you want to steal it?")
    var a = Math.floor((Math.random() * 2) + 1)
    if(c && a == 1){
      alert("You steal the tool and head back to your cell.")
      resources.tool += 1
    }else if(c && a == 2){
      alert("You get caught by the prisonmate and he happens to be in the cartel. They beat you up,take all your pesos, and call you mean names.")
      resources.money = 0
    }else{
      alert("You head back to your cell.")
    }
  }

  updateText()
}

function upgradeTool(num) {
  if (resources.money >= costs.tool * num) {
    resources.tool += num
    resources.money -= num * costs.tool

    costs.tool *= growthRate.tool
    updateToolText(num)
    updateText()
  }

  detGrowth += 0.01
}

function upgradePrisonmateTool(num) {
  if (resources.money >= costs.prisonmate_tool * num) {
    resources.prisonmate_tool += num
    resources.money -= num * costs.prisonmate_tool

    costs.prisonmate_tool *= growthRate.prisonmate_tool
    detGrowth += 0.01

    updateText()
  }
}


function hirePrisonmate(num) {
  if (resources.money >= costs.prisonmate * num) {
    if (!resources.prisonmate_tool) {
      resources.prisonmate_tool = 1
    }
    resources.prisonmate += num
    resources.money -= num * costs.prisonmate
    detGrowth += resources.prisonmate/100
    costs.prisonmate *= growthRate.prisonmate
    detGrowth += 0.01

    updateText()
  }
}

function wardenAppearance(){
  startTime = Date.now()
	document.getElementById("hideTools").style.display = "block"
	warden = true
	document.getElementById("hideTools").innerHTML = '<button onClick = "hide()">Protect Prisonmate!</button>'
}

function hide(){
  endTime = Date.now()
	document.getElementById("hideTools").style.display = "none"
	warden = false

  var elapsed_time = endTime - startTime
  if (elapsed_time > 5000){
    lossCounter++
    if(lossCounter == 2){
      alert("You were dumb enough to get caught twice and have been transfered to a maximum security prison. Game Over")
      window.location = self.location;
    }

    resources.determination -= resources.determination * .10
    detGrowth = 0.02
    if(resources.tool > 1){
      resources.tool = 1
    }
    if(resources.prisonmate > 0){
      resources.prisonmate = 0
    }
    if(resources.prisonmate_tool > 1){
      resources.prisonmate_tool = 1
    }

  }
}


 function showcanvas(){
  document.getElementById("GameCanvas").style.display = "block"
  document.getElementById("SplashScreen").style.display = "none"

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
        if(key == "tool")
        {
          var current_tool = resources[key]
          if(current_tool <= 15){
            element.innerHTML = digTools[current_tool]
          }
        }else if(key == "prisonmate_tool"){
          var current_tool = resources[key]
          if(current_tool <= 15){
            element.innerHTML = digTools[current_tool]
          }
        }else{
          element.innerHTML = resources[key].toFixed(2)
        }
      }
    }
    for (var key in costs) {
      for (var element of document.getElementsByClassName(key + "_cost")) {
        element.innerHTML = costs[key].toFixed(2)
      }
    }
  
    var x = Math.floor((Math.random() * 100) + 1)
    if(x == 5 && !warden && resources.money > 0){
      wardenAppearance()
      // If statement to see if a certain amount of time has passed.
    }

    document.getElementById('progressBarFull').style.width = `${(resources.determination / 100 ) * 100}%`;
  
  
    if(resources.determination <= 0){
      alert("You have been transfered to maximum security prison. Game Over")
      window.location = self.location;
    }
    if(resources.determination >= 100){
      alert("You have broken out of prison. Congratulations on freedom")
      window.location = self.location;
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
      resources[increment.output] += total / tickRate2
    }
  }

  //determination rates
	if(warden){
		resources.determination -= detDecrease
	}



  if (timer > visualRate) {
    timer -= visualRate
    updateText()
  }

}, tickRate);
