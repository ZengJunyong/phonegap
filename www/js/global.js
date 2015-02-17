Kinvey.API_ENDPOINT = 'https://se-baas.kinvey.com';

var localStorage;

var loch = window.location.href;

var offlineFlag = false;

// 当PhoneGap加载完毕后调用onDeviceReady回调函数
// 此时，该文件已加载完毕但phonegap.js还没有加载完毕。
// 当PhoneGap加载完毕并开始和本地设备进行通讯，
// 会触发“deviceready”事件
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
function onDeviceReady() {
  // 注册回退按钮事件监听器
  document.addEventListener("backbutton", onBackKeyDown, false);
}

// 处理后退按钮操作
function onBackKeyDown() {
  function yesno() {
    if(confirm("是否退出APP?")){ navigator.app.exitApp(); }else return false; }

}

function createTime() {
  var myDate = new Date();
  var _year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  var _month = parseInt(myDate.getMonth()) + 1; //获取当前月份(0-11,0代表1月)
  var _date = myDate.getDate(); //获取当前日(1-31)
  var time = _year + "-" + _month + "-" + _date;
  return time;
}

$(function() {


  $(window).on({
    offline: Kinvey.Sync.offline,
    online: function() {
      // Some browsers fire the online event before the connection is available
      // again, so set a timeout here.
      setTimeout(function() {
        Kinvey.Sync.online();
      }, 10000);
    }
  });

  var method = Kinvey.Sync.isOnline();

  var offlineFlag = false;

  if (!method) {
    offlineFlag = true;
  }


  //初始化
  var promise = Kinvey.init({
    appKey: 'kid_eTzsTVEU1O',
    appSecret: 'c57ef4f8036a4ca3b909141ef231ea04',
    sync: {
      enable: true,
      online: navigator.onLine
    }
  }).then(function() {

    /*user用户信息*/
    var user = Kinvey.getActiveUser();
    localStorage.setItem("usernamemsg", user.username);
    localStorage.setItem("mailmsg", user.email);
    if (localStorage.usernamemsg) {
      $("#usernamemsg").html(localStorage.usernamemsg);
      $("#mailmsg").html(localStorage.mailmsg);
      $("#feedbackname").val(localStorage.usernamemsg);
      $("#feedbackmail").val(localStorage.mailmsg);

    } else {
      $("#usernamemsg").html(user.username);
      $("#mailmsg").html(user.email);
      $("#feedbackname").val(user.usernamemsg);
      $("#feedbackmail").val(user.mailmsg);
    }


    if (loch.indexOf("login") != -1) {
      //在登陆页面判断用户是否已经登陆
      if (user.username) {
        window.location.href = "content.html";
      }
    }

    /*重置密码*/
    $("#resetPwd").click(function(event) {
      var promise = Kinvey.User.resetPassword(user.username, {
        success: function() {
          var user = Kinvey.getActiveUser();
          alert("Your password reset email has been sent to " + user.email + ". Please follow the instructions to reset your password.");
        }
      });
    });

    //搜索按钮点击
    $("#searchBtn").click(function(event) {
      var qkeywords = $("#searchtxt").val();
      if (qkeywords == "") {
        alert("关键字不能为空");
        return false;
      }
      var _type = $("#mainCheck li.active p").text().toLowerCase();
      $("#layoutBg").css("display", "block");
      $("#layoutBdload").css("display", "block");

      window.location.href = "list-refrence.html?k=" + qkeywords + "&type=" + _type + "&stype=" + _type + "";
    });

  });


  //登陆
  var doc = $(document);

  var uname = $("#user");
  var pass = $("#pwd");

  //当本地用户名存在的时候则勾选上checked,并且赋值给user
  if (localStorage.username) {
    uname.val(localStorage.username);
    $("#remember span").addClass('checked');
  }


  //登陆点击
  doc.on('click', '#login', function() {

    if (uname.val() == "") {
      alert("用户名不能为空");
      return false;
    }

    if (pass.val() == "") {
      alert("密码不能为空");
      return false;
    }
    //读取用户信息状态
    $("#layoutBg").css("display", "block");
    $("#layoutBdload").css("display", "block");
    Kinvey.User.login({
      username: uname.val(),
      password: pass.val()
    }, {
      success: function(response) {
        if (localStorage.username) {
          //用户登录名更换的时候，重新做记录保存
          if (localStorage.username != uname.val()) {
            localStorage.username = uname.val();
          }
        } else {
          localStorage.username = uname.val();
        }
        $("#layoutBg").css("display", "none");
        $("#layoutBdload").css("display", "none");
        window.location.href = "content.html";
      }
    });
  });

  /*remember me*/
  $("#remember").click(function(event) {
    var $check = $(this).find('.check');
    if ($check.hasClass('checked')) {
      localStorage.removeItem("username")
      $check.removeClass('checked');
    } else {
      localStorage.setItem("username", uname.val());
      $check.addClass('checked');
    }
  });

  //首页选择
  $("#mainCheck li").click(function(event) {
    $(this).addClass('active').siblings().removeClass('active');
    var _num = $(this).attr("num");
    $("section .main ul").eq(_num).addClass("active").siblings('ul').removeClass("active");
  });


  //nav导航
  $("header .nav").click(function(event) {
    if ($("#slidemenu").length == 0) {
      var str = createMenu();
      $("body").append(str);
    }
    if ($("#slidemenu").hasClass('move')) {
      $("#slidemenu").removeClass('move').stop().animate({
          "left": "-85%"
        },
        500, function() {
          /* stuff to do after animation is complete */
        });
      $(".wrap").stop().animate({
          "left": "0",
        },
        500, function() {
          /* stuff to do after animation is complete */
        });
    } else {
      //移动
      $("#slidemenu").addClass('move').stop().animate({
          "left": 0
        },
        500, function() {
          /* stuff to do after animation is complete */
        });
      $(".wrap").stop().animate({
          "left": "85%",
        },
        500, function() {
          /* stuff to do after animation is complete */
        });
    }
  });

  //登出
  $("#logout").click(function(event) {
    logout();
  });

  /*白色小箭头返回*/
  $(".return").click(function(event) {
    if(loch.indexOf("list")!=-1){
      console.log(loch.split("-")[1].split(".")[0]);
      if(loch.split("-")[1]!=undefined){
        var c = loch.split("-")[1].split(".")[0];
        c = c.substring(0, c.length - 1);
        if (c == "con") {
          window.location.href = "main.html?c=control";
        } else if (c == "relays") {
          window.location.href = "main.html?c=relays";
        } else if (c == "sign") {
          window.location.href = "main.html?c=signaling";
        } else if (c == "hmi") {
          window.location.href = "main.html?c=hmi";
        }
      } else {
        history.back();
      }
    }

  });

  /*feedbakc*/
  $("#feedbacksend").click(function(event) {
    //$("#send").text("sending...");
    var _name = $("#feedbackname").val();
    var _mail = $("#feedbackmail").val();
    var _comments = $("#feedbackcon").val();

    var event = {
      name: _name, //名字
      mail: _mail, //邮件
      comments: _comments //内容
    };
    // Save the event.
    var promise = Kinvey.DataStore.save('FeedBack', event, {
      offline: offlineFlag,
      success: function(response) {
        console.log(response);
        alert("Thanks for your feedback!");
        //$("#send").text("send");
      }
    });
  });

  /*用户信息*/
  $(".headlogo").click(function(event) {
    window.location.href = "user.html";
  });

  //滑动左边菜单
  if ($(".layoutBg").css("display") == "block" || loch.indexOf("login.html") != -1 || loch.indexOf("index.html") != -1 || loch.indexOf("list-") != -1) {

    return false;
  } else {
    $('body').touchwipe({
      wipeLeft: function() {
        $("#slidemenu").removeClass('move').stop().animate({
            "left": "-85%"
          },
          500, function() {
            /* stuff to do after animation is complete */
          });
        $(".wrap").stop().animate({
            "left": "0",
          },
          500, function() {
            /* stuff to do after animation is complete */
          });
      },
      wipeRight: function() {
        if ($("#slidemenu").length == 0) {
          var str = createMenu();
          $("body").append(str);
        }
        //移动
        $("#slidemenu").addClass('move').stop().animate({
            "left": 0
          },
          500, function() {
            /* stuff to do after animation is complete */
          });
        $(".wrap").stop().animate({
            "left": "85%",
          },
          500, function() {
            /* stuff to do after animation is complete */
          });
      },
      min_move_x: 10,
      min_move_y: 10,
    });
  }


});


function blank2underline(val) {
  //  var result   = str.replace(eval("/"+str1+"/gi"),str2);
  var ret = val.replace(" ", "_");
  var ret = ret.replace(" ", "_");
  var ret = ret.replace(" ", "_");
  var ret = ret.replace(" ", "_");
  var ret = ret.replace("*", "");
  var ret = ret.replace("*", "");
  var ret = ret.replace("*", "");
  var ret = ret.replace("*", "");
  return ret;
}

function logout() {
  var user = Kinvey.getActiveUser();
  if (null !== user) {
    Kinvey.User.logout().then(function() {
      window.location.href = "login.html";
    }, function(error) {

    }).then(function() { // Restore UI.
      uname.val("");
      pass.val("");
    });
  } else {}
}

function createMenu() {
  var str = '';
  str += '<div id="slidemenu">';
  str += '<div class="slideBg">';
  str += '<a href="#">';
  str += '<div class="title">';
  str += '<span class="slidelogo"></span>';
  str += 'Offer Selection Support';
  str += '</div>';
  str += '</a>';
  str += '<a href="content.html">';
  str += '<div style="margin-top:10px;" class="listT ' + (loch.indexOf("content") != -1 ? "active" : "") + '">';
  str += '<span class="home"></span>';
  str += 'Home';
  str += '</div>';
  str += '</a>';
  str += '<a href="database.html">';
  str += '<div class="listT ' + (loch.indexOf("database") != -1 ? "active" : "") + '">';
  str += '<span class="database"></span>';
  str += 'Database';
  str += '</div>';
  str += '</a>';
  str += '<a href="contact.html">';
  str += '<div class="listT ' + (loch.indexOf("contact") != -1 ? "active" : "") + '">';
  str += '<span class="contact"></span>';
  str += 'Contact';
  str += '</div>';
  str += '</a>';
  str += '<a href="feedback.html">';
  str += '<div class="listT ' + (loch.indexOf("feedback") != -1 ? "active" : "") + '">';
  str += '<span class="feedback"></span>';
  str += 'Feedback';
  str += '</div>';
  str += '</a>';
  str += '</div>';
  str += '</div>';
  return str;
}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function getperformance(val) {
  var ret = "";
  for (i = 0; i < val.length; i++) {
    ret += "<span class='greycircle'></span>";
  }
  return ret;
}
