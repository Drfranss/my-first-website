// script.js - Space Mission Signup
// Handles form validation, localStorage, and the roster table

// ================================
// FORM PAGE (index.html)
// ================================

// Check if the signup form exists on the page
if (document.getElementById("signupForm")) {

  document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // stop the page from refreshing

    // --- Grab form values ---
    var name        = document.getElementById("name").value.trim();
    var email       = document.getElementById("email").value.trim();
    var role        = document.getElementById("role").value;
    var destination = document.getElementById("destination").value;
    var snack       = document.getElementById("snack").value.trim();
    var motto       = document.getElementById("motto").value.trim();

    // Check which radio button is selected
    var expRadios  = document.querySelectorAll("input[name='experience']");
    var experience = "";
    for (var i = 0; i < expRadios.length; i++) {
      if (expRadios[i].checked) {
        experience = expRadios[i].value;
      }
    }

    // --- Clear previous error messages ---
    document.getElementById("nameError").textContent  = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("roleError").textContent  = "";
    document.getElementById("destError").textContent  = "";
    document.getElementById("expError").textContent   = "";

    // --- Validate each field ---
    var isValid = true;

    if (name === "") {
      document.getElementById("nameError").textContent = "Please enter your full name.";
      isValid = false;
    }

    if (email === "") {
      document.getElementById("emailError").textContent = "Please enter your email address.";
      isValid = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      document.getElementById("emailError").textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (role === "") {
      document.getElementById("roleError").textContent = "Please select a role.";
      isValid = false;
    }

    if (destination === "") {
      document.getElementById("destError").textContent = "Please select a destination.";
      isValid = false;
    }

    if (experience === "") {
      document.getElementById("expError").textContent = "Please select your experience level.";
      isValid = false;
    }

    // If anything failed validation, stop here
    if (!isValid) {
      return;
    }

    // --- Build the crew member object ---
    var newMember = {
      name:        name,
      email:       email,
      role:        role,
      destination: destination,
      experience:  experience,
      snack:       snack || "None",
      motto:       motto
    };

    // --- Save to localStorage ---
    // localStorage can only store text, so we convert the array to a string first
    var crewList = JSON.parse(localStorage.getItem("crew")) || [];
    crewList.push(newMember);
    localStorage.setItem("crew", JSON.stringify(crewList));

    // --- Show success message and redirect ---
    document.getElementById("successMsg").textContent = "You have been registered! Redirecting to roster...";

    setTimeout(function() {
      window.location.href = "roster.html";
    }, 1500);

  });

}


// ================================
// ROSTER PAGE (roster.html)
// ================================

// Check if the roster table exists on the page
if (document.getElementById("rosterTable")) {

  // Load crew from localStorage when the page loads
  loadAndDisplayCrew();

  // Clear all data button
  document.getElementById("clearBtn").addEventListener("click", function() {
    var confirmed = confirm("Are you sure you want to delete all crew members?");
    if (confirmed) {
      localStorage.removeItem("crew");
      loadAndDisplayCrew();
    }
  });

}


// --- loadAndDisplayCrew ---
// Reads crew from localStorage and builds the table rows
function loadAndDisplayCrew() {
  var crewList = JSON.parse(localStorage.getItem("crew")) || [];

  // Clear existing rows first
  var tbody = document.getElementById("rosterBody");
  tbody.innerHTML = "";

  // Loop through each crew member and create a table row
  for (var i = 0; i < crewList.length; i++) {
    var m = crewList[i];

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" + m.name + "</td>" +
      "<td>" + m.role + "</td>" +
      "<td>" + m.destination + "</td>" +
      "<td>" + m.experience + "</td>" +
      "<td>" + m.email + "</td>" +
      "<td>" + m.snack + "</td>" +
      "<td>" +
        "<button class='btn-highlight' onclick='highlightRow(this)'>Highlight</button> " +
        "<button class='btn-delete' onclick='deleteMember(" + i + ")'>Delete</button>" +
      "</td>";

    tbody.appendChild(row);
  }

  // Update the footer with total crew count
  var footer = document.getElementById("footerText");
  if (crewList.length === 0) {
    footer.textContent = "No crew members registered yet.";
  } else {
    footer.textContent = "Total crew members registered: " + crewList.length;
  }
}


// --- deleteMember ---
// Removes one crew member by index and refreshes the table
function deleteMember(index) {
  var confirmed = confirm("Remove this crew member from the roster?");
  if (!confirmed) {
    return;
  }

  var crewList = JSON.parse(localStorage.getItem("crew")) || [];
  crewList.splice(index, 1); // remove 1 item at the given index
  localStorage.setItem("crew", JSON.stringify(crewList));

  loadAndDisplayCrew(); // re-render the table
}


// --- highlightRow ---
// Toggles a highlight class on the clicked row
function highlightRow(button) {
  // The button is inside a <td> inside a <tr>, so we go up two levels
  var row = button.parentElement.parentElement;
  row.classList.toggle("highlighted");
}
