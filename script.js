// Флаги и дефолтные значения
var IS_CLICKED = false
var CURRENT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
var DEFAULT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--default-color');
var FILL_MODE = false


// Изменение флага "кнопка мыши опущена"
document.addEventListener('mousedown', function() {
    IS_CLICKED = true;
})


document.addEventListener('mouseup', function() {
    IS_CLICKED = false;
})


// Заполняем поле таким количеством клеток, сколько предусмотрено в grid-е
let field = document.querySelector('.field')


for (let i = 0; i < 450; i+=1) {
    let cell = document.createElement('div')
    cell.classList.add('cell')
    // ID пригодится в качестве параметра точки отсчёта радиальной анимации заливки
    cell.setAttribute('id', `${i}`)
    field.appendChild(cell)
}


// Каждой ячейке в рабочей области добавляем обработчики событий
let cells = document.querySelectorAll('.cell')
cells.forEach(cell => {
    cell.addEventListener('mouseover', function() {
        // Клетка будет закрашиваться при наведении на неё курсора мыши, если до этого кнопка мыши была зажата
        if (IS_CLICKED) {
            anime({
                targets: cell,
                background: CURRENT_COLOR,
                duration: 200,
                easing: 'linear'
            })
        }
    })
   
    cell.addEventListener('mousedown', function() {
        // Если до этого была нажата кнопка "заливка", то значение флага меняется и условный оператор заходит в ветку с кодом заливки.
        if (FILL_MODE) {
            let cell_id = parseInt(cell.getAttribute('id'))
            FILL_MODE = !FILL_MODE
            anime({
                targets: '.cell',
                background: CURRENT_COLOR,
                easing: 'easeInOutQuad',
                duration: 500,
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
            })
        } else {
            // Если находимся не в режиме заливки, клетка просто закрасится
            anime({
                targets: cell,
                background: CURRENT_COLOR,
                duration: 500,
                easing: 'easeInOutQuad'
            })
        }
    })
})


// Выбор цвета
let color_cells = document.querySelectorAll('.color-cell')
color_cells.forEach(color_cell => {
    color_cell.addEventListener('click', function() {
        // Если вдруг был включен режим заливки, из него нужно выйти, если пользователь выбрал цвет.
        FILL_MODE = false
        // Значение цвета получаем непосредственно из значения свойства background у ячейки с цветом в палитре
        // И сохраняем в глобальную переменную, чтобы в любой момент можно было получить текущий цвет для других задач.
        CURRENT_COLOR = getComputedStyle(color_cell).backgroundColor;


        // Это интересный способ настроить передачу значения из JS в CSS. Теперь при наведении мыши на ячейку,
        // любая ячейка будет получать значение CSS-переменной с цветом как значение свойства background
        document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`
        document.querySelector('.selected').classList.remove('selected')
        color_cell.classList.add('selected')
    })
})


// Отдельный обработчик для ластика и заливки, потому что это не color-cell, а tool-cell.
document.querySelector('.eraser').addEventListener('click', function() {
    // В CSS-переменной сохранён код цвета по умолчанию, чтобы избежать дублирования значений в CSS и в JS.
    // В самом начале он подтягивается в DEFAULT_COLOR
    CURRENT_COLOR = DEFAULT_COLOR
    // По сути, стёрка - то же самое, что и рисование, просто цвет совпадает с цветом фона
    document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`


    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})


// Обработчик инструмента заливки.
document.querySelector('.fill-tool').addEventListener('click', function() {
    FILL_MODE = !FILL_MODE
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})
