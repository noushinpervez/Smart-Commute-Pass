// constants
const seatPrice = 550;
const capacity = 40;
const maxSeat = 4;
const ticketClass = "Economy";
const validCouponCodes = ["New15", "Couple 20"];

// DOM elements
const seatBtn = document.getElementsByClassName("seat");
const applyBtn = document.getElementById("coupon-apply");
const showInfoContainer = document.getElementById("show-info");
const phoneNumberInput = document.getElementById("phone");
const nextBtn = document.getElementById("next-btn");
const couponCodeInput = document.getElementById("coupon-code");
const couponCodeError = document.getElementById("coupon-code-error");

// apply and next buttons disabled initially
applyBtn.disabled = true;
nextBtn.disabled = true;

// variables
let selectedSeatsArray = []; 
let count = 0; // tracks selection of only 4 seats
let couponApplied = false; // tracks if valid coupon code has been applied or not

// event listeners
phoneNumberInput.addEventListener("input", function () {
    enableNextButton();
});

applyBtn.addEventListener("click", function () {
    applyCoupon();
});

for (const btn of seatBtn) {
    btn.addEventListener("click", function (e) {
        const seatNumber = e.target.innerText;

        // seat select or deselect if valid coupon code has not been applied
        if (!couponApplied) {
            toggleSeatSelection(seatNumber);
            updateSeatStyles();
            updateTicketInfo();
            enableNextButton();
            count++;
        }
    });
}

// update the style of seat button based on selection
function updateSeatStyles() {
    for (const btn of seatBtn) {
        const seatNumber = btn.innerText;

        if (selectedSeatsArray.includes(seatNumber)) {
            btn.style.backgroundColor = "#1DD100";
            btn.style.opacity = 0.5;
            btn.style.color = "#FFFFFF";
        }
        else {
            btn.style.backgroundColor = "";
            btn.style.opacity = "";
            btn.style.color = "";
        }
    }
}

// handle the selection and deselection of seats conditions
function toggleSeatSelection(seatNumber) {
    const seatIndex = selectedSeatsArray.indexOf(seatNumber);

    if (selectedSeatsArray.length < maxSeat || selectedSeatsArray.includes(seatNumber)) {
        if (seatIndex === -1) {
            selectedSeatsArray.push(seatNumber);
            const seatDiv = createSeatDiv(seatNumber);
            showInfoContainer.appendChild(seatDiv);
        }
        else {
            selectedSeatsArray.splice(seatIndex, 1);
            removeTicketInfo(seatNumber);
        }
    }
    // show error message if trying to select more seats than allowed
    else if (!selectedSeatsArray.includes(seatNumber) && count >= maxSeat) {
        setInnerText("seat-selection-message", "You can only select up to 4 seats.");
    }
}

// update seat count, seat left and price info
function updateTicketInfo() {
    setInnerText("seat-taken", selectedSeatsArray.length);
    setInnerText("seat-left", capacity - selectedSeatsArray.length);
    setInnerText("total-price", selectedSeatsArray.length * seatPrice);
    setInnerText("grand-total-price", selectedSeatsArray.length * seatPrice);

    // enable apply button if 4 seats are selected
    if (selectedSeatsArray.length < 4) {
        applyBtn.disabled = true;
    }
    else {
        applyBtn.disabled = false;
    }
}

// show ticket info by creating div element
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

// show ticket info
function showTicketInfo(seatNumber) {
    const seatDiv = createSeatDiv(seatNumber);
    showInfoContainer.appendChild(seatDiv);
}

// remove ticket information for the deselected seat
function removeTicketInfo(seatNumber) {
    const seatInfoToRemove = document.getElementById(`seat-info-${seatNumber}`);

    if (seatInfoToRemove) {
        showInfoContainer.removeChild(seatInfoToRemove);
    }
}

// set inner text
function setInnerText(id, value) {
    document.getElementById(id).innerText = value;
}

// enable next button based on phone number input and selection of at least 1 seat
function enableNextButton() {
    const phoneNumberValue = phoneNumberInput.value.trim();
    const phoneNumber = Number(phoneNumberValue);

    if (selectedSeatsArray.length >= 1 && phoneNumberValue.length === 11 && !isNaN(phoneNumber) && typeof phoneNumber === "number") {
        nextBtn.disabled = false;
    }
    else {
        nextBtn.disabled = true;
    }
}

// apply coupon code
function applyCoupon() {
    const couponCode = couponCodeInput.value.trim();

    if (validCouponCodes.includes(couponCode)) {
        const discountPercentage = getDiscountPercentage(couponCode);
        const discountedPrice = calculateDiscount(selectedSeatsArray.length * seatPrice, discountPercentage);
        const savings = selectedSeatsArray.length * seatPrice - discountedPrice;

        setInnerText("grand-total-price", discountedPrice);

        // hide coupon code input and apply button after successful coupon code entry
        couponCodeInput.style.display = "none";
        applyBtn.style.display = "none";

        // show discount information
        const discountMessage = document.getElementById("discount-message");

        const div1 = createDiv(`${discountPercentage}% Discount`);
        const div2 = createDiv(`- BDT ${savings}`);

        discountMessage.appendChild(div1);
        discountMessage.appendChild(div2);

        // remove any existing error message
        const errorToRemove = document.getElementById("error");
        if (errorToRemove) {
            setInnerText("error", "");
        }

        couponApplied = true;
    }
    else {
        // show error message for invalid coupon code
        couponCodeError.id = "error";
        setInnerText("error", "Invalid coupon code. Please try again.");
    }
}

// return discount percentage based on the coupon code
function getDiscountPercentage(couponCode) {
    if (couponCode === "New15") {
        return 15;
    }
    else if (couponCode === "Couple 20") {
        return 20;
    }
}

// calculate discounted price
function calculateDiscount(originalPrice, discountPercentage) {
    const discountAmount = (discountPercentage / 100) * originalPrice;
    return originalPrice - discountAmount;
}