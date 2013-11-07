//$("#jp_container_1").hide();

$('#files a').click(function(e) {
    e.preventDefault();
    $("#jquery_jplayer_1").jPlayer('pause');
    DataValues.reset();
    var link = $(this).attr('href');
    $('#files a.playing').removeClass('playing');
    $(this).addClass('playing');
    var title = $(this).html();

    makeWaveSlider(title);

    $("#jquery_jplayer_1")
      .jPlayer("clearMedia")
      .jPlayer("setMedia", {oga: link})
      .jPlayer("preload", "metadata")
      .jPlayer("playHead", 10)
      .jPlayer("play");
    $('#jp_container_1 .jp-title li').html(title);
    return false;
});


$("#jquery_jplayer_1").jPlayer({
    pause: function (event) {
      if (typeof interval != 'undefined') {
        clearInterval(interval);
      }
    },
    timeupdate: function(event) {
      var time = $("#jquery_jplayer_1").data("jPlayer").status.currentTime;
      var $section = $('section.filePlayer');
      if (time === 0) {
        var width = $section.width() - 5;
        var height = parseInt($section.find('.music #crCanvas').attr('height'));

        var param = width * 70 / 3000 + 35;

        // $('footer div.navbar-inner').height(param);
        $section.find('.music #slider canvas').attr('width', width);
        // $('footer .music #slider').height(height);
        $section.find('#slider').width(0);
        DataValues.imgWidth = width;
      } else {
        if ($section.find('span.buffering')) {
          $section.find('span.buffering')
            .remove()
          .end()
          .find('.hidden')
            .removeClass('hidden');
        }

        var duration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
        if (DataValues.length != duration && duration > 0) {
          DataValues.length = duration;
          var timeRounded = Math.round(duration*100)/100;
          $section
            .find('.total .time')
            .html(timeRounded+'s');
        }
        seekWave(time);
      }
    },

    swfPath: "js/vendors/jplayer/jplayer",
    //supplied: "mp3",
    supplied: "oga, mp3, mp4",
    wmode: "window",
    preload: "metadata"
});


$('section.filePlayer').on('click', '.playControl a', function() {
    var action = null;
  switch ($(this).attr('class')) {
    case 'cp-play':
      action = 'pause';
      $("#jquery_jplayer_1").jPlayer('play');
      break;
    case 'cp-pause':
      action = 'play';
      $("#jquery_jplayer_1").jPlayer('pause');
      break;
    case 'close-wave pull-right':
      $('section.filePlayer').html('');
      $("#jquery_jplayer_1").jPlayer('pause');
      break;
  }

  $(this)
    .toggleClass('cp-play')
    .toggleClass('cp-pause');
  $(this)
    .find('img')
      .attr('src', 'img/'+action+'.png')

  return false;

});


var DataValues = {
  imgWidth: undefined,
  fixWidth: -5,
  itemValue: undefined,
  percents: undefined,
  length: undefined,
  reset: function() {
    DataValues.imgWidth = undefined;
    DataValues.itemValue = undefined;
    DataValues.percents = undefined;
    DataValues.length = undefined;
  }
};

  $('section.filePlayer').on('mouseup', '#crCanvas, #slider', function(e) {
    var xcoordinate = e.pageX;
    var move = xcoordinate * DataValues.length / DataValues.imgWidth;
    seekPlayer(move);
    DataValues.pp = xcoordinate;

    $('.playControl a.cp-play').trigger('click');
  });

  var seekPlayer = function(move) {
    $("#jquery_jplayer_1").jPlayer('play', move);
  }

  var seekWave = function(time) {
    var seek = time * DataValues.imgWidth / DataValues.length + DataValues.fixWidth;
    var timeRounded = Math.round(time*100)/100;
    $('section.filePlayer')
      .find('#slider')
        .width(seek);
    if (DataValues.length) {
      $('section.filePlayer')
      .find('.elapsedTime .time')
        .html(timeRounded + 's');
    }
  }


function makeWaveSlider(title) {
  var $footer = $('section.filePlayer');
  var $foo =
      '<div class="navbar-inner">' +
        '<div class="playControl clearfix">' +
          '<span class="buffering"><i class="icon-spinner icon-spin"></i> Buffering</span>' +
          'Playing: <a class="cp-pause hidden" href="javascript:;"><img src="img/pause.png" alt="pause" />'+title +'</a>' +
          '<a class="close-wave pull-right" href="javascript:;"><i class="icon-remove"></i></a>' +
          '<span class="total hidden">Total time: <span class="time"></span></span>' +
          '<span class="elapsedTime hidden">Time elapsed: <span class="time"></span></span>' +
        '</div>' +
        '<div class="music">' +
          '<div id="slider">'+
            '<canvas id="crCanvasSlider" height="100"></canvas>' +
          '</div>' +
          '<canvas id="crCanvas" height="100"></canvas>' +
        '</div>' +
      '</div>';

  $footer.html($foo);

  var footer = $('section.filePlayer');
  var width = footer.width() - 5;
  $('#crCanvas').attr('width', width);

  DrawCR.init(title);
}

var DrawCR = {
  file: undefined,
  data: undefined,
  init: function(file) {
    DrawCR.file = file;
    DrawCR.data = undefined;
    DrawCR.getData();
  },
  getData: function() {
      console.log(DrawCR.file);
      //May implement f to get remote data
    var url = 'js/vendors/jplayer/JSONS/' + DrawCR.file + '.json';

    $.getJSON(url)
      .success(function(data) {
        if (data.error == null && data.result) {
          DrawCR.data = data.result;
          DrawCR.generateNumbers();
        } else if (data.error != null) {
          $('div.playControl').append(
            '<span class="error">' +
              'Coresponding data was not found in server' +
            '</span>'
            );
        }
      })
      .error(function(data) {
          $('div.playControl').append(
            '<span class="error">' +
              'Coresponding data was not found in server' +
            '</span>'
            );
          //console.log('error retrieving file, url: ' + DrawCR.file);
      });
  },
  generateNumbers: function() {
    var canvas = document.getElementById('crCanvas');
    var canvas2 = document.getElementById('crCanvasSlider');

    var footer = $('section.filePlayer');
    // var width = footer.width() - 5;
    var width = $('#crCanvas').attr('width');
    var height = parseInt($('#crCanvas').attr('height'));
    var dataLength = DrawCR.data.length;
    var crx = canvas.getContext('2d');
    var crx2 = canvas2.getContext('2d');

    for (var i=0; i<=dataLength; i++) {
      var item = DrawCR.data[i];
      var y, y1 = false;
      var x = i * width / dataLength;
      if (item && item !== 100 ) {
        y = height - item;
        y1 = height - (height - item);
      } else {
        y = height / 2 + 1;
        y1 = height / 2  - 1;
      }
      DrawCR.draw(crx, 1, x, y, y1, '#FAA732');
      DrawCR.draw(crx2, 1, x, y, y1, '#006DCC');
    }
  },
  draw: function(crx, width, x, y, y1, color) {
    crx.lineWidth = width;
    crx.beginPath();
    crx.moveTo(x, y);
    crx.lineTo(x, y1);
    crx.strokeStyle = color;
    crx.stroke();
  }
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}


