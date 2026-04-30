document.addEventListener("DOMContentLoaded", function() {
    // Default profile data to simulate a database state
    const defaultProfile = {
        name: "Nguyễn Văn A",
        phone: "0908 882 795",
        email: "nguyenvana@gmail.com",
        address: "Hồ Chí Minh",
        dob: "2001-03-27",
        gender: "Nam"
    };

    // Retrieve or initialize from localStorage
    let profileData = JSON.parse(localStorage.getItem('ngonlimage_profile'));
    if (!profileData) {
        profileData = defaultProfile;
        localStorage.setItem('ngonlimage_profile', JSON.stringify(profileData));
    }

    // Page 1: Display Mode (thongtin1.html)
    if (document.getElementById('disp-name')) {
        document.getElementById('disp-name').textContent = profileData.name;
        document.getElementById('disp-phone').textContent = profileData.phone;
        document.getElementById('disp-email').textContent = profileData.email;
        document.getElementById('disp-address').textContent = profileData.address;
        
        // Format date for display from YYYY-MM-DD to DD/MM/YYYY
        let dobParts = profileData.dob.split('-');
        if(dobParts.length === 3) {
             document.getElementById('disp-dob').textContent = `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`;
        } else {
             document.getElementById('disp-dob').textContent = profileData.dob;
        }
        
        document.getElementById('disp-gender').textContent = profileData.gender;
    }

    // Page 2: Edit Mode (thongtin2.html)
    if (document.getElementById('edit-profile-form')) {
        // Load data into inputs
        document.getElementById('input-name').value = profileData.name;
        
        // Check if phone has country code and separate it if needed, or just put the whole string
        // For simplicity, we just put it in the phone input
        document.getElementById('input-phone').value = profileData.phone;
        
        document.getElementById('input-email').value = profileData.email;
        document.getElementById('input-address').value = profileData.address;
        document.getElementById('input-dob').value = profileData.dob;
        document.getElementById('input-gender').value = profileData.gender;

        // Handle Form Submission
        document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Collect new values
            profileData.name = document.getElementById('input-name').value;
            profileData.phone = document.getElementById('input-phone').value;
            profileData.email = document.getElementById('input-email').value;
            profileData.address = document.getElementById('input-address').value;
            profileData.dob = document.getElementById('input-dob').value;
            profileData.gender = document.getElementById('input-gender').value;

            // Save back to localStorage
            localStorage.setItem('ngonlimage_profile', JSON.stringify(profileData));
            
            // Navigate back to thongtin1.html to show changes
            window.location.href = 'thongtin1.html';
        });
    }
});
