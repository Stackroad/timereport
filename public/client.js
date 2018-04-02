
var calculateTotalMinutes = function(){
  axios.get('/calculate-total-minutes')
    .then(function (response) {
      var totalHoursElement = document.getElementById("totalhours");
      totalHoursElement.textContent =  response.data.totalminutes / 60;
    })
    .catch(function (error) {
      console.log(error);
    });
}

var calculateTotalMinutesWithinDate = function(event){
  event.preventDefault();
  var startdate = document.getElementById("startdate").value;
  var enddate = document.getElementById("enddate").value;
  axios.post('/calculate-total-minutes-within-date/', {start_date : startdate, end_date : enddate})
    .then(function (response) {
      var totalHoursElement = document.getElementById("totalhours");
      totalHoursElement.textContent =  response.data.totalminutes / 60;
    })
    .catch(function (error) {
      console.log(error);
    });
}

var deleteEntry = function(element){
  var id = element.dataset.id
  axios.delete('/timereports/' + id)
    .then(function (response) {
      var parentRow = element.parentElement.parentElement;
      parentRow.remove()
    })
    .catch(function (error) {
      console.log(error);
    });
}

window.onload = function(){
  calculateTotalMinutes();
  var element = document.getElementById("dateform")
  element.addEventListener("submit", calculateTotalMinutesWithinDate, false);
};
