// Handles opening/closing windows, dragging + resizing on desktop, and
// full-screen sheet behavior (with swipe-to-dismiss) on mobile.
//
// Also owns basic accessibility: focus moves into a window when it
// opens and back to whatever triggered it when it closes, windows are
// keyboard-dismissable via Escape, and dragging can't push a window
// entirely off-screen.

const isMobile = () => window.innerWidth <= 768;
const TOPBAR_H = 40;
const EDGE_MARGIN = 8;

let zTop = 10;
const windows = new Map<string, HTMLElement>();
let scrim: HTMLElement;
let lastTrigger: HTMLElement | null = null;

export function initWindows(): void {
  scrim = document.getElementById("scrim") as HTMLElement;

  document.querySelectorAll<HTMLElement>(".window").forEach((w) => {
    const key = w.id.replace("win-", "");
    windows.set(key, w);
  });

  document.querySelectorAll<HTMLElement>("[data-open]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.justDragged === "1") {
        delete el.dataset.justDragged;
        return;
      }
      lastTrigger = el;
      openWindow(el.dataset.open!);
    });
  });

  document.querySelectorAll<HTMLElement>(".window [data-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const w = (e.target as HTMLElement).closest(".window") as HTMLElement;
      closeWindow(w.id.replace("win-", ""));
    });
  });

  document.querySelectorAll<HTMLElement>(".window").forEach((w) => {
    w.addEventListener("mousedown", () => {
      if (!isMobile()) bringToFront(w);
    });
  });

  scrim.addEventListener("click", () => {
    document
      .querySelectorAll<HTMLElement>(".window.mobile-open")
      .forEach((w) => closeWindow(w.id.replace("win-", "")));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const openWins = [...windows.values()].filter(
      (w) => w.style.display === "flex" || w.classList.contains("mobile-open")
    );
    if (!openWins.length) return;
    const topmost = openWins.reduce((a, b) =>
      Number(b.style.zIndex || 0) > Number(a.style.zIndex || 0) ? b : a
    );
    closeWindow(topmost.id.replace("win-", ""));
  });

  applyStoredIconPositions();
  initIconDragging();
  initDragging();
  initResizing();
  initSwipeToDismiss();

  window.addEventListener("resize", () => {
    if (isMobile()) {
      document.querySelectorAll<HTMLElement>(".window").forEach((w) => {
        if (w.style.display === "flex" && !w.classList.contains("mobile-open")) {
          w.classList.add("mobile-open");
        }
      });
    } else {
      // A window positioned for a wider viewport can end up stranded
      // off-screen after a resize (e.g. rotating a tablet) — pull it back.
      document.querySelectorAll<HTMLElement>(".window").forEach((w) => {
        if (w.style.display === "flex") clampToViewport(w);
      });
    }
  });
}

export function openWindow(key: string): void {
  const w = windows.get(key);
  if (!w) return;

  if (isMobile()) {
    w.setAttribute("aria-modal", "true");
    w.style.display = "flex";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => w.classList.add("mobile-open"))
    );
    scrim.classList.add("show");
    document.body.style.overflow = "hidden";
  } else {
    w.removeAttribute("aria-modal");
    if (w.style.display === "none" || !w.style.display) {
      w.style.display = "flex";
      w.style.transform = "scale(0.92)";
      w.style.opacity = "0";
      requestAnimationFrame(() => {
        w.style.transition =
          "transform 0.18s cubic-bezier(.2,.9,.3,1.2), opacity 0.15s";
        w.style.transform = "scale(1)";
        w.style.opacity = "1";
        clampToViewport(w);
      });
    }
    bringToFront(w);
  }

  document
    .querySelectorAll(`.dock-item[data-open="${key}"]`)
    .forEach((d) => d.classList.add("open"));

  // Move focus into the window so keyboard/screen-reader users land
  // somewhere sensible instead of on a now-hidden trigger.
  const focusTarget =
    w.querySelector<HTMLElement>("[data-close]") ??
    w.querySelector<HTMLElement>("h1, input, textarea, button");
  focusTarget?.focus();
}

export function closeWindow(key: string): void {
  const w = windows.get(key);
  if (!w) return;

  if (isMobile()) {
    w.classList.remove("mobile-open");
    scrim.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!w.classList.contains("mobile-open")) w.style.display = "none";
    }, 340);
  } else {
    w.style.display = "none";
  }

  document
    .querySelectorAll(`.dock-item[data-open="${key}"]`)
    .forEach((d) => d.classList.remove("open"));

  // Return focus to whatever opened this window, if it's still on the page.
  if (lastTrigger && document.contains(lastTrigger)) {
    lastTrigger.focus();
  }
}

function bringToFront(w: HTMLElement): void {
  zTop++;
  w.style.zIndex = String(zTop);
}

// Keeps a window's title bar reachable — dragging can move a window
// around, but never lose it entirely off the visible viewport.
function clampToViewport(win: HTMLElement): void {
  const rect = win.getBoundingClientRect();
  const maxLeft = window.innerWidth - rect.width - EDGE_MARGIN;
  const maxTop = window.innerHeight - 48 - EDGE_MARGIN; // keep title bar grabbable
  const minTop = TOPBAR_H + EDGE_MARGIN;

  let left = rect.left;
  let top = rect.top;

  if (rect.width > window.innerWidth - EDGE_MARGIN * 2) {
    left = EDGE_MARGIN;
  } else {
    left = Math.min(Math.max(left, EDGE_MARGIN), Math.max(EDGE_MARGIN, maxLeft));
  }
  top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));

  win.style.left = `${left}px`;
  win.style.top = `${top}px`;
}

// ---------- desktop icon dragging ----------
const ICON_POS_KEY = "icon-positions";

function loadIconPositions(): Record<string, { top: number; left: number }> {
  try {
    return JSON.parse(localStorage.getItem(ICON_POS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveIconPosition(key: string, top: number, left: number): void {
  const positions = loadIconPositions();
  positions[key] = { top, left };
  localStorage.setItem(ICON_POS_KEY, JSON.stringify(positions));
}

function applyStoredIconPositions(): void {
  const positions = loadIconPositions();
  document.querySelectorAll<HTMLElement>(".icon[data-open]").forEach((icon) => {
    const pos = positions[icon.dataset.open!];
    if (!pos) return;
    icon.style.top = `${pos.top}px`;
    icon.style.left = `${pos.left}px`;
    icon.style.right = "";
    icon.style.bottom = "";
  });
}

function initIconDragging(): void {
  document.querySelectorAll<HTMLElement>(".icon[data-open]").forEach((icon) => {
    icon.addEventListener("mousedown", (e) => {
      if (isMobile() || e.button !== 0) return;

      const desktop = document.getElementById("desktop")!;
      const deskRect = desktop.getBoundingClientRect();
      const rect = icon.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const origLeft = rect.left - deskRect.left;
      const origTop = rect.top - deskRect.top;
      let moved = false;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        moved = true;

        const maxLeft = Math.max(0, deskRect.width - icon.offsetWidth);
        const maxTop = Math.max(TOPBAR_H, deskRect.height - icon.offsetHeight);
        const left = Math.min(Math.max(origLeft + dx, 0), maxLeft);
        const top = Math.min(Math.max(origTop + dy, TOPBAR_H), maxTop);

        icon.style.left = `${left}px`;
        icon.style.top = `${top}px`;
        icon.style.right = "";
        icon.style.bottom = "";
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        if (moved) {
          icon.dataset.justDragged = "1";
          saveIconPosition(icon.dataset.open!, parseFloat(icon.style.top), parseFloat(icon.style.left));
        }
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}

function initDragging(): void {
  document.querySelectorAll<HTMLElement>(".titlebar").forEach((bar) => {
    bar.addEventListener("mousedown", (e) => {
      if (isMobile()) return;
      if ((e.target as HTMLElement).closest("[data-close]")) return;

      const win = bar.closest(".window") as HTMLElement;
      bringToFront(win);
      const rect = win.getBoundingClientRect();
      const offX = e.clientX - rect.left;
      const offY = e.clientY - rect.top;

      const onMove = (ev: MouseEvent) => {
        win.style.left = `${ev.clientX - offX}px`;
        win.style.top = `${ev.clientY - offY}px`;
      };
      const onUp = () => {
        clampToViewport(win);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}

function initResizing(): void {
  document.querySelectorAll<HTMLElement>(".resize-handle").forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      if (isMobile()) return;
      e.stopPropagation();

      const win = handle.closest(".window") as HTMLElement;
      bringToFront(win);
      const startW = win.offsetWidth;
      const startH = win.offsetHeight;
      const startX = e.clientX;
      const startY = e.clientY;

      const onMove = (ev: MouseEvent) => {
        const maxW = window.innerWidth - win.offsetLeft - EDGE_MARGIN;
        const maxH = window.innerHeight - win.offsetTop - EDGE_MARGIN;
        win.style.width = `${Math.min(maxW, Math.max(280, startW + (ev.clientX - startX)))}px`;
        win.style.height = `${Math.min(maxH, Math.max(160, startH + (ev.clientY - startY)))}px`;
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}

function initSwipeToDismiss(): void {
  document.querySelectorAll<HTMLElement>(".window").forEach((w) => {
    const bar = w.querySelector(".titlebar") as HTMLElement;
    let startY = 0;
    let dragging = false;

    bar.addEventListener(
      "touchstart",
      (e) => {
        if (!isMobile()) return;
        if ((e.target as HTMLElement).closest("[data-close]")) return;
        startY = e.touches[0].clientY;
        dragging = true;
        w.style.transition = "none";
      },
      { passive: true }
    );

    bar.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        const dy = e.touches[0].clientY - startY;
        if (dy > 0) w.style.transform = `translateY(${dy}px)`;
      },
      { passive: true }
    );

    bar.addEventListener("touchend", (e) => {
      if (!dragging) return;
      dragging = false;
      w.style.transition = "";
      const dy = e.changedTouches[0].clientY - startY;
      w.style.transform = "";
      if (dy > 110) closeWindow(w.id.replace("win-", ""));
    });
  });
}
