// قاعدة بيانات محلية مبسطة
let appData = JSON.parse(localStorage.getItem('oilTransportData')) || {
    transports: [],
    cars: [],
    drivers: [],
    factories: [],
    advances: [],
    funds: [],
    expenses: [],
    documents: []
};

// دالة لحفظ البيانات في المتصفح
function saveData() {
    localStorage.setItem('oilTransportData', JSON.stringify(appData));
    updateDashboard();
}

// دالة التنقل بين التبويبات
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- 1. تحديث لوحة التحكم ---
function updateDashboard() {
    document.getElementById('stat-daily-transports').innerText = appData.transports.length; // مبسط للعدد الكلي
    document.getElementById('stat-total-advances').innerText = appData.advances.reduce((sum, adv) => sum + Number(adv.amount), 0);
    document.getElementById('stat-factory-expenses').innerText = appData.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    // آخر 10 نقلات
    const recent = appData.transports.slice(-10).reverse();
    const tbody = document.getElementById('recent-transports-table');
    tbody.innerHTML = '';
    recent.forEach(t => {
        tbody.innerHTML += `<tr><td>${t.date}</td><td>${t.driver}</td><td>${t.car}</td><td>${t.factory}</td><td>${t.qty}</td><td>${t.price}</td></tr>`;
    });
    
    renderAllTables();
}

// --- 2. إدارة النقلات ---
document.getElementById('transport-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newTransport = {
        id: Date.now(),
        date: document.getElementById('trans-date').value,
        driver: document.getElementById('trans-driver').value,
        car: document.getElementById('trans-car').value,
        factory: document.getElementById('trans-factory').value,
        qty: document.getElementById('trans-qty').value,
        price: document.getElementById('trans-price').value
    };
    appData.transports.push(newTransport);
    saveData();
    this.reset();
});

// --- 3. إدارة السيارات ---
document.getElementById('car-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.cars.push({
        number: document.getElementById('car-number').value,
        driver: document.getElementById('car-driver').value,
        type: document.getElementById('car-type').value,
        owner: document.getElementById('car-owner').value
    });
    saveData();
    this.reset();
});

// --- 4. إدارة السواق ---
document.getElementById('driver-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.drivers.push({
        name: document.getElementById('drv-name').value,
        phone: document.getElementById('drv-phone').value,
        car: document.getElementById('drv-car').value,
        factory: document.getElementById('drv-factory').value
    });
    saveData();
    this.reset();
});

// --- 5. إدارة المعامل ---
document.getElementById('factory-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.factories.push({
        name: document.getElementById('fac-name').value,
        price: document.getElementById('fac-price').value,
        notes: document.getElementById('fac-notes').value
    });
    saveData();
    this.reset();
});

// --- 6. السلف والصناديق ---
document.getElementById('fund-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.funds.push({
        amount: Number(document.getElementById('fund-amount').value)
    });
    saveData();
    this.reset();
});

document.getElementById('advance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.advances.push({
        driver: document.getElementById('adv-driver').value,
        amount: document.getElementById('adv-amount').value,
        date: document.getElementById('adv-date').value,
        notes: document.getElementById('adv-notes').value
    });
    saveData();
    this.reset();
});

// --- 7. المصاريف ---
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.expenses.push({
        factory: document.getElementById('exp-factory').value,
        amount: document.getElementById('exp-amount').value,
        date: document.getElementById('exp-date').value,
        notes: document.getElementById('exp-notes').value
    });
    saveData();
    this.reset();
});

// --- 9. الوثائق ---
document.getElementById('document-form').addEventListener('submit', function(e) {
    e.preventDefault();
    appData.documents.push({
        driver: document.getElementById('doc-driver').value,
        car: document.getElementById('doc-car').value,
        type: document.getElementById('doc-type').value
    });
    saveData();
    this.reset();
});


// دالة لتحديث جميع الجداول في النظام
function renderAllTables() {
    // جدول النقلات
    document.getElementById('transports-table').innerHTML = appData.transports.map(t => 
        `<tr><td>${t.date}</td><td>${t.driver}</td><td>${t.car}</td><td>${t.factory}</td><td>${t.qty}</td><td>${t.price}</td>
        <td><button onclick="deleteItem('transports', ${t.id})">حذف</button></td></tr>`).join('');
        
    // جدول السيارات
    document.getElementById('cars-table').innerHTML = appData.cars.map(c => 
        `<tr><td>${c.number}</td><td>${c.driver}</td><td>${c.type}</td><td>${c.owner}</td><td>0</td><td>0</td><td>0</td><td>0</td><td>-</td></tr>`).join('');

    // جدول السواق
    document.getElementById('drivers-table').innerHTML = appData.drivers.map(d => 
        `<tr><td>${d.name}</td><td>${d.phone}</td><td>${d.car}</td><td>0</td><td>0</td><td>0</td><td>كشف</td></tr>`).join('');

    // جدول المعامل
    document.getElementById('factories-table').innerHTML = appData.factories.map(f => 
        `<tr><td>${f.name}</td><td>${f.price}</td><td>0</td><td>0</td><td>0</td></tr>`).join('');

    // جدول السلف
    document.getElementById('advances-table').innerHTML = appData.advances.map(a => 
        `<tr><td>${a.driver}</td><td>${a.amount}</td><td>${a.date}</td><td>${a.notes}</td></tr>`).join('');
        
    // تحديث رصيد السلف
    const totalFunds = appData.funds.reduce((sum, f) => sum + f.amount, 0);
    const totalAdvances = appData.advances.reduce((sum, a) => sum + Number(a.amount), 0);
    document.getElementById('fund-balance').innerText = totalFunds - totalAdvances;

    // جدول المصاريف
    document.getElementById('expenses-table').innerHTML = appData.expenses.map(ex => 
        `<tr><td>${ex.factory}</td><td>${ex.amount}</td><td>${ex.date}</td><td>${ex.notes}</td></tr>`).join('');

    // جدول الوثائق
    document.getElementById('documents-table').innerHTML = appData.documents.map(doc => 
        `<tr><td>${doc.driver}</td><td>${doc.car}</td><td>${doc.type}</td><td><button>عرض</button></td></tr>`).join('');
}

// دالة حذف بسيطة (للنقلات كمثال)
function deleteItem(type, id) {
    if(confirm('هل أنت متأكد من الحذف؟')) {
        appData[type] = appData[type].filter(item => item.id !== id);
        saveData();
    }
}

// تشغيل التحديث عند فتح الصفحة
window.onload = updateDashboard;
