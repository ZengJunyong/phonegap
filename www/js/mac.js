var mac = {
	Msg: Msg || {}
};
if (jQuery) {
	(function() {
		$.extend($.fn, {
			mac: function() {
				var func = arguments[0];
				arguments[0] = this;
				return eval("mac." + func).apply(this, arguments)
			},
			seek: function(name) {
				return $(this).find("[name=" + name + "]")
			}
		})
	})(jQuery)
}
mac.getMousePos = function(b) {
	var b = b || window.event,
		c = document,
		f = c.documentElement,
		a = c.body;
	return {
		x: b.pageX || (b.clientX + (f.scrollLeft || a.scrollLeft)),
		y: b.pageY || (b.clientY + (f.scrollTop || a.scrollTop))
	}
};
mac.eval = function(str) {
	if(typeof(str)=="object"){
		return str
	}else{
		return str ? eval("(" + str + ")") : {}
	}
};
mac.getMsg = function(c, b) {
	if (b && b.length) {
		for (var a = 0; a < b.length; a++) {
			c = c.replace("{" + a + "}", b[a])
		}
	}
	return c
};