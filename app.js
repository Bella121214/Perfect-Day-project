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




// ==========================================
// CALENDAR ITEM ELEMENTS
// ==========================================


const itemForm = document.getElementById("itemForm");


const itemTitle = document.getElementById("itemTitle");
const itemDate = document.getElementById("itemDate");
const itemTime = document.getElementById("itemTime");
const itemColor = document.getElementById("itemColor");




// ==========================================
// HAPPY MEMORY ELEMENTS
// ==========================================


const memoryForm = document.getElementById("memoryForm");


const memoryText =
    document.getElementById("memoryText");


const memoryDate =
    document.getElementById("memoryDate");




// ==========================================
// CURRENT DATE
// ==========================================


let currentDate = new Date();


let currentMonth =
    currentDate.getMonth();


let currentYear =
    currentDate.getFullYear();




// ==========================================
// LOAD SAVED CALENDAR ITEMS
// ==========================================


let items =
    JSON.parse(
        localStorage.getItem("calendarItems")
    ) || [];




// ==========================================
// LOAD SAVED HAPPY MEMORIES
// ==========================================


let memories =
    JSON.parse(
        localStorage.getItem("happyMemories")
    ) || [];




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
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();




    // Number of days in current month
    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();




    // Number of days in previous month
    const daysInPreviousMonth =
        new Date(
            currentYear,
            currentMonth,
            0
        ).getDate();




    // ==========================================
    // PREVIOUS MONTH DAYS
    // ==========================================


    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {


        const dayNumber =
            daysInPreviousMonth - i;


        const date =
            new Date(
                currentYear,
                currentMonth - 1,
                dayNumber
            );


        createDay(date, true);
    }




    // ==========================================
    // CURRENT MONTH DAYS
    // ==========================================


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {


        const date =
            new Date(
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


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {


        const date =
            new Date(
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


    const day =
        document.createElement("div");


    day.classList.add("day");




    if (otherMonth) {
        day.classList.add("other-month");
    }




    // ==========================================
    // TODAY
    // ==========================================


    const today = new Date();


    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {


        day.classList.add("today");
    }




    // ==========================================
    // DAY NUMBER
    // ==========================================


    const number =
        document.createElement("div");


    number.classList.add("day-number");


    number.textContent =
        date.getDate();


    day.appendChild(number);




    // ==========================================
    // DATE STRING
    // ==========================================


    const dateString =
        formatDate(date);




    // ==========================================
    // FIND CALENDAR EVENTS
    // ==========================================


    const dayItems =
        items
            .filter(
                item =>
                    item.date === dateString
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(b.time)
            );




    // ==========================================
    // DISPLAY CALENDAR EVENTS FIRST
    // ==========================================


    dayItems.forEach(item => {


        const itemElement =
            document.createElement("div");


        itemElement.classList.add(
            "calendar-item"
        );




        itemElement.style.backgroundColor =
            item.color;




        const readableTime =
            formatTime(item.time);




        itemElement.innerHTML = `
            <span class="item-time">
                ${readableTime}
            </span>
            ${escapeHTML(item.title)}
        `;




        // ======================================
        // DELETE CALENDAR EVENT
        // ======================================


        itemElement.addEventListener(
            "click",
            function(event) {


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
            }
        );




        day.appendChild(itemElement);
    });




    // ==========================================
    // FIND HAPPY MEMORIES FOR THIS DATE
    // ==========================================


    const dayMemories =
        memories.filter(
            memory =>
                memory.date === dateString
        );




    // ==========================================
    // DISPLAY MEMORIES AFTER ALL EVENTS
    // ==========================================


    dayMemories.forEach(memory => {


        const memoryElement =
            document.createElement("div");




        memoryElement.classList.add(
            "calendar-item",
            "memory-item"
        );




        // Sunset color for memories
        memoryElement.style.backgroundColor =
            "#d85a72";




        memoryElement.innerHTML = `
            <span class="item-time">
                ♥
            </span>
            ${escapeHTML(memory.text)}
        `;




        // ======================================
        // DELETE HAPPY MEMORY
        // ======================================


        memoryElement.addEventListener(
            "click",
            function(event) {


                event.stopPropagation();




                const deleteMemory =
                    confirm(
                        `Delete this happy memory?\n\n"${memory.text}"`
                    );




                if (deleteMemory) {


                    memories =
                        memories.filter(
                            savedMemory =>
                                savedMemory.id !== memory.id
                        );


                    saveMemories();


                    renderCalendar();
                }
            }
        );




        // Add memory AFTER all events
        day.appendChild(memoryElement);
    });




    // ==========================================
    // CLICK DAY TO OPEN MODAL
    // ==========================================


    day.addEventListener(
        "click",
        function() {


            openModal(dateString);
        }
    );




    calendarDays.appendChild(day);
}




// ==========================================
// FORMAT DATE
// ==========================================


function formatDate(date) {


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


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
        hour >= 12
            ? "PM"
            : "AM";


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


        // Set event date
        itemDate.value = date;


        // Set memory date too
        memoryDate.value = date;
    }




    itemTitle.focus();
}




// ==========================================
// CLOSE MODAL
// ==========================================


function closeModalWindow() {


    modal.classList.add("hidden");




    // Reset calendar item form
    itemForm.reset();




    // Reset calendar color
    itemColor.value =
        "#f4515f";




    // Reset memory form
    memoryForm.reset();
}




// ==========================================
// ADD ITEM BUTTON
// ==========================================


addItemBtn.addEventListener(
    "click",
    function() {


        const today =
            formatDate(new Date());


        openModal(today);
    }
);




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


modal.addEventListener(
    "click",
    function(event) {


        if (event.target === modal) {


            closeModalWindow();
        }
    }
);




// ==========================================
// SAVE CALENDAR ITEM
// ==========================================


itemForm.addEventListener(
    "submit",
    function(event) {


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




        items.push(newItem);




        saveItems();




        closeModalWindow();




        renderCalendar();
    }
);




// ==========================================
// SAVE HAPPY MEMORY
// ==========================================


memoryForm.addEventListener(
    "submit",
    function(event) {


        event.preventDefault();




        // Make sure both fields are filled
        if (
            memoryText.value.trim() === "" ||
            memoryDate.value === ""
        ) {


            alert(
                "Please enter a memory and choose a date."
            );


            return;
        }




        // ======================================
        // CREATE MEMORY
        // ======================================


        const newMemory = {


            id:
                Date.now(),


            text:
                memoryText.value.trim(),


            date:
                memoryDate.value
        };




        // ======================================
        // SAVE MEMORY
        // ======================================


        memories.push(newMemory);


        saveMemories();




        // ======================================
        // CLOSE MODAL
        // ======================================


        closeModalWindow();




        // ======================================
        // REFRESH CALENDAR
        // ======================================


        renderCalendar();
    }
);




// ==========================================
// SAVE CALENDAR ITEMS
// ==========================================


function saveItems() {


    localStorage.setItem(
        "calendarItems",
        JSON.stringify(items)
    );
}




// ==========================================
// SAVE HAPPY MEMORIES
// ==========================================


function saveMemories() {


    localStorage.setItem(
        "happyMemories",
        JSON.stringify(memories)
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
// ==========================================


function escapeHTML(text) {


    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;
}




// ==========================================
// START CALENDAR
// ==========================================


renderCalendar();


