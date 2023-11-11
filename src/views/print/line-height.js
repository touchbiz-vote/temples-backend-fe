export default (function () {
  function t() {
    this.name = 'lineHeight'; // 重写的参数 key
  }
  // 涉及修改元素样式， 添加一个 css 方法
  return (
    (t.prototype.css = function (t, e) {
      if (t && t.length) {
        if (e) return t.css('line-height', e + 'pt'), 'line-height:' + e + 'pt';
        t[0].style.lineHeight = '';
      }
      return null;
    }),
    // 创建 DOM
    (t.prototype.createTarget = function () {
      this.target = $(
        ' <div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        字体行高\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="number" value="" min="6" step="0.1" class="auto-submit" />\n        </div>\n    </div>'
      );
      return this.target;
    }),
    // 获取值
    (t.prototype.getValue = function () {
      var t = this.target.find('input[type="number"]').val();
      if (t) return parseFloat(t.toString());
    }),
    // 设置值
    (t.prototype.setValue = function (t) {
      this.target.find('input[type="number"]').val(t);
    }),
    // 销毁 DOM
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
