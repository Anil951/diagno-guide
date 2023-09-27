var buttons = document.getElementsByName("sym");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    if (this.classList.contains("selected")) {
      this.classList.remove("selected");
    } else {
      this.classList.add("selected");
    }
  });
}

const checkbox = document.getElementById("t-c");
const submitButton = document.getElementById("t-c-submit");
const head = document.getElementById("head");

checkbox.addEventListener("change", function () {
  submitButton.disabled = !this.checked;
});

var forms = document.getElementsByClassName("formContainer");
var headings = document.getElementsByTagName("h2");
var currentFormIndex = -1;

function showForm(index) {
  for (var i = 0; i < forms.length; i++) {
    forms[i].classList.remove("active");
    headings[i].classList.remove("underline");
    headings[i].classList.remove("color");
  }
  console.log(currentFormIndex);
  forms[index].classList.add("active");
  headings[index].classList.add("underline");
  headings[index].classList.add("color");
}

function nextForm() {
  if (currentFormIndex < forms.length - 1) {
    currentFormIndex++;
    showForm(currentFormIndex);
  }


  if (currentFormIndex == 0) {
    document.getElementById("backbtn").disabled = true;
    document.getElementById("heads").style.display = "flex";
    
  }
  if(currentFormIndex==1){
    // Get height and weight values from the form
var height = parseFloat((document.getElementById('height').value)/100); // in meters
var weight = parseFloat(document.getElementById('weight').value); // in kilograms
console.log(height,weight);

// Calculate BMI
var bmi = weight / (height * height);

// Determine if obesity is present
var isObese = bmi >= 30;

// Select the symptoms dropdown element
var symptomsDropdown = document.getElementById('dropdown-content');

// If obesity is present, select the "Obesity" option in the dropdown
if (isObese) {
      document.getElementById('obesity').selected = true;
}
else{
  document.getElementById('obesity').selected = false;
}


  }
  if (currentFormIndex == 3) {
    document.getElementById("t-c-submit").disabled = true;
  } else {
    document.getElementById("backbtn").disabled = false;
    document.getElementById("t-c-submit").disabled = false;
    document.getElementById("predict").style.display = "block";
    document.getElementById("medic").style.display = "block";
  }

  document.getElementById("form0Container").style.display = "none";
}

function prevForm() {
  if (currentFormIndex > 0) {
    currentFormIndex--;
    showForm(currentFormIndex);
    document.getElementById("form0Container").style.display = "none";
  }
  
  if (currentFormIndex == 0) {
    document.getElementById("backbtn").disabled = true;
    document.getElementById("heads").style.display = "flex";
  }
  if (currentFormIndex == 3) {
    document.getElementById("t-c-submit").disabled = true;
  } else {
    document.getElementById("backbtn").disabled = false;
    document.getElementById("t-c-submit").disabled = false;
    document.getElementById("predict").style.display = "block";
    document.getElementById("medic").style.display = "block";
  }

  document.getElementById("output").style.display = "none";
  document.getElementById("results").style.display = "none";
  document.getElementById("buttonContainer").style.display = "none";
  document.getElementById("medications-container").style.display = "none";
  $("#medications-container").empty();
}

var ageInput = document.getElementById("age");
var genderInputs = document.getElementsByName("gender");
var question3 = document.getElementById("alcohol");
var question3dup = document.getElementById("cigar");
var question4 = document.getElementById("pregyesno");
var preginputs = document.getElementsByName("pregyesno");
var question5 = document.getElementById("trisemister");

ageInput.addEventListener("input", updateQuestions);
for (var i = 0; i < genderInputs.length; i++) {
  genderInputs[i].addEventListener("input", updateQuestions);
}
ageInput.addEventListener("input", updateQuestions);
for (var i = 0; i < preginputs.length; i++) {
  preginputs[i].addEventListener("input", updateQuestions);
}

function updateQuestions() {
  var age = parseInt(ageInput.value);
  var gender = getSelectedValue(genderInputs);
  var preg = getSelectedValue(preginputs);

  if (age > 16) {
    question3.style.display = "block";
    question3dup.style.display = "block";
    if (gender === "female") {
      question4.style.display = "block";
      if (preg === "Yes") {
        question5.style.display = "block";
      } else {
        question5.style.display = "none";
      }
    } else {
      question4.style.display = "none";
      question5.style.display = "none";
    }
  } else {
    question3.style.display = "none";
    question3dup.style.display = "none";
    question4.style.display = "none";
    question5.style.display = "none";
    // preg.style.display = "none";
  }
}

function getSelectedValue(inputs) {
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      return inputs[i].value;
    }
  }
  return null;
}

// for multi-select dropdown
const dropdown = document.querySelector(".dropdown");
const dropdownSelect = dropdown.querySelector(".dropdown-select");
const dropdownContent = dropdown.querySelector(".dropdown-content");
const searchInput = dropdown.querySelector("#search-input");

dropdownSelect.addEventListener("click", function () {
  dropdownContent.style.display = "block";
});

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase();
  const buttons = dropdownContent.querySelectorAll("button");

  buttons.forEach(function (button) {
    const text = button.textContent.toLowerCase();
    if (text.includes(searchValue)) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });

  const selectedItems = dropdownSelect.querySelectorAll(".selected-item");
  selectedItems.forEach(function (selectedItem) {
    const selectedButton = dropdownContent.querySelector(
      `button[value="${selectedItem.textContent}"]`
    );
    if (selectedButton) {
      selectedButton.style.display = "none";
    }
  });
});






dropdownContent.addEventListener("click", function (event) {
  if (event.target.nodeName === "BUTTON") {
    const selectedItems = dropdownSelect.querySelectorAll(".selected-item");
    const button = event.target;

    if (!button.classList.contains("selected")) {
      // Add selected item
      const selectedItem = document.createElement("div");
      selectedItem.className = "selected-item";
      selectedItem.id = button.getAttribute("value");
      selectedItem.textContent = button.getAttribute("value");

      const removeButton = document.createElement("span");
      removeButton.className = "remove";
      removeButton.textContent = "✕";
      removeButton.addEventListener("click", function () {
        dropdownSelect.removeChild(selectedItem);
        button.classList.remove("selected");
      });

      selectedItem.appendChild(removeButton);
      dropdownSelect.appendChild(selectedItem);

      button.classList.add("selected");
    } else {
      // Remove selected item
      selectedItems.forEach(function (selectedItem) {
        if (selectedItem.textContent === button.getAttribute("value")) {
          dropdownSelect.removeChild(selectedItem);
          button.classList.remove("selected");
        }
      });
    }
  }
});

$(document).ready(function () {
  $("#myForm").submit(function (e) {
    document.getElementById("output").style.display = "block";
    document.getElementById("results").style.display = "block";

    e.preventDefault(); // Prevent form submission
    var name = $("#name").val();
    var age = $("#age").val();
    var weight = $("#weight").val();
    var height = $("#height").val();
    var gender = $("input[name=gender]:checked").val();
    var alcohol = $("input[name=alcohol]:checked").val();
    var cigar = $("input[name=cigar]:checked").val();
    var preg = $("input[name=pregyesno]:checked").val();
    console.log(preg);
    var trisemister = $("input[name=trisemister]:checked").val();

    // Send an AJAX request to the server
    $.ajax({
      url: "/update",
      type: "POST",
      data: {
        name: name,
        age: age,
        weight: weight,
        height: height,
        gender: gender,
        alcohol: alcohol,
        // cigar: cigar,
        // preg: preg,
        trisemister: trisemister,
      },
      // success: function(response) {
      //   $('#output').html(response); // Update the content of the element
      // }
      success: function (response) {
        console.log(
          response.name,
          response.age,
          response.weight,
          response.height,
          response.gender,
          response.alcohol,
          response.preg,
          response.trisemister
        );
        $("#output").empty(); // Clear the content of the element
        $("#output").append(" <b>User Details</b>:<br>________________<br>");
        $("#output").append(
          "<b>Name</b>: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + response.name + "<br>"
        );
        $("#output").append(
          "<b>Age</b>: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
            response.age +
            "yr<br>"
        );
        console.log(response.weight.length);
        if (response.weight.length == 0) {
          $("#output").append("<b>Weight</b>: &nbsp&nbsp&nbsp " + "-" + "<br>");
        } else {
          $("#output").append(
            "<b>Weight</b>: &nbsp&nbsp&nbsp " + response.weight + "kg<br>"
          );
        }

        if (response.height.length == 0) {
          $("#output").append(
            "<b>Height</b>: &nbsp&nbsp&nbsp&nbsp  " + "-" + "<br>"
          );
        } else {
          $("#output").append(
            "<b>Height</b>: &nbsp&nbsp&nbsp " + response.height + "cm<br>"
          );
        }

        $("#output").append(
          "<b>Gender</b>:&nbsp&nbsp&nbsp&nbsp " + response.gender + "<br>"
        );

        // console.log((response.alcohol).length);

        if (cigar === undefined) {
          $("#output").append(
            "<b>Cigar</b>: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + "No" + "<br>"
          );
        } else {
          $("#output").append(
            "<b>Cigar</b>: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + cigar + "<br>"
          );
        }

        if (response.age > 16) {
          if (response.alcohol.length == 5) {
            $("#output").append(
              "<b>Alcohol</b>:&nbsp&nbsp&nbsp&nbsp " + "Yes" + "<br>"
            );
          } else {
            $("#output").append(
              "<b>Alcohol</b>:&nbsp&nbsp&nbsp&nbsp " + "No" + "<br>"
            );
          }

          if (response.gender === "male") {
            $("#output").append(
              "<b>Pregnant</b>: &nbsp" + "not-applicable" + "<br>"
            );
            $("#output").append(
              "<b>trimister</b>: &nbsp" + "not-applicable" + "<br>" + "<br>"
            );
          } else {
            $("#output").append("<b>Pregnant</b>: &nbsp" + preg + "<br>");

            if (preg === "Yes") {
              var isSubset = ["A", "B", "C", "D"].every((item) =>
                response.trisemister.includes(item)
              );

              if (isSubset) {
                $("#output").append(
                  "<b>trimister</b>: &nbsp" + "1" + "<br>" + "<br>"
                );
              } else {
                $("#output").append(
                  "<b>trimister</b>: &nbsp" + "2/3" + "<br>" + "<br>"
                );
              }
            } else {
              $("#output").append(
                "<b>trimister</b>: &nbsp" + "not-applicable" + "<br>" + "<br>"
              );
            }
          }
        } else {
          $("#output").append(
            "<b>Alcohol</b>:&nbsp&nbsp&nbsp&nbsp " + "No" + "<br>"
          );
          $("#output").append(
            "<b>Cigar</b>: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + "No" + "<br>"
          );
          $("#output").append("<b>Pregnant</b>: &nbsp" + "No" + "<br>");
          $("#output").append(
            "<b>trimister</b>: &nbsp" + "not-applicable" + "<br>" + "<br>"
          );
        }
      },
    });
  });
});

function sendSymptoms() {
  // document.getElementById("predict").style.display = "none";
  
  var values = [];
  $(".dropdown-select > div").each(function () {
    var value = $(this)
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      })
      .text()
      .trim();
    values.push(value);
  });
  console.log(values);
  
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;

    var gender = document.querySelector('input[name="gender"]:checked');

    if (name != "") {
      if (age != "") {
        if (gender) {
          if (values.length > 2) {
            // Sending selected symptoms to the server
            $.ajax({
              url: "/send_data",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(values),
        
              success: function (response) {
                console.log("Data received from Flask");
                console.log(response);
                console.log(response.length);
                // Process the response data and display it on the page
                if (response.length > 0) {
                  document.getElementById("form4Container").display="block";

                  var resultsElement = document.getElementById("results");
                  resultsElement.innerHTML = ""; // Clear previous results
                  resultsElement.innerHTML =
                    "Based on the given symptoms: <b>" +
                    values.join(", ") +
                    "</b><br><br>";
                  for (var i = 0; i < response.length; i++) {
                    var disease = response[i].disease;
                    var probability = response[i].probability;
                    var precautions = response[i].precautions;
        
                    var resultElement = document.createElement("div");
        
                    var resultElementProbability = document.createElement("span");
                    resultElementProbability.innerHTML =
                      "Possibility of having '" + disease;
        
                    var resultElementButton = document.createElement("i");
                    resultElementButton.className = "fas fa-info-circle";
                    resultElementButton.id = disease;
        
                    var resultElementProbability1 = document.createElement("span");
                    if (probability >= 50) {
                      resultElementProbability1.innerHTML =
                        "':<span style='color:green;'><b>" +
                        probability +
                        "% </b></span> ";
                    } else {
                      resultElementProbability1.innerHTML =
                        "':<span style='color:red;'><b>" +
                        probability +
                        "%</b> <br><i>as probability is below THRESHOLD--we recommend you to consult <b>"+
                        response[i].doc_type+"</b></i> </span> ";
                    }
        
                    var nextitem = document.createElement("span");
                    nextitem.innerHTML = "_________________________________";
        
                    var precdiv = document.createElement("div");
                    precdiv.id = "precdiv";
                    // precdiv.style.border="2px solid black";
        
                    var resultElement1 = document.createElement("button");
                    resultElement1.textContent = "Get Precautions";
                    resultElement1.id = "getprec";
                    resultElement1.addEventListener(
                      "click",
                      createPrecautionsToggleHandler(resultElement1)
                    );
        
                    // var resultElement2 = document.createElement('button');
                    // resultElement2.textContent = 'Get Medication';
        
                    var resultElementPrec = document.createElement("span");
                    resultElementPrec.className = "precautions";
                    resultElementPrec.style.display = "none";
        
                    for (var j = 0; j < precautions.length; j++) {
                      var precautionItem = document.createElement("span");
                      precautionItem.textContent = precautions[j];
                      resultElementPrec.appendChild(precautionItem);
                      resultElementPrec.appendChild(document.createElement("br"));
                    }
        
                    var resultElementButtonClickListener = function (disease) {
                      return function () {
                        redirectToWikipedia(disease);
                      };
                    };
        
                    resultElementButton.addEventListener(
                      "click",
                      resultElementButtonClickListener(disease)
                    );
        
                    resultElement.appendChild(resultElementProbability);
                    resultElement.appendChild(resultElementButton);
                    resultElement.appendChild(resultElementProbability1);
        
                    // resultElement.appendChild(document.createElement('br'));
                    precdiv.appendChild(resultElement1);
                    // precdiv.appendChild(resultElement2);
                    precdiv.appendChild(resultElementPrec);
        
                    resultsElement.appendChild(resultElement);
                    resultsElement.appendChild(precdiv);
                    resultsElement.appendChild(nextitem);
                  }
                }
              },
              error: function (xhr, status, error) {
                console.error("Error in AJAX request:", status, error);
                var resultsElement = document.getElementById("results");
                resultsElement.innerHTML =
                  "Error occurred while processing the request.";
              },
            });
          } else {
            alert("select atleast 3 symptoms for better results");
            document.getElementById("form4Container").display="none";
            document.getElementById("form3Container").display="none";
            // showForm(1);
          }
        } else {
          alert("select gender");
          // showForm(0);
          
        }
      } else {
        alert("please fill the age field");
        // showForm(0);
        
      }
    } else {
      alert("please fill the name field");
      // showForm(0);
    }
  
  
}

function createPrecautionsToggleHandler(button) {
  return function () {
    var resultElementPrec = button.parentNode.querySelector(".precautions");
    if (resultElementPrec.style.display === "none") {
      resultElementPrec.style.display = "block";
      button.textContent = "Hide Precautions";
    } else {
      resultElementPrec.style.display = "none";
      button.textContent = "Get Precautions";
    }
  };
}

function redirectToWikipedia(disease) {
  var searchTerm = encodeURIComponent(disease);
  var url = "https://en.wikipedia.org/wiki/" + searchTerm;
  window.open(url, "_blank");
}

document.getElementById("loadingOverlay").style.display = "none";

function onButtonClick(disease, probability) {
  // Show the loading overlay
  document.getElementById("loadingOverlay").style.display = "flex";
  // Get the disease and probability values from the clicked button

  // Make the API call here
  $.ajax({
    url: "/medic", // Update this URL to match your API route
    type: "GET",
    success: function (response) {
      // Process the API response
      console.log(disease, probability);

      // For example, you can call a function to display more details about the disease
      displaymedic(disease, probability);
    }.bind(null, disease, probability),
    error: function (error) {
      console.log("Error:", error);
      // Hide the loading overlay in case of error
      document.getElementById("loadingOverlay").style.display = "none";
    },
  });
}

document.getElementById("medic").addEventListener("click", medic);

function medic() {
  document.getElementById("medic").style.display = "none";
  document.getElementById("loadingOverlay").style.display = "none";
  document.getElementById("buttonContainer").style.display = "block";

  $.ajax({
    url: "/medic",
    type: "GET",

    success: function (response) {
      var buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.innerHTML = "get medication for: &nbsp<br><br>";
      // Loop through the 'response' array

      for (var i = 0; i < response.length; i++) {
        var disease = response[i].disease;
        var probability = response[i].probability;
        // Create a new button element
        var buttonElement = document.createElement("button");
        buttonElement.className = "dis";
        buttonElement.style.marginRight = "5px";
        // buttonElement.classList.add("dis");

        // Set the value of the button to the disease name
        buttonElement.textContent = disease;
        buttonElement.value = disease;

        // Add an event listener to the button using an IIFE
        (function (d, p) {
          console.log("mediv funnnc", d, p);
          buttonElement.addEventListener("click", function () {
            // Handle button click event here
            // For example, you can call a function to display more details about the disease
            onButtonClick(d, p);
          });
        })(disease, probability);

        // Append the button to the container
        buttonContainer.appendChild(buttonElement);
      }



      var nextitem1 = document.createElement("span");
      nextitem1.innerHTML =
        "_________________________________________________________<br>";
      buttonContainer.appendChild(nextitem1);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function displaymedic(disease, probability) {
  document.getElementById("medications-container").style.display = "block";

  // Send an AJAX request to the server
  $.ajax({
    url: "/displaymedic",
    type: "POST",
    data: { disease: disease, probability: probability},
    success: function (response) {
      document.getElementById("loadingOverlay").style.display = "none";
      // Check if 'gotohospital' key exists in the response

      // Append the medication element to the medications container

      if ("gotohospital" in response) {
        if (response["gotohospital"] == "urgent") {
          $("#medications-container").empty();
          var medicationElement1 = document.createElement("div");
          medicationElement1.innerHTML =
            "AGE>>>>>>>......GO TO A DOCTOR -- <b>URGENT !!!!</b>";

          // Append the medication element to the medications container
          $("#medications-container").append(medicationElement1);
        } else {
          // If 'gotohospital' key is present, it means probability is below 50
          console.log(
            "medication will be given to symptoms, not the disease, as probability is less than the threshold"
          );
          $("#medications-container").empty();

          // Append the medication element to the medications container
          $("#medications-container").append(medicationElement1);

          // Create a number range asking "How long have you been experiencing symptoms? (in days)"
          var duration = prompt(
            "How long have you been experiencing symptoms? (in days)"
          );
          // Perform any action you want with the 'duration' value
          if (duration > 5) {
            $("#medications-container").empty();

            var medicationElement1 = document.createElement("div");
            medicationElement1.innerHTML =
              "Seek medical attention <b>immediately</b> --- experiencing symptoms for <b>" +
              duration +
              "</b> days. <br><br>Use the option to <b>LOCATE NEARBY HOSPITALS</b> for assistance.<br> Consider consulting a <b>"+response["doc_type"]+"</b> for Diagnosis and Clarification.";

            // Append the medication element to the medications container
            $("#medications-container").append(medicationElement1);
          } else {
            console.log("medication for choosen symptoms:");

            // Perform any action with the medication response data received from Flask
            console.log(response);
            // Clear previous medications container content
            var medicationsElement = document.getElementById(
              "medications-container"
            );
            medicationsElement.innerHTML =
              "Medications given to <b>SYMPTOMS</b> <br>(as possibility of having <b>  " +
              response["disease"] +
              " (" +
              response["probability"] +
              "%)</b> is less then Threshold) <br> Consider consulting a <b>"+response["doc_type"]+"</b> for a more accurate diagnosis and clarification." ; 

            // Loop through the medications in the response
            for (var disease in response.medications) {
              var medicationList = response.medications[disease];

              var medicationContainer = document.createElement("div");
              var diseaseElement = document.createElement("h3");
              diseaseElement.textContent = disease;
              medicationContainer.appendChild(diseaseElement);

              // Create an unordered list for the medications of the current disease
              var medicationListElement = document.createElement("ul");

              // Loop through the medications for the current disease
              for (var i = 0; i < medicationList.length; i++) {
                var medicationItem = document.createElement("li");
                medicationItem.textContent = medicationList[i];
                medicationListElement.appendChild(medicationItem);
              }

              medicationContainer.appendChild(medicationListElement);
              medicationsElement.appendChild(medicationContainer);
            }
          }
        }
      } else {
        // If 'gotohospital' key is not present, it means probability is above 50
        console.log("Recommend medicines based on dataset:");

        // Perform any action with the medication response data received from Flask
        console.log(response);
        var dis = response["disease"];
        var prob = response["probability"];
        // Here you can update the web page with the recommended medicines
        // Clear previous medications container content

        var medicationsElement = document.getElementById(
          "medications-container"
        );
        medicationsElement.innerHTML =
          "Medications for <b>" +
          response["disease"] +
          "</b> (" +
          response["probability"] +
          "%) based of patient Details</b> : <br> Consider consulting a <b>"+response["doc_type"]+"</b> for a more accurate diagnosis and clarification.<br><br>";
        // medicationsElement.appendChild(medicationContainer);

        // Display medications on the page
        var medications = response[dis];
        // const medications = response[response.disease];
        console.log("medic for prob >50", medications);

        if (medications && Array.isArray(medications)) {
          medications.forEach(function (medication) {
            var medicationElement = document.createElement("div");
            medicationElement.textContent = medication;
            // medicationsContainer.appendChild(medicationElement);

            medicationsElement.appendChild(medicationElement);
          });
        }
      }
    },

    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function stopBlinking() {
  var myDiv = document.getElementById("locate-hospital");
  myDiv.style.border = "2px solid #ff0000"; // Set the border back to red
  myDiv.classList.remove("blink-animation"); // Remove the animation class
  myDiv.style.cursor = "auto"; // Reset the cursor to default
}

const roundDiv = document.querySelector(".round-div");
const rectangleForm = document.querySelector(".rectangle-form");
const closeButton = document.querySelector(".close-button");

roundDiv.addEventListener("click", () => {
  rectangleForm.style.display = "block";
  document.getElementById("center").style.filter = "blur(4px)";
});

closeButton.addEventListener("click", () => {
  rectangleForm.style.display = "none";
  document.getElementById("center").style.filter = "blur(0px)";
});

const hospitalForm = document.getElementById("locate");

hospitalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  document.getElementById("map").style.display = "block";
  var data = {
    locationOption: $("input[name='locationOption']:checked").val(),
    locationInput: $("#locationInput").val(),
    hospitalRange: $("#hospitalRange").val(),
  };

  $.ajax({
    url: "/locate",
    type: "POST",
    data: data,
    success: function (response) {
      console.log(response);

      var nearestHospitalsElement = $("#ans");
      nearestHospitalsElement.empty(); // Clear previous content

      var hospitalElement = document.createElement("div");
      // hospitalElement.textContent = JSON.stringify(response);
      // Display the nearest hospitals on the page

      nearestHospitalsElement.append(hospitalElement);

      // Plot the hospitals on the map
      plotHospitals(response);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
});

function plotHospitals(hospitalsData) {
  console.log("in the map plot function");
  const startPoint = [hospitalsData.latitude, hospitalsData.longitude];
  const map = L.map("map").setView(startPoint, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Create a custom marker icon
  const customMarkerIcon = L.divIcon({
    className: "custom-marker-icon",
  });

  // Create the marker for the start point with the custom green icon and a popup
  L.marker(startPoint, { icon: customMarkerIcon, draggable: false })
    .bindTooltip("Your Location", { permanent: true, direction: "left" })
    .addTo(map);

  // Plot the hospitals
  for (let i = 0; i < hospitalsData.hospitalcount; i++) {
    const lat = hospitalsData["lat" + i];
    const lng = hospitalsData["long" + i];
    const hospitalName = hospitalsData["hospital" + i];
    const endPoint = [lat, lng];

    // Create the marker for the hospital with a custom popup for the hospital name
    const hospitalMarker = L.marker(endPoint, { draggable: false })
      .bindPopup(hospitalName) // Bind a custom popup to the hospital marker
      .addTo(map);

    // Add a click event listener to the hospital marker
    hospitalMarker.on("click", function () {
      // Remove the previously added routing control, if exists
      if (map.routingControl) {
        map.removeControl(map.routingControl);
      }

      // Calculate and display the route between start point and hospital
      map.routingControl = L.Routing.control({
        waypoints: [L.latLng(startPoint), L.latLng(endPoint)],
        routeWhileDragging: false, // Allow route calculation while dragging the markers
        createMarker: function (i, wp, nWps) {
          // Create a custom marker for the waypoints with hospital name as popup
          if (i === 0) {
            return L.marker(wp.latLng, { icon: customMarkerIcon }).bindPopup(
              "Your Location"
            );
          } else {
            return L.marker(wp.latLng, { icon: customMarkerIcon }).bindPopup(
              hospitalName
            );
          }
        },
      })
        .addTo(map)
        .on("routesfound", function (e) {
          // Get the calculated route
          const routes = e.routes;
          if (routes.length > 0) {
            const route = routes[0];
            const distance = route.summary.totalDistance; // Distance in meters
            console.log("Route Distance:", distance, "meters");
          }
        });
    });
  }
}

const floatingInputs = document.querySelectorAll(".floating-input");

function handleInputFocus(event) {
  const input = event.target;
  const label = input.previousElementSibling;

  label.style.top = "-12px";
  label.style.left = "10px";
  label.style.fontSize = "14px";
  label.style.color = "rgb(32, 162, 32)";
}

function handleInputBlur(event) {
  const input = event.target;
  const label = input.previousElementSibling;

  if (input.value === "") {
    label.style.top = "0px";
    label.style.left = "10px";
    label.style.fontSize = "14px";
    label.style.color = "#282727";
    // label.style.fontWeight = 'normal';
  }
}

function handleInputLoad(input) {
  const label = input.previousElementSibling;

  if (input.value !== "") {
    label.style.top = "-12px";
    label.style.left = "10px";
    label.style.fontSize = "14px";
    // label.style.fontWeight = 'normal';
  }
}

floatingInputs.forEach((input) => {
  input.addEventListener("focus", handleInputFocus);
  input.addEventListener("blur", handleInputBlur);
  handleInputLoad(input);
});
