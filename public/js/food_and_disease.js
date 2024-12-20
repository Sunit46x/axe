document.querySelector(".check_interaction").addEventListener("click", function () {
    const drugNames = [];
    const drugItems = document.querySelectorAll(".drug-item");

    // Extract drug names from the buttons
    drugItems.forEach(item => {
        const buttonText = item.querySelector(".drug-button").innerText.replace(" -", "").trim();
        drugNames.push(buttonText);
    });

    // Check if we have two drugs
    if (drugNames.length === 2) {
        // Send the drug names to the server
        fetch("/drug-drug", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_drug_input1: drugNames[0], user_drug_input2: drugNames[1] }), // Send as separate fields
        })
        .then(response => response.text())
        .then(data => {
            console.log("Server response:", data); // Log the server response
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("Please add exactly 2 drugs.");
    }
});

// Function to add a drug
function addDrug() {
    const drugName = document.querySelector(".input-field").value;

    if (drugName) {
        const newDrugDiv = document.createElement("div");
        newDrugDiv.className = "drug-item";

        const newButton = document.createElement("button");
        newButton.className = "drug-button";  
        newButton.innerText = drugName + " "; 

        const removeIcon = document.createElement("span");
        removeIcon.className = "remove-icon";
        removeIcon.innerText = "-"; 
        
        removeIcon.addEventListener("click", function(event) {
            event.stopPropagation(); 
            newDrugDiv.remove();  
        });

        newButton.appendChild(removeIcon);
        newDrugDiv.appendChild(newButton);
        document.querySelector(".drug-list-container").appendChild(newDrugDiv);

        // Clear the input field
        document.querySelector(".input-field").value = "";
    } else {
        alert("Please enter a drug name.");
    }
}

// Add functionality for Enter keypress
document.querySelector(".input-field").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addDrug();
    }
});

// Clear all the options 
document.querySelector(".clear_interaction").addEventListener("click", function () {
    const list = document.querySelector(".drug-list-container");
    list.innerHTML = "";
    document.querySelector(".input-field").value = "";
});
