const courses = document.querySelectorAll('.course');
const timetable = document.getElementById('timetable');

courses.forEach(course => {
  course.addEventListener('dragstart', dragStart);
});

timetable.addEventListener('dragover', dragOver);
timetable.addEventListener('drop', drop);

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.innerText);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const courseName = e.dataTransfer.getData('text/plain');
  const cell = e.target.closest('.cell');
  if (cell) {
    cell.innerHTML = `<div class="course-in-cell">${courseName}<span class="delete-course">X</span></div>`;
    const deleteBtn = cell.querySelector('.delete-course');
    deleteBtn.addEventListener('click', () => {
      cell.innerHTML = '';
    });
  }
}

document.getElementById('addCustomCourse').addEventListener('click', () => {
  const customCourseInput = document.getElementById('customCourse');
  const customCourseName = customCourseInput.value.trim();
  if (customCourseName !== '') {
    const course = document.createElement('div');
    course.className = 'course';
    course.draggable = true;
    course.textContent = customCourseName;
    course.addEventListener('dragstart', dragStart);
    document.querySelector('.courses').insertBefore(course, document.querySelector('.custom-course'));
    customCourseInput.value = '';
  }
});
