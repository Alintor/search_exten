
var suggest_count = 0;


$(window).load(function(){
  $("#search_box").keyup(function(event){
      // определение действий при нажатии на клавиатуру
      switch(event.keyCode) {
          // игнорирование группы клавиш
          case 13:  // enter
          case 27:  // escape
          case 38:  // стрелка вверх
          case 40:  // стрелка вниз
          break;

          default:
              // выводятся подсказки только при вводе более 2х символов
              if($(this).val().length>2){

                  // Отправляем запрос
                  var url = "http://suggestqueries.google.com/complete/search?";
                  $.getJSON(url, {'client':'firefox', 'q':$(this).val()}, function(res){
                      //список подсказок содержится вторым элементом в возвращаемом массиве
                      var list = res[1];
                      suggest_count = list.length;
                      if(suggest_count > 0){
                          // очищение старых подсказок из панели
                          $("#suggest_box").html("").show();
                          for(var i in list){
                              if(list[i] != ''){
                                  // добавление подсказки в панель
                                  $('#suggest_box').append('<div class="suggest_item">'+list[i]+'</div>');
                              }
                          }
                      }
                  });
              }
          break;
      }
  });
});
