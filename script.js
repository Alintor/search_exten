
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

var selected_item = 0;
var origin_search_value = '';
var search_url = ["http://www.google.com/search?as_q=", "https://yandex.ru/search/?text="];


$(window).load(function(){
  //загрузка состояния search_engine из перед закрытием
  chrome.storage.sync.get("search_index", function (obj) {
      if (obj.search_index!=null)
      {
          $( "#search_engine" )[0].selectedIndex = obj.search_index;
        }
  });

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

                  origin_search_value = $(this).val();//запоминаем изначальное значение
                  selected_item = 0;
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
      //открытие страницы с поиском
      open_search_page();
  });

  //обработка нажатий клавиш после вывода подсказки
  $("#search_box").keydown(function(event){
      switch(event.keyCode) {
          case 13: // enter
              open_search_page();
          break;
          // обработка нажития на стрелки
          case 38: // стрелка вверх
          case 40: // стрелка вниз
              event.preventDefault();
              if(suggest_count){
                move_by_list(event.keyCode);
              }
          break;
      }
  });
  //сохранение состояния search_engine в памяти после изменения
  $( "#search_engine" ).change(function(){
    var index = $( "#search_engine" ).prop('selectedIndex');
    chrome.storage.sync.set({'search_index': index});
  });
});
//передвижение по подсказкам с помощью стрелок
function move_by_list(key){
    //удаления класса оформления у предыдущего выбранного элемента
    $('#suggest_box div').eq(selected_item-1).removeClass('selected');
    //выбор направления движения
    if(key == 40 && selected_item < suggest_count){
        selected_item++;
    }else if(key == 38 && selected_item > 0){
        selected_item--;
    }
    //добавление класса оформления для выбранного элемента
    //и добавления текста подсказки в поле поиска
    if( selected_item > 0){
        $('#suggest_box div').eq(selected_item-1).addClass('selected');
        $("#search_box").val( $('#suggest_box div').eq(selected_item-1).text() );
    } else {
        $("#search_box").val( origin_search_value );
    }
}

//открытие страницы поиска в новой вкладке
function open_search_page(){
  var index = $( "#search_engine" ).prop('selectedIndex');
  chrome.tabs.create({url: search_url[index] + $("#search_box").val()});
}
