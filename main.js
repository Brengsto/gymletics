(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // ---------- Header & menu ----------
  var header = document.getElementById("header");
  var toggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    header.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(!header.classList.contains("open"));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // Highlight the current page in the navigation
  var page = location.pathname.split("/").pop() || "index.html";
  if (page === "checkout.html") page = "join.html";
  Array.prototype.forEach.call(navLinks.querySelectorAll("a"), function (a) {
    if (a.getAttribute("href") === page) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Class schedule (classes.html) ----------
  var scheduleEl = document.getElementById("schedule");
  if (scheduleEl) {
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var catLabels = { strength: "Strength", cardio: "Cardio", mind: "Body & Mind" };

    var plan = {
      Mon: [
        ["7:00 AM", "Morning Burn", "cardio", "Lisa", "45 min"],
        ["12:15 PM", "Lunch Express Circuit", "strength", "Jonas", "30 min"],
        ["6:00 PM", "HIIT", "cardio", "Marco", "45 min"],
        ["7:30 PM", "Power Yoga", "mind", "Anna", "60 min"]
      ],
      Tue: [
        ["7:00 AM", "Functional Training", "strength", "Jonas", "45 min"],
        ["5:30 PM", "Spinning", "cardio", "Lisa", "45 min"],
        ["6:30 PM", "Barbell Workshop", "strength", "Marco", "60 min"],
        ["8:00 PM", "Pilates", "mind", "Anna", "45 min"]
      ],
      Wed: [
        ["9:00 AM", "Healthy Back", "mind", "Anna", "45 min"],
        ["12:15 PM", "Lunch Express Circuit", "strength", "Jonas", "30 min"],
        ["6:00 PM", "Boxing Fitness", "cardio", "Marco", "60 min"],
        ["7:30 PM", "Stretch & Relax", "mind", "Lisa", "45 min"]
      ],
      Thu: [
        ["7:00 AM", "Morning Burn", "cardio", "Lisa", "45 min"],
        ["5:30 PM", "Kettlebell", "strength", "Marco", "45 min"],
        ["6:30 PM", "Spinning", "cardio", "Lisa", "45 min"],
        ["8:00 PM", "Yoga Flow", "mind", "Anna", "60 min"]
      ],
      Fri: [
        ["7:00 AM", "Functional Training", "strength", "Jonas", "45 min"],
        ["4:30 PM", "HIIT", "cardio", "Marco", "45 min"],
        ["6:00 PM", "Glutes & Core", "strength", "Jonas", "45 min"],
        ["7:00 PM", "Mobility Flow", "mind", "Anna", "45 min"]
      ],
      Sat: [
        ["10:00 AM", "Bootcamp", "cardio", "Marco", "60 min"],
        ["11:30 AM", "Power Yoga", "mind", "Anna", "60 min"],
        ["1:00 PM", "Strength Basics", "strength", "Jonas", "60 min"]
      ],
      Sun: [
        ["10:00 AM", "Yoga Flow", "mind", "Anna", "60 min"],
        ["11:30 AM", "Spinning", "cardio", "Lisa", "45 min"]
      ]
    };

    var todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0
    var state = { day: days[todayIdx], cat: "all" };
    var tabsEl = document.getElementById("dayTabs");
    var filtersEl = document.getElementById("filters");

    days.forEach(function (d, i) {
      var b = document.createElement("button");
      b.className = "tab";
      b.type = "button";
      b.textContent = d;
      b.title = dayNames[i];
      b.setAttribute("role", "tab");
      b.dataset.day = d;
      tabsEl.appendChild(b);
    });

    var render = function () {
      Array.prototype.forEach.call(tabsEl.children, function (b) {
        var on = b.dataset.day === state.day;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      Array.prototype.forEach.call(filtersEl.children, function (b) {
        var on = b.dataset.cat === state.cat;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });

      var items = plan[state.day].filter(function (c) {
        return state.cat === "all" || c[2] === state.cat;
      });

      if (!items.length) {
        scheduleEl.innerHTML = '<div class="empty">No classes in this category on ' + dayNames[days.indexOf(state.day)] + '.</div>';
        return;
      }

      scheduleEl.innerHTML = items.map(function (c) {
        return '<div class="class-row">' +
          '<div class="class-time">' + escapeHtml(c[0]) + '</div>' +
          '<div class="class-info"><div class="class-name">' + escapeHtml(c[1]) + '</div></div>' +
          '<div class="class-meta">with ' + escapeHtml(c[3]) + ' · ' + escapeHtml(c[4]) + '</div>' +
          '<span class="badge badge-' + c[2] + '">' + escapeHtml(catLabels[c[2]]) + '</span>' +
          '</div>';
      }).join("");
    };

    tabsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".tab");
      if (!b) return;
      state.day = b.dataset.day;
      render();
    });
    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest(".filter");
      if (!b) return;
      state.cat = b.dataset.cat;
      render();
    });
    render();
  }

  // ---------- Newsletter (join.html) ----------
  var form = document.getElementById("newsletterForm");
  if (form) {
    var nameIn = document.getElementById("name");
    var emailIn = document.getElementById("email");
    var termsCheck = document.getElementById("termsCheck");
    var newsCheck = document.getElementById("newsCheck");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var setError = function (input, el, msg) {
      el.textContent = msg;
      if (input) {
        input.classList.toggle("invalid", !!msg);
        input.setAttribute("aria-invalid", msg ? "true" : "false");
      }
    };

    var makeCode = function () {
      var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      var out = "GYMLETICS20-";
      for (var i = 0; i < 5; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
      return out;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = nameIn.value.trim();
      var email = emailIn.value.trim();

      if (name.length < 2) { setError(nameIn, document.getElementById("nameError"), "Please enter your first name."); ok = false; }
      else setError(nameIn, document.getElementById("nameError"), "");

      if (!emailRe.test(email)) { setError(emailIn, document.getElementById("emailError"), "Please enter a valid email address."); ok = false; }
      else setError(emailIn, document.getElementById("emailError"), "");

      var checkErr = document.getElementById("checkError");
      if (!termsCheck.checked || !newsCheck.checked) {
        checkErr.textContent = "Please confirm both boxes to receive your discount.";
        ok = false;
      } else {
        checkErr.textContent = "";
      }

      if (!ok) return;

      document.getElementById("successTitle").textContent = "Welcome, " + name + "!";
      var code = makeCode();
      document.getElementById("codeOut").textContent = code;
      document.getElementById("checkoutLink").href = "checkout.html?plan=premium&code=" + encodeURIComponent(code);
      form.hidden = true;
      document.getElementById("successBox").hidden = false;
    });
  }

  // ---------- Checkout (checkout.html) ----------
  var coForm = document.getElementById("checkoutForm");
  if (coForm) {
    var plans = {
      basic: { name: "Basic", price: 29.9, unit: "month", discountable: true },
      premium: { name: "Premium", price: 39.9, unit: "month", discountable: true },
      daypass: { name: "Day Pass", price: 12, unit: "day", discountable: false }
    };
    var codeRe = /^GYMLETICS20-[A-Z0-9]{5}$/;
    var params = new URLSearchParams(location.search);
    var co = { plan: plans[params.get("plan")] ? params.get("plan") : "premium", code: "" };

    var planInputs = coForm.querySelectorAll('input[name="plan"]');
    var codeIn = document.getElementById("discountCode");
    var codeMsg = document.getElementById("codeMsg");
    var startIn = document.getElementById("startDate");
    var minTermBox = document.getElementById("minTermBox");
    var minTermLabel = document.getElementById("minTermLabel");
    var minTermCheck = document.getElementById("minTermCheck");
    var summaryEl = document.getElementById("summary");

    var euro = function (n) { return "€" + n.toFixed(2); };
    var isoDate = function (d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    };
    var today = isoDate(new Date());
    startIn.min = today;
    startIn.value = today;

    var row = function (label, value, cls) {
      return '<div class="summary-row' + (cls ? " " + cls : "") + '"><span>' + label + "</span><span>" + value + "</span></div>";
    };

    var renderCheckout = function () {
      var p = plans[co.plan];
      var hasDiscount = !!co.code && p.discountable;

      Array.prototype.forEach.call(planInputs, function (inp) {
        inp.checked = inp.value === co.plan;
        inp.closest(".plan-option").classList.toggle("selected", inp.checked);
      });

      document.getElementById("startLabel").textContent = p.unit === "day" ? "Visit date" : "Start date";
      minTermBox.hidden = !hasDiscount;
      minTermLabel.hidden = !hasDiscount;
      if (!hasDiscount) minTermCheck.checked = false;

      if (co.code && !p.discountable) {
        codeMsg.className = "error-msg";
        codeMsg.textContent = "Your code is saved, but it only applies to Basic and Premium memberships.";
      }

      var html = row("Plan", escapeHtml(p.name));
      html += row("Regular price", euro(p.price) + " / " + p.unit);
      if (hasDiscount) {
        var reduced = Math.round(p.price * 80) / 100;
        html += row("Discount code", escapeHtml(co.code));
        html += row("Discount", "−20%", "is-saving");
        html += row("Months 1–6", euro(reduced) + " / month");
        html += row("From month 7", euro(p.price) + " / month");
        html += row("Minimum term", "6 months");
        html += row("You save", euro(Math.round((p.price - reduced) * 600) / 100), "is-saving");
      } else if (p.unit === "month") {
        html += row("Billing", "Monthly");
      }
      if (p.unit === "day") {
        html += row("Due on your visit", euro(p.price), "summary-total");
        html += '<p class="summary-note">Pay at reception when you arrive.</p>';
      } else {
        html += row("Due today", euro(0), "summary-total");
        html += '<p class="summary-note">Your first monthly payment is due on your start date.</p>';
      }
      summaryEl.innerHTML = html;
    };

    var applyCode = function () {
      var val = codeIn.value.trim().toUpperCase();
      codeIn.value = val;
      if (!val) {
        co.code = "";
        codeMsg.className = "error-msg";
        codeMsg.textContent = "Please enter a discount code.";
      } else if (!codeRe.test(val)) {
        co.code = "";
        codeMsg.className = "error-msg";
        codeMsg.textContent = "This code is not valid. Codes look like GYMLETICS20-AB12C.";
      } else {
        co.code = val;
        codeMsg.className = "error-msg ok-msg";
        codeMsg.textContent = "Code applied: 20% off your first 6 months.";
      }
      renderCheckout();
    };

    document.getElementById("planOptions").addEventListener("change", function (e) {
      if (e.target.name !== "plan") return;
      co.plan = e.target.value;
      if (co.code && plans[co.plan].discountable) {
        codeMsg.className = "error-msg ok-msg";
        codeMsg.textContent = "Code applied: 20% off your first 6 months.";
      }
      renderCheckout();
    });
    document.getElementById("applyCode").addEventListener("click", applyCode);
    codeIn.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); applyCode(); }
    });

    if (params.get("code")) {
      codeIn.value = params.get("code");
      applyCode();
    }
    renderCheckout();

    coForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var p = plans[co.plan];
      var emailRe2 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      var fields = [
        ["firstName", function (v) { return v.length >= 2; }, "Please enter your first name."],
        ["lastName", function (v) { return v.length >= 2; }, "Please enter your last name."],
        ["coEmail", function (v) { return emailRe2.test(v); }, "Please enter a valid email address."],
        ["startDate", function (v) { return !!v && v >= today; }, "Please choose today or a future date."]
      ];
      fields.forEach(function (f) {
        var input = document.getElementById(f[0]);
        var valid = f[1](input.value.trim());
        document.getElementById(f[0] + "Error").textContent = valid ? "" : f[2];
        input.classList.toggle("invalid", !valid);
        input.setAttribute("aria-invalid", valid ? "false" : "true");
        if (!valid) ok = false;
      });

      var checkErr = document.getElementById("coCheckError");
      var needMinTerm = !!co.code && p.discountable;
      if (!document.getElementById("agbCheck").checked || (needMinTerm && !minTermCheck.checked)) {
        checkErr.textContent = needMinTerm ? "Please confirm both boxes to continue." : "Please accept the membership terms to continue.";
        ok = false;
      } else {
        checkErr.textContent = "";
      }

      if (!ok) {
        var firstBad = coForm.querySelector(".invalid");
        if (firstBad) firstBad.focus();
        return;
      }

      var first = document.getElementById("firstName").value.trim();
      var date = new Date(startIn.value + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      var orderNo = "GL-";
      for (var i = 0; i < 6; i++) orderNo += chars.charAt(Math.floor(Math.random() * chars.length));

      document.getElementById("confirmTitle").textContent = "You're in, " + first + "!";
      document.getElementById("confirmText").textContent = p.unit === "day"
        ? "Your Day Pass is booked for " + date + ". Show your order number at reception."
        : "Your " + p.name + " membership starts on " + date + (needMinTerm ? " with 20% off for the first 6 months." : ".") + " Your order number:";
      document.getElementById("orderNo").textContent = orderNo;
      document.getElementById("checkout").hidden = true;
      document.getElementById("confirmBox").hidden = false;
      window.scrollTo(0, document.getElementById("confirmBox").getBoundingClientRect().top + window.scrollY - 100);
    });
  }

  // ---------- Image fallback ----------
  Array.prototype.forEach.call(document.querySelectorAll("img"), function (img) {
    function hide() { img.style.visibility = "hidden"; }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) hide();
    else img.addEventListener("error", hide);
  });

  // ---------- Reveal animation ----------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("visible"); });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
