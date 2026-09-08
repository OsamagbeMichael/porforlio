import "./style.css";
import { initWindows } from "./windows";
import { initPoolsuite } from "./poolsuite";
import { api } from "./api";

// ---------- boot ----------
initWindows();
initPoolsuite();

initClock();
loadProjects();

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

// ---------- utils ----------
function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
