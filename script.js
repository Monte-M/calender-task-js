let nav = 0;
let clicked = null;
let events = sessionStorage.getItem('events')
  ? JSON.parse(sessionStorage.getItem('events'))
  : [];

// elements
const calendar = document.getElementById('calendar');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const toggleFormBtn = document.getElementById('toggleView');
const deleteButton = document.getElementById('deleteButton');

// inputs
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const addEventBtn = document.getElementById('addEvent');
const errorMessage = document.getElementById('errorMessage');
const timeErrorMessage = document.getElementById('timeErrorMessage');

// event elements
const eventsContainerEl = document.getElementById('eventsContainer');
const eventsListEl = document.getElementById('eventsList');
const titleEl = document.getElementById('titleEl');

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const prefilledArr = [
  {
    id: '2021-12-31T06:40:19.156Z',
    title: 'Visma Task Deadline',
    date: '2022-01-10',
    startTime: '13:00',
    endTime: '14:00',
    type: 'Out of office',
    description: 'Have to finish task before this date.',
  },
];

const uniqid = new Date();

let eventsArr = [];

function checkStorage() {
  if (sessionStorage.events) {
    eventsArr = JSON.parse(sessionStorage.getItem('events'));
  } else {
    eventsArr = sessionStorage.setItem('events', JSON.stringify(prefilledArr));
  }
}

addEventBtn.onclick = () => {
  if (!titleInput.value) {
    titleInput.classList.add('error');
    errorMessage.style.display = 'block';
  } else {
    titleInput.classList.remove('error');
  }
  if (!dateInput.value) {
    dateInput.classList.add('error');
    errorMessage.style.display = 'block';
  } else {
    dateInput.classList.remove('error');
  }
  if (!startTimeInput.value) {
    startTimeInput.classList.add('error');
    errorMessage.style.display = 'block';
  } else {
    startTimeInput.classList.remove('error');
  }
  if (!endTimeInput.value) {
    endTimeInput.classList.add('error');
    errorMessage.style.display = 'block';
  } else {
    endTimeInput.classList.remove('error');
  }
  if (endTimeInput.value < startTimeInput.value) {
    endTimeInput.classList.add('error');
    timeErrorMessage.style.display = 'block';
  } else {
    endTimeInput.classList.remove('error');
  }

  if (
    titleInput.value &&
    dateInput.value &&
    startTimeInput.value &&
    endTimeInput.value &&
    endTimeInput.value > startTimeInput.value
  ) {
    events.push({
      id: uniqid,
      title: titleInput.value,
      date: dateInput.value,
      startTime: startTimeInput.value,
      endTime: endTimeInput.value,
      type: typeInput.value,
      description: descriptionInput.value,
    });

    sessionStorage.setItem('events', JSON.stringify(events));
    window.location.reload();
  }
};

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
    {
      month: 'long',
    }
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

      const eventForDay = events.filter((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay.length > 0) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = 'Tasks: ' + eventForDay.length;
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

function showEvents(date) {
  clicked = date;

  const eventForDay = eventsArr.filter((e) => e.date == clicked);
  if (eventForDay.length > 0) {
    eventsContainerEl.style.display = 'flex';
    const item = eventForDay
      .map(
        (item) => `
          <div class='singleEvent' id=${item.id}>
            <p>Title: ${item.title}</p>
            <div class='eventTimes'>
              <p>Start time: ${item.startTime}</p>
              <p>End time: ${item.endTime}</p>
            </div>
            <p>Type: ${item.type}</p>
            <p>Description: ${item.description}</p>
            <button id=${item.id} class='deleteBtn'>Delete</button>
            </div>
    `
      )
      .join('');
    eventsListEl.innerHTML = item;
  } else {
    eventsContainerEl.style.display = 'none';
  }
}

function openModal(filteredArr, title) {
  deleteEventModal.style.display = 'block';
  document.getElementById('eventText').innerText = title;

  deleteButton.onclick = () => {
    sessionStorage.setItem('events', JSON.stringify(filteredArr));
    window.location.reload();
  };
}

function closeModal() {
  deleteEventModal.style.display = 'none';
  clicked = null;
  load();
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

  eventsContainerEl.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteBtn')) {
      const id = e.target.id;
      const title = e.path[1].children[0].innerHTML.slice(7);

      const filteredArr = JSON.parse(sessionStorage.getItem('events')).filter(
        (e) => e.id !== id
      );
      openModal(filteredArr, title);
    }
  });

  document.getElementById('closeButton').addEventListener('click', closeModal);
}

checkStorage();
initButtons();
load();
