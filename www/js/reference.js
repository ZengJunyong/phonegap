document.addEventListener('deviceready', function() {
  $(function(argument) {
    var k = getUrlParam("k");
    var qtype = getUrlParam("type");

    var query = new Kinvey.Query();
    query.matches('Part Number', eval("'^" + k.toUpperCase() + "'"));
    //query.equalTo('Part Number', k.toUpperCase());
    var tale_name;
    var _type = getUrlParam("stype");
    var qtype;
    if (_type == "control") {
      tale_name = "ControlSos";
      qtype = "CONTROL";
    } else if (_type == "relays") {
      tale_name = "RelaysSos";
      qtype = "RELAYS";
    } else if (_type == "signaling") {
      tale_name = "SignalingSos";
      qtype = "SIGNALING";
    } else if (_type == "hmi") {
      tale_name = "HMISos";
      qtype = "HMI";
    }

    var find = function (offline,fallback) {
      var q = query;
      if(offline){
        q = null;
      }
      var promise = Kinvey.DataStore.find(tale_name, q, {
        offline: offline,
        fallback:fallback,
        success: function(response) {
          if (response.length != 0) {
            if(offline){
              var result = [];
              for(var i=0;i<response.length;i++){
                var t = response[i];
                if(t['Part Number'].indexOf(k.toUpperCase())!=-1){
                  result.push(t);
                }
              }
              createResult(result);
            }else{
              createResult(response);
            }
          }else{
            $(".titleNav").html("Result - \"no result\"");
            $("#layoutBg").fadeOut(300);
            $("#layoutBdload").fadeOut(300);
          }
        }
      });
    }

    if(navigator.connection.type!='none'){
      var promise = Kinvey.init({
        appKey: 'kid_eTzsTVEU1O',
        appSecret: 'c57ef4f8036a4ca3b909141ef231ea04',
        sync: {
          enable: true,
          online: navigator.onLine
        }
      }).then(function() {
        find(false,true);
      });
    }else{
      find(true,false);
    }

    $(".titleNav").html("Result - \"" + k + "\"");
    $("nav").empty().html('<div class="return"></div>CROSS REFERENCE - ' + qtype.toUpperCase() + '');
    $(".return").click(function(event) {
      history.back();
    });

    $(".return").click(function(event) {
      var c = getUrlParam("stype");
      if (c == "control") {
        window.location.href = "mainsearch.html?c=control";
      } else if (c == "relays") {
        window.location.href = "mainsearch.html?c=relays";
      } else if (c == "signaling") {
        window.location.href = "mainsearch.html?c=signaling";
      } else if (c == "hmi") {
        window.location.href = "mainsearch.html?c=hmi";
      } else {
        history.back();
      }
    });

  });
}, false);

function createResult(data) {
	console.log(data);
	var str = '';
	for (var i = 0; i < data.length; i++) {
		var tempA = [];
		var referenceA = [];
		if(data[i].Reference.split("||||").length>1){
			tempA = data[i].eshop.split("||||");
			referenceA = data[i].Reference.split("||||");
		}
		str += '<li>';

		str += '<h5>' + data[i].Brand + '</h5>';
		str += '<h4><i>Part Number: </i>' + data[i]["Part Number"] + '</h4>';
		str += '<h4>' + data[i].Description + '</h4>';
		str += '<div class="refBg">';
		str += '<h4><i>Rang: </i>' + data[i].Range + '</h4>';
		if(data[i].Reference.split("||||").length>1){
			str += '<h4><i>Reference: </i>' + createReference(referenceA,tempA) + '</h4>';
		}else{
			str += '<h4><i>Reference: </i>' + data[i].Reference + '</h4>';
		}
		str += '<span class="rightArrow"></span>';
		str += '</div>';
		if(data[i].Comments){
			str += '<h4 class="alignCenter clickshow">Click Show Comments</h4>';
			str += '<h4 class="comments">' + data[i].Comments + '</h4>';
		}
		str += '</li>';
	}

	str += '<div class="clear"></div>';

	$("section.reference ul").empty().append(str);

	$(".clickshow").click(function(event) {
		$(this).fadeOut(300, function() {
			$(this).next().fadeIn(300, function() {});
		});
	});

	$("#layoutBg").fadeOut(300);
	$("#layoutBdload").fadeOut(300);
}

function createReference(r,a){
	var str = "";
	for (var i = 0; i < a.length; i++) {
		str += '<a href="'+a[i]+'">'+r[i]+'</a>,'
	};
	return str.substring(0,str.length-1);
}
