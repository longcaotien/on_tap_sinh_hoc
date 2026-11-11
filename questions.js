// Bộ câu hỏi và hình vẽ của BioMaster 11.
// Dùng chung cho trang làm bài (index.html) và trang quản lý (admin.html, để xem màn hình người học).
// =========================================================================
// 1. HÌNH VẼ VECTOR SVG CHẤT LƯỢNG CAO (3 HÌNH TRONG ĐỀ)
// =========================================================================

// Hình 1: Thí nghiệm Hô hấp ở hạt nảy mầm (Bài 6 - Phần I - Câu 14)
function getSeedExperimentSVG() {
    return `
    <div class="my-4 bg-gradient-to-b from-white to-emerald-50/60 rounded-2xl p-4 border border-emerald-200 shadow-inner flex flex-col items-center">
        <div class="text-xs font-bold text-bio-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i class="fa-solid fa-flask text-bio-600"></i>
            Hình mô phỏng thí nghiệm phát hiện hô hấp ở thực vật (Vẽ lại Vector sắc nét)
        </div>
        <svg viewBox="0 0 500 320" class="w-full max-w-[440px] h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <!-- Cốc rót nước ở trên -->
            <g transform="translate(80, 15) rotate(28)">
                <rect x="0" y="0" width="46" height="58" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
                <path d="M4 22 L42 10 L42 54 L4 54 Z" fill="#38bdf8" opacity="0.6"/>
                <!-- Bàn tay cầm cốc -->
                <path d="M-12 18 Q-2 12 8 18 L8 42 Q-2 46 -12 38 Z" fill="#fed7aa" stroke="#c2410c" stroke-width="1.5"/>
            </g>
            <!-- Dòng nước chảy xuống phễu -->
            <path d="M132 58 Q144 75 145 95" stroke="#0284c7" stroke-width="3.5" stroke-dasharray="5 4" fill="none"/>

            <!-- Phễu thủy tinh -->
            <polygon points="122,90 168,90 149,122 141,122" fill="#f0f9ff" stroke="#334155" stroke-width="2"/>
            <rect x="142" y="122" width="6" height="95" fill="#e0f2fe" stroke="#334155" stroke-width="1.5"/>

            <!-- Nút cao su màu đen -->
            <polygon points="128,136 182,136 177,156 133,156" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>

            <!-- Bình thủy tinh chứa hạt nảy mầm -->
            <path d="M133 156 L133 175 L105 215 L105 292 C105 300 112 304 120 304 L190 304 C198 304 205 300 205 292 L205 215 L177 175 L177 156 Z" 
                  fill="#f8fafc" fill-opacity="0.7" stroke="#334155" stroke-width="2.5"/>

            <!-- Các giọt nước rơi trong bình -->
            <circle cx="145" cy="228" r="3" fill="#0284c7"/>
            <circle cx="145" cy="245" r="3.5" fill="#0284c7"/>
            <circle cx="145" cy="262" r="3" fill="#0284c7"/>

            <!-- Lớp hạt đang nảy mầm màu vàng xanh ở đáy bình -->
            <g fill="#eab308" stroke="#713f12" stroke-width="1">
                <ellipse cx="120" cy="292" rx="7" ry="5"/><ellipse cx="134" cy="294" rx="7" ry="5"/>
                <ellipse cx="148" cy="293" rx="7" ry="5"/><ellipse cx="162" cy="294" rx="7" ry="5"/>
                <ellipse cx="176" cy="292" rx="7" ry="5"/><ellipse cx="190" cy="293" rx="7" ry="5"/>
                <ellipse cx="126" cy="283" rx="7" ry="5"/><ellipse cx="141" cy="284" rx="7" ry="5"/>
                <ellipse cx="155" cy="283" rx="7" ry="5"/><ellipse cx="170" cy="284" rx="7" ry="5"/>
                <ellipse cx="184" cy="283" rx="7" ry="5"/><ellipse cx="135" cy="274" rx="7" ry="5"/>
                <ellipse cx="150" cy="275" rx="7" ry="5"/><ellipse cx="165" cy="274" rx="7" ry="5"/>
                <ellipse cx="178" cy="275" rx="7" ry="5"/>
            </g>
            <!-- Mầm xanh nhỏ -->
            <path d="M135 270 Q138 262 142 266 M165 270 Q168 260 172 265" stroke="#16a34a" stroke-width="2" fill="none"/>

            <!-- Ống thủy tinh hình chữ U dẫn khí CO2 -->
            <path d="M166 168 L166 112 Q166 102 176 102 L320 102 Q330 102 330 112 L330 275" 
                  fill="none" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
            <path d="M166 168 L166 112 Q166 102 176 102 L320 102 Q330 102 330 112 L330 275" 
                  fill="none" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>

            <!-- Ống nghiệm chứa nước vôi trong -->
            <path d="M312 175 L312 288 C312 298 320 304 330 304 C340 304 348 298 348 288 L348 175" 
                  fill="#f8fafc" fill-opacity="0.6" stroke="#334155" stroke-width="2.2"/>
            <ellipse cx="330" cy="175" rx="20" ry="4" fill="#f1f5f9" stroke="#334155" stroke-width="1.8"/>

            <!-- Nước vôi trong bị vẩn đục + Bọt khí CO2 -->
            <path d="M314 225 L346 225 L346 288 C346 296 339 302 330 302 C321 302 314 296 314 288 Z" 
                  fill="#cbd5e1" fill-opacity="0.75"/>
            <circle cx="330" cy="265" r="3" fill="white" stroke="#64748b" stroke-width="1"/>
            <circle cx="326" cy="250" r="2.5" fill="white" stroke="#64748b" stroke-width="1"/>
            <circle cx="335" cy="238" r="3.5" fill="white" stroke="#64748b" stroke-width="1"/>

            <!-- Chú thích trên hình -->
            <text x="42" y="75" fill="#1e293b" font-size="12" font-weight="700">Cốc nước</text>
            <line x1="92" y1="71" x2="112" y2="55" stroke="#64748b" stroke-width="1.2"/>

            <text x="50" y="108" fill="#1e293b" font-size="12" font-weight="700">Phễu</text>
            <line x1="85" y1="104" x2="128" y2="100" stroke="#64748b" stroke-width="1.2"/>

            <text x="22" y="148" fill="#1e293b" font-size="12" font-weight="700">Nút cao su</text>
            <line x1="88" y1="145" x2="128" y2="145" stroke="#64748b" stroke-width="1.2"/>

            <text x="12" y="232" fill="#065f46" font-size="12" font-weight="800">Bình chứa hạt</text>
            <text x="28" y="247" fill="#065f46" font-size="12" font-weight="800">nảy mầm</text>
            <line x1="95" y1="238" x2="122" y2="255" stroke="#059669" stroke-width="1.2"/>

            <text x="208" y="88" fill="#1e293b" font-size="12" font-weight="700">Ống thủy tinh chữ U</text>
            <line x1="255" y1="92" x2="245" y2="102" stroke="#64748b" stroke-width="1.2"/>

            <text x="372" y="195" fill="#1e293b" font-size="12" font-weight="700">Ống nghiệm</text>
            <line x1="348" y1="192" x2="368" y2="192" stroke="#64748b" stroke-width="1.2"/>

            <text x="372" y="272" fill="#0f766e" font-size="12" font-weight="800">Nước vôi trong</text>
            <line x1="344" y1="268" x2="368" y2="268" stroke="#0f766e" stroke-width="1.2"/>
        </svg>
    </div>
    `;
}

// Hình 2: Đồ thị Lượng CO2 giải phóng ở củ khoai tây qua 3 tuần (Bài 6 - Phần II - Câu 1)
function getPotatoGraphSVG() {
    return `
    <div class="bg-gradient-to-b from-white to-teal-50/50 rounded-2xl p-4 border border-teal-200 shadow-inner flex flex-col items-center">
        <div class="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i class="fa-solid fa-chart-line text-teal-600"></i>
            Đồ thị lượng CO₂ giải phóng qua 3 tuần thí nghiệm
        </div>
        <svg viewBox="0 0 440 240" class="w-full max-w-[400px] h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <!-- Trục tọa độ -->
            <line x1="55" y1="200" x2="410" y2="200" stroke="#0f172a" stroke-width="2.2"/>
            <polygon points="415,200 405,195 405,205" fill="#0f172a"/>
            <line x1="55" y1="215" x2="55" y2="25" stroke="#0f172a" stroke-width="2.2"/>
            <polygon points="55,18 50,28 60,28" fill="#0f172a"/>

            <!-- Đường gióng đứt nét phân chia Tuần 1, 2, 3 -->
            <line x1="155" y1="35" x2="155" y2="205" stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5"/>
            <line x1="255" y1="35" x2="255" y2="205" stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5"/>
            <line x1="355" y1="35" x2="355" y2="205" stroke="#475569" stroke-width="1.5" stroke-dasharray="5 5"/>

            <!-- Nhãn môi trường phía trên -->
            <rect x="65" y="38" width="80" height="20" rx="5" fill="#d1fae5"/>
            <text x="105" y="52" text-anchor="middle" fill="#065f46" font-size="10" font-weight="700">Không khí sạch</text>

            <rect x="168" y="38" width="74" height="20" rx="5" fill="#fee2e2"/>
            <text x="205" y="52" text-anchor="middle" fill="#991b1b" font-size="10" font-weight="700">Nitơ sạch</text>

            <rect x="265" y="38" width="80" height="20" rx="5" fill="#d1fae5"/>
            <text x="305" y="52" text-anchor="middle" fill="#065f46" font-size="10" font-weight="700">Không khí sạch</text>

            <!-- Đường biểu diễn Lượng CO2 -->
            <path d="M 55 145 L 155 145 C 162 185, 175 196, 200 198 L 255 198 C 272 150, 288 85, 300 85 C 312 85, 322 145, 335 145 L 355 145" 
                  fill="none" stroke="#059669" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Chú thích trục -->
            <text x="64" y="32" fill="#0f172a" font-size="13" font-style="italic" font-weight="700">Lượng CO₂</text>
            <text x="105" y="220" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">1</text>
            <text x="205" y="220" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">2</text>
            <text x="305" y="220" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">3</text>
            <text x="380" y="220" text-anchor="middle" fill="#0f172a" font-size="12" font-style="italic" font-weight="700">Thời gian (tuần)</text>
        </svg>
    </div>
    `;
}

// Hình 3: Sơ đồ giải phẫu Hệ Tiêu Hóa Người (Bài 8 - Phần II - Câu 1)
function getDigestiveSystemSVG() {
    return `
    <div class="bg-gradient-to-b from-white to-emerald-50/50 rounded-2xl p-4 border border-emerald-200 shadow-inner flex flex-col items-center">
        <div class="text-xs font-bold text-bio-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i class="fa-solid fa-lungs-virus text-bio-600"></i>
            Sơ đồ giải phẫu Hệ Tiêu Hóa ở Người
        </div>
        <svg viewBox="0 0 420 470" class="w-full max-w-[340px] h-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bodySkin" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#e2e8f0"/>
                </linearGradient>
                <linearGradient id="stomachGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/>
                </linearGradient>
                <linearGradient id="liverGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#991b1b"/><stop offset="100%" stop-color="#7f1d1d"/>
                </linearGradient>
                <linearGradient id="colonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#15803d"/>
                </linearGradient>
                <linearGradient id="smallIntGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#e11d48"/>
                </linearGradient>
            </defs>
            <path d="M165 25 C195 20, 225 35, 225 65 C225 85, 215 100, 210 115 L225 135 C265 145, 290 175, 290 230 L290 420 L115 420 L115 230 C115 175, 135 145, 170 135 L172 110 C155 105, 145 95, 145 80 C138 78, 138 70, 145 65 C145 45, 150 30, 165 25 Z" fill="url(#bodySkin)" stroke="#94a3b8" stroke-width="2"/>
            <path d="M145 78 Q170 72 188 85 Q180 96 160 92 Z" fill="#f43f5e" opacity="0.85"/>
            <ellipse cx="188" cy="78" rx="11" ry="8" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
            <ellipse cx="176" cy="95" rx="8" ry="5" fill="#fbbf24" stroke="#b45309" stroke-width="1"/>
            <path d="M188 85 Q196 130 202 205" stroke="#dc2626" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M188 85 Q196 130 202 205" stroke="#fca5a5" stroke-width="3" stroke-linecap="round" fill="none"/>
            <path d="M135 200 C135 182, 175 180, 200 198 C185 220, 155 238, 138 242 C132 230, 133 212, 135 200 Z" fill="url(#liverGrad)" stroke="#450a0a" stroke-width="1.5"/>
            <ellipse cx="165" cy="233" rx="9" ry="6" transform="rotate(-20 165 233)" fill="#16a34a" stroke="#14532d" stroke-width="1.2"/>
            <path d="M200 198 C225 192, 252 208, 250 235 C248 262, 218 272, 192 262 C182 258, 180 245, 190 242 C205 240, 212 225, 200 198 Z" fill="url(#stomachGrad)" stroke="#7f1d1d" stroke-width="1.5"/>
            <path d="M188 265 Q215 258 240 268 Q215 278 188 272 Z" fill="#facc15" stroke="#a16207" stroke-width="1.2"/>
            <g fill="url(#smallIntGrad)" stroke="#9f1239" stroke-width="1.5">
                <rect x="166" y="292" width="74" height="82" rx="18"/>
                <path d="M174 308 Q203 298 232 310 Q203 324 174 322 Q205 338 232 336 Q200 352 175 352 Q205 366 228 362" fill="none" stroke="#881337" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <path d="M162 375 L155 300 C155 282, 175 280, 202 282 C230 280, 248 282, 248 300 L246 368 C245 380, 220 382, 204 385 L204 418" fill="none" stroke="url(#colonGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M162 375 L155 300 C155 282, 175 280, 202 282 C230 280, 248 282, 248 300 L246 368 C245 380, 220 382, 204 385 L204 418" fill="none" stroke="#86efac" stroke-width="2" stroke-dasharray="6 8" stroke-linecap="round"/>

            <circle cx="52" cy="78" r="16" fill="#065f46" stroke="#a7f3d0" stroke-width="2"/>
            <text x="52" y="84" text-anchor="middle" fill="white" font-weight="800" font-size="18">1</text>
            <line x1="68" y1="78" x2="152" y2="82" stroke="#0f172a" stroke-width="1.5"/>

            <line x1="196" y1="78" x2="262" y2="78" stroke="#475569" stroke-width="1"/>
            <text x="266" y="81" fill="#334155" font-size="10.5" font-weight="600">Tuyến nước bọt</text>
            <line x1="196" y1="125" x2="250" y2="125" stroke="#475569" stroke-width="1"/>
            <text x="254" y="128" fill="#334155" font-size="10.5" font-weight="600">Thực quản</text>
            <line x1="78" y1="180" x2="152" y2="198" stroke="#475569" stroke-width="1"/>
            <text x="52" y="182" fill="#334155" font-size="10.5" font-weight="600">Gan</text>
            <line x1="75" y1="240" x2="158" y2="234" stroke="#475569" stroke-width="1"/>
            <text x="34" y="243" fill="#334155" font-size="10.5" font-weight="600">Túi mật</text>

            <circle cx="332" cy="195" r="16" fill="#065f46" stroke="#a7f3d0" stroke-width="2"/>
            <text x="332" y="201" text-anchor="middle" fill="white" font-weight="800" font-size="18">2</text>
            <line x1="316" y1="200" x2="235" y2="225" stroke="#0f172a" stroke-width="1.5"/>

            <line x1="236" y1="268" x2="310" y2="262" stroke="#475569" stroke-width="1"/>
            <text x="314" y="265" fill="#334155" font-size="10.5" font-weight="600">Tuyến tụy</text>

            <circle cx="52" cy="345" r="16" fill="#065f46" stroke="#a7f3d0" stroke-width="2"/>
            <text x="52" y="351" text-anchor="middle" fill="white" font-weight="800" font-size="18">3</text>
            <line x1="68" y1="342" x2="152" y2="328" stroke="#0f172a" stroke-width="1.5"/>

            <circle cx="348" cy="328" r="16" fill="#065f46" stroke="#a7f3d0" stroke-width="2"/>
            <text x="348" y="334" text-anchor="middle" fill="white" font-weight="800" font-size="18">4</text>
            <line x1="332" y1="328" x2="220" y2="332" stroke="#0f172a" stroke-width="1.5"/>

            <line x1="125" y1="402" x2="202" y2="395" stroke="#475569" stroke-width="1"/>
            <text x="72" y="406" fill="#334155" font-size="10.5" font-weight="600">Trực tràng</text>
            <line x1="204" y1="418" x2="255" y2="418" stroke="#475569" stroke-width="1"/>
            <text x="260" y="421" fill="#334155" font-size="10.5" font-weight="600">Hậu môn</text>
        </svg>
    </div>
    `;
}

// =========================================================================
// 2. CƠ SỞ DỮ LIỆU CÂU HỎI GỐC (BÀI 6 + BÀI 8)
// =========================================================================

const originalMCQData = [
    // ---------------- BÀI 6: HÔ HẤP Ở THỰC VẬT (18 CÂU) ----------------
    {
        uid: "b6_mcq_1", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 1,
        question: "Ở tế bào nhân thực, quá trình hô hấp tế bào chủ yếu diễn ra trong .........(1).........<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: ["Lục lạp.", "Ribosome.", "Ti thể.", "Peroxisome."],
        correct: 2,
        explanation: "Ở tế bào nhân thực, quá trình hô hấp tế bào (chu trình Krebs và chuỗi truyền electron) diễn ra chủ yếu trong bào quan <b>ti thể</b>."
    },
    {
        uid: "b6_mcq_2", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 2,
        question: "Trong quá trình hô hấp tế bào, giai đoạn tạo ra nhiều ATP nhất là",
        options: ["chu trình Krebs.", "chuỗi truyền electron.", "lên men.", "đường phân."],
        correct: 1,
        explanation: "Đường phân tạo 2 ATP, chu trình Krebs tạo 2 ATP, còn <b>chuỗi truyền electron</b> hô hấp tạo ra nhiều ATP nhất (khoảng 26 – 28 ATP)."
    },
    {
        uid: "b6_mcq_3", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 3,
        question: "Khi nói về hô hấp ở thực vật, nhận định nào sau đây là <b>đúng</b>?",
        options: [
            "Hô hấp sáng giúp tăng lượng sản phẩm quang hợp.",
            "Thực vật không có cơ quan hô hấp chuyên trách.",
            "Phần năng lượng hô hấp được thải ra qua dạng nhiệt là hao phí, không cần thiết.",
            "Phân giải kị khí gồm đường phân, chu trình Krebs và chuỗi chuyền electron."
        ],
        correct: 1,
        explanation: "<b>Thực vật không có cơ quan hô hấp chuyên trách</b> như động vật; quá trình trao đổi khí và hô hấp diễn ra ở mọi cơ quan của cây (rễ, thân, lá, hoa, quả, hạt)."
    },
    {
        uid: "b6_mcq_4", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 4,
        question: "Hô hấp ở thực vật <b>không</b> có vai trò nào sau đây?",
        options: [
            "Tạo H<sub>2</sub>O cung cấp cho quang hợp.",
            "Tạo ra các hợp chất trung gian cho quá trình đồng hóa trong cơ thể.",
            "Tạo nhiệt năng để duy trì các hoạt động sống.",
            "Tạo ATP cung cấp cho mọi hoạt động sống."
        ],
        correct: 0,
        explanation: "Ba vai trò chính của hô hấp ở thực vật là: tạo ATP, tạo nhiệt năng duy trì thân nhiệt và tạo các sản phẩm trung gian cho quá trình tổng hợp chất hữu cơ khác. Nguồn nước cung cấp cho quang hợp chủ yếu do rễ hút từ đất."
    },
    {
        uid: "b6_mcq_5", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 5,
        question: "Khi nói về hô hấp ở thực vật, phát biểu nào sau đây <b>sai</b>?",
        options: [
            "Cường độ hô hấp tỷ lệ thuận với nhiệt độ (trong giới hạn).",
            "Cường độ hô hấp tỉ lệ nghịch với hàm lượng nước của cơ thể và cơ quan hô hấp.",
            "Cường độ hô hấp tỷ lệ nghịch với nồng độ CO<sub>2</sub>.",
            "Phân giải kỵ khí là một cơ chế thích nghi của thực vật."
        ],
        correct: 1,
        explanation: "Nước là dung môi và nguyên liệu trực tiếp tham gia các phản ứng hóa sinh trong hô hấp, nên cường độ hô hấp <b>tỉ lệ thuận</b> (không phải tỉ lệ nghịch) với hàm lượng nước."
    },
    {
        uid: "b6_mcq_6", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 6,
        question: "Chất nhận e cuối cùng trong chuỗi truyền e của quá trình photphorin hoá oxi hoá là chất nào sau đây?",
        options: ["O<sub>2</sub>.", "H<sub>2</sub>O.", "NAD<sup>+</sup>.", "Pyruvic acid."],
        correct: 0,
        explanation: "Trong chuỗi truyền electron hô hấp hiếu khí ở màng trong ti thể, chất nhận điện tử (electron) cuối cùng là phân tử <b>O<sub>2</sub></b> để kết hợp với H<sup>+</sup> tạo thành H<sub>2</sub>O."
    },
    {
        uid: "b6_mcq_7", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 7,
        question: "Cho 60 hạt đậu xanh vào một bình thủy tinh, đổ nước ngập hạt. Sau đó ngâm hạt trong nước khoảng 2 – 3 giờ, gạn hết nước ra khỏi bình. Cắm một nhiệt kế vào khối hạt sau đó nút kín bình và đặt bình vào một hộp xốp. Nhiệt độ trong bình thay đổi như thế nào trong 24 giờ?",
        options: [
            "Nhiệt độ trong bình tăng dần lên.",
            "Nhiệt độ trong bình giảm dần đi.",
            "Nhiệt độ trong bình giữ nguyên.",
            "Nhiệt độ trong bình lúc đầu giảm, sau đó tăng lên."
        ],
        correct: 0,
        explanation: "Hạt đậu xanh sau khi ngâm nước sẽ hút nước và nảy mầm, cường độ hô hấp diễn ra rất mạnh giải phóng năng lượng dưới dạng nhiệt làm <b>nhiệt độ trong bình tăng dần lên</b>."
    },
    {
        uid: "b6_mcq_8", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 8,
        question: "Nguyên liệu chủ yếu của quá trình đường phân là",
        options: ["Sucrose.", "Glycogen.", "Glucose.", "Cellulose."],
        correct: 2,
        explanation: "Nguyên liệu trực tiếp đi vào giai đoạn đường phân ở tế bào chất là phân tử đường đơn <b>Glucose</b> (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>)."
    },
    {
        uid: "b6_mcq_9", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 9,
        question: "Trong quá trình hô hấp, giai đoạn đường phân có đặc điểm là",
        options: [
            "kị khí và xảy ra trong ti thể.",
            "hiếu khí và xảy ra trong ti thể.",
            "kị khí và xảy ra trong tế bào chất.",
            "hiếu khí và xảy ra trong tế bào chất."
        ],
        correct: 2,
        explanation: "Đường phân xảy ra trong <b>tế bào chất (bào tương)</b> và là giai đoạn <b>kị khí</b> (không cần sự tham gia trực tiếp của O<sub>2</sub>)."
    },
    {
        uid: "b6_mcq_10", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 10,
        question: "Sơ đồ tóm tắt nào sau đây thể hiện đúng quá trình đường phân?",
        options: [
            "1 glucose → 2 pyruvic acid + 2 ATP + 2 NADH.",
            "1 glucose → 2 pyruvic acid + CO<sub>2</sub> + ATP + NADH.",
            "1 glucose → 2 pyruvic acid + nước + năng lượng.",
            "1 glucose → 2 CO<sub>2</sub> + nước + 2ATP."
        ],
        correct: 0,
        explanation: "Kết thúc quá trình đường phân, từ 1 phân tử glucose (6C) bị phân giải thành <b>2 phân tử pyruvic acid (3C), thu được 2 ATP và 2 NADH</b> (chưa giải phóng CO<sub>2</sub>)."
    },
    {
        uid: "b6_mcq_11", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 11,
        question: "Phương trình tổng quát của quá trình hô hấp tế bào với nguyên liệu glucose là .........(1).........<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: [
            "C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O.",
            "6CO<sub>2</sub> + 6H<sub>2</sub>O → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>.",
            "6CO<sub>2</sub> + 6H<sub>2</sub>O + Q (ATP + nhiệt) → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>.",
            "C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + Q (ATP + nhiệt)."
        ],
        correct: 3,
        explanation: "Phương trình tổng quát đầy đủ của hô hấp hiếu khí là: <b>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + Q (năng lượng: ATP + nhiệt)</b>."
    },
    {
        uid: "b6_mcq_12", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 12,
        question: "Các giai đoạn chính của hô hấp tế bào diễn ra theo trật tự ............(1)............<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: [
            "Chu trình Krebs → Đường phân → Chuỗi truyền electron hô hấp.",
            "Đường phân → Chuỗi truyền electron hô hấp → Chu trình Krebs.",
            "Đường phân → Chu trình Krebs → Chuỗi truyền electron hô hấp.",
            "Chuỗi truyền electron hô hấp → Chu trình Krebs → Đường phân."
        ],
        correct: 2,
        explanation: "Trật tự 3 giai đoạn chính của hô hấp tế bào hiếu khí là: <b>Đường phân → Chu trình Krebs → Chuỗi truyền electron hô hấp</b>."
    },
    {
        uid: "b6_mcq_13", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 13,
        question: "Cơ sở khoa học của các biện pháp bảo quản nông sản khô phổ biến hiện nay là làm .........(1).........<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: [
            "Tăng nhẹ cường độ hô hấp tế bào.",
            "Ngưng hoàn toàn quá trình hô hấp tế bào.",
            "Giảm cường độ hô hấp tế bào tới mức tối thiểu.",
            "Tăng cường độ hô hấp tế bào tới mức tối đa."
        ],
        correct: 2,
        explanation: "Trong bảo quản nông sản, người ta khống chế độ ẩm, nhiệt độ, thành phần khí để <b>giảm cường độ hô hấp tế bào tới mức tối thiểu</b> (không làm ngưng hoàn toàn vì nếu ngưng hoàn toàn tế bào phôi hạt sẽ chết)."
    },
    {
        uid: "b6_mcq_14", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 14,
        hasSeedSVG: true,
        question: "Để tìm hiểu quá trình hô hấp ở thực vật, 1 nhóm học sinh đã bố trí thí nghiệm như hình bên dưới. Dự đoán nào sau đây <b>đúng</b> về kết quả của thí nghiệm này?",
        options: [
            "Nước vôi ở ống nghiệm bị hút vào bình chứa hạt.",
            "Ống nghiệm chứa nước vôi xuất hiện nhiều khói trắng.",
            "Ống nghiệm chứa nước vôi bị vẩn đục.",
            "Nút cao su của bình chứa hạt nảy mầm bị bật ra."
        ],
        correct: 2,
        explanation: "Hạt đang nảy mầm hô hấp mạnh thải ra nhiều khí CO<sub>2</sub> tích tụ trong bình. Khi rót nước qua phễu vào bình, nước sẽ đẩy không khí giàu CO<sub>2</sub> qua ống chữ U sục vào ống nghiệm chứa nước vôi trong (Ca(OH)<sub>2</sub>) tạo kết tủa CaCO<sub>3</sub> làm <b>ống nghiệm chứa nước vôi bị vẩn đục</b>."
    },
    {
        uid: "b6_mcq_15", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 15,
        question: "Trong các phát biểu sau về hô hấp hiếu khí và lên men, có bao nhiêu phát biểu <b>sai</b>?<br><div class='mt-2 space-y-1 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200'>1. Hô hấp hiếu khí cần oxi, còn lên men không cần ôxi.<br>2. Trong hô hấp hiếu khí có chuỗi chuyền điện tử còn lên men thì không.<br>3. Sản phẩm cuối cùng của hô hấp hiếu khí là CO<sub>2</sub> và H<sub>2</sub>O còn của lên men là etanol hoặc axit lactic.<br>4. Hô hấp hiếu khí xảy ra ở tế bào chất còn lên men xảy ra ở ti thể.</div>",
        options: ["1", "2", "4", "3"],
        correct: 0,
        explanation: "Chỉ có <b>1 phát biểu sai</b> là phát biểu <b>(4)</b> vì quá trình lên men hoàn toàn xảy ra ở <b>tế bào chất</b>, còn hô hấp hiếu khí diễn ra chủ yếu ở <b>ti thể</b>. Các phát biểu 1, 2, 3 đều đúng."
    },
    {
        uid: "b6_mcq_16", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 16,
        question: "Có bao nhiêu lí do sau đây làm cho cây trên cạn bị ngập úng lâu ngày thì sẽ chết?<br><div class='mt-2 space-y-1 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200'>(1) Rễ cây thiếu oxi, nên cây hô hấp không bình thường.<br>(2) Lông hút bị chết.<br>(3) Cân bằng nước trong cây bị phá hủy.<br>(4) Cây bị thừa nước tất cả các tế bào đều bị úng nước nên hoạt động kém.</div>",
        options: ["1.", "2.", "3.", "4."],
        correct: 2,
        explanation: "Có <b>3 lí do đúng</b> là <b>(1), (2), (3)</b>. Khi ngập úng lâu ngày, đất thiếu O<sub>2</sub> → rễ phải hô hấp kị khí tạo chất độc và thiếu ATP (1) → tế bào lông hút bị tổn thương và chết, không hình thành lông hút mới (2) → rễ không hút được nước trong khi lá vẫn thoát hơi nước làm mất cân bằng nước và cây héo chết (3). Ý (4) sai."
    },
    {
        uid: "b6_mcq_17", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 17,
        question: "Để phát hiện hô hấp ở thực vật, một nhóm học sinh đã tiến hành thí nghiệm như sau: Dùng 4 bình cách nhiệt giống nhau đánh số thứ tự 1, 2, 3 và 4. Cả 4 bình đều đựng hạt của một giống lúa: bình 1 chứa 1kg hạt mới nhú mầm, bình 2 chứa 1kg hạt khô, bình 3 chứa 1kg hạt mới nhú mầm đã luộc chín và bình 4 chứa 0,5kg hạt mới nhú mầm. Đậy kín nắp mỗi bình rồi để trong 2 giờ. Biết rằng các điều kiện khác ở 4 bình là như nhau và phù hợp với thí nghiệm. Theo lí thuyết, có bao nhiêu dự đoán sau đây <b>đúng</b> về kết quả thí nghiệm?<br><div class='mt-2 space-y-1 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200'>I. Nhiệt độ ở cả 4 bình đều tăng.<br>II. Nhiệt độ ở bình 1 cao nhất.<br>III. Nồng độ O<sub>2</sub> ở bình 1 và bình 4 đều giảm.<br>IV. Nồng độ O<sub>2</sub> ở bình 3 tăng.</div>",
        options: ["2", "4", "3", "1"],
        correct: 0,
        explanation: "Có <b>2 dự đoán đúng</b> là <b>II và III</b>:<br>• I sai vì bình 3 chứa hạt đã luộc chín (tế bào đã chết) nên không hô hấp, nhiệt độ không tăng.<br>• II đúng vì bình 1 chứa lượng hạt đang nhú mầm lớn nhất (1kg) nên hô hấp tỏa nhiệt nhiều nhất.<br>• III đúng vì bình 1 và bình 4 đều có hạt đang nhú mầm hô hấp mạnh tiêu thụ O<sub>2</sub>.<br>• IV sai vì hạt ở bình 3 đã chết nên nồng độ O<sub>2</sub> không tăng."
    },
    {
        uid: "b6_mcq_18", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", num: 18,
        question: "Người ta đã tiến hành thí nghiệm để phát hiện hô hấp tạo ra khí CO<sub>2</sub> qua các thao tác sau:<br><div class='mt-2 space-y-1 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200'>(1) Cho 50g các hạt mới nhú mầm vào bình thủy tinh.<br>(2) Vì không khí đó chứa nhiều CO<sub>2</sub> nên làm nước vôi trong bị vẩn đục.<br>(3) Nút chặt bình bằng nút cao su đã gắn ống thủy tinh hình chữ U và phễu thủy tinh.<br>(4) Cho đầu ngoài của ống thủy tinh hình chữ U đặt vào ống nghiệm có chứa nước vôi trong.<br>(5) Nước sẽ đẩy không khí trong bình thủy tinh vào ống nghiệm.<br>(6) Sau 1,5 đến 2 giờ ta rót nước từ từ từng ít một qua phễu vào bình chứa hạt.</div>Các thao tác thí nghiệm được tiến hành theo trình tự đúng là:",
        options: [
            "(1) → (3) → (4) → (6) → (5) → (2).",
            "(2) → (1) → (3) → (4) → (6) → (5).",
            "(1) → (2) → (3) → (4) → (5) → (6).",
            "(2) → (3) → (4) → (1) → (5) → (6)."
        ],
        correct: 0,
        explanation: "Trình tự tiến hành và hiện tượng chuẩn của thí nghiệm là: Cho hạt vào bình <b>(1)</b> → Nút chặt bình có gắn ống chữ U và phễu <b>(3)</b> → Đặt đầu ống chữ U vào ống nghiệm nước vôi trong <b>(4)</b> → Chờ 1,5–2h rồi rót nước qua phễu <b>(6)</b> → Nước đẩy khí trong bình sang ống nghiệm <b>(5)</b> → Khí giàu CO<sub>2</sub> làm nước vôi trong vẩn đục <b>(2)</b>."
    },

    // ---------------- BÀI 8: DINH DƯỠNG & TIÊU HÓA Ở ĐỘNG VẬT (18 CÂU) ----------------
    {
        uid: "b8_mcq_1", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 1,
        question: "Các động vật nào sau đây có túi tiêu hóa?",
        options: [
            "San hô, thủy tức, sứa.",
            "San hô, thủy tức, giun đất, sứa.",
            "San hô, sứa, châu chấu.",
            "San hô, thủy tức, châu chấu."
        ],
        correct: 0,
        explanation: "Động vật có túi tiêu hóa thuộc ngành Ruột khoang (San hô, thủy tức, sứa, hải quỳ) và Giun dẹp. Giun đất và châu chấu đã có ống tiêu hóa."
    },
    {
        uid: "b8_mcq_2", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 2,
        question: "Tiêu hóa là quá trình",
        options: [
            "làm biến đổi thức ăn thành các chất hữu cơ đơn giản.",
            "tạo ra các chất dinh dưỡng và năng lượng cung cấp cho cơ thể.",
            "biến đổi thức ăn thành các chất dinh dưỡng và tạo ra năng lượng.",
            "biến đổi thức ăn thành những chất đơn giản mà cơ thể hấp thụ được."
        ],
        correct: 3,
        explanation: "Tiêu hóa là quá trình biến đổi các chất dinh dưỡng có trong thức ăn thành những chất đơn giản mà cơ thể hấp thụ được."
    },
    {
        uid: "b8_mcq_3", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 3,
        question: "Tiêu hóa nội bào là quá trình tiêu hóa thức ăn",
        options: [
            "bên trong tế bào, nhờ quá trình hô hấp tế bào.",
            "bên trong tế bào, nhờ các enzyme trong hệ tiêu hóa.",
            "bên ngoài tế bào, nhờ enzyme tiêu hóa và hoạt động cơ học.",
            "bên trong tế bào, nhờ enzyme tiêu hóa và hoạt động cơ học."
        ],
        correct: 1,
        explanation: "Tiêu hóa nội bào diễn ra bên trong tế bào, thức ăn được phân giải hóa học nhờ các enzyme thủy phân chứa trong lysosome."
    },
    {
        uid: "b8_mcq_4", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 4,
        question: "Tiêu hóa ngoại bào là quá trình tiêu hóa thức ăn",
        options: [
            "bên ngoài cơ thể, nhờ hoạt động cơ học của cơ quan tiêu hóa.",
            "bên ngoài tế bào, nhờ hoạt động cơ học của cơ quan tiêu hóa.",
            "bên ngoài tế bào, nhờ enzyme tiêu hóa và hoạt động cơ học.",
            "bên ngoài cơ thể, nhờ enzyme tiêu hóa và hoạt động cơ học."
        ],
        correct: 2,
        explanation: "Tiêu hóa ngoại bào là quá trình biến đổi thức ăn diễn ra bên ngoài tế bào (trong túi tiêu hóa hoặc trong lòng ống tiêu hóa), nhờ sự phối hợp của hoạt động cơ học và enzyme tiêu hóa."
    },
    {
        uid: "b8_mcq_5", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 5,
        question: "Thức ăn khi vào dạ dày của người sẽ được biến đổi về mặt .....(1).....<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: ["Cơ học", "Hóa học", "Cơ học và hóa học", "Không biến đổi mà di chuyển thẳng xuống ruột"],
        correct: 2,
        explanation: "Ở dạ dày người diễn ra cả tiêu hóa cơ học (dạ dày co bóp nhào trộn thức ăn) và tiêu hóa hóa học (nhờ enzyme pepsin và HCl phân giải protein)."
    },
    {
        uid: "b8_mcq_6", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 6,
        question: "Ở người và đa số động vật, bộ phận trực tiếp hấp thụ chất dinh dưỡng là",
        options: ["manh tràng.", "ruột non.", "dạ dày.", "ruột già."],
        correct: 1,
        explanation: "Ruột non là bộ phận trực tiếp hấp thụ hầu hết các chất dinh dưỡng nhờ có diện tích bề mặt hấp thụ rất lớn (nếp gấp, lông ruột, vi nhung mao)."
    },
    {
        uid: "b8_mcq_7", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 7,
        question: "Trong cơ thể người, chất dinh dưỡng sẽ được hấp thụ vào ......(1)......<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: ["Huyết tương", "Hồng cầu", "Lông ruột", "Máu và mạch bạch huyết"],
        correct: 3,
        explanation: "Chất dinh dưỡng đi qua biểu mô lông ruột để hấp thụ vào mao mạch máu và mao mạch bạch huyết."
    },
    {
        uid: "b8_mcq_8", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 8,
        question: "Ở sinh vật đơn bào, thức ăn được tiêu hóa bằng hình thức ......(1)......<br><span class='text-sm font-normal text-slate-600'>Từ/Cụm từ (1) là:</span>",
        options: ["Nội bào", "Ngoại bào", "Kết hợp", "Cơ chế tiêu hóa chưa rõ"],
        correct: 0,
        explanation: "Sinh vật đơn bào chưa có cơ quan tiêu hóa nên thức ăn được tiêu hóa hoàn toàn bằng hình thức tiêu hóa nội bào."
    },
    {
        uid: "b8_mcq_9", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 9,
        question: "Ở động vật có túi tiêu hóa, thức ăn được tiêu hóa ......(1)...... (nhờ enzim .....(2)...... chất dinh dưỡng phức tạp trong lòng túi) và tiêu hóa ..........(3)........<br><span class='text-sm font-normal text-slate-600'>Các từ/cụm từ cần điền vào vị trí (1), (2) và (3) lần lượt là:</span>",
        options: [
            "1 – nội bào; 2 – thủy phân; 3 – ngoại bào",
            "1 – ngoại bào; 2 – phân hủy; 3 – nội bào",
            "1 – nội bào; 2 – tiêu hủy; 3 – ngoài bào",
            "1 – ngoại bào; 2 – thủy phân; 3 – nội bào"
        ],
        correct: 3,
        explanation: "Trong túi tiêu hóa, thức ăn đầu tiên được tiêu hóa ngoại bào (1) nhờ các enzyme thủy phân (2) chất dinh dưỡng phức tạp trong lòng túi thành các mảnh nhỏ, sau đó tiếp tục tiêu hóa nội bào (3)."
    },
    {
        uid: "b8_mcq_10", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 10,
        question: "Trong ống tiêu hóa của người, các cơ quan tiêu hóa được sắp theo thứ tự: Miệng → thực quản → ......(1)...... → ........(2)...... → ruột già → hậu môn.<br><span class='text-sm font-normal text-slate-600'>Các từ/cụm từ cần điền vào vị trí (1), (2) lần lượt là:</span>",
        options: [
            "1 – thận; 2 – dạ dày",
            "1 – tá tràng; 2 – ruột non",
            "1 – dạ dày; 2 – ruột non",
            "1 – gan; 2 – tá tràng"
        ],
        correct: 2,
        explanation: "Thứ tự các bộ phận trong ống tiêu hóa của người: Khoang miệng → Thực quản → Dạ dày (1) → Ruột non (2) → Ruột già → Hậu môn."
    },
    {
        uid: "b8_mcq_11", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 11,
        question: "Trong quá trình tiêu hóa ở khoang miệng của người, tinh bột được biến đổi thành đường maltose nhờ tác dụng của enzyme nào trong nước bọt?",
        options: ["amylase.", "maltase.", "protease.", "Lipase."],
        correct: 0,
        explanation: "Tuyến nước bọt tiết ra enzyme Amylase có tác dụng thủy phân một phần tinh bột chín thành đường đôi maltose."
    },
    {
        uid: "b8_mcq_12", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 12,
        question: "Enzyme pepsin trong dạ dày có tác dụng tiêu hóa",
        options: ["Cellulose.", "protein.", "lipid.", "carbohydrate."],
        correct: 1,
        explanation: "Trong dạ dày, dưới tác dụng của HCl và enzyme pepsin, protein được phân cắt thành các chuỗi polypeptide ngắn."
    },
    {
        uid: "b8_mcq_13", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 13,
        question: "Sự tiến hóa của các hình thức tiêu hóa diễn ra như thế nào?",
        options: [
            "Tiêu hóa nội bào → Tiêu hóa ngoại bào → Tiêu hóa nội bào kết hợp với ngoại bào.",
            "Tiêu hóa nội bào → Tiêu hóa nội bào kết hợp với ngoại bào → Tiêu hóa nội bào.",
            "Tiêu hóa nội bào → Tiêu hóa nội bào kết hợp với ngoại bào → Tiêu hóa ngoại bào.",
            "Tiêu hóa nội bào kết hợp với ngoại bào → Tiêu hóa nội bào → Tiêu hóa ngoại bào."
        ],
        correct: 2,
        explanation: "Chiều hướng tiến hóa về tiêu hóa ở động vật: Tiêu hóa nội bào → Tiêu hóa nội bào kết hợp với ngoại bào → Tiêu hóa ngoại bào."
    },
    {
        uid: "b8_mcq_14", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 14,
        question: "Khi nói đến tiêu hóa động vật, có bao nhiêu nhận định <b><i>sai</i></b>?<br><div class='mt-2 space-y-1 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200'>1. Các chất không được tiêu hóa trong ống tiêu hóa sẽ tạo thành phân và thải ra ngoài.<br>2. Tiêu hóa thức ăn ở động vật có ống tiêu hóa chủ yếu là tiêu hóa nội bào.<br>3. Tuỳ thuộc vào các loại thức ăn khác nhau mà cấu tạo của bộ hàm, dạ dày, và ruột của ống tiêu hoá ở các nhóm động vật là khác nhau.<br>4. Ống tiêu hóa gồm nhiều bộ phận với các chức năng khác nhau.</div>",
        options: ["1.", "2.", "3.", "4."],
        correct: 0,
        explanation: "Chỉ có <b>1 nhận định sai</b> là nhận định <b>(2)</b> vì ở động vật có ống tiêu hóa, thức ăn được tiêu hóa hoàn toàn theo hình thức <b>tiêu hóa ngoại bào</b>."
    },
    {
        uid: "b8_mcq_15", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 15,
        question: "Động vật có ống tiêu hóa là",
        options: [
            "Người, Trâu, Bò, Dê, Cá, Châu chấu, Giun đất.",
            "Người, Trâu, Bò, Dê, Cá, San hô, Hải quỳ.",
            "Người, Trâu, Bò, Dê, Cá, San hô, Hải quỳ, Vi khuẩn.",
            "Người, Trâu, Bò, Dê, Cá, San hô, Hải quỳ, Trùng biến hình, Trùng đế giày."
        ],
        correct: 0,
        explanation: "Người, Trâu, Bò, Dê, Cá, Châu chấu, Giun đất đều có ống tiêu hóa. San hô, hải quỳ có túi tiêu hóa; Trùng biến hình, trùng đế giày tiêu hóa nội bào."
    },
    {
        uid: "b8_mcq_16", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 16,
        question: "Lông ruột, nếp gấp ở ruột non có tác dụng gì?",
        options: [
            "Đẩy thức ăn đi nhanh hơn.",
            "Tăng diện tích tiếp xúc và hấp thụ dinh dưỡng.",
            "Tăng kích thước ruột non.",
            "Giữ thức ăn đi chậm hơn."
        ],
        correct: 1,
        explanation: "Niêm mạc ruột non có nhiều nếp gấp, lông ruột và vi nhung mao giúp tăng diện tích bề mặt lên tới 250 – 300 m<sup>2</sup>, tối ưu hóa việc tiếp xúc và hấp thụ chất dinh dưỡng."
    },
    {
        uid: "b8_mcq_17", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 17,
        question: "Khi nói về tiêu hóa hóa học, có bao nhiêu ý <b>đúng</b> trong các ý sau?<br><div class='mt-2 space-y-1 text-sm font-normal text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200'>1. Nhờ các enzim trong dịch tiêu hoá do các tuyến tiêu hoá tiết ra.<br>2. Enzim giúp chuyển các hợp chất hữu cơ phức tạp thành các chất hữu cơ đơn giản có thể hấp thụ được.<br>3. Gan tiết mật góp phần nhũ tương hoá lypit và tạo môi trường thuận lợi cho hoạt động của các enzim tiêu hoá ở ruột.<br>4. HCl trong dạ dày giúp tiêu hóa thức ăn nhanh hơn.</div>",
        options: ["1.", "2.", "3.", "4."],
        correct: 3,
        explanation: "<b>Cả 4 ý đều đúng</b> khi xét về quá trình tiêu hóa hóa học trong ống tiêu hóa."
    },
    {
        uid: "b8_mcq_18", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", num: 18,
        question: "Đâu là bệnh về đường tiêu hóa?",
        options: [
            "Viêm loét dạ dày, ung thư đại tràng.",
            "Viêm khớp, viêm não.",
            "Bao đỏ, teo cơ.",
            "Ho, viêm phổi."
        ],
        correct: 0,
        explanation: "Viêm loét dạ dày và ung thư đại tràng là các bệnh lý về đường tiêu hóa."
    }
];

// =========================================================================
// 3. DỮ LIỆU PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (BÀI 6 + BÀI 8 = 8 CÂU LỚN)
// =========================================================================
const originalTFData = [
    // ---------------- BÀI 6: HÔ HẤP Ở THỰC VẬT (4 CÂU ĐÚNG/SAI) ----------------
    {
        uid: "b6_tf_1", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 1",
        prompt: "Người ta giữ khoai tây một tuần trong không khí sạch, sau đó giữ một tuần trong nitơ sạch, rồi lại giữ một tuần trong không khí sạch. Lượng CO<sub>2</sub> giải phóng ra trong thí nghiệm được biểu diễn ở đồ thị bên. Giải thích kết quả và cho biết mỗi nhận định sau đây Đúng hay Sai?",
        diagramType: "potatoGraph",
        statements: [
            {
                label: "a",
                text: "Quá trình hô hấp làm chất lượng nông sản bị giảm.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Hô hấp phân giải các chất hữu cơ dự trữ (tinh bột, đường, vitamin...) trong nông sản nên làm giảm khối lượng và chất lượng nông sản."
            },
            {
                label: "b",
                text: "Ở tuần 1 quá trình hô hấp hiếu khí bình thường.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Trong tuần 1, khoai tây được giữ trong không khí sạch (đủ O<sub>2</sub>) nên diễn ra hô hấp hiếu khí bình thường, lượng CO<sub>2</sub> thải ra ổn định."
            },
            {
                label: "c",
                text: "Ở tuần 2 xảy ra giai đoạn đầu hô hấp hiếu khí, giai đoạn sau chỉ xảy ra hô hấp kị khí.",
                isTrue: false,
                explanation: "<b>Sai.</b> Ở tuần 2 trong môi trường nitơ sạch hoàn toàn không có O<sub>2</sub> nên không xảy ra hô hấp hiếu khí mà tế bào khoai tây chuyển sang lên men tạo acid lactic (quá trình lên men lactic không giải phóng CO<sub>2</sub> nên đồ thị lượng CO<sub>2</sub> hạ sát xuống trục hoành)."
            },
            {
                label: "d",
                text: "Ở tuần 3 giai đoạn đầu, các mô có oxi sẽ đẩy mạnh oxi hóa glucozơ chuyển thành acid pyruvic tham gia vào chu trình Krebs → có sự tăng cao hàm lượng CO<sub>2</sub> thải ra, sau đó quá trình hô hấp hiếu khí bình thường → lượng CO<sub>2</sub> ổn định trở lại.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Khi đưa trở lại không khí sạch ở đầu tuần 3, lượng sản phẩm trung gian tích lũy trong giai đoạn kị khí và glucose được oxi hóa mạnh mẽ qua chu trình Krebs làm lượng CO<sub>2</sub> tăng vọt, sau đó trở về mức hô hấp hiếu khí ổn định như tuần 1."
            }
        ]
    },
    {
        uid: "b6_tf_2", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 2",
        prompt: "Khi nói về hô hấp ở thực vật, mỗi phát biểu sau đây là Đúng hay Sai?",
        diagramType: null,
        statements: [
            {
                label: "a",
                text: "Hô hấp thực chất là một chuỗi phản ứng oxy hóa khử phân giải chất hữu cơ.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Hô hấp tế bào là một chuỗi các phản ứng oxi hóa – khử sinh học phân giải chất hữu cơ phức tạp thành CO<sub>2</sub> và H<sub>2</sub>O."
            },
            {
                label: "b",
                text: "Hô hấp phá vỡ các liên kết trong các chất hữu cơ để giải phóng năng lượng, toàn bộ năng lượng được giải phóng sẽ được tích lũy trong phân tử ATP.",
                isTrue: false,
                explanation: "<b>Sai.</b> Không phải toàn bộ năng lượng đều tích lũy trong ATP; chỉ khoảng 40 – 50% năng lượng được tích lũy trong phân tử ATP, phần còn lại tỏa ra dưới dạng nhiệt năng."
            },
            {
                label: "c",
                text: "Bào quan thực hiện hô hấp chủ yếu ở thực vật là ti thể và lục lạp.",
                isTrue: false,
                explanation: "<b>Sai.</b> Bào quan thực hiện hô hấp chủ yếu ở thực vật là <b>ti thể</b> (lục lạp là bào quan thực hiện quang hợp)."
            },
            {
                label: "d",
                text: "Hô hấp ở rễ mạnh vì tế bào rễ cần nhiều năng lượng để hút khoáng chủ động.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Quá trình hấp thụ khoáng chủ động ở các tế bào lông hút của rễ tiêu tốn rất nhiều năng lượng ATP nên rễ có cường độ hô hấp rất mạnh."
            }
        ]
    },
    {
        uid: "b6_tf_3", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 3",
        prompt: "Khi nói về lên men kị khí ở thực vật, mỗi phát biểu sau đây là Đúng hay Sai?",
        diagramType: null,
        statements: [
            {
                label: "a",
                text: "Khi tế bào thiếu oxygen thì quá trình đường phân sẽ bị ngưng trệ đầu tiên.",
                isTrue: false,
                explanation: "<b>Sai.</b> Đường phân là giai đoạn kị khí (không cần O<sub>2</sub>) nên vẫn diễn ra; giai đoạn bị ngưng trệ đầu tiên khi thiếu O<sub>2</sub> là chuỗi truyền electron và chu trình Krebs trong ti thể."
            },
            {
                label: "b",
                text: "Hiệu quả chuyển hóa năng lượng của lên men cao hơn hô hấp hiếu khí.",
                isTrue: false,
                explanation: "<b>Sai.</b> Hiệu quả năng lượng của lên men rất thấp (chỉ tạo 2 ATP/1 glucose), thấp hơn nhiều lần so với hô hấp hiếu khí (30 – 32 ATP/1 glucose)."
            },
            {
                label: "c",
                text: "Giai đoạn đường phân diễn ra ở tế bào chất, giai đoạn lên men xảy ra ở ti thể.",
                isTrue: false,
                explanation: "<b>Sai.</b> Cả giai đoạn đường phân và giai đoạn lên men đều diễn ra ở <b>tế bào chất</b>."
            },
            {
                label: "d",
                text: "Quá trình lên men rượu và lên men lactic đều giải phóng CO<sub>2</sub>.",
                isTrue: false,
                explanation: "<b>Sai.</b> Chỉ có lên men rượu (ethanol) mới giải phóng khí CO<sub>2</sub>, còn lên men lactic tạo ra acid lactic hoàn toàn không giải phóng CO<sub>2</sub>."
            }
        ]
    },
    {
        uid: "b6_tf_4", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 4",
        prompt: "Khi nói về ứng dụng của hô hấp ở thực vật, mỗi phát biểu sau đây là Đúng hay Sai?",
        diagramType: null,
        statements: [
            {
                label: "a",
                text: "Để bảo quản hạt cần phơi khô hạt để giảm độ ẩm, qua đó giảm cường độ hô hấp.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Phơi khô hạt đưa độ ẩm về mức an toàn (khoảng 10 – 13%) giúp hạn chế tối đa cường độ hô hấp, tránh hạt nảy mầm hoặc mốc hỏng."
            },
            {
                label: "b",
                text: "Quá trình hô hấp làm nhiệt độ môi trường bảo quản tăng.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Một phần lớn năng lượng giải phóng từ hô hấp tỏa ra dưới dạng nhiệt làm tăng nhiệt độ kho bảo quản."
            },
            {
                label: "c",
                text: "Ở hạt khô, nếu được tăng độ ẩm thì sẽ tăng cường độ hô hấp của hạt.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Nước kích hoạt các enzyme thủy phân và hô hấp trong hạt, làm cường độ hô hấp tăng mạnh."
            },
            {
                label: "d",
                text: "Để bảo quản rau tươi, cần sấy khô trước khi đem vào tủ lạnh.",
                isTrue: false,
                explanation: "<b>Sai.</b> Rau tươi có hàm lượng nước tự nhiên cao, nếu đem sấy khô sẽ làm dập nát mô, mất nước và hỏng rau; bảo quản rau tươi chỉ cần để ráo nước bề mặt và giữ trong túi đục lỗ ở ngăn mát tủ lạnh."
            }
        ]
    },

    // ---------------- BÀI 8: DINH DƯỠNG & TIÊU HÓA Ở ĐỘNG VẬT (4 CÂU ĐÚNG/SAI) ----------------
    {
        uid: "b8_tf_1", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 1",
        prompt: "Sơ đồ bên dưới mô tả các thành phần trong hệ tiêu hóa ở người. Dựa vào sơ đồ này và những hiểu biết về sự tiêu hóa thức ăn ở người, xét các nhận định sau, hãy cho biết nhận định sau đây Đúng hay Sai?",
        diagramType: "digestiveSystem",
        statements: [
            {
                label: "a",
                text: "[1] là miệng, là nơi diễn ra tiêu hóa cơ học (nhai) và tiêu hóa hóa học tinh bột nhờ enzyme lipase.",
                isTrue: false,
                explanation: "<b>Sai.</b> Ở khoang miệng [1], tiêu hóa hóa học tinh bột diễn ra nhờ enzyme <b>amylase</b> trong nước bọt, không phải enzyme lipase."
            },
            {
                label: "b",
                text: "[2] là dạ dày đơn, là nơi diễn ra tiêu hóa cơ học (co bóp) lẫn tiêu hóa hóa học nhờ tiết ra pepsin + HCl để tiêu hóa cơ bản protein.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Dạ dày người [2] là dạ dày đơn, vừa co bóp cơ học vừa tiết dịch vị chứa HCl + enzyme pepsin để phân giải protein."
            },
            {
                label: "c",
                text: "[3] là ruột non, chỉ diễn ra tiêu hóa hóa học, là nơi diễn ra sự tiêu hóa protein, lipid, carbohydrate và cũng là nơi hấp thụ các chất dinh dưỡng vào máu.",
                isTrue: false,
                explanation: "<b>Sai.</b> Ở ruột non diễn ra cả tiêu hóa cơ học (nhu động ruột) và tiêu hóa hóa học; đồng thời trên hình số [3] chỉ vào ruột già, số [4] mới chỉ vào ruột non."
            },
            {
                label: "d",
                text: "[4] là ruột già, là nơi diễn ra quá trình tái hấp thụ nước, hình thành phân và thải ra ngoài. Ở người, manh tràng không có nhiều chức năng trong tiêu hóa và bị tiêu giảm.",
                isTrue: true,
                explanation: "<b>Đúng (theo chức năng của ruột già trong đáp án đề cương).</b> Ruột già tái hấp thụ nước, hình thành phân và ở người manh tràng tiêu giảm thành ruột thừa."
            }
        ]
    },
    {
        uid: "b8_tf_2", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 2 (TH)",
        prompt: "Mỗi nhận định sau đây là Đúng hay Sai khi nói về động vật chưa có cơ quan tiêu hóa?",
        diagramType: null,
        statements: [
            {
                label: "a",
                text: "Đa số động vật đơn bào.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Động vật chưa có cơ quan tiêu hóa chủ yếu là động vật đơn bào (trùng biến hình, trùng đế giày...)."
            },
            {
                label: "b",
                text: "Thực hiện tiêu hóa ngoại bào.",
                isTrue: false,
                explanation: "<b>Sai.</b> Động vật chưa có cơ quan tiêu hóa thực hiện <b>tiêu hóa nội bào</b>."
            },
            {
                label: "c",
                text: "Thức ăn vào cơ thể theo kiểu nhập bào.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Tế bào lấy thức ăn bằng cách thực bào/ẩm bào (nhập bào) tạo không bào tiêu hóa."
            },
            {
                label: "d",
                text: "Không bào tiêu hóa và lisosome tiết enzyme tiêu hóa thức ăn để cung cấp dinh dưỡng cho cơ thể.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Lysosome hòa màng với không bào tiêu hóa và tiết enzyme thủy phân chất dinh dưỡng."
            }
        ]
    },
    {
        uid: "b8_tf_3", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 3 (TH)",
        prompt: "Mỗi nhận định sau đây là Đúng hay Sai khi nói về tiêu hóa thức ăn ở động vật?",
        diagramType: null,
        statements: [
            {
                label: "a",
                text: "Ở động vật chưa có cơ quan tiêu hóa, thức ăn được tiêu hóa ngoại bào.",
                isTrue: false,
                explanation: "<b>Sai.</b> Ở động vật chưa có cơ quan tiêu hóa, thức ăn được tiêu hóa <b>nội bào</b>."
            },
            {
                label: "b",
                text: "Ở động vật có túi tiêu hóa, thức ăn được tiêu hóa ngoại bào và nội bào.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Thức ăn được tiêu hóa ngoại bào trong lòng túi, sau đó tiêu hóa nội bào trong các tế bào thành túi."
            },
            {
                label: "c",
                text: "Tiêu hóa thức ăn trong ống tiêu hóa có ở hầu hết động vật không xương sống và có xương sống.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Hầu hết ĐV không xương sống (từ giun đốt, thân mềm, chân khớp) và tất cả ĐV có xương sống đều có ống tiêu hóa."
            },
            {
                label: "d",
                text: "Tiêu hóa nội bào là tiêu hóa thức ăn diễn ra bên trong tế bào.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Đây là định nghĩa chính xác của tiêu hóa nội bào."
            }
        ]
    },
    {
        uid: "b8_tf_4", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 4 (TH)",
        prompt: "Mỗi nhận định sau đây là Đúng hay Sai khi nói về chế độ dinh dưỡng cân bằng?",
        diagramType: null,
        statements: [
            {
                label: "a",
                text: "Chế độ dinh dưỡng cân bằng là cung cấp năng lượng và các chất dinh dưỡng phù hợp với nhu cầu cơ thể, các nhóm chất đưa vào cơ thể vừa đủ, đúng tỉ lệ.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Khẩu phần ăn cần đủ năng lượng và cân đối tỉ lệ các chất dinh dưỡng."
            },
            {
                label: "b",
                text: "Trong chế độ dinh dưỡng cân bằng, tỉ lệ nhóm chất carbohydrate chiếm khoảng 13 – 20% so với tổng nhu cầu năng lượng.",
                isTrue: false,
                explanation: "<b>Sai.</b> Carbohydrate chiếm khoảng <b>55 – 65%</b> tổng nhu cầu năng lượng; còn 13 – 20% là tỉ lệ của nhóm <b>Protein</b>."
            },
            {
                label: "c",
                text: "Trong chế độ dinh dưỡng cân bằng, tỉ lệ nhóm chất lipid chiếm khoảng 15 – 20% so với tổng nhu cầu năng lượng.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Lipid chiếm khoảng 15 – 20% tổng nhu cầu năng lượng."
            },
            {
                label: "d",
                text: "Chế độ dinh dưỡng cân bằng cần bổ sung đầy đủ nước, vitamin, khoáng chất và chất xơ.",
                isTrue: true,
                explanation: "<b>Đúng.</b> Nước, vitamin, khoáng chất và chất xơ là thành phần thiết yếu trong chế độ dinh dưỡng cân bằng."
            }
        ]
    }
];

// =========================================================================
// 4. DỮ LIỆU PHẦN III: TRẢ LỜI NGẮN (BÀI 6 + BÀI 8 = 6 CÂU)
// =========================================================================
const originalSAData = [
    // ---------------- BÀI 6: HÔ HẤP Ở THỰC VẬT (3 CÂU) ----------------
    {
        uid: "b6_sa_1", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 1",
        question: "Trong số các chất sau đây: <b>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>, O<sub>2</sub>, CO<sub>2</sub>, H<sub>2</sub>O</b>. Có bao nhiêu chất là <b>nguyên liệu</b> của hô hấp?",
        items: [
            { text: "1. C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> (Glucose)", isTarget: true, note: "Nguyên liệu hữu cơ chính của quá trình hô hấp tế bào." },
            { text: "2. O<sub>2</sub> (Oxygen)", isTarget: true, note: "Nguyên liệu oxi hóa (chất nhận electron cuối cùng trong chuỗi truyền e)." },
            { text: "3. CO<sub>2</sub> (Carbon dioxide)", isTarget: false, note: "Là sản phẩm thải của quá trình hô hấp, không phải nguyên liệu." },
            { text: "4. H<sub>2</sub>O (Nước)", isTarget: false, note: "Theo PTTQ rút gọn SGK (C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Q) thì H₂O là sản phẩm. (Lưu ý: Nếu xét PTTQ đầy đủ có 6H₂O tham gia chu trình Krebs thì có thể tính là 3 chất, nhưng đáp án chuẩn phổ thông theo PTTQ rút gọn là 2 chất: C₆H₁₂O₆ và O₂)." }
        ],
        correctAnswer: 2,
        maxChoices: 4,
        explanation: "Theo phương trình tổng quát chuẩn SGK: <b>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + Q (ATP + nhiệt)</b>, có <b>2 chất</b> là nguyên liệu chính của hô hấp gồm: <b>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> và O<sub>2</sub></b>."
    },
    {
        uid: "b6_sa_2", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 2",
        question: "Trong số các chất sau đây: <b>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>, O<sub>2</sub>, CO<sub>2</sub>, H<sub>2</sub>O, ATP</b>. Có bao nhiêu chất là <b>sản phẩm chính</b> của hô hấp?",
        items: [
            { text: "1. C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>", isTarget: false, note: "Là nguyên liệu của hô hấp." },
            { text: "2. O<sub>2</sub>", isTarget: false, note: "Là nguyên liệu của hô hấp." },
            { text: "3. CO<sub>2</sub>", isTarget: true, note: "Sản phẩm của quá trình khử carboxyl trong chu trình Krebs." },
            { text: "4. H<sub>2</sub>O", isTarget: true, note: "Sản phẩm tạo thành ở cuối chuỗi truyền electron." },
            { text: "5. ATP", isTarget: true, note: "Sản phẩm năng lượng sinh học quan trọng nhất của hô hấp tế bào." }
        ],
        correctAnswer: 3,
        maxChoices: 5,
        explanation: "Có <b>3 chất</b> là sản phẩm chính của quá trình hô hấp tế bào gồm: <b>CO<sub>2</sub>, H<sub>2</sub>O và ATP</b>."
    },
    {
        uid: "b6_sa_3", topic: "b6", topicBadge: "Bài 6 • Hô hấp TV", title: "Câu 3",
        question: "Trong số các nhân tố sau đây: <b>Hàm lượng nước, Nhiệt độ, Nồng độ O<sub>2</sub>, Nồng độ CO<sub>2</sub></b>. Có bao nhiêu nhân tố <b>càng tăng thì cường độ hô hấp càng giảm</b>?",
        items: [
            { text: "1. Hàm lượng nước", isTarget: false, note: "Khi hàm lượng nước tăng (đến mức bão hòa sinh lý) thì cường độ hô hấp tăng." },
            { text: "2. Nhiệt độ", isTarget: false, note: "Trong giới hạn sinh lý (tới nhiệt độ tối ưu), nhiệt độ tăng thì cường độ hô hấp tăng." },
            { text: "3. Nồng độ O<sub>2</sub>", isTarget: false, note: "Nồng độ O₂ tăng (đến ngưỡng bão hòa) giúp thúc đẩy hô hấp hiếu khí." },
            { text: "4. Nồng độ CO<sub>2</sub>", isTarget: true, note: "Thỏa mãn: CO₂ là sản phẩm cuối của hô hấp, nồng độ CO₂ trong môi trường càng tăng cao thì phản ứng hô hấp càng bị ức chế (cường độ hô hấp càng giảm)." }
        ],
        correctAnswer: 1,
        maxChoices: 4,
        explanation: "Chỉ có <b>1 nhân tố</b> là <b>Nồng độ CO<sub>2</sub></b>: Nồng độ CO<sub>2</sub> trong môi trường càng tăng cao (vượt mức bình thường 0,03%) thì càng ức chế quá trình hô hấp, làm cường độ hô hấp giảm."
    },

    // ---------------- BÀI 8: DINH DƯỠNG & TIÊU HÓA Ở ĐỘNG VẬT (3 CÂU) ----------------
    {
        uid: "b8_sa_1", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 1",
        question: "Có bao nhiêu nhận định <b>đúng</b> với ưu thế của ống tiêu hóa so với túi tiêu hóa?",
        items: [
            { text: "1. Dịch tiêu hóa được hòa loãng", isTarget: false, note: "Sai (Ở ống tiêu hóa, dịch tiêu hóa KHÔNG bị hòa loãng với nước như ở túi tiêu hóa)." },
            { text: "2. Dịch tiêu hóa không được hòa loãng", isTarget: true, note: "Đúng (Giúp nồng độ enzyme tiêu hóa đậm đặc, hiệu suất cao)." },
            { text: "3. Ống tiêu hóa được phân hóa thành các bộ phận khác nhau tạo cho sự chuyên hóa về chức năng", isTarget: true, note: "Đúng (Chuyên hóa từng bộ phận giúp tiêu hóa và hấp thụ triệt để)." },
            { text: "4. Có sự kết hợp giữa tiêu hóa hóa học và tiêu hóa cơ học", isTarget: true, note: "Đúng (Cơ học nghiền nhỏ làm tăng diện tích tiếp xúc với enzyme hóa học)." }
        ],
        correctAnswer: 3,
        maxChoices: 4,
        explanation: "Có <b>3 nhận định đúng</b> là: <b>(2), (3) và (4)</b>."
    },
    {
        uid: "b8_sa_2", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 2",
        question: "Có bao nhiêu nhận định <b>đúng</b> khi nói về tiêu hóa ở động vật?",
        items: [
            { text: "(1) Bệnh tiêu chảy có thể do dùng kháng sinh bừa bãi gây ra", isTarget: true, note: "Đúng (Gây loạn khuẩn đường ruột)." },
            { text: "(2) Táo bón có thể do nhịn đi vệ sinh lâu ngày", isTarget: true, note: "Đúng (Phân bị tái hấp thụ kiệt nước trở nên khô cứng)." },
            { text: "(3) Ống tiêu hóa là sự tiến hóa của túi tiêu hóa", isTarget: true, note: "Đúng." },
            { text: "(4) Ăn uống kém vệ sinh không gây ra bệnh tiêu hóa", isTarget: false, note: "Sai (Ăn uống kém vệ sinh gây ngộ độc, tiêu chảy, nhiễm giun sán)." },
            { text: "(5) Nên tích cực xổ giun định kỳ để phòng bệnh giun sán", isTarget: true, note: "Đúng." },
            { text: "(6) Sử dụng thuốc táo bón thường xuyên tốt cho sức khỏe", isTarget: false, note: "Sai (Lạm dụng thuốc nhuận tràng gây phụ thuộc thuốc và rối loạn tiêu hóa)." }
        ],
        correctAnswer: 4,
        maxChoices: 6,
        explanation: "Có <b>4 nhận định đúng</b> là: <b>(1), (2), (3) và (5)</b>."
    },
    {
        uid: "b8_sa_3", topic: "b8", topicBadge: "Bài 8 • Tiêu hóa ĐV", title: "Câu 3",
        question: "Có bao nhiêu nhận định <b>sai</b> khi nói dinh dưỡng và tiêu hóa ở động vật?",
        items: [
            { text: "(1) Protein trong khẩu phần ăn hằng ngày nên chiếm từ 50%", isTarget: true, note: "Nhận định SAI (Protein chỉ nên chiếm 13 – 20%)." },
            { text: "(2) Chế độ ăn ngoài đủ các nhóm chất dinh dưỡng chính không cần phải bổ sung gì thêm", isTarget: true, note: "Nhận định SAI (Cần bổ sung nước, vitamin, khoáng chất, chất xơ)." },
            { text: "(3) Vận động nhiều sẽ dẫn đến nguy cơ táo bón cao", isTarget: true, note: "Nhận định SAI (Ít vận động mới gây táo bón)." },
            { text: "(4) Có hai hình thức tiêu hóa ở động vật là tiêu hóa nội bào và ngoại bào, đôi khi chúng kết hợp cả hai ở động vật đa bào bậc thấp", isTarget: false, note: "Nhận định ĐÚNG." }
        ],
        correctAnswer: 3,
        maxChoices: 4,
        explanation: "Đề bài hỏi số nhận định <b>SAI</b> → Có <b>3 nhận định sai</b> là: <b>(1), (2) và (3)</b>."
    }
];
