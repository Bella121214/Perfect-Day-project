// Grab the elements from our HTML page
const activityForm = document.getElementById('activity-form');
const activityTime = document.getElementById('activity-time');
const activityText = document.getElementById('activity-text');
const timeline = document.getElementById('timeline');

// Listen for when the user clicks "Add to Day"
activityForm.addEventListener('submit', function(event) {
    // Stop the page from refreshing automatically
    event.preventDefault();

    // Get the values the user typed in
    const timeValue = activityTime.value;
    const textValue = activityText.value;

    // Create a new HTML element for the activity box
    const activityCard = document.createElement('div');
    activityCard.className = 'activity-item';
    activityCard.innerHTML = `<strong>${timeValue}</strong> - ${textValue}`;

    // Add this new box into our timeline container
    timeline.appendChild(activityCard);

    // Clear the text box so it's ready for the next activity
    activityText.value = '';
});
const journalInput = document.getElementById('journal-input');
const saveJournalBtn = document.getElementById('save-journal-btn');
const savedMemories = document.getElementById('saved-memories');

// Listen for when the user clicks "Save Memory"
saveJournalBtn.addEventListener('click', function() {
    const memoryText = journalInput.value;

    // Don't save empty text
    if (memoryText.trim() === "") return;

    // Create a new HTML element for the memory
    const memoryCard = document.createElement('div');
    memoryCard.className = 'memory-item';
    memoryCard.innerText = memoryText;

    // Add it to our saved memories section
    savedMemories.appendChild(memoryCard);

    // Clear out the journal typing area
    journalInput.value = '';
});