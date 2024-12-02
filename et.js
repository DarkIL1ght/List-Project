let tasks = [];
class Task {
    constructor(name, text, datetime, completed = false) {
        this.name = name;
        this.text = text;
        this.datetime = datetime;
        this.completed = completed;
    }
}

// Обработчик отправки формы для добавления новой задачи
document.getElementById("add").onsubmit = function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const text = document.getElementById("text").value;
    const datetime = document.getElementById("datetime").value;

    // Если задача редактируется, то обновляем её, иначе добавляем новую задачу
    if (document.getElementById("add").dataset.editIndex !== undefined) {
        const index = document.getElementById("add").dataset.editIndex;
        tasks[index] = new Task(name, text, datetime);  // Обновляем задачу
        delete document.getElementById("add").dataset.editIndex;  // Удаляем флаг редактирования
    } else {
        tasks.push(new Task(name, text, datetime));  // Добавляем новую задачу
    }

    // Очищаем поля ввода
    document.getElementById("name").value = '';
    document.getElementById("text").value = '';
    document.getElementById("datetime").value = '2024-12-09T15:45';

    // Отображаем задачи
    displayTasks();
};

// Функция для отображения задач
function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых задач

    // Сортируем задачи по дате и времени
    tasks.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    // Перебираем массив tasks и добавляем задачи на страницу
    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        if (task.completed) {
            taskDiv.classList.add("completed");
        }
        
        // Добавляем имя задачи
        const nameElement = document.createElement("h3");
        nameElement.textContent = task.name;
        taskDiv.appendChild(nameElement);

        // Добавляем описание задачи
        const textElement = document.createElement("p");
        textElement.textContent = task.text;
        taskDiv.appendChild(textElement);

        // Добавляем дату и время задачи
        const datetimeElement = document.createElement("p");
        datetimeElement.textContent = `Дата и время: ${task.datetime}`;
        taskDiv.appendChild(datetimeElement);

        // Добавляем галочку для завершения задачи
        const completionCheckbox = document.createElement("input");
        completionCheckbox.type = "checkbox";
        completionCheckbox.checked = task.completed;
        completionCheckbox.onclick = function () {
            toggleTaskCompletion(index);  // Меняет состояние выполнения задачи
        };
        taskDiv.appendChild(completionCheckbox);

        // Добавляем кнопку для редактирования задачи
        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.onclick = function () {
            editTask(index);  // Редактировать задачу по индексу
        };
        taskDiv.appendChild(editButton);

        // Добавляем кнопку для удаления задачи
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.onclick = function () {
            deleteTask(index);  // Удалить задачу по индексу
        };
        taskDiv.appendChild(deleteButton);

        // Добавляем задачу в контейнер
        tasksContainer.appendChild(taskDiv);
    });
}

// Функция для переключения состояния выполнения задачи
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

// Функция для редактирования задачи
function editTask(index) {
    const task = tasks[index];
    // Заполняем форму редактирования существующими данными
    document.getElementById("name").value = task.name;
    document.getElementById("text").value = task.text;
    document.getElementById("datetime").value = task.datetime;
    // Устанавливаем флаг редактирования
    document.getElementById("add").dataset.editIndex = index;
}

// Функция для удаления задачи
function deleteTask(index) {
    // Удаляем задачу из массива tasks
    tasks.splice(index, 1);
    displayTasks();  // Обновляем отображение после удаления
}
// Функция для проверки, если время задачи уже наступило
function checkTaskCompletion() {
    const now = new Date();
    tasks.forEach(task => {
        const taskDate = new Date(task.datetime);
        const timeDifference = taskDate - now; // разница во времени в миллисекундах
        if (!task.completed && timeDifference <= 0) {
            alert(`Время для задачи "${task.name}" наступило!\nДата: ${task.datetime}`);
            task.completed = true;  // Помечаем задачу как выполненную
            displayTasks(); // Обновление отображения задач
        }
    });
}

// Проверка каждую секунду для задач, которые уже наступили
setInterval(() => {
    checkTaskCompletion();  // Проверка задач, которые уже наступили
}, 1000); // каждые 1 секунду