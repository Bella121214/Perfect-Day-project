// ==========================================
// 📅 THE CORE - TIMELINE PLANNER ENGINE
// ==========================================

// 1. Grab the elements from our HTML page
const activityForm = document.getElementById('activity-form');
const activityTime = document.getElementById('activity-time');
const activityText = document.getElementById('activity-text');
const timeline = document.getElementById('timeline');

// 2. Listen for when the user clicks the "Add to Day" button
activityForm.addEventListener('submit', function(event) {
   
    // Stop the web page from automatically refreshing
    event.preventDefault();

    // Get the specific time and text the user typed in
    const timeValue = activityTime.value;
    const textValue = activityText.value;

    // 3. Create a brand new visual box for the activity
    const activityCard = document.createElement('div');
    activityCard.className = 'activity-item';
   
    // Put the time in bold, followed by the activity text
    activityCard.innerHTML = `<strong>${timeValue}</strong> - ${textValue}`;

    // 4. Add this new box into our timeline area on the screen
    timeline.appendChild(activityCard);

    // 5. Clear out the text box so it's fresh and ready for the next entry
    activityText.value = '';
});