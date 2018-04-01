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
