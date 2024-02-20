const seatPrice = 550;
const capacity = 40;
const maxSeat = 4;
const ticketClass = "Economy";

const seatBtn = document.getElementsByClassName("seat");
const applyBtn = document.getElementById("coupon-apply");
const showInfoContainer = document.getElementById("show-info");
const phoneNumberInput = document.getElementById("phone");
const nextBtn = document.getElementById("next-btn");

applyBtn.disabled = true;
nextBtn.disabled = true;

let selectedSeatsArray = [];

phoneNumberInput.addEventListener("input", function () {
    enableNextButton();
});

for (const btn of seatBtn) {
    btn.addEventListener("click", function (e) {
        const seatNumber = e.target.innerText;
        toggleSeatSelection(seatNumber);
        updateSeatStyles();
        updateTicketInfo();
        enableNextButton();
    });
}

function toggleSeatSelection(seatNumber) {
    const seatIndex = selectedSeatsArray.indexOf(seatNumber);

    if (selectedSeatsArray.length < maxSeat || selectedSeatsArray.includes(seatNumber)) {
        if (seatIndex === -1) {
            selectedSeatsArray.push(seatNumber);
            showTicketInfo(seatNumber);
        } 
        else {
            selectedSeatsArray.splice(seatIndex, 1);
            removeTicketInfo(seatNumber);
        }
    }
}

function updateTicketInfo() {
    setInnerText("seat-taken", selectedSeatsArray.length);
    setInnerText("seat-left", capacity - selectedSeatsArray.length);
    setInnerText("total-price", selectedSeatsArray.length * seatPrice);
    setInnerText("grand-total-price", selectedSeatsArray.length * seatPrice);

    if (selectedSeatsArray.length < 1) {
        applyBtn.disabled = true;
    } 
    else {
        applyBtn.disabled = false;
    }
}

function showTicketInfo(seatNumber) {
    const seatDiv = createSeatDiv(seatNumber);
    showInfoContainer.appendChild(seatDiv);
}

function createSeatDiv(seatNumber) {
    const seatDiv = document.createElement("div");
    seatDiv.classList.add("flex", "justify-between");
    seatDiv.id = "seat-info-${seatNumber}";

    const div1 = createDiv(seatNumber);
    const div2 = createDiv(ticketClass);
    const div3 = createDiv(seatPrice);

    seatDiv.appendChild(div1);
    seatDiv.appendChild(div2);
    seatDiv.appendChild(div3);

    return seatDiv;
}

function createDiv(value) {
    const div = document.createElement("div");
    div.innerText = value;
    return div;
}

function removeTicketInfo(seatNumber) {
    const seatInfoToRemove = document.getElementById("seat-info-${seatNumber}");
    if (seatInfoToRemove) {
        showInfoContainer.removeChild(seatInfoToRemove);
    }
}

function updateSeatStyles() {
    for (const btn of seatBtn) {
        const seatNumber = btn.innerText;
        const isSelected = selectedSeatsArray.includes(seatNumber);
        btn.style.backgroundColor = isSelected ? '#1DD100' : '';
        btn.style.opacity = isSelected ? 0.5 : '';
        btn.style.color = isSelected ? '#FFFFFF' : '';
    }
}

function setInnerText(id, value) {
    document.getElementById(id).innerText = value;
}

function enableNextButton () {
    const phoneNumberValue = phoneNumberInput.value.trim();
    
    if (selectedSeatsArray.length >= 1 && phoneNumberValue.length === 11) {
        nextBtn.disabled = false;
    } 
    else {
        nextBtn.disabled = true;
    }
}