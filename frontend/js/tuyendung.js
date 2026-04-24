document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. KIỂM TRA ĐĂNG NHẬP (Soft Check)
    // ==========================================
    const loginBtn = document.getElementById('btn-login-logout');
    const token = localStorage.getItem('accessToken');

    if (token) {
        loginBtn.innerText = 'Đăng xuất';
        loginBtn.style.backgroundColor = '#d9534f'; 
        loginBtn.style.color = '#fff';
        
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm("Ní có chắc muốn đăng xuất không?")) {
                localStorage.removeItem('accessToken'); 
                window.location.reload(); 
            }
        };
    } else {
        loginBtn.onclick = () => {
            window.location.href = 'dangnhap.html';
        }
    }

    // ==========================================
    // 2. RENDER DỮ LIỆU ĐỘNG CHO DANH SÁCH VIỆC LÀM
    // ==========================================
    const jobContainer = document.getElementById('job-list-container');
    
    // API lấy danh sách việc làm từ Backend (Ví dụ)
    // const API_URL = "http://localhost:8080/api/jobs"; 

    try {
        // Tạm thời tôi dùng mảng fake data giả lập API trả về để ní test giao diện động
        // Nếu ní đã có API Spring Boot thì mở comment dòng fetch() phía dưới ra nhé.
        
        /* const response = await fetch(API_URL);
        const jobs = await response.json(); 
        */

        const jobs = [
            { id: 1, title: "Đầu bếp món chay/kiêng", req1: "Kinh nghiệm tối thiểu 2 năm bếp chay", req2: "Am hiểu về cân bằng dinh dưỡng, tính calo" },
            { id: 2, title: "Nhân viên Phục vụ", req1: "Nhanh nhẹn, thân thiện, giao tiếp tốt", req2: "Không yêu cầu kinh nghiệm (sẽ được đào tạo)" },
            { id: 3, title: "Quản lý Cửa hàng", req1: "Kinh nghiệm 2 năm quản lý F&B", req2: "Kỹ năng xử lý tình huống, đào tạo nhân sự" }
        ];

        // Xóa dòng chữ "Đang tải..."
        jobContainer.innerHTML = '';

        // Dùng vòng lặp nhả dữ liệu động vào HTML
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'pos-card'; // Giữ đúng class CSS cũ của ní
            
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <ul>
                    <li>${job.req1}</li>
                    <li>${job.req2}</li>
                </ul>
                <button class="btn-apply" data-job="${job.title}" style="margin-top: 15px; padding: 8px 15px; background: #5cb85c; color: white; border: none; border-radius: 5px; cursor: pointer;">Ứng tuyển ngay</button>
            `;
            jobContainer.appendChild(jobCard);
        });

        // Gắn sự kiện cho nút Ứng tuyển
        const applyButtons = document.querySelectorAll('.btn-apply');
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobTitle = e.target.getAttribute('data-job');
                if(token) {
                    alert(`✅ Chuyển hướng đến form nộp CV cho vị trí: [${jobTitle}].`);
                } else {
                    alert(`⚠️ Ní cần Đăng nhập trước khi nộp hồ sơ vị trí [${jobTitle}] nha!`);
                }
            });
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu tuyển dụng:", error);
        jobContainer.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Không thể tải danh sách việc làm lúc này.</p>';
    }
});