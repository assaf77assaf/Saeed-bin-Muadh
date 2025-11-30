const ADMIN_PASSWORD = "11223344556677889900";

// ⭐⭐ الإضافة 1: تحميل البيانات من التخزين ⭐⭐
let students = {};
function loadData() {
    const saved = localStorage.getItem("students_data");
    if (saved) students = JSON.parse(saved);
}
loadData();

// ⭐⭐ الإضافة 2: حفظ البيانات ⭐⭐
function saveData() {
    localStorage.setItem("students_data", JSON.stringify(students));
}

// ⭐⭐ الإضافة 3: تحديث الصفحات الأخرى عند تغيير البيانات ⭐⭐
window.addEventListener("storage", (e) => {
    if (e.key === "students_data") {
        loadData();
        refreshUI();
    }
});

const loginDiv = document.getElementById("login_div");
const studentLoginDiv = document.getElementById("student_login_div");
const dashboardDiv = document.getElementById("dashboard_div");
const studentDashboard = document.getElementById("student_dashboard");

const studentsList = document.getElementById("students_list");

// تحديث القوائم تلقائي
function refreshUI() {
    const select1 = document.getElementById("points_student");
    select1.innerHTML = "";

    const select2 = document.getElementById("delete_student_select");
    select2.innerHTML = "";

    let text = "";

    // ⭐⭐⭐ الإضافة الجديدة: ترتيب الطلاب حسب النقاط ⭐⭐⭐
    let sortedStudents = Object.entries(students).sort((a, b) => b[1].points - a[1].points);

    // تم استخدام sortedStudents بدل students — دون حذف شيء
    for (const [name, data] of sortedStudents) {

        let option1 = document.createElement("option");
        option1.value = name;
        option1.textContent = name;
        select1.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = name;
        option2.textContent = name;
        select2.appendChild(option2);

        text += `${name} — صف ${data.class} — نقاط: ${data.points}\n`;
    }

    studentsList.textContent = text;
}

// تسجيل دخول المشرف
document.getElementById("login_btn").onclick = () => {
    if (document.getElementById("password_input").value === ADMIN_PASSWORD) {
        loginDiv.style.display = "none";
        dashboardDiv.style.display = "block";

        // ⭐ إخفاء تسجيل الطالب عند دخول المشرف
        studentLoginDiv.style.display = "none";

        refreshUI();
    } else {
        document.getElementById("login_message").textContent = "❌ كلمة المرور خاطئة";
    }
};

// تسجيل خروج المشرف
document.getElementById("logout_admin_btn").onclick = () => {
    dashboardDiv.style.display = "none";
    loginDiv.style.display = "block";

    // ⭐ إظهار تسجيل الطالب عند خروج المشرف
    studentLoginDiv.style.display = "block";
};

// إضافة طالب
document.getElementById("add_student_btn").onclick = () => {
    const name = document.getElementById("new_student_name").value.trim();
    const code = document.getElementById("new_student_code").value.trim();
    const classNum = document.getElementById("new_student_class").value;

    if (!name || !code) return;

    students[name] = {
        code: code,
        class: classNum,
        points: 0,
        display: null,
        image: "" // جاهزة لإضافة رابط الصورة لاحقًا
    };

    saveData(); // ⭐ جديد
    refreshUI();
};

// حذف طالب
document.getElementById("delete_student_btn").onclick = () => {
    const name = document.getElementById("delete_student_select").value;
    delete students[name];
    saveData(); // ⭐ جديد
    refreshUI();
};

// إضافة نقاط
document.getElementById("add_points_btn").onclick = () => {
    const name = document.getElementById("points_student").value;
    let pts = parseInt(document.getElementById("points_value").value);
    if (!isNaN(pts)) {
        students[name].points += pts;
        saveData(); // ⭐ جديد
        refreshUI();
    }
};

// خصم نقاط
document.getElementById("subtract_points_btn").onclick = () => {
    const name = document.getElementById("points_student").value;
    let pts = parseInt(document.getElementById("points_value").value);
    if (!isNaN(pts)) {
        students[name].points -= pts;
        saveData(); // ⭐ جديد
        refreshUI();
    }
};

// ⭐⭐ تسجيل دخول الطالب
document.getElementById("student_login_btn").onclick = () => {
    loadData(); // ⭐ جديد

    const code = document.getElementById("student_code_input").value;

    for (const [name, data] of Object.entries(students)) {
        if (data.code === code) {
            studentLoginDiv.style.display = "none";
            studentDashboard.style.display = "block";

            // ⭐ إخفاء تسجيل المشرف عند دخول الطالب
            loginDiv.style.display = "none";

            document.getElementById("student_name_display").textContent = name;
            document.getElementById("student_points_display").textContent = data.points;
            document.getElementById("student_class_display").textContent = data.class;

            // ⭐ تحديث الصورة إذا موجود رابط
            document.getElementById("student_image").src = data.image || "";

            students[name].display = document.getElementById("student_points_display");
            return;
        }
    }

    document.getElementById("student_message").textContent = "❌ رمز خاطئ";
};

// تسجيل خروج الطالب
document.getElementById("logout_student_btn").onclick = () => {
    studentDashboard.style.display = "none";
    studentLoginDiv.style.display = "block";

    // ⭐ إظهار تسجيل المشرف عند خروج الطالب
    loginDiv.style.display = "block";
};

// زر تحديث صفحة الطالب
document.getElementById("refresh_student_btn").onclick = () => {
    loadData(); // تحميل آخر البيانات من التخزين

    const name = document.getElementById("student_name_display").textContent;

    if (students[name]) {
        document.getElementById("student_points_display").textContent = students[name].points;
        document.getElementById("student_class_display").textContent = students[name].class;

        // ⭐ تحديث الصورة أيضاً
        document.getElementById("student_image").src = students[name].image || "";
    }
};
