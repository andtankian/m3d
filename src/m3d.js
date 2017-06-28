/*!
 * Material Design Dropdown JQuery Plugin
 * author: Andrew Ribeiro
 * Licensed under the MIT license
 */

;
(function ($, window, document, undefined) {

    var pluginName = "m3d",
            defaults = {
                origin: "tl", //tl, tr, bl, br
                maxDelay: 0.3,
                position: "left" //left, center, right
            };

    function m3d(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        this.$el = $(element);
        this.lis = this.$el.children("li");
        this.lis = this.lis[0] ? this.lis : {};
        this.willDrop = true;
        this.init();
    }

    m3d.prototype = {
        init: function () {
            this.$el.css({
                display: "block"
            }).addClass("m3d-origin-" + this.options.origin);
            this.adjustTransitions(this.willDrop);
            var that = this;
            $(document).on("click", "body", function (e) {
                var target = e.target;
                var $t = $(target);
                var data = $t.data("m3d-toggle");
                if (!data || data !== that.$el.attr("id")) {
                    that.rise();
                } else {
                    if (that.willDrop)
                        that.positionIt($t);
                    that.toggle();
                }

            });
        },
        toggle: function () {
            var that = this;
            setTimeout(function () {
                that.$el.toggleClass("m3d-toggled");
                that.adjustTransitions(that.willDrop);
                that.willDrop = !that.willDrop;
            }, 1);
        },
        drop: function () {
            if (!this.$el.hasClass("m3d-toggled"))
                this.$el.addClass("m3d-toggled");
            this.adjustTransitions(true);
            this.willDrop = false;
        },
        rise: function () {
            $(this.$el.removeClass("m3d-toggled"));
            this.adjustTransitions(false);
            this.willDrop = true;
        },
        adjustTransitions: function (dropping) {
            var maxDelay = this.options.maxDelay;
            var totalItens = this.lis.size();
            totalItens = totalItens === 0 ? 1 : totalItens;
            var realDelay = maxDelay / totalItens;
            var that = this;
            if (dropping) {
                this.lis.each(function (i, e) {
                    e.style.transition = "all 0.3s ease " + realDelay * (i + 1) + "s";
                });
                this.$el.css("transition", "all 0.3s ease");
            } else {
                this.lis.each(function (i, e) {
                    e.style.transition = "all 0.2s ease " + (realDelay * 0.5) * (that.lis.size() - i) + "s";
                });
                this.$el.css("transition", "all 0.2s ease " + maxDelay * 0.5 + "s");
            }
        },
        positionIt: function (target) {
            var p = this.options.position;
            var o = this.options.origin;
            var offsetTarget = target.offset();
            var undefinedLeft;
            if (p === "left" && (o === "bl" || o === "tl"))
                undefinedLeft = offsetTarget.left;
            else if (p === "left" && (o === "br" || o === "tr"))
                undefinedLeft = offsetTarget.left + this.$el.width();
            else if (p === "right" && (o === "bl" || o === "tl"))
                undefinedLeft = offsetTarget.left + target.outerWidth() - this.$el.width();
            else if (p === "right" && (o === "br" || o === "tr"))
                undefinedLeft = offsetTarget.left + target.outerWidth();
            this.$el.offset({left: undefinedLeft});
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                        new m3d(this, options));
            }
        });
    };

})(jQuery, window, document);