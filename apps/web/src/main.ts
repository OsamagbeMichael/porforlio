import "./style.css";
import { initWindows, openWindow } from "./windows";
import { api, art, type AvailabilitySlot } from "./api";

// ---------- boot ----------
initWindows();
if (window.innerWidth > 768) {
  openWindow("about");
  openWindow("projects");
}

initClock();
initCountdown();
initWallpaper();
loadProjects();
loadNotes();
loadWritingStats();
initCalendar();
initContactForm();

// ---------- clock ----------
function initClock(): void {
  const el = document.getElementById("clock")!;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  tick();
  setInterval(tick, 1000);
}

// ---------- "running out of time" ticker ----------
function initCountdown(): void {
  const el = document.getElementById("cd-text")!;
  const start = new Date("2021-01-01");
  const compact = window.matchMedia("(max-width: 768px)");
  const update = () => {
    const days = Math.floor((Date.now() - start.getTime()) / 86_400_000);
    el.textContent = compact.matches
      ? `${days.toLocaleString()} days running`
      : `${days.toLocaleString()} days making things`;
  };
  update();
  compact.addEventListener("change", update);
  setInterval(update, 60_000);
}

// ---------- generative wallpaper (Python service) ----------
function initWallpaper(): void {
  const desktop = document.getElementById("desktop")!;
  let seed = sessionStorage.getItem("wallpaper-seed");
  if (!seed) {
    seed = Math.random().toString(36).slice(2);
    sessionStorage.setItem("wallpaper-seed", seed);
  }
  const url = art.wallpaperUrl(seed);
  const probe = new Image();
  probe.onload = () => {
    desktop.style.backgroundImage = `url("${url}")`;
  };
  probe.onerror = () => {
    // art-service not running — keep the flat CSS fallback color
    console.warn("Wallpaper service unavailable, using fallback background.");
  };
  probe.src = url;
}

// ---------- projects ----------
async function loadProjects(): Promise<void> {
  const list = document.getElementById("projects-list")!;
  try {
    const projects = await api.getProjects();
    if (!projects.length) {
      list.innerHTML = `<p class="sub">Nothing published yet — check back soon.</p>`;
      return;
    }
    list.innerHTML = projects
      .map((p) => {
        const statusClass =
          p.status === "SHIPPED" ? "done" : p.status === "IN_PROGRESS" ? "progress" : "";
        const statusLabel =
          p.status === "LIVE" ? "live" : p.status === "IN_PROGRESS" ? "in progress" : "shipped";
        return `
          <div class="proj-row">
            <div>
              <div class="proj-name">${escapeHtml(p.name)}</div>
              <div class="proj-meta">${escapeHtml(p.stack.join(" · "))}</div>
              <div class="proj-desc">${escapeHtml(p.description)}</div>
            </div>
            <span class="proj-status ${statusClass}">${statusLabel}</span>
          </div>`;
      })
      .join("");
  } catch (err) {
    list.innerHTML = `<p class="sub">Couldn't reach the API — is it running on ${
      import.meta.env.VITE_API_URL
    }?</p>`;
    console.error(err);
  }
}

// ---------- field notes ----------
async function loadNotes(): Promise<void> {
  const list = document.getElementById("notes-list")!;
  try {
    const notes = await api.getNotes();
    if (!notes.length) {
      list.innerHTML = `<p class="sub">No notes yet.</p>`;
      return;
    }
    list.innerHTML = notes
      .map(
        (n) => `
          <div class="note-item">
            <div class="note-title">${escapeHtml(n.title)}</div>
            <div class="note-date">${new Date(n.createdAt).toLocaleDateString()}</div>
            <p class="body-text">${escapeHtml(n.body)}</p>
          </div>`
      )
      .join("");
  } catch (err) {
    list.innerHTML = `<p class="sub">Couldn't load notes.</p>`;
    console.error(err);
  }
}

// ---------- writing stats badge (Python service) ----------
async function loadWritingStats(): Promise<void> {
  const badge = document.getElementById("writing-stats")!;
  try {
    const stats = await art.getWritingStats();
    badge.style.display = "inline-flex";
    badge.innerHTML = `
      <div><strong>${stats.totalWords}</strong>words written</div>
      <div><strong>${stats.totalNotes}</strong>notes</div>
      <div><strong>${stats.longestStreakDays}</strong>day streak</div>
    `;
  } catch {
    // art-service optional — fail quietly, badge just stays hidden
  }
}

// ---------- calendar ----------
let selectedSlot: AvailabilitySlot | null = null;

async function initCalendar(): Promise<void> {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = document.getElementById("cal-month")!;
  const grid = document.getElementById("cal-grid")!;
  const bookForm = document.getElementById("book-form") as HTMLFormElement;
  const bookBtn = document.getElementById("book-btn") as HTMLButtonElement;
  const bookHint = document.getElementById("book-hint")!;
  const selectedLabel = document.getElementById("book-selected-label")!;
  const status = document.getElementById("book-status")!;

  monthLabel.textContent = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  let slots: AvailabilitySlot[] = [];
  try {
    slots = await api.getAvailability(month);
  } catch (err) {
    grid.innerHTML = `<p class="sub">Couldn't load availability.</p>`;
    console.error(err);
    return;
  }

  const slotsByDay = new Map<number, AvailabilitySlot>();
  slots.forEach((s) => slotsByDay.set(new Date(s.date).getDate(), s));

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstWeekday = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7; // Mon=0

  const headers = ["M", "T", "W", "T", "F", "S", "S"]
    .map((d) => `<div class="cal-cell head">${d}</div>`)
    .join("");

  const blanks = Array.from({ length: firstWeekday }, () => `<div class="cal-cell"></div>`).join("");

  const cells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const isToday = day === now.getDate();
    const slot = slotsByDay.get(day);
    const classes = ["cal-cell"];
    let title = "";
    if (isToday) classes.push("today");
    if (slot?.available) {
      classes.push("avail");
      title = "Available — click to book";
    } else if (slot && !slot.available) {
      classes.push("unavail");
      title = "Already booked";
    } else {
      classes.push("unavail");
      title = "Not bookable";
    }
    return `<div class="${classes.join(" ")}" data-day="${day}" title="${title}">${day}</div>`;
  }).join("");

  grid.innerHTML = headers + blanks + cells;

  grid.querySelectorAll<HTMLElement>(".cal-cell.avail").forEach((cell) => {
    cell.addEventListener("click", () => {
      const day = Number(cell.dataset.day);
      const slot = slotsByDay.get(day)!;
      grid.querySelectorAll(".cal-cell.selected").forEach((c) => c.classList.remove("selected"));
      cell.classList.add("selected");
      selectedSlot = slot;

      selectedLabel.textContent = `Booking ${new Date(slot.date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })}`;
      bookForm.style.display = "block";
      bookHint.style.display = "none";
      status.textContent = "";
      status.className = "form-status";
    });
  });

  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const data = new FormData(bookForm);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name || !email) return;

    bookBtn.disabled = true;
    status.className = "form-status";
    status.textContent = "Booking…";

    try {
      await api.book({ slotId: selectedSlot.id, name, email });
      status.className = "form-status ok";
      status.textContent = "Booked — confirmation coming your way.";
      bookBtn.textContent = "Booked";
      bookForm.querySelectorAll("input").forEach((el) => (el.disabled = true));
    } catch (err) {
      status.className = "form-status err";
      status.textContent = err instanceof Error ? err.message : "Something went wrong.";
      bookBtn.disabled = false;
    }
  });
}

// ---------- contact form ----------
function initContactForm(): void {
  const form = document.getElementById("contact-form") as HTMLFormElement;
  const status = document.getElementById("contact-status")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const submitBtn = form.querySelector("button[type=submit]") as HTMLButtonElement;
    submitBtn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";

    try {
      await api.sendContact(payload);
      status.className = "form-status ok";
      status.textContent = "Sent — talk soon.";
      form.reset();
    } catch (err) {
      status.className = "form-status err";
      status.textContent = err instanceof Error ? err.message : "Couldn't send that.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ---------- utils ----------
function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
