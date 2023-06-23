var your_name = document.currentScript.getAttribute('data-user-name');


console.log("user_name from flask to js", your_name)

 function toggleSelected(cell) {
  cell.classList.toggle("selected");
  checkWin();
}

    // Function to check if a player has won
function checkWin() {
  var selectedCount = document.getElementsByClassName("selected").length;
  if (selectedCount >= 5) {
    var cells = document.getElementsByTagName("td");
    var rows = 5;
    var cols = 5;
    var matrix = [];

    // Creating a matrix to represent the selected cells
    for (var i = 0; i < rows; i++) {
      matrix[i] = [];
      for (var j = 0; j < cols; j++) {
        matrix[i][j] = cells[i * cols + j].classList.contains("selected") ? 1 : 0;
      }
    }

    // Checking for a win
    var points = -1;
    // Check horizontal lines
    for (var i = 0; i < rows; i++) {
      if (matrix[i].every(cell => cell === 1)) {
        points++;
      }
    }

    // Check vertical lines
    for (var j = 0; j < cols; j++) {
      var column = [];
      for (var i = 0; i < rows; i++) {
        column.push(matrix[i][j]);
      }
      if (column.every(cell => cell === 1)) {
        points++;

      }
    }

    // Check diagonal lines
    var diagonal1 = [];
    var diagonal2 = [];
    for (var i = 0; i < rows; i++) {
      diagonal1.push(matrix[i][i]);
      diagonal2.push(matrix[i][cols - 1 - i]);
    }
    if (diagonal1.every(cell => cell === 1)) {
      points++;
    }
    if (diagonal2.every(cell => cell === 1)) {
      points++;
    }
        console.log("checkpoint,,,,,,",points);  
       highlightLetter(points)
    if (points >= 4) {
      userResponse(points);

      // alert("Bingo! You've won!");
      fireSweetAlert();
    }
  }
}

function highlightLetter(index) {
  var letters = document.getElementsByClassName("letter");

  // Remove the "highlight" class from all letters
  for (var i = 0; i < letters.length; i++) {
    letters[i].classList.remove("highlight");
  }

  // Highlight the letters up to the given index
  if (index >= 0 && index < letters.length) {
    for (var i = 0; i <= index; i++) {
      letters[i].classList.add("highlight");
    }
  }
}



// Function to generate random numbers
function generateNumbers() {
  var numbers = [];
  while (numbers.length < 25) {
    var randomNumber = Math.floor(Math.random() * 25) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
}

// Function to populate the table with random numbers
function populateTable() {
  var numbers = generateNumbers();
  var cells = document.getElementsByTagName("td");
  for (var i = 0; i < cells.length; i++) {
    cells[i].textContent = numbers[i];
  }
}


function fireSweetAlert() {
    Swal.fire(
        'Congratulations...',
        'You have won the BINGO😎',
        'success'
    )
}





// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}




// server code //

function userResponse(points) {
  if (points === 4) {
      appendMessage("Game Bot 🤖", BOT_IMG, "left", "You have Won The GAME...");
      sendMessage(your_name+" won the game,","Bot");

    }
  else {
  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const msgText = data.message;
    const port = event.target.url.split(':')[2];
    // (data.name !== PERSON_NAME && points === 4)

    // woner_name = msgText
    var modifiedText = msgText.replace(your_name, "");

    if (data.name !== PERSON_NAME && modifiedText !== " won the game,") {
      const delay = msgText.split(" ").length * 100;
      setTimeout(() => {
        appendMessage(data.name, BOT_IMG, "left", msgText);
      }, delay);
    }
    }
  };
}

// Send a message to the server
function sendMessage(message,name) {
  // const message = document.getElementById('message').value;
  // name = personFromFlask
  if (message.trim() !== '') {
    const data = {
      name: name,
      message: message
    };
    socket.send(JSON.stringify(data));
  }
}
