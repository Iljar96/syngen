window.onload = function () {
	document.querySelectorAll('._hidden')
		.forEach(item => item.classList.remove('_hidden'));


	//Placeholder
	const placeholderParents = document.querySelectorAll('._placeholder-parent');
	if (placeholderParents.length > 0) {
		placeholderParents.forEach(placeholderParent => {
			const input = placeholderParent.querySelector('.input');
			const placeholder = placeholderParent.querySelector('._placeholder');
			input.addEventListener('focus', e => {
				placeholder.classList.add('_hidden');
			})
			input.addEventListener('blur', e => {
				if (e.target && e.target.value.trim() === '')
					placeholder.classList.remove('_hidden');
			})
		})
	}

	//
	// document.querySelectorAll('.product-body__navitem').forEach(el => {
	// 	el.style.maxWidth = `${el.offsetWidth}px`;
	// })
	//Tabs nav line
	const navLine = document.querySelector('.product-body__line'),
		navItem = document.querySelectorAll('.product-body__navitem');

	if (navLine) {
		navLine.style.width = `${navItem[0].offsetWidth}px`;

		navItem.forEach(el => {
			el.addEventListener('mouseenter', (e) => {
				setTimeout(function () {
					navLine.style.width = `${e.target.offsetWidth}px`;
					navLine.style.left = `${e.target.offsetLeft}px`;
				}, 10);

			});

			el.addEventListener('mouseleave', () => {
				let navItemActive = document.querySelector('.product-body__navitem._active');

				navLine.style.width = `${navItemActive.offsetWidth}px`;
				navLine.style.left = `${navItemActive.offsetLeft}px`;
			});
		});
	}

	//QUANTITY
	const quantityButtons = document.querySelectorAll('.quantity__button');
	if (quantityButtons.length > 0) {
		for (let index = 0; index < quantityButtons.length; index++) {
			const quantityButton = quantityButtons[index];
			quantityButton.addEventListener("click", function (e) {
				let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
				if (quantityButton.classList.contains('quantity__button_plus')) {
					value++;
				} else {
					value = value - 1;
					if (value < 1) {
						value = 1
					}
				}
				quantityButton.closest('.quantity').querySelector('input').value = value;
			});
		}

		const cartTotalSumContainer = document.querySelector('.cart-block__total .amount ._amount-digits');
		const table = document.querySelector('.cart-block table');

		let singleProductPrice,
			val,
			sumContainer,
			sum = 0,
			totalSum = 0;


		function getCartVariable(el) {
			let parentRow = el.closest('tr');
			singleProductPrice = +parentRow.querySelector('.product-price .amount').textContent.replace(/\D/g, '');
			val = +parentRow.querySelector('.quantity__input input').value;
			sumContainer = parentRow.querySelector('.product-subtotal .amount ._amount-digits');
			sum = singleProductPrice * val;
		}

		function changeCartSum() {
			sumContainer.innerHTML = sum;
		}

		function changeCartTotalSum() {
			totalSum = 0;
			table.querySelectorAll('.product-subtotal .amount').forEach(el => {
				totalSum += +el.textContent.replace(/\D/g, '');
			});
			cartTotalSumContainer.innerHTML = totalSum;
		}

		changeCartTotalSum();

		if (document.querySelector('.cart-block')) {
			const quantities = table.querySelectorAll('.quantity');
			for (let j = 0; j < quantities.length; j++) {
				const quantity = quantities[j];
				quantity.querySelector('.quantity__button_plus').addEventListener('click', (e) => {
					getCartVariable(e.target)
					changeCartSum();
					changeCartTotalSum();
				});
				quantity.querySelector('.quantity__button_minus').addEventListener('click', (e) => {
					getCartVariable(e.target)
					changeCartSum();
					changeCartTotalSum();
				});
				quantity.querySelector('.quantity__input input').addEventListener('change', (e) => {
					getCartVariable(e.target)
					changeCartSum();
					changeCartTotalSum();
				});
			}
		}
	}

	const sidebarBodyBlock = document.querySelector('.sidebar__body'),
		sidebarTopBtn = document.querySelector('.sidebar__mob-top');


	// Вот тут функция оптимизации резайса (троттлинг)
	function throttleFn() {
		let throttle = function (type, name, obj) {
			obj = obj || window;
			let running = false;
			let func = function () {
				if (running) { return; }
				running = true;
				requestAnimationFrame(function () {
					obj.dispatchEvent(new CustomEvent(name));
					running = false;
				});
			};
			obj.addEventListener(type, func);
		};

		/* init - you can init any event */
		throttle("resize", "optimizedResize");
	}

	// Функция, чтобы было удобно вызвать
	throttleFn();

	// Событие, сюда ваш код
	window.addEventListener("optimizedResize", function () {
		resizeWindow(); // вызов той самой функции
	});

	function resizeWindow() {
		if (sidebarTopBtn) {
			if (window.innerWidth < 992) {
				sidebarBodyBlock.hidden = true;
				sidebarTopBtn.addEventListener('click', (e) => {
					_slideToggle(sidebarBodyBlock, 500);
				});
			}
			else {
				sidebarBodyBlock.hidden = false;
			}
		}
	}

	// Вызов функции, чтобы она срабатывала при загрузке
	resizeWindow();




	document.addEventListener("click", documentActions);
	// Actions (делегирование события click)
	function documentActions(e) {
		const targetElement = e.target;
		//Show more button
		if (targetElement.classList.contains('popular__more')) {
			targetElement.classList.add('_hide');
		}

		//Sidebar mob-top button
		// if (targetElement.classList.contains('sidebar__mob-top')) {
		// 	targetElement.querySelector('.menu-burger').classList.toggle('_active');
		// }

		if (window.innerWidth > 767 && isMobile.any()) {
			if (targetElement.classList.contains('menu-item-has-children')) {
				e.preventDefault();
				targetElement.classList.toggle('_hover');

				if (document.querySelectorAll('.menu-item-has-children._hover').length > 1) {
					_removeClasses(document.querySelectorAll('.menu-item-has-children._hover'), "_hover");
				}
			}
			if ((!targetElement.classList.contains('menu-item-has-children'))) {
				_removeClasses(document.querySelectorAll('.menu-item-has-children._hover'), "_hover");
			}
		}
	}

	//Upload button
	const forms = document.querySelectorAll('form');
	const inputFile = document.querySelectorAll('.upload-file__input');

	/////////// Кнопка «Прикрепить файл» /////////// 
	inputFile.forEach(function (el) {
		let textSelector = document.querySelector('.upload-file__text');
		let fileList;

		// Событие выбора файла(ов) 
		el.addEventListener('change', function (e) {

			// создаём массив файлов 
			fileList = [];
			for (let i = 0; i < el.files.length; i++) {
				fileList.push(el.files[i]);
			}

			// вызов функции для каждого файла 
			fileList.forEach(file => {
				uploadFile(file);
			});
		});

		// Проверяем размер файлов и выводим название 
		const uploadFile = (file) => {

			// файла <5 Мб 
			if (file.size > 1 * 1024 * 1024) {
				alert('Файл должен быть не более 1 МБ.');
				return;
			}

			// Показ загружаемых файлов 
			if (file && file.length > 1) {
				if (file.length <= 4) {
					textSelector.textContent = `Выбрано ${file.length} файла`;
				}
				if (file.length > 4) {
					textSelector.textContent = `Выбрано ${file.length} файлов`;
				}
			} else {
				textSelector.textContent = file.name;
			}
		}

	});

	// Отправка формы на сервер 
	// const postData = async (url, fData) => { // имеет асинхронные операции 

	// 	// начало отправки 
	// 	// здесь можно оповестить пользователя о начале отправки 

	// 	// ждём ответ, только тогда наш код пойдёт дальше 
	// 	let fetchResponse = await fetch(url, {
	// 		method: 'POST',
	// 		body: fData
	// 	});

	// 	// ждём окончания операции 
	// 	return await fetchResponse.text();
	// };

	// if (forms) {
	// 	forms.forEach(el => {
	// 		el.addEventListener('submit', function (e) {
	// 			e.preventDefault();

	// 			// создание объекта FormData 
	// 			let fData = new FormData();

	// 			// Добавление всех input, кроме type="file" 
	// 			el.querySelectorAll('input:not([type="file"])').forEach(input => {
	// 				fData.append(input.name, input.value);
	// 			});

	// 			// Добавление файлов input type file 
	// 			let file = el.querySelector('.upload-file__input');
	// 			for (let i = 0; i < (file.files.length); i++) {
	// 				fData.append('files[]', file.files[i]); // добавляем файлы в объект FormData() 
	// 			}

	// 			// Отправка на сервер 
	// 			postData('./mail.php', fData)
	// 				.then(fetchResponse => {
	// 					console.log('Данные успешно отправлены!');
	// 					console.log(fetchResponse);
	// 				})
	// 				.catch(function (error) {
	// 					console.log('Ошибка!');
	// 					console.log(error);
	// 				});
	// 		});
	// 	});
	// };
}
