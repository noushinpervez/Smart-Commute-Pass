const seatBtn = document.getElementsByClassName("seat");
let seatCount = 0;
const seatPrice = 550;
const capacity = 40;
let selectedSeatsArray = [];

for (const btn of seatBtn) {
    btn.addEventListener("click", function (e) {
        const seatNumber = e.target.innerText;

        if (selectedSeatsArray.length < 4 || selectedSeatsArray.includes(seatNumber)) {
            if (!selectedSeatsArray.includes(seatNumber)) {
                selectedSeatsArray.push(seatNumber);
            }
        }

        if (selectedSeatsArray.includes(seatNumber)) {
            btn.style.backgroundColor = '#1DD100';
            btn.style.opacity = 0.5;
            btn.style.color = '#FFFFFF';
        } else {
            btn.style.backgroundColor = '';
            btn.style.opacity = '';
            btn.style.color = '';
        }

        setInnerText("seat-taken", selectedSeatsArray.length);
        setInnerText("seat-left", capacity - selectedSeatsArray.length);
        setInnerText("total-price", selectedSeatsArray.length * seatPrice);
        setInnerText("grand-total-price", selectedSeatsArray.length * seatPrice);
    });
}

function setInnerText(id, value) {
    document.getElementById(id).innerText = value;
}