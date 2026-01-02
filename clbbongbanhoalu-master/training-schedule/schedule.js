let data = {
    coaches: [],
    groups: [],
    sessions: []
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayNamesVN = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

async function loadData() {
    try {
        const response = await fetch('data/schedule.json');
        data = await response.json();
        renderCalendar();
        renderAdminLists();
        populateSelectors();
    } catch (e) {
        console.error("Using default seed data", e);
        renderCalendar();
    }
}

function setupEventListeners() {
    // Tabs Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.dataset.tab;
            document.getElementById('calendar-view').style.display = target === 'calendar' ? 'block' : 'none';
            document.getElementById('admin-view').style.display = target === 'admin' ? 'block' : 'none';
        });
    });

    // Form Submissions
    document.getElementById('coach-form').addEventListener('submit', handleAddCoach);
    document.getElementById('session-form').addEventListener('submit', handleAddSession);
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    days.forEach((day, index) => {
        const col = document.createElement('div');
        col.className = 'day-column';
        col.innerHTML = `
            <div class="day-header">${dayNamesVN[index]}</div>
            <div class="day-content" id="day-${day}"></div>
        `;
        grid.appendChild(col);

        const daySessions = data.sessions.filter(s => s.day === day);
        // Sort sessions by time
        daySessions.sort((a, b) => a.start_time.localeCompare(b.start_time));

        const dayContent = col.querySelector('.day-content');
        daySessions.forEach(session => {
            const coach = data.coaches.find(c => c.id === session.coach_id);
            const group = data.groups.find(g => g.id === session.group_id);
            if (!coach || !group) return;

            const card = document.createElement('div');
            card.className = 'session-card';
            card.style.borderLeftColor = coach.color || '#7AC943';
            card.innerHTML = `
                <div class="card-time">${session.start_time} - ${session.end_time}</div>
                <div class="card-title">${group.name}</div>
                <div class="card-coach">
                    <span style="width:10px; height:10px; background:${coach.color}; border-radius:50%"></span>
                    ${coach.name}
                </div>
                <span class="card-loc">📍 ${session.location}</span>
            `;
            dayContent.appendChild(card);
        });
    });
}

function renderAdminLists() {
    const coachList = document.getElementById('coach-list');
    coachList.innerHTML = '';
    data.coaches.forEach(c => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
            <div>
                <strong>${c.name}</strong><br>
                <small>${c.level}</small>
            </div>
            <div class="actions">
                <button class="btn-sm btn-danger" onclick="deleteCoach('${c.id}')">Xóa</button>
            </div>
        `;
        coachList.appendChild(li);
    });

    const sessionList = document.getElementById('session-list');
    sessionList.innerHTML = '';
    data.sessions.forEach(s => {
        const coach = data.coaches.find(c => c.id === s.coach_id);
        const group = data.groups.find(g => g.id === s.group_id);
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
            <div>
                <strong>${group?.name} (${s.day})</strong><br>
                <small>${s.start_time} - ${s.end_time} | ${coach?.name}</small>
            </div>
            <div class="actions">
                <button class="btn-sm btn-danger" onclick="deleteSession('${s.id}')">Xóa</button>
            </div>
        `;
        sessionList.appendChild(li);
    });
}

function populateSelectors() {
    const coachSel = document.getElementById('session-coach');
    coachSel.innerHTML = '<option value="">-- Chọn HLV --</option>';
    data.coaches.forEach(c => {
        coachSel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    const groupSel = document.getElementById('session-group');
    groupSel.innerHTML = '<option value="">-- Chọn nhóm tập --</option>';
    data.groups.forEach(g => {
        groupSel.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
}

function handleAddCoach(e) {
    e.preventDefault();
    const name = document.getElementById('coach-name').value;
    const level = document.getElementById('coach-level').value;
    const phone = document.getElementById('coach-phone').value;
    const colors = ['#4E9F3D', '#7AC943', '#FFD800', '#1e293b', '#2D5A27'];

    const newCoach = {
        id: 'c' + Date.now(),
        name,
        level,
        phone,
        color: colors[data.coaches.length % colors.length]
    };

    data.coaches.push(newCoach);
    e.target.reset();
    saveAndRefresh();
}

function handleAddSession(e) {
    e.preventDefault();
    const session = {
        id: 's' + Date.now(),
        coach_id: document.getElementById('session-coach').value,
        group_id: document.getElementById('session-group').value,
        day: document.getElementById('session-day').value,
        start_time: document.getElementById('session-start').value,
        end_time: document.getElementById('session-end').value,
        location: document.getElementById('session-loc').value
    };

    if (checkConflict(session)) {
        showToast("⚠️ Trùng lịch! HLV hoặc Nhóm đã có lịch vào giờ này.");
        return;
    }

    data.sessions.push(session);
    e.target.reset();
    saveAndRefresh();
}

function checkConflict(newS) {
    return data.sessions.some(s => {
        if (s.day !== newS.day) return false;

        const overlap = (newS.start_time < s.end_time && newS.end_time > s.start_time);
        if (!overlap) return false;

        // Rule 1: Coach conflict
        if (s.coach_id === newS.coach_id) return true;
        // Rule 2: Group conflict
        if (s.group_id === newS.group_id) return true;

        return false;
    });
}

function deleteCoach(id) {
    data.coaches = data.coaches.filter(c => c.id !== id);
    data.sessions = data.sessions.filter(s => s.coach_id !== id);
    saveAndRefresh();
}

function deleteSession(id) {
    data.sessions = data.sessions.filter(s => s.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    // In a real app, we'd POST to server. Here we just update UI.
    console.log("Saving data...", data);
    renderCalendar();
    renderAdminLists();
    populateSelectors();
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3000);
}
