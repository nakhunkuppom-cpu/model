// Navbar shrink on scroll
const navEl = document.querySelector('nav');
if (navEl) {
    window.addEventListener('scroll', () => {
        navEl.classList.toggle('scrolled', window.scrollY > 60);
    });
}

// Smooth scrolling for in-page anchor links only
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ============================================================
//  FILE UPLOAD - Real implementation
// ============================================================
let uploadedFile = null;

function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        showFilePreview(file);
    }
}

function handleDrop(event) {
    event.preventDefault();
    const zone = document.getElementById('upload-zone');
    zone.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file) {
        // Also set the file on the hidden input
        const dt = new DataTransfer();
        dt.items.add(file);
        document.getElementById('file-input').files = dt.files;
        showFilePreview(file);
    }
}

function showFilePreview(file) {
    uploadedFile = file;
    const ext = file.name.split('.').pop().toLowerCase();
    const icons = { pdf: 'fa-file-pdf', csv: 'fa-file-csv', jpg: 'fa-file-image', jpeg: 'fa-file-image', png: 'fa-file-image' };
    const sizeKB = (file.size / 1024).toFixed(1);

    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('file-preview').style.display = 'flex';
    document.getElementById('file-name').innerText = file.name;
    document.getElementById('file-size').innerText = `${sizeKB} KB · ${ext.toUpperCase()}`;
    document.querySelector('#file-preview i').className = `fa-solid ${icons[ext] || 'fa-file'} text-accent`;
}

function clearFile() {
    uploadedFile = null;
    document.getElementById('file-input').value = '';
    document.getElementById('file-preview').style.display = 'none';
    document.getElementById('upload-zone').style.display = 'flex';
}

// ============================================================
//  APP SCAN - Detailed multi-step AI flow
// ============================================================
const PROGRESS_STEPS = [
    { id: 'ps-0', label: 'กำลังดึงภาพดาวเทียม Sentinel-2...', pct: 20 },
    { id: 'ps-1', label: 'AI กำลังวิเคราะห์สเปกตรัมดิน (NDVI / NDMI)...', pct: 40 },
    { id: 'ps-2', label: 'Generative Model จำลองระบบ Microbiome...', pct: 65 },
    { id: 'ps-3', label: 'สร้าง Nano-Microbial Recipe...', pct: 82 },
    { id: 'ps-4', label: 'คำนวณ Carbon Credits บน Blockchain...', pct: 100 },
];

function startScan() {
    const btn = document.getElementById('btn-scan');
    const scanLine = document.getElementById('scan-line');
    const coordDisplay = document.getElementById('coord-display');
    const resultPanel = document.getElementById('analysis-result');
    const progressPanel = document.getElementById('ai-progress');

    // Read manual coords if entered
    const inputLat = document.getElementById('input-lat')?.value;
    const inputLng = document.getElementById('input-lng')?.value;
    const baseLat = parseFloat(inputLat) || 13.7563;
    const baseLng = parseFloat(inputLng) || 100.5018;

    // Reset UI
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังประมวลผล...';
    resultPanel.classList.remove('show');
    resultPanel.style.display = 'none';

    // Show progress panel
    if (progressPanel) {
        progressPanel.classList.add('show');
    }

    // Reset all steps
    PROGRESS_STEPS.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) el.className = 'prog-step';
    });
    setProgressBar(0);

    // Scan animation
    if (scanLine) scanLine.classList.add('active');

    // Randomize coordinates around base
    let scanCount = 0;
    const coordInterval = setInterval(() => {
        const lat = (baseLat + (Math.random() - 0.5) * 0.005).toFixed(4);
        const lng = (baseLng + (Math.random() - 0.5) * 0.005).toFixed(4);
        coordDisplay.innerText = `Lat: ${lat}, Lng: ${lng}`;
        scanCount++;
        if (scanCount > 30) clearInterval(coordInterval);
    }, 80);

    // Run through each AI step sequentially
    PROGRESS_STEPS.forEach((step, i) => {
        setTimeout(() => {
            // Mark all previous as done
            for (let j = 0; j < i; j++) {
                const el = document.getElementById(PROGRESS_STEPS[j].id);
                if (el) el.className = 'prog-step done';
            }
            // Mark current as active
            const curr = document.getElementById(step.id);
            if (curr) curr.className = 'prog-step active';

            // Update label and bar
            const label = document.getElementById('progress-label');
            if (label) label.innerText = step.label;
            setProgressBar(step.pct);

            // Last step → show results
            if (i === PROGRESS_STEPS.length - 1) {
                setTimeout(() => {
                    curr.className = 'prog-step done';
                    if (scanLine) scanLine.classList.remove('active');
                    if (progressPanel) progressPanel.classList.remove('show');

                    // Set final coord
                    const finalLat = (baseLat + (Math.random() - 0.5) * 0.001).toFixed(4);
                    const finalLng = (baseLng + (Math.random() - 0.5) * 0.001).toFixed(4);
                    coordDisplay.innerText = `Lat: ${finalLat}, Lng: ${finalLng}`;

                    const lbl = document.getElementById('result-coord-label');
                    if (lbl) lbl.innerText = `พิกัด: ${finalLat}°N, ${finalLng}°E ${uploadedFile ? '· ใช้ข้อมูลจาก: ' + uploadedFile.name : ''}`;

                    resultPanel.style.display = '';
                    requestAnimationFrame(() => resultPanel.classList.add('show'));

                    btn.innerHTML = '<i class="fa-solid fa-microchip"></i> วิเคราะห์ด้วย AI';
                    btn.disabled = false;
                }, 700);
            }
        }, i * 1000);
    });
}

function setProgressBar(pct) {
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = pct + '%';
}

function orderRecipe() {
    const btn = document.getElementById('btn-order');
    if (!btn) return;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่งคำสั่ง...';

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> ส่งสำเร็จ! ติดตามที่ Bio-Hub App';
        btn.style.background = 'var(--accent-hover)';
    }, 1500);
}

function resetScan() {
    const resultPanel = document.getElementById('analysis-result');
    const progressPanel = document.getElementById('ai-progress');
    if (resultPanel) { resultPanel.classList.remove('show'); resultPanel.style.display = 'none'; }
    if (progressPanel) progressPanel.classList.remove('show');

    const btn = document.getElementById('btn-order');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-industry"></i> ส่งคำสั่งผลิตไปยัง Bio-Hub'; btn.style.background = ''; }

    const coordDisplay = document.getElementById('coord-display');
    if (coordDisplay) coordDisplay.innerText = 'Lat: --.----, Lng: --.----';
    setProgressBar(0);
}

// ============================================================
//  UNIFIED SCROLL ANIMATION SYSTEM
// ============================================================
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Fade-up (default) – sections, cards, panels
document.querySelectorAll(
    '.step-card, .simulator-container, .ledger-dashboard, .badge-item, .map-panel'
).forEach((el, i) => {
    el.classList.add('anim-hidden');
    const delay = (i % 5) * 0.1;
    el.style.transitionDelay = `${delay}s`;
    animObserver.observe(el);
});

// Slide-in from left – feature cards on odd index
document.querySelectorAll('.feature-card').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'anim-from-left' : 'anim-from-right');
    el.style.transitionDelay = `${(i % 3) * 0.15}s`;
    animObserver.observe(el);
});

// Scale-in – achievement badges
document.querySelectorAll('.achievements-panel').forEach((el, i) => {
    el.classList.add('anim-scale');
    el.style.transitionDelay = `${i * 0.2}s`;
    animObserver.observe(el);
});

// Slide ledger ticker items from top
document.querySelectorAll('.ledger-ticker .ticker-item').forEach((el, i) => {
    el.classList.add('anim-hidden');
    el.style.transitionDelay = `${i * 0.15}s`;
    animObserver.observe(el);
});

// Section titles
document.querySelectorAll('.section-title, .section-subtitle').forEach((el, i) => {
    el.classList.add('anim-hidden');
    el.style.transitionDelay = `${i * 0.1}s`;
    animObserver.observe(el);
});

// 1. Impact Simulator Logic
function calculateImpact() {
    const area = document.getElementById('area-slider').value;
    const window = document.getElementById('window-slider').value;

    document.getElementById('area-val').innerText = area;
    document.getElementById('window-val').innerText = window;

    // AI Calculation Mockup
    const treeCalc = (area * 120) + (window * 15);
    const saveMoney = (window * 120) + (area * 50); // abstract energy saving

    // Animate numbers
    animateValue("tree-count", parseInt(document.getElementById('tree-count').innerText.replace(/,/g, '')), treeCalc, 500);
    animateValue("save-money", parseInt(document.getElementById('save-money').innerText.replace(/,/g, '')), saveMoney, 500);
}

function animateValue(id, start, end, duration) {
    if (start === end) return;
    let range = end - start;
    let current = start;
    let increment = end > start ? Math.ceil(range / 10) : Math.floor(range / 10);
    let stepTime = Math.abs(Math.floor(duration / 10));
    let obj = document.getElementById(id);
    let timer = setInterval(function () {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        obj.innerHTML = current.toLocaleString();
    }, stepTime);
}

// 2. Live Carbon Ledger Ticker
function updateTicker() {
    const co2Obj = document.getElementById('global-co2');
    const creditsObj = document.getElementById('total-credits');

    let currentCO2 = parseInt(co2Obj.innerText.replace(/,/g, ''));
    let currentCredits = parseInt(creditsObj.innerText.replace(/,/g, ''));

    // Simulate real-time growth (Blockchain sync)
    co2Obj.innerText = (currentCO2 + Math.floor(Math.random() * 3)).toLocaleString();
    creditsObj.innerText = (currentCredits + Math.floor(Math.random() * 2)).toLocaleString();
}
setInterval(updateTicker, 3000);

// 3. AR Visualizer Mock
function openAR() {
    alert("ระบบ AR กำลังเปิดใช้งานผ่านกล้อง... \n[Mockup: ภาพกล้องจะแสดงขึ้นพร้อมให้คุณวางจำลองกระจก Bio-Active หรือ Smart Pod ในพื้นที่ของคุณ]");
}

// 4. Solution Map Logic
function showPinInfo(title, desc) {
    const modal = document.getElementById('pin-modal');
    document.getElementById('pin-title').innerText = title;
    document.getElementById('pin-desc').innerText = desc;

    // Reset all pins
    document.querySelectorAll('.map-pin').forEach(pin => pin.classList.remove('active'));
    // Set clicked as active (handled roughly by inline onclick for this demo)

    modal.classList.add('show');

    setTimeout(() => {
        modal.classList.remove('show');
    }, 4000);
}

// 5. AI Concierge Bot Logic
let chatOpen = false;
function toggleChat() {
    chatOpen = !chatOpen;
    document.getElementById('chat-body').classList.toggle('open');
    document.getElementById('chat-input').classList.toggle('open');
    document.getElementById('chat-toggle-icon').className = chatOpen ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up";
}

function sendMsg() {
    const input = document.getElementById('chat-msg');
    const text = input.value.trim();
    if (!text) return;

    const body = document.getElementById('chat-body');

    // User msg
    body.innerHTML += `<div class="msg user">${text}</div>`;
    input.value = '';

    // Auto scroll bottom
    body.scrollTop = body.scrollHeight;

    // Bot reply
    setTimeout(() => {
        // Simple keyword match for demonstration
        let reply = "ฉันกำลังวิเคราะห์ข้อมูล... โซลูชันที่ดีที่สุดคือการเริ่มจัดการขยะอินทรีย์และใช้หลอดไฟประหยัดพลังงาน!";
        if (text.includes("5000") || text.includes("คอนโด") || text.includes("5,000")) {
            reply = "ด้วยงบ 5,000 บาท ในคอนโด ฉันแนะนำ <b>Smart Composter (เครื่องย่อยเศษอาหาร)</b> ขนาดเล็ก ราคา ~3,000 บาท และเปลี่ยนเป็น <b>หลอดไฟ LED Smart Sensor</b> ทั้งห้อง จะช่วยลดขยะฝังกลบและประหยัดไฟได้ 20% ต่อเดือนครับ สนใจดูสินค้าไหม?";
        }

        body.innerHTML += `<div class="msg bot">${reply}</div>`;
        body.scrollTop = body.scrollHeight;
    }, 1000);

    // Press Enter to send
    document.getElementById('chat-msg').addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            sendMsg();
        }
    });
}
