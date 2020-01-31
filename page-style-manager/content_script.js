

function getDaysInMonth(month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    while (date.getMonth() === month) {
        var day = new Date(date).toDateString().substr(0, 3).toLowerCase();
       days.push(day);
       date.setDate(date.getDate() + 1);
    }
    return days;
}

var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();

var daysInMonth = getDaysInMonth(
    currentMonth,
    currentYear
);

var inputs = document.querySelectorAll('tr td input[type="checkbox"][id^="checkbox"]');

inputs.forEach((input, index) => {
    if(daysInMonth[index] != 'sat' && daysInMonth[index] != 'sun'){
        input.checked = true; 
    }
});


 