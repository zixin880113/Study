(function () {
  var $ = function (id) { return document.getElementById(id); };
  var hoursOpts = [0, 0.5, 1, 1.5, 2, 2.5, 3];
  var countOpts = [0, 5, 10, 15, 20, 25, 30, 40, 50, 100];
  var days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

  function fill(sel, list, def, fmt) {
    list.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v;
      o.textContent = fmt ? fmt(v) : v;
      if (v === def) o.selected = true;
      sel.appendChild(o);
    });
  }
  var hFmt = function (v) { return v + " 小時"; };
  var cFmt = function (v) { return v + " 題"; };
  fill($("enHours"), hoursOpts, 1, hFmt);
  fill($("jpHours"), hoursOpts, 0.5, hFmt);
  fill($("enCount"), countOpts, 20, cFmt);
  fill($("enWrong"), [0,1,2,3,4,5,6,7,8,9,10,15,20,30], 0, cFmt);

  $("day").value = days[new Date().getDay()];

  function build() {
    var rest = $("status").value === "休息日";
    $("restNote").hidden = !rest;
    var eh = Number($("enHours").value);
    var jh = Number($("jpHours").value);
    var cnt = Number($("enCount").value);
    var wr = Number($("enWrong").value);
    var lines = ["日期：" + $("day").value];

    if (rest) {
      lines.push("今天休息");
    } else {
      var en = $("enTopic").value;
      if (eh === 0) {
        lines.push("英文：0 小時（今天沒讀）");
      } else {
        var detail = en;
        if (cnt > 0) detail += "，做了 " + cnt + " 題，錯 " + Math.min(wr, cnt) + " 題";
        lines.push("英文：" + eh + " 小時（" + detail + "）");
      }
      if (jh === 0) {
        lines.push("日文：0 小時（今天沒讀）");
      } else {
        lines.push("日文：" + jh + " 小時（" + $("jpTopic").value + "）");
      }
    }
    lines.push("狀態：" + $("status").value);
    var note = $("note").value.trim();
    if (note) lines.push("補充：" + note);

    $("report").textContent = lines.join("\n");
    $("total").textContent = rest ? "" : "今日合計 " + (eh + jh) + " 小時（英文 " + eh + " ＋ 日文 " + jh + "）";
    $("enPanel").style.opacity = rest ? "0.5" : "1";
    $("jpPanel").style.opacity = rest ? "0.5" : "1";
  }

  ["day","status","enHours","enTopic","enCount","enWrong","jpHours","jpTopic"].forEach(function (id) {
    $(id).addEventListener("change", build);
  });
  $("note").addEventListener("input", build);

  function selectReport() {
    var r = document.createRange();
    r.selectNodeContents($("report"));
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  $("copyBtn").addEventListener("click", function () {
    var text = $("report").textContent;
    var hint = $("hint");
    function done(ok) {
      if (ok) {
        hint.textContent = "已複製。回到對話貼上送出即可。";
        hint.className = "hint ok";
      } else {
        selectReport();
        hint.textContent = "沒辦法自動複製，文字已選取，請長按選「拷貝」。";
        hint.className = "hint";
      }
    }
    try {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } catch (e) { done(false); }
  });

  build();
})();
