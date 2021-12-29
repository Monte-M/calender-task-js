let nav = 0;
let clicked = null;
let events = sessionStorage.getItem('events')
  ? JSON.parse(sessionStorage.getItem('events'))
  : [];

const calendar = document.getElementById('calendar');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const toggleFormBtn = document.getElementById('toggleView');

// inputs
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const addEventBtn = document.getElementById('addEvent');

addEventBtn.onclick = () => {
  if (title.value) {
    title.classList.remove('error');

    events.push({
      title: titleInput.value,
      date: dateInput.value,
      startTime: startTimeInput.value,
      endTime: endTimeInput.value,
      type: typeInput.value,
      description: descriptionInput.value,
    });

    sessionStorage.setItem('events', JSON.stringify(events));
    window.location.reload();
  } else {
    title.classList.add('error');
  }
};

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString(
    'en-US',
    { month: 'long' }
  )} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    let dayString = `${year}-${month + 1}-${i - paddingDays}`;

    if (i - paddingDays < 10) {
      dayString = `${year}-${month + 1}-0${i - paddingDays}`;
    }
    if (month < 10) {
      dayString = `${year}-0${month + 1}-${i - paddingDays}`;
    }
    if (month < 10 && i - paddingDays < 10) {
      dayString = `${year}-0${month + 1}-0${i - paddingDays}`;
    }

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => (dateInput.value = dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  toggleFormBtn.onclick = () => {
    const formEl = document.getElementById('form');
    if (formEl.style.display !== 'none') {
      formEl.style.display = 'none';
      toggleFormBtn.innerText = 'Show Create View';
    } else {
      toggleFormBtn.innerText = 'Hide Create View';
      formEl.style.display = 'flex';
    }
  };
}

initButtons();
load();
