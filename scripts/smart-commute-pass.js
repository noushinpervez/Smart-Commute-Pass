const seatPrice = 550;
const capacity = 40;
const maxSeat = 4;
const ticketClass = "Economy";
const validCouponCodes = ["New15", "Couple 20"];

const seatBtn = document.getElementsByClassName("seat");
const applyBtn = document.getElementById("coupon-apply");
const showInfoContainer = document.getElementById("show-info");
const phoneNumberInput = document.getElementById("phone");
const nextBtn = document.getElementById("next-btn");
const couponCodeInput = document.getElementById("coupon-code");

// disabled initially
applyBtn.disabled = true;
nextBtn.disabled = true;

let selectedSeatsArray = [];

let count = 0;

phoneNumberInput.addEventListener("input", function () {
    enableNextButton();
});

applyBtn.addEventListener("click", function () {
    applyCoupon();
});

for (const btn of seatBtn) {
    btn.addEventListener("click", function (e) {
        const seatNumber = e.target.innerText;
        toggleSeatSelection(seatNumber);
        updateSeatStyles();
        updateTicketInfo();
        enableNextButton();
        count++;
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
    else if (!selectedSeatsArray.includes(seatNumber) && count >= 4) {
        const messageElement = document.getElementById('seat-selection-message');
        messageElement.innerText = "You can only select up to 4 seats.";
    }
}

function updateTicketInfo() {
    setInnerText("seat-taken", selectedSeatsArray.length);
    setInnerText("seat-left", capacity - selectedSeatsArray.length);
    setInnerText("total-price", selectedSeatsArray.length * seatPrice);
    setInnerText("grand-total-price", selectedSeatsArray.length * seatPrice);

    if (selectedSeatsArray.length < 4) {
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
    seatDiv.id = `seat-info-${seatNumber}`;

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
    const seatInfoToRemove = document.getElementById(`seat-info-${seatNumber}`);
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

function enableNextButton() {
    const phoneNumberValue = phoneNumberInput.value.trim();
    const phoneNumber = Number(phoneNumberValue);

    if (selectedSeatsArray.length >= 1 && phoneNumberValue.length === 11 && !isNaN(phoneNumber) && typeof phoneNumber === 'number') {
        nextBtn.disabled = false;
    }
    else {
        nextBtn.disabled = true;
    }
}

function applyCoupon() {
    const couponCode = couponCodeInput.value.trim();

    if (validCouponCodes.includes(couponCode)) {
        const discountPercentage = getDiscountPercentage(couponCode);
        const discountedPrice = calculateDiscount(selectedSeatsArray.length * seatPrice, discountPercentage);
        const savings = selectedSeatsArray.length * seatPrice - discountedPrice;
        setInnerText("grand-total-price", discountedPrice);

        couponCodeInput.style.display = "none";
        applyBtn.style.display = "none";

        const discountMessage = document.getElementById("discount-message");

        discountMessage.innerHTML = '';

        const div1 = createDiv(`${discountPercentage}% Discount`);
        const div2 = createDiv(`-BDT ${savings}`);

        discountMessage.appendChild(div1);
        discountMessage.appendChild(div2);
    }
    else {
        alert("Invalid coupon code. Please try again.");
    }
}

function getDiscountPercentage(couponCode) {
    if (couponCode === "New15") {
        return 15;
    }
    else if (couponCode === "Couple 20") {
        return 20;
    }
}

function calculateDiscount(originalPrice, discountPercentage) {
    const discountAmount = (discountPercentage / 100) * originalPrice;
    return originalPrice - discountAmount;
}