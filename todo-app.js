(function () {
	function dataToJson(data) {
		return JSON.stringify(data);
	}

	// Сохранение данных
	function setDataToLS(key, data) {
		localStorage.setItem(key, dataToJson(data));
	}

	// Из строки в объект
	function jsonToDate(data) {
		return JSON.parse(data);
	}

	// Получение данных
	function getDataFromLS(key) {
		let data = localStorage.getItem(key);

		return data ? jsonToDate(data) : [];
	}

	// Создаем и возвращаем заголовок приложения
	function createAppTitle(title) {
		let appTitle = document.createElement('h2');
		appTitle.innerHTML = title;
		return appTitle;
	}
	// Создаем и возвращаем форму для создания дела
	function createTodoItemForm() {
		let form = document.createElement('form');
		let input = document.createElement('input');
		let buttonWrapper = document.createElement('div');
		let button = document.createElement('button');

		form.classList.add('input-group', 'mb-3');
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дела';
		buttonWrapper.classList.add('input-group-append');
		button.classList.add('btn', 'btn-primary');
		button.textContent = 'Добавить дело';
    button.disabled = true;

		buttonWrapper.append(button);
		form.append(
      input,
      buttonWrapper
    );

    // Если поле ввода пустое, кнопка не активна
    input.addEventListener('input', function(){
      if(input.value !== ''){
        button.disabled = false;
      } else{
        button.disabled = true;
      }
    });

		return {
			form,
			input,
			button,
		};
	}
	// Создаем и возвращаем список элементов
	function createTodoList() {
		let list = document.createElement('ul');
		list.classList.add('list-group');
		return list;
	}
	// Создаем отдельные дела с кнопками Готово и Удалить
	function createTodoItem(obj) {
		let item = document.createElement('li');

		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		let deleteButton = document.createElement('button');

		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		item.textContent = obj.name;

		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		doneButton.classList.add('btn', 'btn-success');
		doneButton.textContent = 'Готово';
		deleteButton.classList.add('btn', 'btn-danger');
		deleteButton.textContent = 'Удалить';

		buttonGroup.append(doneButton, deleteButton);
		item.append(buttonGroup);

		if (obj.done === true) {
			item.classList.add('list-group-item-success');
		}

		return {
			item,
			doneButton,
			deleteButton,
		};
	}
	// Получение максимального ID из массива
	function getId(arr) {
		let maxId = 0;
		for (let i of arr) {
			if (i.id >= maxId) {
				maxId = i.id;
			}
		}
		return maxId + 1;
	}

	// Добавляем новые дела
	function createTodoApp(container, title = 'Список дел', key) {
		let todoAppTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();
		let todoItemArr = getDataFromLS(key);

		for (let task of todoItemArr) {
			let el = createTodoItem(task);
			todoList.append(el.item);

			el.doneButton.addEventListener('click', function () {
				el.item.classList.toggle('list-group-item-success');

				for (let item of todoItemArr) {
					if (item.id === task.id) item.done = !item.done;
				}
				setDataToLS(key, todoItemArr);
			});

      // удаляем дело
			el.deleteButton.addEventListener('click', function () {
				if (confirm('Вы уверены?')) {
					el.item.remove();

					for (let i = 0; i < todoItemArr.length; i++) {
						if (todoItemArr[i].id == task.id) {
							todoItemArr.splice(i, 1);
						}
					}
					setDataToLS(key, todoItemArr);
				}
			});
		}

		container.append(todoAppTitle, todoItemForm.form, todoList);

		// Событие по нажатию на enter или кнопку - создание дела
		todoItemForm.form.addEventListener('submit', function (e) {
			e.preventDefault();

			// Игнорируем создание формы, если пользователь ничего не ввел
			if (!todoItemForm.input.value) {
				return;
			}

			let obj = {
				id: getId(todoItemArr),
				name: todoItemForm.input.value,
				done: false,
			};

			todoItemArr.push(obj);
			setDataToLS(key, todoItemArr);

			let todoItem = createTodoItem(obj);
			todoList.append(todoItem.item);

			todoItem.doneButton.addEventListener('click', function () {
				todoItem.item.classList.toggle('list-group-item-success');

				for (let item of todoItemArr) {
					if (item.id === obj.id) item.done = !item.done;
				}
				setDataToLS(key, todoItemArr);
			});

			todoItem.deleteButton.addEventListener('click', function () {
				if (confirm('Вы уверены?')) {
					todoItem.item.remove();

					for (let i = 0; i < todoItemArr.length; i++) {
						if (todoItemArr[i].id == obj.id) {
							todoItemArr.splice(i, 1);
						}
					}
					setDataToLS(key, todoItemArr);
				}
			});

			todoItemForm.input.value = '';

      todoItemForm.button.disabled = true;
		});
	}

	window.createTodoApp = createTodoApp;
})();
