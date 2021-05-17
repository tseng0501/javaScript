function cc() {
    window.location.reload();
}
// JavaScript Array concat() (陣列合併)
// 陣列 (array)的 concat() 方法可以用來合併兩個不同的陣列變成一個新陣列。
// 語法：
// var newArray = oldArray.concat(value1[, value2[, ...[, valueN]]])
// 1
function concat() {
    var ary1 = ['a', 'b', 'c'];
    var ary2 = ['d', 'e', 'f'];

    var ary3 = ary1.concat(ary2);

    // 輸出 ["a", "b", "c", "d", "e", "f"]
    console.log(ary3);

    // ------------------------------

    // 參數也可以是單個值：
    var fruits = ['Apple', 'Banana'];

    var moreFruits = fruits.concat('Orange');

    // 輸出 ["Apple", "Banana", "Orange"]
    console.log(moreFruits);
}

// JavaScript Array every()
// 陣列 (array) 的 every() 方法用來測試是否所有的元素都通過指定的測試函數。
// 語法：
// ary.every(callback[, thisArg])
// 參數 callback 是一個函數，用來測試所有的元素，這個函數會接收到三個參數，分別是：
// currentValue 代表目前處理到的元素的值
// index 代表目前處理到的元素的索引位置
// array 代表陣列本身
// 根據 callback 的執行結果，返回 true 表示測試通過；返回 false 則表示失敗
// thisArg 代表 callback 裡面的 this 是指向哪一個物件
// every() 執行結果會返回 true / false
// 2
function every() {
    function isBigEnough(element, index, array) {
        return element >= 10;
    }
    // false
    [12, 5, 8, 130, 44].every(isBigEnough);

    // true
    [12, 54, 18, 130, 44].every(isBigEnough);

}

// JavaScript Array filter()
// 陣列 (array) 的 filter() 方法用來根據你指定的測試函數，從一個陣列中篩選出符合條件的元素。
// 語法：
// var newArray = arr.filter(callback[, thisArg])
// 3
function filter() {
    function isBigEnough(value) {
        return value >= 10;
    }

    var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);

    // 輸出 [12, 130, 44]
    console.log(filtered);
}

// JavaScript Array forEach()
// 除了用 for 迴圈語法，你還可以用 forEach() 方法來遍歷陣列中的每一個元素。
// 語法：
// ary.forEach(callback[, thisArg])
// 4
function forEach() {
    function logArrayElements(currentValue, index, array) {
        console.log('ary[' + index + '] = ' + currentValue);
    }

    ['a', 'b', 'c'].forEach(logArrayElements);
    //  輸出 ary[0] = a
    //  輸出 ary[1] = b
    //  輸出 ary[2] = c
}

// JavaScript Array indexOf()
// 陣列 (array) 的 indexOf() 方法用來找出一個值出現在陣列中的哪個位置。
// ary.indexOf(searchElement)
// ary.indexOf(searchElement, fromIndex)
// 參數 searchElement 表示要尋找的值
// 參數 fromIndex 表示從哪個索引位置開始找起，預設為 0；如果 fromIndex 是負數，表示從陣列後面算起，例如 -1 表示最後一個元素的位置
// indexOf() 方法會返回第一個找到的元素的索引位置，沒找到則返回 -1
// 5
function indexOf() {
    var ary = [2, 9, 9];

    // 返回 0
    ary.indexOf(2);

    // 返回 -1
    ary.indexOf(7);

    // 返回 2
    ary.indexOf(9, 2);

    // 返回 -1
    ary.indexOf(2, -1);

    // 返回 0
    ary.indexOf(2, -3);
    console.log(ary.indexOf(2));
}

// JavaScript Array join()
// join() 方法用來將陣列的所有元素按指定的分隔符號合併成一個字串。
// 語法：
// ary.join()
// ary.join(separator)
// 參數 separator 為分隔符號，預設是逗點 ,。
// 6
function join() {
    var ary = ['Wind', 'Rain', 'Fire'];

    // 輸出 'Wind,Rain,Fire'
    console.log(ary.join());

    // 輸出 'Wind, Rain, Fire'
    console.log(ary.join(', '));

    // 輸出 'Wind + Rain + Fire'
    console.log(ary.join(' + '));

    // 輸出 'WindRainFire'
    console.log(ary.join(''));
}

// JavaScript Array lastIndexOf()
// 陣列 (array) 的 lastIndexOf() 方法用來找出一個值出現在陣列中的哪個位置。相對於 indexOf() 方法是從陣列開頭找起，lastIndexOf() 方法則是從後面開始往回找。
// 語法：
// ary.lastIndexOf(searchElement)
// ary.lastIndexOf(searchElement, fromIndex)
// 參數 searchElement 表示要尋找的值
// 參數 fromIndex 表示從哪個索引位置開始往回找起，預設為陣列最後一個索引位置；如果 fromIndex 是負數，表示從陣列後面算起，例如 -1 表示最後一個元素的位置
// lastIndexOf() 方法會返回從後面開始往回找到的第一個元素的索引位置，沒找到則返回 -1
// 7
function lastIndexOf() {
    var ary = [2, 5, 9, 2];

    // 返回 3
    ary.lastIndexOf(2);
    // 返回 -1
    ary.lastIndexOf(7);
    // 返回 3
    ary.lastIndexOf(2, 3);
    // 返回 0
    ary.lastIndexOf(2, 2);
    // 返回 0
    ary.lastIndexOf(2, -2);
    // 返回 3
    ary.lastIndexOf(2, -1);
    console.log(ary.lastIndexOf(2));
}

// JavaScript Array map()
// 陣列 (arrray) 的 map() 方法用來遍歷一個陣列中的每個元素，將元素分別傳入你指定的函數，最後將所有函數的返回值組成一個新的陣列。
// 語法：
// var newArray = oldArray.map(callback[, thisArg])
// thisArg 代表 callback 裡面的 this 是指向哪一個物件
// map() 執行結果會返回一個新陣列
// 8
function map() {
    var numbers = [1, 4, 9];

    var doubles = numbers.map(function (num) {
        return num * 2;
    });

    // 輸出 [2, 8, 18]
    console.log(doubles);

    // 輸出 [1, 4, 9]
    console.log(numbers);
}

// JavaScript Array pop()
// 陣列 (array) 的 pop() 方法用來移除陣列的最後一個元素，同時返回這個元素值。
// 語法：
// ary.pop()
// 9
function pop() {
    var fruits = ['Apple', 'Banana'];

    var last = fruits.pop();

    // 輸出 Banana
    console.log(last);

    // 輸出 ["Apple"]
    console.log(fruits);
}

// JavaScript Array push()
// 陣列 (array) 的 push() 方法用來新增元素到陣列最後面。
// 語法：
// ary.push([element1[, ...[, elementN]]])
// push() 方法會返回陣列新的長度。
// 10
function push() {
    var sports = ['soccer', 'baseball'];
    var total = sports.push('football', 'swimming');

    // 輸出 ["soccer", "baseball", "football", "swimming"]
    console.log(sports);

    // 輸出 4
    console.log(total);
}

// JavaScript Array reduce()
// 陣列 (array) 的 reduce() 方法會對陣列中的每一個元素，由左至右傳入指定的函數，最後返回一個累加 (accumulator) 的值。
// 語法：
// ary.reduce(callback[,initialValue])
// 參數 initialValue 表示初始的累加值
// reduce() 方法會返回所有元素最後累加的結果
// 11
function reduce() {
    var ary = ['Welcome', ' ', 'fooish', '.', 'com'];

    var concatStr = ary.reduce(function (str, el) {
        return str + el;
    }, '');

    // 輸出 'Welcome fooish.com'
    console.log("reduce:", concatStr);
}

// JavaScript Array reduceRight()
// 相對於 reduce() 方法，陣列 (array) 的 reduceRight() 方法會對陣列中的每一個元素，由右至左傳入指定的函數，最後返回一個累加 (accumulator) 的值。
// 語法：
// ary.reduceRight(callback[,initialValue])
// 12
function reduceRight() {
    var a = ['1', '2', '3', '4', '5'];

    var left = a.reduce(function (prev, cur) {
        return prev + cur;
    });

    var right = a.reduceRight(function (prev, cur) {
        return prev + cur;
    });

    // 輸出 "12345"
    console.log("reduce: ", left);
    // 輸出 "54321"
    console.log("reduceRight: ", right);
}

// JavaScript Array reverse()
// 陣列 (array) 的 reverse() 方法用來將陣列倒轉，將第一個元素換到最後一個，最後一個元素換到第一個，依此類推。
// 語法：
// ary.reverse()
// reverse() 方法會返回倒轉後的陣列。
// 13
function reverse() {
    var ary = ['one', 'two', 'three'];

    var reversed = ary.reverse();

    // 輸出 ["three", "two", "one"]
    console.log("reverse:", ary);
}

// JavaScript Array shift()
// 陣列 (array) 的 shift() 方法用來移除陣列中的第一個元素，同時返回這個元素值。
// 語法：
// ary.shift()
// 14
function shift() {
    var fruits = ['Apple', 'Banana'];
    var first = fruits.shift();

    // 輸出 Apple
    console.log("shift移除陣列中: ", first);

    // 輸出 ["Banana"]
    console.log("返回這個元素值:",fruits);
}

// JavaScript Array slice()
// 陣列 (array) 的 slice() 方法可以任意截取出陣列的一部分。
// 語法：
// ary.slice()
// ary.slice(begin)
// ary.slice(begin, end)
// 參數 begin 表示開始擷取的索引位置 (索引值從 0 開始)，預設是 0
// 參數 end 表示結束擷取的索引位置，擷取的範圍不包含 end 元素；如果 end 是負數，表示從陣列後面算起，例如 -1 表示最後一個元素的位置
// slice() 方法返回一個新的陣列
// 15
function slice() {
    var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];

    var foo1 = fruits.slice(1, 3);

    // 輸出 ["Orange", "Lemon"]
    console.log(foo1);

    var foo2 = fruits.slice(1, -2);

    // 輸出 ["Orange", "Lemon"]
    console.log(foo2);
}

// JavaScript Array some()
// 陣列 (array) 的 some() 方法用來測試陣列中是否有任何一個元素可以通過指定的測試函數。
// 語法：
// ary.some(callback[, thisArg])
// some() 方法的執行結果，如果有任一元素通過測試返回 true；反之則返回 false
// 16
function some() {
    function isBiggerThan10(element, index, array) {
        return element > 10;
    }
    // 返回 false
    var ss = [2, 5, 8, 1, 4].some(isBiggerThan10);
    console.log("some:", ss);

    // 返回 true
    var cc = [12, 5, 8, 1, 4].some(isBiggerThan10);
    console.log("some:", cc);

}

// JavaScript Array sort() (陣列排序)
// 陣列 (array) 的 sort() 方法用來重新排序陣列中的元素。
// 語法：
// ary.sort()
// ary.sort(compareFunction)
// sort() 預設會將元素轉型成字串再做比較，比較的方式是從左到右逐一比對元素中的每個字元的 Unicode code point 大小。
// sort() 執行後會返回排序後的陣列。
// https://www.fooish.com/javascript/array/sort.html
// 17
function sort() {
    // 字串型態元素的排序-------------------------
    var fruits = ['cherries', 'apples', 'bananas'];

    // 返回 ["apples", "bananas", "cherries"]
    fruits.sort();
    console.log("fruits:", fruits);

    // 數字型態元素的排序 (Numeric Sort)--------------------------
    var scores = [1, 10, 21, 2];

    // 注意 10 會排在 2 前面
    // 因為字串 '10' 的第一個字元 '1' 比 '2' 的 Unicode code point 小
    //
    // 返回 [1, 10, 2, 21]
    scores.sort();
    console.log("scores:", scores);

    var things = ['word', 'Word', '1 Word', '2 Words'];

    // 返回 ["1 Word", "2 Words", "Word", "word"]
    // 因為數字的 Unicode code point 比英文字小
    things.sort();
    console.log("things:", things);

    // 倒轉陣列排序(Reversing an Array)-----------------------
    var fruits = ['cherries', 'apples', 'bananas'];

    fruits.sort();
    fruits.reverse();

    // 輸出 ["cherries", "bananas", "apples"]
    console.log("sort, reverse " ,fruits);

    // 自定義排序 (Custom Sort)
    // sort() 可以傳入函數參數 compareFunction，可以用來自訂排序的邏輯，陣列會根據 compareFunction 函數的回傳值來做排序依據。
}

// JavaScript Array splice()
// 陣列 (array) 的 splice() 方法用來插入、刪除或替換陣列中的某一個或某個範圍的元素。
// 語法：
// ary.splice(start)
// ary.splice(start, deleteCount)
// ary.splice(start, deleteCount, newElement1, newElement2, ...)
// 參數 start 表示操作開始的索引位置；如果 start 是負數，表示從陣列後面算起，例如 -1 表示最後一個元素的位置
// 參數 deleteCount 表示多少個元素要被刪除，如果 deleteCount 是 0 表示不要刪除任何元素。預設 deleteCount 等於 (ary.length - start)
// 參數 newElement1, newElement2, ... 表示要新增的陣列中的元素，新元素會從 start 的位置開始加入，如果沒有指定則表示沒有要新增元素
// splice() 執行後會返回一個陣列，陣列中是被刪除的元素
// 18
function splice() {
    // 刪除元素----------------
    var fruits = ['Banana', 'Orange', 'Apple', 'Mango', 'Peach'];
    var removed = fruits.splice(2, 2);

    // 輸出 ["Banana", "Orange", "Peach"]
    console.log("返回元素", fruits);

    // 輸出 ["Apple", "Mango"]
    console.log("刪除元素:", removed);

    // 刪除並新增元素-------------------
    var fruits = ['Banana', 'Orange', 'Apple', 'Mango', 'Peach'];
    var removed = fruits.splice(2, 2, 'Watermelon', 'Lemon');

    // 輸出 ["Banana", "Orange", "Watermelon", "Lemon", "Peach"]
    console.log("返回元素", fruits);

    // 輸出 ["Apple", "Mango"]
    console.log("刪除元素:", removed);

    // 新增元素-----------------------------
    var fruits = ['Banana', 'Orange', 'Apple', 'Mango', 'Peach'];
    var removed = fruits.splice(1, 0, 'Watermelon', 'Lemon');

    // 輸出 ["Banana", "Watermelon", "Lemon", "Orange", "Apple", "Mango", "Peach"]
    console.log("返回元素", fruits);

    // 輸出 []
    console.log("刪除元素:", removed);
}

// JavaScript Array unshift()
// 陣列 (array) 的 unshift() 方法用來新增一個元素到陣列最前面。
// 語法：
// ary.unshift([element1[, ...[, elementN]]])
// unshift() 執行後會返回新陣列的長度。
// 19
function unshift() {
    var fruits = ['Apple', 'Banana'];

    fruits.unshift('Orange');

    // 輸出 ["Orange", "Apple", "Banana"]
    console.log("unshift:", fruits);
}