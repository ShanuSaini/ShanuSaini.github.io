var MINI = require(['vendor/minified']);
var _=MINI._, $=MINI.$, $$=MINI.$$, EE=MINI.EE, HTML=MINI.HTML;

$(function() {
  

  $('.load-container').on('click', function() {
    $('#hamburger').set('nav-close nav');
    $('.nav-section').set('open');
  });
  
  setTimeout(function() {
    $('.loading.page-loader').set({$top: '-200%'});
  }, 1000);

  if(window.innerWidth>767){
    $(window).on('scroll', function(){
        bikeParallex();
        motorbikeParallex();
        parallexGamepad();
    });  
    particlesJS('particles-js',
      {
        "particles": {
          "number": {
            "value": 15,
            "density": {
              "enable": false,
              "value_area": 3393
            }
          },
          "color": {
            "value": "#000000"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.6,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#000000",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1,
            "direction": "top",
            "random": true,
            "straight": false,
            "out_mode": "bounce",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 1843.9238699953512,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "window",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": false,
              "mode": "repulse"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 121.81158184520176,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      }
    );
  }
  if(window.innerWidth<768){
    particlesJS('mobile-particals',
      {
        "particles": {
          "number": {
            "value": 10,
            "density": {
              "enable": false,
              "value_area": 3393
            }
          },
          "color": {
            "value": "#000000"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.6,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 2,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#000000",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1,
            "direction": "top",
            "random": true,
            "straight": false,
            "out_mode": "bounce",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 1843.9238699953512,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "window",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": false,
              "mode": "repulse"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 121.81158184520176,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      }
    );
  }

  // only for testing
//  $('.nav-section .links li a').on('click', function() {
//    $('#hamburger').set('-nav-close -nav +loading');
//  });

    

});

function parallex(){
  var scrollPosition = window.pageYOffset;
  var calculatedPosition = 0-(scrollPosition * .2);
  var d = "center " + calculatedPosition + "px";
  // console.log(d);
  $('.about-section').set({$backgroundPosition: d});
}

function bikeParallex(){
  var scrollPosition = window.pageYOffset;
  var calculatedPosition = -(0-(scrollPosition * .8));
  var d = calculatedPosition + "px";
  $('.parallex-bike').set({$left: d});
}

function motorbikeParallex(){
  var scrollPosition = window.pageYOffset;
  var calculatedPosition = -(0-(scrollPosition * .3));
  var d = calculatedPosition + "px";
  $('.parallex-motorbike').set({$left: d});
}

function parallexGamepad(){
  var scrollPosition = window.pageYOffset;
  var calculatedPosition = 0-(scrollPosition * .5);
  var d = (-100-calculatedPosition) + "px";
  $('.parallex-gamepad').set({$top: d});
}

$(window).on('scroll', function(){
    parallex();
  }
);


