
var suggest_count = 0;
var suggest_url = ["http://suggestqueries.google.com/complete/search?", "http://suggest.yandex.ru/suggest-ya.cgi?"];
var key_data = ['q', 'part'];
//данные для запросса на получения подсказок для гугл и яндекса
var url_data = [{
  'client':'firefox',
  'q': ''
},
{
  'v': '4',
  'part': ''
}];


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

                  //берутся необходимы данные в зависимоти от
                  //выбранного поискового движка
                  var index = $( "#search_engine" ).prop('selectedIndex');
                  var url = suggest_url[index];
                  var url_d = url_data[index]; //данные для запроса
                  var key = key_data[index]; //ключь для передачи поисковой строки
                  url_d[key] = $(this).val(); //добавленние поисковой строки в данные
                  // Отправляем запрос
                  $.getJSON(url, url_d, function(res){
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

  // обработка клика по подсказке
  $(document).on('click', '.suggest_item', function(){
      // Вставка текста из посказки в поле поиска
      $('#search_box').val($(this).text());
      // скрытие подсказок
      $('#suggest_box').hide();
  });

  //обработка нажатий клавиш после вывода подсказки
  $("#search_box").keydown(function(event){
      switch(event.keyCode) {
          case 13: // enter
          break;
          // обработка нажития на стрелки
          case 38: // стрелка вверх
          case 40: // стрелка вниз
              event.preventDefault();
          break;
      }
  });


});
