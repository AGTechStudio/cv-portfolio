// SCROLL SUAVE SOLO PARA LINKS INTERNOS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// ANIMACIONES AL HACER SCROLL (FADE IN)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.section, .card, .video-card').forEach((el) => {
    el.classList.add('hidden');
    observer.observe(el);
});


// NAVBAR ACTIVA SEGÚN SECCIÓN
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === "#" + current) {
            a.classList.add("active");
        }
    });
});
const toggleBtn = document.getElementById("theme-toggle");
const icon = toggleBtn.querySelector("i");
const themeHint = document.getElementById("theme-hint");

// reflejar el ícono según el tema ya aplicado por el script inline del <head>
if (document.documentElement.classList.contains("dark-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
}

// mostrar el aviso de "podés cambiar a modo oscuro" una sola vez
if (themeHint && !localStorage.getItem("hideDarkHint") && !document.documentElement.classList.contains("dark-mode")) {
    setTimeout(() => themeHint.classList.add("show"), 1200);
    setTimeout(() => themeHint.classList.remove("show"), 7000);
}

function dismissThemeHint() {
    if (themeHint) {
        themeHint.classList.remove("show");
        localStorage.setItem("hideDarkHint", "1");
    }
}

if (themeHint) {
    themeHint.addEventListener("click", () => {
        toggleBtn.click();
    });
}

toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
    dismissThemeHint();

    if (document.documentElement.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        localStorage.setItem("theme", "light");
        icon.classList.replace("fa-sun", "fa-moon");
    }
});
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

// TERMINAL ANIMADA - AG SCANNER (simulación de consola OBD2 en loop)
const terminalOutput = document.getElementById("terminal-output");

if (terminalOutput) {
    const sequence = [
        { type: "cmd", text: "ATZ" },
        { type: "resp", text: "ELM327 v1.5" },
        { type: "cmd", text: "0100" },
        { type: "resp", text: "41 00 BE 3F A8 13" },
        { type: "cmd", text: "010C" },
        { type: "resp", text: "41 0C 1A F8 → RPM: 1782" },
        { type: "cmd", text: "010D" },
        { type: "resp", text: "41 0D 3C → Velocidad: 60 km/h" },
        { type: "cmd", text: "0105" },
        { type: "resp", text: "41 05 5A → Temp. refrigerante: 90°C" },
        { type: "cmd", text: "03" },
        { type: "resp", text: "No hay DTCs almacenados" },
        { type: "cmd", text: "ATRV" },
        { type: "resp", text: "14.2V" },
    ];

    let started = false;
    let lineIndex = 0;
    let charIndex = 0;
    const maxLines = 9;

    function typeNextChar() {
        const line = sequence[lineIndex];
        const lines = terminalOutput.querySelectorAll(".t-line");
        let currentLine = lines[lines.length - 1];

        if (charIndex === 0) {
            currentLine = document.createElement("div");
            currentLine.className = "t-line " + (line.type === "cmd" ? "cmd" : "resp");
            terminalOutput.appendChild(currentLine);
        }

        currentLine.textContent = line.text.slice(0, charIndex + 1);
        charIndex++;

        // limitar líneas visibles
        const allLines = terminalOutput.querySelectorAll(".t-line");
        if (allLines.length > maxLines) {
            terminalOutput.removeChild(allLines[0]);
        }

        if (charIndex <= line.text.length) {
            setTimeout(typeNextChar, line.type === "cmd" ? 55 : 18);
        } else {
            charIndex = 0;
            lineIndex++;
            if (lineIndex >= sequence.length) {
                setTimeout(() => {
                    terminalOutput.innerHTML = "";
                    lineIndex = 0;
                    typeNextChar();
                }, 1800);
            } else {
                setTimeout(typeNextChar, line.type === "cmd" ? 400 : 550);
            }
        }
    }

    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
                started = true;
                typeNextChar();
            }
        });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalOutput);
}

// CARRUSEL DE CAPTURAS (estilo galería) - Aula Digital, Torneos, AG Scanner
document.querySelectorAll(".screen[data-project]").forEach((screen) => {
    const project = screen.dataset.project;
    const imgs = screen.querySelectorAll("img");
    const dots = document.querySelectorAll(`[data-dots="${project}"] span`);
    let i = 0;

    if (imgs.length > 1) {
        setInterval(() => {
            imgs[i].classList.remove("active");
            dots[i].classList.remove("active");
            i = (i + 1) % imgs.length;
            imgs[i].classList.add("active");
            dots[i].classList.add("active");
        }, 2200);
    }
});