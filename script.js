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

// event elements
const eventsContainerEl = document.getElementById('eventsContainer');
const eventsListEl = document.getElementById('eventsList');
const singleEventEl = document.getElementById('singleEvent');
const titleEl = document.getElementById('titleEl');

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

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
  console.log('date1', date);
}

function showEvents(date) {
  clicked = date;
  console.log('clicked', clicked);

  const eventForDay = events.filter((e) => e.date == clicked);
  if (eventForDay.length > 0) {
    eventsContainerEl.style.display = 'flex';
    const item = eventForDay
      .map(
        (item) => `
          <div class='singleEvent'>
            <p>Title: ${item.title}</p>
            <div class='eventTimes'>
              <p>Start time: ${item.startTime}</p>
              <p>End time: ${item.endTime}</p>
            </div>
            <p>Type: ${item.type}</p>
            <p>Description: ${item.description}</p>
            <button>Delete</button>
            </div>
    `
      )
      .join('');
    eventsListEl.innerHTML = item;
  } else {
    eventsContainerEl.style.display = 'none';
  }
}

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
    const dateString = `${month + 1}/${i - paddingDays}/${year}`;

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

      const eventForDay = events.filter((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay.length > 0) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.length + ' tasks';
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener(
        'click',
        () => (dateInput.value = dayString) && showEvents(dayString)
      );
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  clicked = null;
  load();
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  sessionStorage.setItem('events', JSON.stringify(events));
  closeModal();
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

  document
    .getElementById('deleteButton')
    .addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);

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
