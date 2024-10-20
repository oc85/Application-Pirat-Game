class State {
    constructor() {        
        this.speed = "none";
        this.skills = "none";
        this.firstaid = "none";
        this.food = "none";
        this.age = "none";
        this.name = "none";
        this.money = "none";
        this.health = "none";
        this.skills = "none";
        this.health1 = 100;
        this.health2 = 100;
        this.health3 = 100;
        this.day_id=0;
    }

    update(name,value) {
        this[name] = value
        try {
            document.getElementById(name).innerHTML = value    
        } catch (error) {
            console.error(error);
        }
    }

    create_fields() {
        
    }
}

function add_computer_message(input_text) {
    const obj = document.getElementById("Chat");
    const chat_box = document.createElement("p");
    chat_box.innerHTML = input_text;
    obj.append(chat_box);

    // Add horizontal line for visual separation
    // obj.append(document.createElement("hr"));

    // Scroll to the bottom of the chat container
    obj.scrollTop = obj.scrollHeight;

}

function add_player_message(input_text) {
    obj = document.getElementById("Chat")
    chat_box = document.createElement("p")
    chat_box.classList.add("user_text")
    chat_box.innerHTML = input_text
    obj.append(chat_box)
}

function update_image(image_id,path_to_image) {
    //use the iamge id to get the <img> object
    temp = document.getElementById(image_id)
    //set the src="path_to image" on the object
    temp.src = path_to_image

    // Scroll to the bottom of the chat container
    obj.scrollTop = obj.scrollHeight;
}


// -------chat options communication --------------------------------------------------------//

let askingForAge = false;
let choosingSkills = false;
let shoppingFood = false;
let shoppingFirstAid = false;
let foodAmount = 0;
let makingShopping=false
let costFood=30
let costFarmacy=50

function submitUserInput() {
    const userInput = document.getElementById("user_input").value;
    add_player_message(userInput);

    // Clear the text editor after submitting
    document.getElementById("user_input").value = "";

    if (game_state.name === "none") {
        handleNameInput(userInput);
    } else if (askingForAge) {
        handleAgeInput(userInput);// Handle age input
    } else if (choosingSkills) {
        handleSkillsSelection(userInput);// Handle skills selection
    } else if (makingShopping) {
        handleMakingShopping(userInput); // Call handleMakingShopping when in shopping state
    }
}

function handleNameInput(userInput) {
    game_state.name = userInput;
    game_state.update("name", userInput);

    const greetingMessage = `Nice to meet you, ${userInput}!`;
    add_computer_message(greetingMessage);

    askingForAge = true;
    add_computer_message("How old are you?");
}

function handleAgeInput(userInput) {
    if (isNaN(userInput)) {
        add_computer_message("Please enter a valid age (a number). Try again.");
        document.getElementById("user_input").value = ""; // Clear the input editor
        return;
    }

    game_state.age = userInput;
    game_state.update("age", userInput);

    add_computer_message(`Thank you for providing your age, ${game_state.name}!`);
    askingForAge = false;

    add_computer_message("Choose which skills you will have:");
    add_skill_button("speed", "Speed");
    add_skill_button("luck", "Luck");
    add_skill_button("kindness", "Kindness");
    choosingSkills = true;
}

function handleSkillsSelection(userInput) {
    const skillSelections = {
        speed: { speed: 100, food: 40, money: 10000, health: 50, skills: "speed" },
        luck: { speed: 60, food: 100, money: 20000, health: 100, skills: "luck" },
        kindness: { speed: 60, food: 200, money: 5000, health: 50, skills: "kindness" }
    };

    const selectedSkill = userInput.toLowerCase();
    if (skillSelections[selectedSkill]) {
        const selectedSkillValues = skillSelections[selectedSkill];
        Object.keys(selectedSkillValues).forEach(key => {
            game_state[key] = selectedSkillValues[key];
            game_state.update(key, selectedSkillValues[key]);
        });

        add_computer_message(`You have chosen ${userInput}. Skills updated.`);
        add_computer_message(`Congratulations ${game_state.name}, here is your team!`);

        displayPeopleInformation();
        choosingSkills = false;
    }
    makingShopping=true;
    add_computer_message("Let's do some shopping:");
    add_shopping_button("food", "Supermarket", 30);
    add_shopping_button("firstaid", "Farmacy",50);
    add_startjourney_button();
}

function handleMakingShopping(userInput) {
    if (userInput.toLowerCase() === "supermarket") {
        add_computer_message("You have chosen Supermarket. Let's go shopping!");
        addShoppingButton("food", "Supermarket", 30);
    } else if (userInput.toLowerCase() === "farmacy") {
        add_computer_message("You have chosen Farmacy. Let's go shopping!");
        addShoppingButton("first_aid", "Farmacy", 50);
    }
}



function displayPeopleInformation() {
    const peopleData = [
        { image: "images/Profile2.png", age: 25, name: "Mia", health: game_state.health1, text: "Hi, nice to meet you!" },
        { image: "images/Profile3.png", age: 30, name: "Shark", health: game_state.health2, text: "Let's do it" },
        { image: "images/Profile4.png", age: 35, name: "Good Luck", health: game_state.health3, text: "Dont worry, I am lucky :)" }
    ];

    add_computer_message("People: Mia, Shark and Good Luck");
    const peopleField = document.getElementById("People");
    peopleData.forEach(person => {
        const personDiv = document.createElement("div");
        personDiv.style.textAlign = "center";

        const personImage = document.createElement("img");
        personImage.src = person.image;
        personImage.style.width = "100px";
        personImage.style.height = "100px";
        personDiv.appendChild(personImage);

        const ageDiv = document.createElement("div");
        ageDiv.innerHTML = `Age: ${person.age}`;
        ageDiv.style.fontWeight = "bold";
        personDiv.appendChild(ageDiv);

        const nameDiv = document.createElement("div");
        nameDiv.innerHTML = `Name: ${person.name}`;
        nameDiv.style.fontWeight = "bold";
        personDiv.appendChild(nameDiv);

        const healthDiv = document.createElement("div");
        healthDiv.innerHTML = `Health: ${person.health}`;
        healthDiv.style.fontWeight = "bold";
        personDiv.appendChild(healthDiv);

        const textDiv = document.createElement("div");
        textDiv.innerHTML = person.text;
        personDiv.appendChild(textDiv);

        peopleField.appendChild(personDiv);
    });
}

function add_skill_button(skill, label) {
    const button = document.createElement("button");
    button.innerHTML = label;
    button.className = "button-chat"; // Adding custom CSS class
    button.onclick = function() {
        document.getElementById("user_input").value = skill;
        submitUserInput();
        button.disabled = true; // Disable the button after it is clicked
    };

    document.getElementById("Chat").append(button);

}



function add_shopping_button(type, label, costPerUnit) {
    const button = document.createElement("button");
    button.innerHTML = label;
    button.className = "button-chat";
    button.onclick = function() {
        add_computer_message(`How many units of ${label} would you like to buy?`);
        setTimeout(() => {
            const units = prompt(`Enter the number of units you want to buy at ${label}. Each unit costs ${costPerUnit} coins.`, "0");
            if (units !== null) {
                add_computer_message(`You have selected ${units} units.`);
                total_money=game_state.money-(costPerUnit*units)
                game_state.update("money", total_money);
                if (type=="food"){
                total_product=game_state.food+parseInt(units);
                }
                else {total_product=game_state.firstaid+parseInt(units);
                }
                game_state.update(type, total_product);
            }
        }, 100); // Delay the prompt to ensure the message is displayed first
    };
    document.getElementById("Chat").append(button);
}

function add_startjourney_button() {
    const button = document.createElement("button");
    button.innerHTML = "Start Journey";
    button.className = "button-chat";
    button.onclick = function() {
        add_computer_message(`Great! Let's start the journey!`);
        game_state.update("day_id", 1);
        document.getElementById("map_image").src = "images/map_2.png";
        add_supplies_buttons();
        makingShopping=false;
    };
    document.getElementById("Chat").append(button);
}

function add_supplies_buttons() {
    const suppliesDiv = document.getElementById("Supplies");
    suppliesDiv.style.display = "flex";
    suppliesDiv.style.flexDirection = "column";

    const discoverButton = document.createElement("button");
    discoverButton.innerHTML = "Discover Area";
    discoverButton.className = "button-chat";
    discoverButton.onclick = function() {
        // Add functionality for discovering area
    };
    suppliesDiv.appendChild(discoverButton);

    const speakButton = document.createElement("button");
    speakButton.innerHTML = "Speak with People";
    speakButton.className = "button-chat";
    speakButton.onclick = function() {
        // Add functionality for speaking with people
    };
    suppliesDiv.appendChild(speakButton);

    const continueButton = document.createElement("button");
    continueButton.innerHTML = "Continue Journey";
    continueButton.className = "button-chat";
    continueButton.onclick = function() {
        // Add functionality for continuing the journey
    };
    suppliesDiv.appendChild(continueButton);
}

// ---------------------------------------------------------------------//

let game_state = new State()  

for (const [key, value] of Object.entries(game_state)) {
    game_state.update(key,value);
}
  
