let calc_btn_functions = [
    ["√", "x^y", "(", ")", "π", "sin"],
    ["ln", "7", "8", "9", "/", "cos"],
    ["lg", "6", "5", "4", "*", "tg"],
    ["e", "3", "2", "1", "-", "ctg"],
    ["C", "CE", "0", ".", "+", "="]
]
let rows_amount = calc_btn_functions.length;
let column_amount = calc_btn_functions[0].length;
/* *******создаём матрицу кнопок******* */
//вид
for (let x = 0; x < rows_amount; x++) { //создаём их с текстом 
    document.getElementById('calc_buttons').innerHTML += `<div id='line-${x}'></div>`;
    for (let y = 0; y < column_amount; y++) {
        document.getElementById(`line-${x}`).innerHTML += `<button id='line-${x}-column-${y}'>${calc_btn_functions[x][y]}</button>`;
    }
}
//каждой прописываем онклик
for (let x = 0; x < rows_amount; x++) {
    for (let y = 0; y < column_amount; y++) {
        document.getElementById(`line-${x}-column-${y}`).onclick = function() {
            perform(calc_btn_functions[x][y]);
        }
    }
}
/************стиль************/
//подгоняем дисплэй под колличесвто кнопок
document.getElementById('display').style.width = `calc(var(--button-height) * ${column_amount})`;
document.getElementById('calculator').style.width = `calc(var(--button-height) * ${column_amount+0.5})`;
//каждой кнопочке по разделу устанавливаем цвет
let types = ["0123456789.", "+-/*=", "sin cos tg ctg π", "()", "x^y√", "lg ln e", "CE"];
let btn_classes = ["digits", "operators", "trigonometry", "brackets", "middle-school", "logs", "clearer"];
for (let x = 0; x < rows_amount; x++) {
    let btn = null;
    for (let y = 0; y < column_amount; y++) {
        btn_text = document.getElementById(`line-${x}-column-${y}`).innerHTML;
        for (let i = 0; i < types.length; i++) {
            if (types[i].includes(btn_text)) {
                document.getElementById(`line-${x}-column-${y}`).classList.add(btn_classes[i]);
                break;
            }
        }
    }
}
/***********логика************/
function perform(what_to_do) {
    let place_to_write = document.getElementById("display-text");
    let thing = `${what_to_do}`;
    let empty_space = ""; //значение по умолчанию

    //синусы-косинусы-тангенсы-котангенсы
    let to_rad = Math.PI/180;
    let sin = (deg) => Math.sin(deg*to_rad);
    let cos = (deg) => Math.cos(deg*to_rad);
    let tg = (deg) => Math.tan(deg*to_rad);
    let ctg = (deg) => 1/Math.tan(deg*to_rad);   
    let lg = (num) => Math.log10(num);
    let ln = (num) => Math.log1p(num);
    //функция заменяющая константы и радикал (юникод) на свойства и методы Math
    function get_rid_of_letters(exp) {
        to_return = exp;
        to_return = to_return.replace(/√/gu, "Math.sqrt"); // замена всех юникодовских корней
        to_return = to_return.replace(/π/gu, "Math.PI");
        to_return = to_return.replace(/e/gu, "Math.E");
        while (to_return.includes("^")) {to_return=to_return.replace("^", "**")};
        return to_return;
    }

    if ("00123456789.()πe".includes(thing)) {
        console.log("number or dot");
        place_to_write.innerHTML += thing;
    } else if ("+-/*".includes(thing)) { //если оператор
        if ("+-/*".includes(place_to_write.innerHTML[place_to_write.innerHTML.length-1])) { //если перед ним стоит оператор
            console.log("already an operator");
            place_to_write.innerHTML = place_to_write.innerHTML.slice(0, place_to_write.innerHTML.length-1) //меняем его
            place_to_write.innerHTML += thing;
        } else {
            place_to_write.innerHTML += thing;
        }
    } else if (thing=="C") { //очистка
        place_to_write.innerHTML = empty_space;
    } else if (thing=="CE") {
        place_to_write.innerHTML = clear_last(place_to_write.innerHTML);
    } else if (thing=="x^y") {
        place_to_write.innerHTML += "^";
    } else if ("sin cos tan cot tg ctg lg ln √".includes(thing)) {
        place_to_write.innerHTML += thing+"(";
    } else if (thing=="=") {
        let some_str = get_rid_of_letters(place_to_write.innerHTML);
        place_to_write.innerHTML = calculate(some_str);
    }
    /* нужные функции */
    function calculate(str) {//функция превращения строки с выражением в число
        return eval(str) //пока это просто эвалуэйт -_- ---- но тоже вариант =) работает - не трожь
    }
    function clear_last(str) { //очистка строки с конца до оператора
        let cleared = str;
        cleared = cleared.split('');
        let reg_operators = /[*]|[+]|[-]|[()]/;
        if (!reg_operators.test(cleared)) { //по пути нименьшего сопротивления - исправляем баг с неочисткой одного числа
            return "";//если нет знаков
        }
        for (let i = cleared.length-1; i > 0; i--) {
            if (reg_operators.test(cleared[i])) {
                if (reg_operators.test(cleared[cleared.length-1])) {cleared.pop();}
                break;
            } else {
                cleared.pop();
            }
        }
        return cleared.join("");
    }
}