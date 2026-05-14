/* Simple HTML include loader:
   - looks for elements like: <div data-include="./partials/nav.html"></div>
   - fetches that file and injects its HTML
*/
async function loadIncludes() {
    const nodes = document.querySelectorAll("[data-include]");
    await Promise.all(
        Array.from(nodes).map(async (node) => {
            const path = node.getAttribute("data-include");
            if (!path) return;
            try {
                const res = await fetch(path, { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const html = await res.text();
                node.innerHTML = html;
            } catch (err) {
                console.error("Failed to load include:", path, err);
            }
        })
    );
}

// After includes are loaded, run the page JS.
function initPage() {
    // Particles
    const container = document.getElementById("particles");
    if (container) {
        container.innerHTML = "";
        for (let i = 0; i < 28; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            p.style.cssText = `
                left: ${Math.random() * 100}%;
                bottom: ${Math.random() * -20}px;
                --dur: ${9 + Math.random() * 14}s;
                --delay: ${-Math.random() * 20}s;
                --drift: ${(Math.random() - 0.5) * 50}px;
                width: ${1 + Math.random() * 1.2}px;
                height: ${1 + Math.random() * 1.2}px;
            `;
            container.appendChild(p);
        }
    }

    // ASCII flicker
    const ascii = document.getElementById("ascii");
    if (ascii) {
        const original = ascii.textContent || "";
        const chars = "#*░▒";
        setInterval(() => {
            if (Math.random() > 0.5) return;
            const arr = original.split("");
            const pos = arr.reduce((a, c, i) => (c === "#" ? [...a, i] : a), []);
            const pick = pos[Math.floor(Math.random() * pos.length)];
            if (pick !== undefined) {
                arr[pick] = chars[Math.floor(Math.random() * chars.length)];
                ascii.textContent = arr.join("");
                setTimeout(() => {
                    ascii.textContent = original;
                }, 80);
            }
        }, 200);
    }

    // Hamburger menu
    const ham = document.getElementById("ham");
    const mobMenu = document.getElementById("mobMenu");

    if (ham && mobMenu) {
        ham.addEventListener("click", () => {
            ham.classList.toggle("open");
            mobMenu.classList.toggle("open");
            document.body.style.overflow = mobMenu.classList.contains("open") ? "hidden" : "";
        });
    }

    // Global close function for inline onclick handlers
    window.closeMob = function () {
        if (ham) ham.classList.remove("open");
        if (mobMenu) mobMenu.classList.remove("open");
        document.body.style.overflow = "";
    };

    // Active nav on scroll
    const secs = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll("#navLinks a");
    if (secs && links) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        links.forEach((a) => {
                            const href = a.getAttribute("href") || "";
                            a.classList.toggle("active", href === "#" + e.target.id);
                        });
                    }
                });
            },
            { threshold: 0.4 }
        );
        secs.forEach((s) => io.observe(s));
    }
}

(async () => {
    await loadIncludes();
    initPage();
})();
