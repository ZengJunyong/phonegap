(function(c) {
	var a = ["DOMMouseScroll", "mousewheel"];
	c.event.special.mousewheel = {
		setup: function() {
			if (this.addEventListener) {
				for (var d = a.length; d;) {
					this.addEventListener(a[--d], b, false)
				}
			} else {
				this.onmousewheel = b
			}
		},
		teardown: function() {
			if (this.removeEventListener) {
				for (var d = a.length; d;) {
					this.removeEventListener(a[--d], b, false)
				}
			} else {
				this.onmousewheel = null
			}
		}
	};
	c.fn.extend({
		mousewheel: function(d) {
			return d ? this.bind("mousewheel", d) : this.trigger("mousewheel")
		},
		unmousewheel: function(d) {
			return this.unbind("mousewheel", d)
		}
	});

	function b(i) {
		var g = i || window.event,
			f = [].slice.call(arguments, 1),
			j = 0,
			h = true,
			e = 0,
			d = 0;
		i = c.event.fix(g);
		i.type = "mousewheel";
		if (i.wheelDelta) {
			j = i.wheelDelta / 120
		}
		if (i.detail) {
			j = -i.detail / 3
		}
		d = j;
		if (g.axis !== undefined && g.axis === g.HORIZONTAL_AXIS) {
			d = 0;
			e = -1 * j
		}
		if (g.wheelDeltaY !== undefined) {
			d = g.wheelDeltaY / 120
		}
		if (g.wheelDeltaX !== undefined) {
			e = -1 * g.wheelDeltaX / 120
		}
		f.unshift(i, j, e, d);
		return c.event.handle.apply(this, f)
	}
})(jQuery);