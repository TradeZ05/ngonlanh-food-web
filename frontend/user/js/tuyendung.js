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
    // 2. NẾU CÓ Dimage SÁCH ĐỘNG THÌ XỬ LÝ, NGƯỢC LẠI CHỈ CẦN ĐĂNG NHẬP
    // ==========================================
    const jobContainer = document.getElementById('job-list-container');

    if (jobContainer) {
        try {
            const jobs = [
                { id: 1, title: "Đầu bếp món chay/kiêng", req1: "Kinh nghiệm tối thiểu 2 năm bếp chay", req2: "Am hiểu về cân bằng dinh dưỡng, tính calo" },
                { id: 2, title: "Nhân viên Phục vụ", req1: "Nhimage nhẹn, thân thiện, giao tiếp tốt", req2: "Không yêu cầu kinh nghiệm (sẽ được đào tạo)" },
                { id: 3, title: "Quản lý Cửa hàng", req1: "Kinh nghiệm 2 năm quản lý F&B", req2: "Kỹ năng xử lý tình huống, đào tạo nhân sự" }
            ];

            jobContainer.innerHTML = '';

            jobs.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'pos-card';
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
            jobContainer.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Không thể tải dimage sách việc làm lúc này.</p>';
        }
    }
});