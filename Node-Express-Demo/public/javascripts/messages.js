// Validator Konstruktor
function Validator(_class, logic) {
	this.class = _class;
	this.validate = logic;
}

// Validierungsfehler Konstruktor
function Error(element, errorMessage) {
	this.element = element;
	this.errorMessage = errorMessage;
}

// Validierungslogik
var messageValidator = new Validator("messageInput", function(element, errors) {
	var value = element.value;
	if (!/^\w+[\s\w+]*$/.test(value)) {
		errors.push(new Error(element,
				"Die Nachricht muss aus Wörtern bestehen!"));
	}
});

// Validierungsfunktion
var validate = function(event) {
	var validators = this.validators;
	var errors = [];
	for (var i = 0; i < validators.length; i++) {
		var validator = validators[i];
		var elements = this.getElementsByClassName(validator.class);
		for (var j = 0; j < elements.length; j++) {
			validators[i].validate(elements[j], errors);
		}
	}
	if (errors.length > 0) {
		var messages = errors.reduce(function(previousValue, currentValue) {
			return previousValue + currentValue.errorMessage;
		}, "");
		alert(messages);
		errors.forEach(function highlight(item) {
			var classAttr = item.element.getAttribute("class");
			classAttr += " error";
			item.element.setAttribute("class", classAttr);
		});
		event.preventDefault(); // prevent default action
		event.stopImmediatePropagation(); // prevent other handlers on same element
		errors[0].element.focus();
	}
};

// Formular per synchronem Ajax Aufruf senden
function sendAjaxSync(event) {
	event.preventDefault();
	var form = this;
	var request = new XMLHttpRequest();
	var url = form.getAttribute("action");
	var params = "message="
			+ form.getElementsByClassName("messageInput")[0].value;
	request.open("POST", url, false); // synchroner POST
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
	var htmlDocument = document.createElement("HTML");
	htmlDocument.innerHTML = request.responseText;
	var messages = htmlDocument.getElementsByTagName("UL")[0];
	var targetElement = document.getElementById("messages");
	targetElement.innerHTML = ""; // clear the target
	targetElement.appendChild(messages);
}

// Formular per asynchronem Ajax Aufruf senden
function sendAjaxAsync(event) {
	event.preventDefault();
	var form = this;
	var request = new XMLHttpRequest();
	var url = form.getAttribute("action");
	var params = "message="
			+ form.getElementsByClassName("messageInput")[0].value;
	request.open("POST", url, true); // asynchroner POST
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status == "200") {
				var htmlDocument = document.createElement("HTML");
				htmlDocument.innerHTML = request.responseText;
				var messages = htmlDocument.getElementsByTagName("UL")[0];
				var targetElement = document.getElementById("messages");
				targetElement.innerHTML = "";
				targetElement.appendChild(messages);
			} else {
				alert("Ein Fehler ist aufgetreten: " + request.statusText);
			}
		}
	}
}

$(document).ready(function() {
	// Validatoren als Property im Formularelement speichern
	$("#messageForm").prop("validators", [ messageValidator ]);
	// Validator bei submit ausführen
	$("#messageForm").bind("submit", validate);

	// Bei submit Formular per Ajax senden
	// Zum Testen Kommentar in der nächsten Zeile entfernen
	// $("#messageForm").bind("submit", sendAjaxAsync);

	$("INPUT")[0].focus();
});
