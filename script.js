'use strict'
let row = 16 // количество рядов в таблице
let column = 16 // количество колонок в таблице
let numberBomb = 1 // число бомб
let gameOver // вынесенная функция для того чтобы можно было из внешнего скрипта объявлять gameOver
let set // вынесенный сет необходимый для проверки отсутсвия победы во внешнем скрипте
let counterBack // вынесенный счетчик бомб необходимый для проверки отсутсвия победы во внешнем скрипте
let counterForWinner = 1 // счетчик результатов победных игр
let result // содержит в себе ответ пользователя на вопрос о переходе к следующему уровню
let checkGameWon = false // есди игра выиграна выставляется этот флаг для беспрепятственного прохода к следующим уровням
let timerId // таймер для остановки счетчика
let stopTimer = false // для остановки таймера для паузы
let gameRun = false // проверка на начало игры
let audio // добавление аудио сопровождения
let idLvl = [] // определитель уровня сложности для подгрузки результатов
let num = 0
let trs
function superMegaMainFunc(row,column,numberBomb,container) {
  set = new Set() // сет для бомб
  let counterForBomb = 0 // счетчик бомб используемый при заполнении таблицы бомбами
  let funcClick // для снятия обработчика клика с ячейки из внешней функции
  let funcContextMenu //для снятия обработчика правой кнопкой мыши с ячейки из внешней функции
  counterBack = 0

  function createTable(row,column,container) {
    let table = document.createElement('table') // создаем таблицу
    for(let i = 0; i < row; i++) {
      let tr = document.createElement('tr')
      for(let j = 0; j < column; j++) {
        let td = document.createElement('td')
        tr.append(td)
      }
      table.append(tr)
    }
    container.append(table)
  }
  createTable(row, column ,container)

  let tds = document.querySelectorAll('td')
  trs = document.querySelectorAll('tr')

  function random(min, max) {
  let rand =  (((min - 0.5) + Math.random() * (max - min + 0.5)).toFixed()) // вспомогательная функция для рандомного значения
  return Math.round(rand)
  }

  function addBomb(num) { // передаем количество бомб
    for(let td of tds) {

      if(counterForBomb >= num) { // если необходимое количество бомб прекращаем работу цикла
        return
      }

      let probability = random(1,100)  // возвращает псевдо случайное число от 1 до 100
      if(probability < 5) { // вероятность появления бомбы в ячейке 10%
        if(td.lastElementChild) continue // если уже есть бомба пропускаем такую ячейку
        td.innerHTML = '<span>10</span>' // добавляем бомбу
        counterForBomb++ // увеличиваем счетчик
      } 
    }
    if(counterForBomb < num) { // если бомб меньше чем нужно запускаем снова цикл
      addBomb(num)
    }
  }
  addBomb(numberBomb)

  function addPictureBomb() {
  for(let td of tds) {
    if(td.textContent == '10') {
      let img = document.createElement('img')
      img.src = 'bombImg\\pngwing.com.png'
      td.prepend(img)
    }
  }
}
addPictureBomb()

  function addTip() {
      for(let i = 0; i < trs.length; i++) {
        for(let j = 0; j < trs.length; j++) {
          let counter = 0 // если рядом найдена бомба увеличиваем счетчик
          if(trs[i].children[j].hasChildNodes()) continue // если элемент имеет детей значит это бомба(имеет span) пропускаем этот элемент


          if(trs[i].children[j - 1]) { // обработка предыдущего элемента
            if(trs[i].children[j - 1].textContent == '10') {
              counter++
            }
          } 

          if(trs[i].children[j + 1]) { // обработка следующего элемента
            if(trs[i].children[j + 1].textContent == '10') {
              counter++
            }
          } 

          if(trs[i - 1]) { // обработка верхнего элемента
            if(trs[i - 1].children[j].textContent == '10') {
              counter++
            }
          } 

          if(trs[i + 1]) { // обработка нижнего элемента
            if(trs[i + 1].children[j].textContent == '10') {
              counter++
            }
          } 

          if(trs[i - 1]) { // обработка верхнего крайнего левого элемента
            if(trs[i - 1].children[j - 1]) {
              if(trs[i - 1].children[j - 1].textContent == '10') {
              counter++
              }
            }
          } 

          if(trs[i - 1]) { // обработка верхнего крайнего правого элемента
            if(trs[i - 1].children[j + 1]) {
              if(trs[i - 1].children[j + 1].textContent == '10') {
              counter++
              }
            }
          } 

          if(trs[i + 1]) { // обработка нижнего крайнего левого элемента
            if(trs[i + 1].children[j - 1]) {
              if(trs[i + 1].children[j - 1].textContent == '10') {
              counter++
              }
            }
          } 

          if(trs[i + 1]) { // обработка нижнего крайнего правого элемента
            if(trs[i + 1].children[j + 1]) {
              if(trs[i + 1].children[j + 1].textContent == '10') {
              counter++
              }
            }
          } 


          trs[i].children[j].textContent = counter
        }
      }
    }
  addTip()

  function createHiddenElement() {
    for(let td of tds) { // добавляем каждой ячейке скрывающий элемент
    let hidden = document.createElement('div')
    hidden.classList.add('hidden')
    td.append(hidden)
    }
  }
  createHiddenElement()
  
  gameOver = function () {
    removeAudioFight()
    result = confirm('Game over! Do you want to start a new game?') 
    gameRun = false
    if(result) {
      alert('game restarted') // доработать перезапуск игры 
      clearInterval(timerId)
      // // конструкция для перезапуска игры
      let innerRow = row
      let innerColumn = column
      let innerNumberBomb = numberBomb
      seconds.textContent = '00'
      minutes.textContent = '00'
      container.remove()
      let div = document.createElement('div')
      body.prepend(div)
      div.classList.add('container')
      div.id = 'container'
      superMegaMainFunc(innerRow,innerColumn,innerNumberBomb,div)
    } 
    else {
      for(let td of tds) { // если подорвался то окрываются все оставшиеся мины
      
      if(td.children.length == 3) {
        if(td.lastElementChild.classList.contains('bomb')) continue // если мина разгадана правильно то она остается под флагом и не открывается
        td.lastElementChild.remove()
      }
      if(td.children.length == 1) { // если флаг был выбран неправильно
        if(td.lastElementChild.classList.contains('bomb')) {
          td.lastElementChild.remove()
          let bomb = document.createElement('img')
          bomb.src = 'bombImg\\incorrectBomb.png'
          td.prepend(bomb)
         
        }
      }
    }
    
    document.removeEventListener('click', funcClick) // снимаем все обработчики и останавливаем таймер
    document.removeEventListener('contextmenu', funcContextMenu)
    clearInterval(timerId)
    }
  }
  
  
  function gameWinner(event1,functions1,event2,functions2) {
    removeAudioFight()
    if(trs.length == 9) {
      idLvl = 'easy'
      localStorageUtil(minutes.textContent, seconds.textContent,idLvl)
    }
    if(trs.length == 16) {
      idLvl = 'medium'
      localStorageUtil(minutes.textContent, seconds.textContent,idLvl)
    }
    if(trs.length == 25) {
      idLvl = 'hard'
      localStorageUtil(minutes.textContent, seconds.textContent,idLvl)
    }
    alert('Game WON!!! I really congratulate you') // снимаем все обработчики и останавливаем таймер
    gameRun = false
    counterForWinner++ // пушим время в массив для таблицы рекордов

    document.removeEventListener(event1, functions1)
    document.removeEventListener(event2, functions2)


    clearInterval(timerId)
    checkGameWon = true
  }
  
  function addListenerForRemoveElementAndOpenEmptyElement() {
    document.addEventListener('click', funcClick = function (event) {
    let target = event.target.closest('td')
    if(!target) return
    if(!container.contains(target)) return
    if(target.lastElementChild) {
      if(target.lastElementChild.classList.contains('bomb')) return // если ячейка помечена как бомба клик не реагирует
      target.lastElementChild.remove() // по клику на ячейку открывается скрывающий элемент
    }
      if(target.textContent == '0') {
        let counterRow = 0
        let counterColumn = 0

        for(let tr of trs) { // узнаем номер ряда выбранной ячейки
          counterRow++
          if(target.parentNode == tr) {
            break // прекращаем цикл когда цель найдена
          }
        }
        for(let td of tds) { // узнаем номер столбца выбранной ячейки
          counterColumn++
          if(target == td) {
            counterColumn = counterColumn - (counterRow - 1) * column
            break // прекращаем цикл когда цель найдена
          }
        }

          function test(purposeRow,purposeColumn) {
            
            if(trs[purposeRow]) { // обрабатываем наличие этого ряда
            if(trs[purposeRow].children[purposeColumn]){ // есть ли вообще такая ячейка в этом ряду
              if(trs[purposeRow].children[purposeColumn].lastElementChild) { // есть ли дочерний элемент(для проверки на наличие класса у этой ячейки)
                if(!(trs[purposeRow].children[purposeColumn].lastElementChild.classList.contains('bomb'))) { // если нет класса "бомба" продолжаем
                  trs[purposeRow].children[purposeColumn].lastElementChild.remove() // обработка нижнего правого элемента

                  if(trs[purposeRow].children[purposeColumn].textContent == '0') {
                    let newCounterRow = purposeRow + 1
                    let newCounterColumn = purposeColumn + 1
                    test(newCounterRow,newCounterColumn)  // обработка нижнего правого элемента для полного открытия свободных ячеек
                  }
                }
              }
            }

            if(trs[purposeRow].children[purposeColumn - 1]) { // обработка нижнего элемента
              if(trs[purposeRow].children[purposeColumn - 1].lastElementChild) {
                if((!trs[purposeRow].children[purposeColumn - 1].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow].children[purposeColumn - 1].lastElementChild.remove()

                  if(trs[purposeRow].children[purposeColumn - 1].textContent == '0') {
                    let newCounterRow = purposeRow + 1
                    let newCounterColumn = purposeColumn
                    test(newCounterRow,newCounterColumn) // обработка нижнего элемента
                  }
                }
              }
            }

            if(trs[purposeRow].children[purposeColumn - 2]) { // обработка нижнего левого элемента
              if(trs[purposeRow].children[purposeColumn - 2].lastElementChild) {
                if(!(trs[purposeRow].children[purposeColumn - 2].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow].children[purposeColumn - 2].lastElementChild.remove()

                  if(trs[purposeRow].children[purposeColumn - 2].textContent == '0') {
                    let newCounterRow = purposeRow + 1
                    let newCounterColumn = purposeColumn - 1
                    test(newCounterRow,newCounterColumn) // обработка нижнего левого элемента
                  }
                }
              }
            }
          }
          

          if(trs[purposeRow - 1]) {
            if(trs[purposeRow - 1].children[purposeColumn - 2]) { // обработка левого элемента
              if(trs[purposeRow - 1].children[purposeColumn - 2].lastElementChild) {
                if(!(trs[purposeRow - 1].children[purposeColumn - 2].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow - 1].children[purposeColumn - 2].lastElementChild.remove()

                  if(trs[purposeRow - 1].children[purposeColumn - 2].textContent == '0') {
                    let newCounterRow = purposeRow
                    let newCounterColumn = purposeColumn - 1
                    test(newCounterRow,newCounterColumn) // обработка левого элемента
                  }
                }
              }
            }
          

            if(trs[purposeRow - 1].children[purposeColumn]) { // обработка правого элемента
              if(trs[purposeRow - 1].children[purposeColumn].lastElementChild) {
                if(!(trs[purposeRow - 1].children[purposeColumn].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow - 1].children[purposeColumn].lastElementChild.remove()

                  if(trs[purposeRow - 1].children[purposeColumn].textContent == '0') {
                    let newCounterRow = purposeRow
                    let newCounterColumn = purposeColumn + 1
                    test(newCounterRow,newCounterColumn) // обработка правого элемента
                  }
                }
              }
            }
          }
          
          
          if(trs[purposeRow - 2]) {
            if(trs[purposeRow - 2].children[purposeColumn - 2]) { // обработка верхнего левого элемента
              if(trs[purposeRow - 2].children[purposeColumn - 2].lastElementChild) {
                if(!(trs[purposeRow - 2].children[purposeColumn - 2].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow - 2].children[purposeColumn - 2].lastElementChild.remove()

                  if(trs[purposeRow - 2].children[purposeColumn - 2].textContent == '0') {
                    let newCounterRow = purposeRow - 1
                    let newCounterColumn = purposeColumn - 1
                    test(newCounterRow,newCounterColumn) // обработка верхнего левого элемента
                  }
                }
              }
            }
        
          
            if(trs[purposeRow - 2].children[purposeColumn - 1]) { // обработка верхнего элемента
              if(trs[purposeRow - 2].children[purposeColumn - 1].lastElementChild) {
                if(!(trs[purposeRow - 2].children[purposeColumn - 1].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow - 2].children[purposeColumn - 1].lastElementChild.remove()

                  if(trs[purposeRow - 2].children[purposeColumn - 1].textContent == '0') {
                    let newCounterRow = purposeRow - 1
                    let newCounterColumn = purposeColumn
                    test(newCounterRow,newCounterColumn) // обработка верхнего элемента
                  }
                }
              }
            }

            if(trs[purposeRow - 2].children[purposeColumn]) { // обработка верхнего правого элемента
              if(trs[purposeRow - 2].children[purposeColumn].lastElementChild) {
                if(!(trs[purposeRow - 2].children[purposeColumn].lastElementChild.classList.contains('bomb'))) {
                  trs[purposeRow - 2].children[purposeColumn].lastElementChild.remove()

                  if(trs[purposeRow - 2].children[purposeColumn].textContent == '0') {
                    let newCounterRow = purposeRow - 1
                    let newCounterColumn = purposeColumn + 1
                    test(newCounterRow,newCounterColumn) // обработка верхнего правого элемента
                  }
                }
              }
            }
          }
        }

        test(counterRow,counterColumn)
      }
    
      if(target.textContent == '10') { // если попали на бомбу то подрыв
        target.children[0].remove()
        let bomb = document.createElement('img')
        bomb.src = 'bombImg\\kissBomb.png'
        target.append(bomb)
        gameOver()
      }
    })
  }
  addListenerForRemoveElementAndOpenEmptyElement()
  
  function addCounter() {
    document.addEventListener('click', function func3(event) { // по клику на ячейку запускается счетчик
    let target = event.target.closest('td')
    if(!target) return
    if(!container.contains(target)) return
    gameRun = true
    addAudioFight()
    let counterForSeconds = 0
    let counterForMinutes = 0

     timerId =  setInterval(() => {
      if(stopTimer) return
      counterForSeconds++
      if(counterForSeconds < 60) {

        if(counterForSeconds < 10) {
          counterForSeconds = '0' + +counterForSeconds
        }
        seconds.textContent = counterForSeconds
      } else {
        counterForSeconds = 0
        counterForMinutes++

        if(counterForMinutes < 60) {
          minutes.textContent = counterForMinutes
          if(counterForMinutes < 10) {
          minutes.textContent = '0' + +counterForMinutes
          }
        }
      }
    },1000)

    this.removeEventListener('click', func3, true)

    },true)
  }
  addCounter()
  
  function addListenerForContextMenu() {
    document.addEventListener('contextmenu',funcContextMenu = function (event) {
    let target = event.target.closest('td')
    if(!target) return
    if(!container.contains(target)) return

    if(target.lastElementChild) {
      if(target.lastElementChild.classList.contains('bomb')) { // обратный счетчик для бомб
        target.lastElementChild.classList.remove('bomb')
        counterBack--
      } else {
        target.lastElementChild.classList.add('bomb')
        counterBack++
      }
    }
      

    event.preventDefault() // убрать всплытие стандартного контекстного меню
    if(target.textContent == '10') {  // если мина была выбрана неправильно можно отменить действие и поменять флаги только если есть запас флагов
      if(target.lastElementChild.classList.contains('bomb')) {
        set.delete(target)
      } else{
        set.add(target)
      }
    }

    spanForCounterback.textContent = counterBack

    if(set.size == 0 & counterBack == numberBomb) { // если нет бомб в сете и число флагов == числу бомб - победа
      gameWinner('click', funcClick,'contextmenu', funcContextMenu)
    }
  
  })
  } 
  addListenerForContextMenu()
  
  function addBombToSet() {
    for(let td of tds) { // если содержится бомба в ячейке тогда эта ячейка добавляется в сет
    if(td.textContent == '10') {
      set.add(td)
    }
  }


  spanForCounterback.textContent = counterBack // добавление счетчика бомб в форму
  spanForNumberBomb.textContent = numberBomb // добавление изначального количества бомб в форму
  }
  addBombToSet()
  
  function addColorForNumber() {
    let arr = ['rgb(187, 180, 180)','blue','green','grown','red','aqua','blueviolet', 'coral', 'darkorange']
    for(let td of tds) {
      for(let i = 0; i < arr.length; i++) {
        if(td.textContent == `${i}`) {
          td.style.color = arr[i]
        }
      }
    }
  }
  addColorForNumber()
}

superMegaMainFunc(row,column,numberBomb,container)

addRestart()

function addRadioButtons() {

radio1.addEventListener('click', function() {
  records.lastElementChild.innerHTML = ''
  counterForWinner = 1
  idLvl = 'easy'
  addPreviosRecords(idLvl)
  if(gameRun) {
    
    let result
    if(!checkGameWon) {
      result = confirm('if you will change the level game is over. Do you want to do it?')
    }  
    if(result || checkGameWon) {
      helpForRadioButtons(9,9,1)

    } else {
      this.checked = false 
    }
  } else {
    helpForRadioButtons(9,9,1)

  }
 
})
radio2.addEventListener('click', function() {
  records.lastElementChild.innerHTML = ''
  counterForWinner = 1
  idLvl = 'medium'
  addPreviosRecords(idLvl)
  if(gameRun) {
    let result
    if(!checkGameWon) { // проверка на наличие победы в прошлой игре
      result = confirm('if you will change the level game is over. Do you want to do it?')
    }  
    if(result || checkGameWon) {
      helpForRadioButtons(16,16,4)
    }
    else {
      this.checked = false
    }
  
  }  else {
      helpForRadioButtons(16,16,4)
    }
})
radio3.addEventListener('click', function() {
  records.lastElementChild.innerHTML = ''
  counterForWinner = 1
  idLvl = 'hard'
  addPreviosRecords(idLvl)
  if(gameRun) {
    let result
    if(!checkGameWon) {
      result = confirm('if you will change the level game is over. Do you want to do it?')
    }  
    if(result || checkGameWon) {
      helpForRadioButtons(25,25,10)
    }  else {
        this.checked = false
    }
  }
  else {
    helpForRadioButtons(25,25,10)
  }
    
})
}

function helpForRadioButtons (numRow,numColumn,numNumberBomb) {
  if(gameRun) {
    if(!(set.size == 0 & counterBack == numberBomb)) {
      gameOver()
    }
  }
    row = numRow
    column = numColumn
    numberBomb = numNumberBomb
    checkGameWon = false
    seconds.textContent = '00'
    minutes.textContent = '00'
    container.remove()
    let div = document.createElement('div')
    body.prepend(div)
    div.classList.add('container')
    div.id = 'container'
    superMegaMainFunc(row,column,numberBomb,div)
}
addRadioButtons()

function addPause() {
  let counterPause = 0
  document.addEventListener('keydown', function(event) {
    if(event.code == 'Space') {
      counterPause++
      if(counterPause % 2 == 1) {
      let div = document.createElement('div')
      div.classList.add('pause')
      body.append(div)
      stopTimer = true
      removeAudioFight()
      } else {
        body.lastElementChild.remove()
        stopTimer = false
        addAudioFight()
      }
    }
  })
}
addPause()

function addAudioFight() {
  audio = new Audio('audio/melleCafe.mp3')
  audio.autoplay = true
  audio.play() 
}

function removeAudioFight() {
  audio.pause()
}

function localStorageUtil(minutes, seconds,id) {
  let data = []

   function getRecords() {
    const recordsLocalStorage = localStorage.getItem(id)
    if(recordsLocalStorage) {
        return JSON.parse(recordsLocalStorage)
    } 
    else{
        return []
    }
  }

  function putRecords() {
    if(getRecords()) {
      data = getRecords()
    }
    for(let i = 0; i < data.length; i++) {
      if(i % 2 == 0) {

        if(data[i] == minutes) {

          if(data[i + 1] == seconds) {
            return alert('this record already exist, you can try to do it one more time and maybe you`ll be lucky')
          }

        }

      }
    }
    data.push(minutes,seconds)
    if(data.length > 16) {
      data.splice(16,2)
    } else {
      counterForWinner = 1
      records.lastElementChild.innerHTML = ''
      let result = confirm('do you want to add a new record?')
      if(result) {
        localStorage.setItem(id,JSON.stringify(data))
        addPreviosRecords(idLvl)
      }
      
    }
    
  }
  putRecords()

}

function addPreviosRecords(id) {
  let data = JSON.parse(localStorage.getItem(id))
  if(data) {
    let result = []
    const length = 2
    while(data.length) {
        result.push(data.splice(0,length))
    } 

    function flat(arr) {

    let tmp = []

        for(let i = 0; i < arr.length;i++) {

            if(typeof arr[i] == 'object' ) {
                for(let j = 0; j < arr[i].length; j++) {
                    tmp.push(flat(arr[i])[j])
                }
            } else {
                tmp.push(arr[i]) 

            }
            
        }
        return tmp
    }

    function sortArr (arr) {
      // ©superBek
        let data = arr.sort ( function (a, b) {
            if (a < b) {
                return -1;
              };
    
              if (a > b) {
                return 1;
              };
    
              return 0;
            });
            
        return data;
    }

    result = sortArr(result)
    result = flat(result)
    for(let i = 0; i < result.length;) {
      if(i == 0) {
        records.lastElementChild.innerHTML += `${counterForWinner})<span>${result[i]}</span>:<span>${result[i + 1]}</span><br>`
        result.splice(i,2)
        counterForWinner++
      }
    }
  }
}
addPreviosRecords(idLvl)


function addRestart() {
  buttonForRestart.addEventListener('click', function() {
    if(trs.length == 9) {
      helpForRadioButtons(9,9,10)
    }
    if(trs.length == 16) {
      helpForRadioButtons(16,16,40)
    }
    if(trs.length == 25) {
      helpForRadioButtons(25,25,100)
    }
  })
}
