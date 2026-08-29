// ==========================================
// CALENDAR APP
// ==========================================

const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");

const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");

const addItemBtn = document.getElementById("addItemBtn");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const itemForm = document.getElementById("itemForm");

const itemTitle = document.getElementById("itemTitle");
const itemDate = document.getElementById("itemDate");
const itemTime = document.getElementById("itemTime");
const itemColor = document.getElementById("itemColor");


// ==========================================
// CURRENT DATE
// ==========================================

let currentDate = new Date();

let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();


// ==========================================
// LOAD SAVED ITEMS
// ==========================================

let items = JSON.parse(localStorage.getItem("calendarItems")) || [];


// ==========================================
// MONTH NAMES
// ==========================================

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// ==========================================
// CREATE CALENDAR
// ==========================================

function renderCalendar() {

    calendarDays.innerHTML = "";

    monthYear.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;


    // First day of the month
    const firstDay =
        new Date(currentYear, currentMonth, 1).getDay();


    // Number of days in current month
    const daysInMonth =
        new Date(currentYear, currentMonth + 1, 0).getDate();


    // Number of days in previous month
    const daysInPreviousMonth =
        new Date(currentYear, currentMonth, 0).getDate();


    // ==========================================
    // PREVIOUS MONTH DAYS
    // ==========================================

    for (let i = firstDay - 1; i >= 0; i--) {

        const dayNumber =
            daysInPreviousMonth - i;

        const date = new Date(
            currentYear,
            currentMonth - 1,
            dayNumber
        );

        createDay(date, true);
    }


    // ==========================================
    // CURRENT MONTH DAYS
    // ==========================================

    for (let day = 1; day <= daysInMonth; day++) {

        const date = new Date(
            currentYear,
            currentMonth,
            day
        );

        createDay(date, false);
    }


    // ==========================================
    // NEXT MONTH DAYS
    // ==========================================

    const totalCells =
        calendarDays.children.length;

    const remaining =
        42 - totalCells;

    for (let day = 1; day <= remaining; day++) {

        const date = new Date(
            currentYear,
            currentMonth + 1,
            day
        );

        createDay(date, true);
    }
}


// ==========================================
// CREATE A DAY
// ==========================================

function createDay(date, otherMonth) {

    const day = document.createElement("div");

    day.classList.add("day");

    if (otherMonth) {
        day.classList.add("other-month");
    }


    // Today's date
    const today = new Date();

    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {
        day.classList.add("today");
    }


    // Day number
    const number = document.createElement("div");

    number.classList.add("day-number");

    number.textContent = date.getDate();

    day.appendChild(number);


    // Format date as YYYY-MM-DD
    const dateString =
        formatDate(date);


    // Find items for this day
    const dayItems =
        items
            .filter(item => item.date === dateString)
            .sort((a, b) =>
                a.time.localeCompare(b.time)
            );


    // Add items
    dayItems.forEach(item => {

        const itemElement =
            document.createElement("div");

        itemElement.classList.add("calendar-item");

        itemElement.style.backgroundColor =
            item.color;


        // Convert time to readable format
        const readableTime =
            formatTime(item.time);


        itemElement.innerHTML = `
            <span class="item-time">
                ${readableTime}
            </span>
            ${escapeHTML(item.title)}
        `;


        // Click an item to delete it
        itemElement.addEventListener("click", function(event) {

            event.stopPropagation();

            const deleteItem =
                confirm(
                    `Delete "${item.title}"?`
                );

            if (deleteItem) {

                items =
                    items.filter(
                        savedItem =>
                            savedItem.id !== item.id
                    );

                saveItems();

                renderCalendar();
            }
        });


        day.appendChild(itemElement);
    });


    // Clicking a day opens the add window
    day.addEventListener("click", function() {

        openModal(dateString);
    });


    calendarDays.appendChild(day);
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");

    let hour =
        parseInt(hours);

    const ampm =
        hour >= 12 ? "PM" : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minutes} ${ampm}`;
}


// ==========================================
// OPEN MODAL
// ==========================================

function openModal(date = "") {

    modal.classList.remove("hidden");

    if (date) {
        itemDate.value = date;
    }

    itemTitle.focus();
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModalWindow() {

    modal.classList.add("hidden");

    itemForm.reset();

    itemColor.value = "#4f46e5";
}


// ==========================================
// ADD ITEM BUTTON
// ==========================================

addItemBtn.addEventListener("click", function() {

    const today =
        formatDate(new Date());

    openModal(today);
});


// ==========================================
// CLOSE BUTTON
// ==========================================

closeModal.addEventListener(
    "click",
    closeModalWindow
);


// ==========================================
// CLICK OUTSIDE MODAL
// ==========================================

modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeModalWindow();
    }
});


// ==========================================
// SAVE ITEM
// ==========================================

itemForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const newItem = {

        id:
            Date.now(),

        title:
            itemTitle.value.trim(),

        date:
            itemDate.value,

        time:
            itemTime.value,

        color:
            itemColor.value
    };


    // Add to list
    items.push(newItem);


    // Save to browser
    saveItems();


    // Close window
    closeModalWindow();


    // Refresh calendar
    renderCalendar();
});


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveItems() {

    localStorage.setItem(
        "calendarItems",
        JSON.stringify(items)
    );
}


// ==========================================
// PREVIOUS MONTH
// ==========================================

previousMonth.addEventListener(
    "click",
    function() {

        currentMonth--;

        if (currentMonth < 0) {

            currentMonth = 11;
            currentYear--;
        }

        renderCalendar();
    }
);


// ==========================================
// NEXT MONTH
// ==========================================

nextMonth.addEventListener(
    "click",
    function() {

        currentMonth++;

        if (currentMonth > 11) {

            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    }
);


// ==========================================
// SECURITY
// Prevent HTML being inserted into calendar
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// START CALENDAR
// ==========================================

renderCalendar();