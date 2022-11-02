/*!
 * Spacing.js v1.0.7
 * Copyright (c) 2021 Steven Lei
 * Released under the MIT License.
 */ ;(() => {
    "use strict"
    var t = {
            r: (t) => {
                "undefined" != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(t, Symbol.toStringTag, {
                        value: "Module",
                    }),
                    Object.defineProperty(t, "__esModule", { value: !0 })
            },
        },
        e = {}
    function o(t, e) {
        for (var o = 0; o < e.length; o++) {
            var n = e[o]
            ;(n.enumerable = n.enumerable || !1),
                (n.configurable = !0),
                "value" in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n)
        }
    }
    t.r(e)
    var n = (function () {
        function t(e) {
            !(function (t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            })(this, t),
                (this.top = e.top),
                (this.left = e.left),
                (this.width = e.width),
                (this.height = e.height),
                (this.right = e.right),
                (this.bottom = e.bottom)
        }
        var e, n, i
        return (
            (e = t),
            (n = [
                {
                    key: "colliding",
                    value: function (t) {
                        return !(
                            this.top > t.bottom ||
                            this.right < t.left ||
                            this.bottom < t.top ||
                            this.left > t.right
                        )
                    },
                },
                {
                    key: "containing",
                    value: function (t) {
                        return (
                            this.left <= t.left &&
                            t.left < this.width &&
                            this.top <= t.top &&
                            t.top < this.height
                        )
                    },
                },
                {
                    key: "inside",
                    value: function (t) {
                        return (
                            t.top <= this.top &&
                            this.top <= t.bottom &&
                            t.top <= this.bottom &&
                            this.bottom <= t.bottom &&
                            t.left <= this.left &&
                            this.left <= t.right &&
                            t.left <= this.right &&
                            this.right <= t.right
                        )
                    },
                },
            ]) && o(e.prototype, n),
            i && o(e, i),
            t
        )
    })()
    function i(t, e, o, n, i, l) {
        var a = document.createElement("div")
        a.classList.add("spacing-js-".concat(t, "-placeholder")),
            (a.style.border = "2px solid ".concat(l)),
            (a.style.position = "fixed"),
            (a.style.background = "none"),
            (a.style.borderRadius = "2px"),
            (a.style.padding = "0"),
            (a.style.margin = "0"),
            (a.style.width = "".concat(e - 2, "px")),
            (a.style.height = "".concat(o - 2, "px")),
            (a.style.top = "".concat(n - 1, "px")),
            (a.style.left = "".concat(i - 1, "px")),
            (a.style.pointerEvents = "none"),
            (a.style.zIndex = "9999"),
            (a.style.boxSizing = "content-box"),
            document.body.appendChild(a)
        var r = document.createElement("span")
        ;(r.style.background = l),
            (r.style.position = "fixed"),
            (r.style.display = "inline-block"),
            (r.style.color = "#fff"),
            (r.style.padding = "2px 4px"),
            (r.style.fontSize = "10px")
        var s = "",
            c = n
        n < 20
            ? (n < 0 && ((c = 0), (s = "↑ ")),
              (r.style.borderRadius = "2px 0 2px 0"))
            : ((r.style.transform = "translateY(calc(-100% + 2px))"),
              (r.style.borderRadius = "2px 2px 0 0")),
            (r.style.top = "".concat(c - 1, "px")),
            (r.style.left = "".concat(i - 1, "px")),
            (r.innerText = ""
                .concat(s, " ")
                .concat(Math.round(e), "px × ")
                .concat(Math.round(o), "px")),
            a.appendChild(r)
    }
    function l(t) {
        var e
        null ===
            (e = document.querySelector(
                ".spacing-js-".concat(t, "-placeholder"),
            )) ||
            void 0 === e ||
            e.remove()
    }
    function a(t, e, o, n, i) {
        var l =
                arguments.length > 5 && void 0 !== arguments[5]
                    ? arguments[5]
                    : "none",
            a = document.createElement("span")
        ;(a.style.backgroundColor = "red"),
            (a.style.position = "fixed"),
            a.classList.add("spacing-js-marker"),
            (a.style.width = "".concat(t, "px")),
            (a.style.height = "".concat(e, "px")),
            "x" === l &&
                ((a.style.borderLeft = "1px solid rgba(255, 255, 255, .8)"),
                (a.style.borderRight = "1px solid rgba(255, 255, 255, .8)")),
            "y" === l &&
                ((a.style.borderTop = "1px solid rgba(255, 255, 255, .8)"),
                (a.style.borderBottom = "1px solid rgba(255, 255, 255, .8)")),
            (a.style.pointerEvents = "none"),
            (a.style.top = "".concat(o, "px")),
            (a.style.left = "".concat(n, "px")),
            (a.style.zIndex = "9998"),
            (a.style.boxSizing = "content-box")
        var r = document.createElement("span")
        if (
            (r.classList.add("spacing-js-value"),
            (r.style.backgroundColor = "red"),
            (r.style.color = "white"),
            (r.style.fontSize = "10px"),
            (r.style.display = "inline-block"),
            (r.style.fontFamily = "Helvetica, sans-serif"),
            (r.style.fontWeight = "bold"),
            (r.style.borderRadius = "20px"),
            (r.style.position = "fixed"),
            (r.style.width = "42px"),
            (r.style.lineHeight = "15px"),
            (r.style.height = "16px"),
            (r.style.textAlign = "center"),
            (r.style.zIndex = "10000"),
            (r.style.pointerEvents = "none"),
            (r.innerText = i),
            (r.style.boxSizing = "content-box"),
            "x" === l)
        ) {
            var s = o + e / 2 - 7
            s > document.documentElement.clientHeight - 20 &&
                (s = document.documentElement.clientHeight - 20),
                s < 0 && (s = 6),
                (r.style.top = "".concat(s, "px")),
                (r.style.left = "".concat(n + 6, "px"))
        } else if ("y" === l) {
            var c = n + t / 2 - 20
            c > document.documentElement.clientWidth - 48 &&
                (c = document.documentElement.clientWidth - 48),
                c < 0 && (c = 6),
                (r.style.top = "".concat(o + 6, "px")),
                (r.style.left = "".concat(c, "px"))
        }
        document.body.appendChild(a), document.body.appendChild(r)
    }
    function r(t, e, o, n) {
        var i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4]
        if ("top" === o) {
            var l = 1,
                r = Math.abs(t.top - e.top),
                s = Math.floor(
                    (Math.min(t.right, e.right) + Math.max(t.left, e.left)) / 2,
                ),
                c = Math.min(t.top, e.top)
            if (i) {
                if (t.top < e.top) return
                if (t.right < e.left || t.left > e.right) return
                ;(r = Math.abs(e.bottom - t.top)),
                    (c = Math.min(e.bottom, t.top))
            }
            a(l, r, c, s, n, "x")
        } else if ("left" === o) {
            var h = Math.abs(t.left - e.left),
                d = 1,
                p = Math.floor(
                    (Math.min(t.bottom, e.bottom) + Math.max(t.top, e.top)) / 2,
                ),
                f = Math.min(t.left, e.left)
            if (i) {
                if (t.left < e.left) return
                if (t.bottom < e.top || t.top > e.bottom) return
                ;(h = Math.abs(t.left - e.right)),
                    (f = Math.min(e.right, t.left))
            }
            a(h, d, p, f, n, "y")
        } else if ("right" === o) {
            var u = Math.abs(t.right - e.right),
                m = 1,
                b = Math.floor(
                    (Math.min(t.bottom, e.bottom) + Math.max(t.top, e.top)) / 2,
                ),
                g = Math.min(t.right, e.right)
            if (i) {
                if (t.left > e.right) return
                if (t.bottom < e.top || t.top > e.bottom) return
                u = Math.abs(t.right - e.left)
            }
            a(u, m, b, g, n, "y")
        } else if ("bottom" === o) {
            var y = 1,
                x = Math.abs(t.bottom - e.bottom),
                v = Math.min(t.bottom, e.bottom),
                M = Math.floor(
                    (Math.min(t.right, e.right) + Math.max(t.left, e.left)) / 2,
                )
            if (i) {
                if (e.bottom < t.top) return
                if (t.right < e.left || t.left > e.right) return
                x = Math.abs(t.bottom - e.top)
            }
            a(y, x, v, M, n, "x")
        }
    }
    function s() {
        document.querySelectorAll(".spacing-js-marker").forEach(function (t) {
            t.remove()
        }),
            document
                .querySelectorAll(".spacing-js-value")
                .forEach(function (t) {
                    t.remove()
                })
    }
    var c,
        h,
        d = !1,
        p = null,
        f = !1,
        u = null
    function m(t) {
        f && (g(), u && (clearTimeout(u), (u = null))),
            "Alt" !== t.key ||
                d ||
                (t.preventDefault(),
                (d = !0),
                (function () {
                    if (p && p !== c) {
                        ;(c = p), l("selected")
                        var t = c.getBoundingClientRect()
                        i("selected", t.width, t.height, t.top, t.left, "red")
                    }
                })(),
                x(!0)),
            t.shiftKey && (f = !0)
    }
    function b(t) {
        "Alt" === t.key &&
            d &&
            ((d = !1),
            (u = setTimeout(
                function () {
                    g()
                },
                f ? 3e3 : 0,
            )))
    }
    function g() {
        l("selected"), l("target"), (f = !1), (c = null), (h = null), s(), x(!1)
    }
    function y(t) {
        ;(p = t.composedPath ? t.composedPath()[0] : t.target),
            d &&
                new Promise(function (t, e) {
                    if (d && p && p !== c && p !== h) {
                        ;(h = p), l("target")
                        var o = h.getBoundingClientRect()
                        i("target", o.width, o.height, o.top, o.left, "blue"),
                            t()
                    }
                }).then(function () {
                    if (null != c && null != h) {
                        var t,
                            e,
                            o,
                            i,
                            l,
                            a = c.getBoundingClientRect(),
                            d = h.getBoundingClientRect(),
                            p = new n(a),
                            f = new n(d)
                        s(),
                            p.containing(f) || p.inside(f) || p.colliding(f)
                                ? ((t = Math.round(Math.abs(a.top - d.top))),
                                  (e = Math.round(
                                      Math.abs(a.bottom - d.bottom),
                                  )),
                                  (o = Math.round(Math.abs(a.left - d.left))),
                                  (i = Math.round(Math.abs(a.right - d.right))),
                                  (l = !1))
                                : ((t = Math.round(Math.abs(a.top - d.bottom))),
                                  (e = Math.round(Math.abs(a.bottom - d.top))),
                                  (o = Math.round(Math.abs(a.left - d.right))),
                                  (i = Math.round(Math.abs(a.right - d.left))),
                                  (l = !0)),
                            r(p, f, "top", "".concat(t, "px"), l),
                            r(p, f, "bottom", "".concat(e, "px"), l),
                            r(p, f, "left", "".concat(o, "px"), l),
                            r(p, f, "right", "".concat(i, "px"), l)
                    }
                })
    }
    function x(t) {
        t
            ? (window.addEventListener("DOMMouseScroll", v, !1),
              window.addEventListener("wheel", v, { passive: !1 }),
              window.addEventListener("mousewheel", v, { passive: !1 }))
            : (window.removeEventListener("DOMMouseScroll", v),
              window.removeEventListener("wheel", v),
              window.removeEventListener("mousewheel", v))
    }
    function v(t) {
        t.preventDefault()
    }
    ;({
        start: function () {
            document.body
                ? (window.addEventListener("keydown", m),
                  window.addEventListener("keyup", b),
                  window.addEventListener("mousemove", y))
                : console.warn(
                      "Unable to initialize, document.body does not exist.",
                  )
        },
    }.start(),
        (window.Spacing = e))
})()
