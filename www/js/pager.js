mac.pager = function(b, a) {
	a.msg = a.msg || {
		page: "{0}, {1}/{2}",
		go: "Go",
		total: "Total"
	};
	b.config = a;
	b.update = function(n, d, o, h) {
		b.empty();
		b.total = n;
		b.pageCount = o;
		b.pageNo = h;
		b.pageSize = d;
		var g = a.msg;
		b.append(mac.getMsg(g.page, [n, h, o]));
		var k = a.pagerLength,
			l = Math.floor(k / 2),
			e = k % 2;
		var f = Math.max(1, Math.min(h - l, o - k + 1));
		var j = Math.min(f + k, o + 1);
		if (f > 1) {
			b.append('<span action="1" class="pageNo">|&lt;&lt;</span>')
		}
		if (f > k) {
			var p = $('<span class="pageNo">&lt;&lt;</span>');
			p.attr("action", f - l + (e > 0) ? 0 : 1);
			b.append(p)
		}
		for (var m = f; m < j; m++) {
			var p = $('<span class="pageNo"></span>');
			if (m != h) {
				p.attr("action", m)
			}
			b.append(p.append(m))
		}
		if (j <= o - k) {
			var p = $('<span class="pageNo">&gt;&gt;</span>');
			p.attr("action", j + l);
			b.append(p)
		}
		if (j < o) {
			var p = $('<span class="pageNo">&gt;&gt;|</span>');
			b.append(p.attr("action", o))
		}
		b.children("span[action]").click(function() {
			b.pageNo = $(this).attr("action");
			a.loadPage.call(b, b.pageNo, b.pageSize)
		});
		var c = $('<input type="text" name="pageNo" />');
		c.attr("maxlength", ("" + o).length);
		c.change(function() {
			this.value = Math.max(1, Math.min(this.value, o))
		});
		b.append(c);
		$('<span class="button"></span>').click(function() {
			var i = c.val() || 1;
			if (isNaN(i) || i > b.pageCount) {
				i = 1
			}
			b.pageNo = i;
			a.loadPage.call(b, i, b.pageSize)
		}).append(g.go).appendTo(b)
	};
	return b
};