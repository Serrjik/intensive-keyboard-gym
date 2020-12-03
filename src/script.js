// Средняя длина англоязычного слова.
const AVERAGE_LENGTH_OF_AN_ENGLISH_WORD = 5
// Средняя длина русскоязычного слова.
const AVERAGE_LENGTH_OF_AN_RUSSIAN_WORD = 7.2

// Поле для ввода символов.
const input = document.querySelector('input')
// Клавиши с символами на экранной клавиатуре.
const letters = Array.from(document.querySelectorAll('[data-letters]'))
// Специальные клавиши на экранной клавиатуре.
const specs = Array.from(document.querySelectorAll('[data-spec]'))
// Блок со строками, которые нужно отобразить и напечатать.
const textExample = document.querySelector('#textExample')
// Индикатор количества набранных символов в минуту.
const symbolsPerMinute = document.querySelector('#symbolsPerMinute')
// Индикатор "Слов в минуту:".
const wordsPerMinuteIndicator = document.querySelector('#wordsPerMinute')
// Индикатор "Реальных слов в минуту:".
const realWordsPerMinuteIndicator =
	document.querySelector('#realWordsPerMinuteIndicator')
// Индикатор количества ошибок.
const errorPercent = document.querySelector('#errorPercent')

// Функция возвращает объект с текстами для набора.
getTexts = async () => {
	const response = await fetch('./texts/texts.json')

	if (response.ok) {
		return await response.json()
	}

	else {
		return ''
	}
}

main = async () => {
	// Объект из файла с текстами.
	const data = await getTexts()

	// Ключи объекта с текстами.
	const keys = Object.keys(data)
	// Массив ключей уже выбранных текстов.
	const usedKeys = []

	// Текст для тренировки.
	let text = ''

	/*
		Добавляем тексты в текст для тренировки,
		пока не добавим все загруженные тексты из объекта с текстами.
	*/
	do {
		// Случайный ключ объекта с текстами (возьмем текст с этим ключом).
		const key = getRandomFrom(keys)

		if (!usedKeys.includes(key)) {
			usedKeys.push(key)

			// Выбранный массив со строками текста для набора.
			const textArray = data[key]
			// Длина массива со строками текста для набора.
			const textArrayLength = textArray.length

			// Пройти по выбранному массиву со строками текста для набора.
			for (let i = 0; i < textArrayLength; i++) {
				/*
					Если это НЕ последняя строка в массиве со строками текста
					для набора или выбран НЕ последний текст из набора текстов:
				*/
				if ( (i < textArrayLength - 1) ||
				(keys.length !== usedKeys.length)) {
					/*
						Добавить выбранную строку и перевод строки
						к тексту для тренировки.
					*/
					text += textArray[i] + '\r\n'
				}

				/*
					Если это последняя строка в массиве
					и обрабатывается последний текст из набора текстов:
				*/
				else {
					// Добавить выбранную строку к тексту для тренировки.
					text += textArray[i]
				}
			}
		}

	} while (keys.length !== usedKeys.length)

	// Партия тренировки.
	const party = createParty(text)

	init()

	function init () {
		// Повесить обработчик нажатия клавиши на поле для ввода символов.
		input.addEventListener('keydown', keydownHandler)

		// Повесить обработчик отжатия клавиши на поле для ввода символов.
		input.addEventListener('keyup', keyupHandler)

		// Обновить визуальную часть приложения.
		viewUpdate()
	}

	// Обработчик нажатия клавиши.
	function keydownHandler (event) {
		event.preventDefault()

		// Клавиша на экранной клавиатуре, соответствующая прожатой.
		const letter = letters.find(x => x.dataset.letters.includes(event.key))

		// Если на экранной клавиатуре есть клавиша, соответствующая прожатой:
		if (letter) {
			// Подсветить прожатую клавишу.
			letter.classList.add('pressed')
			// Обработать символ, соответствующий отжатой клавише.
			press(event.key)
			return
		}

		// Ключ нажатой клавиши в нижнем регистре.
		let key = event.key.toLowerCase()

		// Если нажали на пробел:
		if (key === ' ') {
			key = 'space'
			// Обработать пробел.
			press(' ')
		}

		// Если нажали Ввод:
		if (key === 'enter') {
			// Обработать спецсимвол "Ввод".
			press('\n')
		}

		// Специальные клавиши на экранной клавиатуре, соответствующие прожатой.
		const ownSpecs = specs.filter(x => x.dataset.spec === key)

		/*
			Если на экранной клавиатуре есть хотя бы 1 специальная клавиша,
			соответствующая прожатой:
		*/
		if (ownSpecs.length) {
			// Подсветить все специальные клавиши, соответствующие прожатой.
			ownSpecs.forEach(spec => spec.classList.add('pressed'))
			return
		}

		// Если была прожата клавиша НЕ с символом и НЕ специальная клавиша:
		console.warn('Неизвестный вид клавиши.', event)
	}

	// Обработчик отжатия клавиши.
	function keyupHandler (event) {
		event.preventDefault()

		// Клавиша на экранной клавиатуре, соответствующая отжатой.
		const letter = letters.find(x => x.dataset.letters.includes(event.key))

		// Если на экранной клавиатуре есть клавиша, соответствующая отжатой:
		if (letter) {
			// Убрать подсветку с отжатой клавиши.
			letter.classList.remove('pressed')
			return
		}

		// Ключ отжатой клавиши в нижнем регистре.
		let key = event.key.toLowerCase()

		// Если отжали пробел:
		if (key === ' ') {
			key = 'space'
		}

		// Специальные клавиши на экранной клавиатуре, соответствующие отжатой.
		const ownSpecs = specs.filter(x => x.dataset.spec === key)

		/*
			Если на экранной клавиатуре есть хотя бы 1 специальная клавиша,
			соответствующая отжатой:
		*/
		if (ownSpecs.length) {
			// Убрать подсветку со всех специальных клавиш, соответствующих отжатой.
			ownSpecs.forEach(spec => spec.classList.remove('pressed'))
			return
		}
	}

	// Функция создаёт и возвращает партию тренировки. Принимает текст.
	function createParty (text) {
		// Партия тренировки.
		const party = {
			// Текст для тренировки.
			text,
			// Строки, которые нужно отобразить и напечатать.
			strings: [],
			// Максимально допустимая длина строки.
			maxStringLength: 70,
			// Максимальное количество отображаемых под полем ввода строк.
			maxShowStrings: 3,
			// Индекс строки, которую нужно отобразить сейчас.
			currentStringIndex: 0,
			// Индекс символа в текущей строке, которую нужно напечатать сейчас.
			currentPressedIndex: 0,
			// Массив символов, в которых ошиблись.
			errors: [],
			// Флаг - началась ли партия тренировки?
			started: false,

			// Флаг - начили ли набор строки? Если true, счётчики активны.
			statisticFlag: false,
			// Время полного набора всего текста (всех строк).
			timerCounter: 0,
			// Момент начала набора текущей строки.
			startTimer: 0,
			// Количество символов в минуту.
			// letterPerMinute: 0,
			// Процент ошибок.
			// errorPercent: 0,
			// Количество ошибок в текущей строке.
			errorCounter: 0,
			// Количество напечатанных символов в текущей строке
			commonCounter: 0,
		}

		/*
			Заменим в тексте все переносы строки на переносы строки и пробел, чтобы
			слова, разделенные переносом строки, тоже считались двумя разными
			словами.
		*/
		party.text = party.text.replace(/\r\n/g, '\n ')
		// Разобьём текст на слова по разделителю "пробел".
		const words = party.text.split(' ')

		// Строка для отображения.
		let string = []
		// Пройти по всем словам текста.
		for (const word of words) {
			// Формируем строку из слов.
			/*
				Длина строки, которую можно создать после добавления текущего слова
				с учётом наличия или отсутствия пробела после последнего слова
				(если есть символ переноса строки).
			*/
			const newStringLength =
				[...string, word].join(' ').length + !word.includes('\n')

			/*
				Если длина строки, которую можно создать после добавления текущего
				слова оказывается больше чем максимально допустимая длина строки
				или добавленное слово включает в себя перенос строки:
			*/
			if (newStringLength > party.maxStringLength) {
				/*
					Добавить строку в массив строк, которые нужно отобразить и
					напечатать, добавив пробел в конце.
				*/
				party.strings.push(string.join(' ') + ' ')
				string = []
			}

			// Добавить текущее слово в следующую строку.
			string.push(word)

			// Если слово содержит перенос строки:
			if (word.includes('\n')) {
				/*
					Добавить строку в массив строк, которые нужно отобразить и
					напечатать, не добавляя пробела в конце.
				*/
				party.strings.push(string.join(' '))
				string = []
			}
		}

		/*
			Если после прохода по всем словам строка НЕ пустая:
		*/
		if (string.length) {
			/*
				Добавить строку в массив строк,
				которые нужно отобразить и напечатать.
			*/
			party.strings.push(string.join(' '))
		}

		return party
	}

	// Функция принимает и обрабатывает набранный символ.
	function press (letter) {
		/*
			После ввода первого символа в поле ввода
			поднять флаг начала партии тренировки!
		*/
		party.started = true

		// Если флаг "Происходит ли печать" опущен:
		if (!party.statisticFlag) {
			// Поднять флаг "Происходит ли печать"!
			party.statisticFlag = true
			// Запомнить момент начала набора текущей строки.
			party.startTimer = Date.now()
		}

		/*
			Соответствует ли символ, который пытаются напечатать, символу,
			который нужно напечатать?
		*/
		// Строка, которую нужно набрать в данный момент.
		const string = party.strings[party.currentStringIndex]

		// Символ, который нужно напечатать.
		const mustLetter = string[party.currentPressedIndex]

		// Если эти символы совпадают:
		if (letter === mustLetter) {
			// Указать следующий символ в текущей строке, который нужно напечатать.
			party.currentPressedIndex++

			// Если индекс следующего символа превышает длину текущей строки:
			if (string.length <= party.currentPressedIndex) {
				/*
					Установить индекс следующего символа в следующей строке,
					который нужно напечатать.
				*/
				party.currentPressedIndex = 0
				/*
					Увеличить индекс строки, которую нужно отобразить сейчас
					(взять следующую строку).
				*/
				party.currentStringIndex++

				/*
					Опустить флаг "Происходит ли печать",
					чтобы можно было делать передышки между строками.
				*/
				party.statisticFlag = false

				// Запомнить время полного набора текущей строки.
				party.timerCounter = Date.now() - party.startTimer
			}
		}

		/*
			Если эти символы НЕ совпадают и символ, который попытались напечатать,
			ещё НЕ входит в массив символов, в которых ошиблись:
			*/
			else if (!party.errors.includes(mustLetter)) {
				// Объявить символ, который попытались напечатать, ошибочным.
				party.errors.push(mustLetter)
				// Если в массиве символов, в которых ошиблись, более 3 символов:
				if (party.errors.length > 3) {
					// Удаляем символ, в котором ошиблись ранее других.
					party.errors.shift()
				}
				// Увеличить счётчик количества ошибок в текущем тексте.
				party.errorCounter++
			}

			// Увеличить счётчик напечатанных символов в текущей строке тренировки.
			party.commonCounter++

		// Обновить визуальную часть приложения.
		viewUpdate()
	}

	/*
		Функция обновляет визуальную часть приложения. Вставляет отображаемые под
		полем ввода строки, которые нужно набрать.
	*/
	function viewUpdate () {
		// Отобразить под полем ввода строки, которые нужно отобразить и напечатать.

		// Строка, которую нужно набрать в данный момент.
		const string = party.strings[party.currentStringIndex]

		// TODO - здесь изменить или удалить код.
		// Если строки для ввода закончились:
		if (!string) {
			console.log('Текст текущей партии набран!')
			return
		}

		// Количество слов в строке, которую нужно набрать в данный момент.
		const wordsPerLine = string.trim().split(' ').length

		// Строки, которые нужно отобразить и напечатать.
		const showedStrings = party.strings.slice(
			party.currentStringIndex,
			party.currentStringIndex + party.maxShowStrings
		)

		// Контейнер для строк, которые нужно отобразить и напечатать.
		const div = document.createElement('div')

		// Первая строка из тех, которые нужно отобразить и напечатать.
		const firstLine = document.createElement('div')
		firstLine.classList.add('line')
		div.append(firstLine)

		// Часть текста, который уже успели напечатать.
		const done = document.createElement('span')
		done.classList.add('done')
		/*
			Заменить в части текста, который уже успели напечатать,
			пробелы на отображаемые пробелы.
		*/
		done.textContent =
			string.slice(0, party.currentPressedIndex).replace(/\s/g, '␣')
		/*
			Добавить в первую строку часть текста, который уже успели напечатать
			и оставшуюся часть строки (которую нужно напечатать).
		*/
		firstLine.append(
			done,
			...string
				.slice(party.currentPressedIndex)
				.split('')
				.map(letter => {
					// Если текущий символ - пробел:
					if (letter === ' ') {
						// Заменить пробел на отображаемый символ пробела.
						return '␣'
					}

					// Если текущий символ - конец строки:
					if (letter === '\n') {
						/*
							Заменить конец строки на отображаемый символ конца
							параграфа.
						*/
						return '¶'
					}

					// Если ранее ошиблись в наборе символа:
					if (party.errors.includes(letter)) {
						// Вернём этот символ выделенным.
						const errorSpan = document.createElement('span')
						// Выделить этот символ.
						errorSpan.classList.add('hint')
						errorSpan.textContent = letter
						return errorSpan
					}

					return letter
				})
		)

		/*
			Пройти по всем строкам, которые нужно отобразить и напечатать,
			кроме начальной.
		*/
		for (let i = 1; i < showedStrings.length; i++) {
			// Текущая строка из тех, которые нужно отобразить и напечатать.
			const line = document.createElement('div')
			line.classList.add('line')
			div.append(line)

			/*
				Добавить в текущую строку текст, который нужно напечатать.
			*/
			line.append(
				...showedStrings[i]
					.split('')
					.map(letter => {
						// Если текущий символ - пробел:
						if (letter === ' ') {
							// Заменить пробел на отображаемый символ пробела.
							return '␣'
						}

						// Если текущий символ - конец строки:
						if (letter === '\n') {
							/*
								Заменить конец строки на отображаемый символ конца
								параграфа.
							*/
							return '¶'
						}

						// Если ранее ошиблись в наборе символа:
						if (party.errors.includes(letter)) {
							// Вернём этот символ выделенным.
							const errorSpan = document.createElement('span')
							// Выделить этот символ.
							errorSpan.classList.add('hint')
							errorSpan.textContent = letter
							return errorSpan
						}

						return letter
					})
			)
		}

		// Очистить блок со строками, которые нужно отобразить и напечатать.
		textExample.innerHTML = ''
		/*
			Вставить в блок со строками, которые нужно отобразить и напечатать,
			контейнер с этими строками.
		*/
		textExample.append(div)

		// Вставить в поле для ввода символов часть строки, которую уже напечатали.
		input.value = string.slice(0, party.currentPressedIndex)

		// Если ещё не начали набор строки и партия тренировки уже стартовала:
		if (!party.statisticFlag && party.started) {
			// Обновить статистику.
			// Скорость набора, измеряемая в знаках в минуту.
			const charactersPerMinute =
				Math.round(60000 * party.commonCounter / party.timerCounter)
			// Индикатор количества набранных символов в минуту.
			symbolsPerMinute.textContent = charactersPerMinute

			// Скорость печати в "словах в минуту".
			const wordsPerMinute =
				Math.round(charactersPerMinute / AVERAGE_LENGTH_OF_AN_RUSSIAN_WORD)
			// Записать значение в индикатор "Слов в минуту:".
			wordsPerMinuteIndicator.textContent = wordsPerMinute

			// Скорость печати в "реальных словах в минуту".
			const realWordsPerMinute =
				Math.round(60000 * wordsPerLine / party.timerCounter)
			// Записать значение в индикатор "Реальных слов в минуту:".
			realWordsPerMinuteIndicator.textContent = realWordsPerMinute

			// Индикатор количества ошибок.
			errorPercent.textContent = Math.floor(
				(10000 * party.errorCounter) / party.commonCounter
				) / 100 + '%'

			// Обнулить количество напечатанных символов в текущей строке/
			party.commonCounter = 0
			// Обнулить количество ошибок в текущей строке.
			party.errorCounter = 0
		}
	}
}

main()

// Функция возвращает случайное число от минимального до максимального.
function getRandom (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

// Функция принимает массив и возвращает случайный элемент этого массива.
function getRandomFrom (array) {
	return array[getRandom(0, array.length - 1)]
}