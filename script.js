document.addEventListener('DOMContentLoaded', () => {
    // Page Elements
    const loginPage = document.getElementById('login-page');
    const registerPage = document.getElementById('register-page');
    const studentProfilePage = document.getElementById('student-profile-page');
    const studentDashboardPage = document.getElementById('student-dashboard-page');
    const adminDashboardPage = document.getElementById('admin-dashboard-page');
    const aboutUsPage = document.getElementById('about-us-page');

    // Form Elements
    const studentLoginForm = document.getElementById('student-login-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const registerForm = document.getElementById('register-form');
    const profileForm = document.getElementById('profile-form');
    const jobPostForm = document.getElementById('job-post-form');

    // Navigation and Buttons
    const showStudentLogin = document.getElementById('show-student-login');
    const showAdminLogin = document.getElementById('show-admin-login');
    const showRegisterStudent = document.getElementById('show-register-student');
    const showRegisterAdmin = document.getElementById('show-register-admin');
    const showLogin = document.getElementById('show-login');
    const toggleMenuStudent = document.getElementById('toggle-menu-student');
    const toggleMenuAdmin = document.getElementById('toggle-menu-admin');
    const toggleContentStudent = document.getElementById('toggle-content-student');
    const toggleContentAdmin = document.getElementById('toggle-content-admin');
    const aboutUsLink = document.getElementById('about-us-link');
    const aboutUsLinkAdmin = document.getElementById('about-us-link-admin');

    // Logout Buttons
    const logoutRegister = document.getElementById('logout-register');
    const logoutProfile = document.getElementById('logout-profile');
    const logoutDashboard = document.getElementById('logout-dashboard');
    const logoutAdmin = document.getElementById('logout-admin');
    const logoutAbout = document.getElementById('logout-about');

    // Navigation Arrows
    const backRegister = document.getElementById('back-register');
    const nextRegister = document.getElementById('next-register');
    const backProfile = document.getElementById('back-profile');
    const nextProfile = document.getElementById('next-profile');
    const backDashboard = document.getElementById('back-dashboard');
    const nextDashboard = document.getElementById('next-dashboard');
    const backAdmin = document.getElementById('back-admin');
    const nextAdmin = document.getElementById('next-admin');
    const backAbout = document.getElementById('back-about');
    const nextAbout = document.getElementById('next-about');

    // Toggle Details
    const toggleDetailsStudent = document.getElementById('toggle-details-student');
    const toggleDetailsAdmin = document.getElementById('toggle-details-admin');

    // Profile Progress Elements
    const progressText = document.getElementById('profile-progress');
    const progressFill = document.getElementById('progress-fill');

    // Profile Form Inputs
    const profileInputs = {
        photo: document.getElementById('profile-photo'),
        personalEmail: document.getElementById('personal-email'),
        mobile: document.getElementById('mobile'),
        gender: document.getElementById('gender'),
        disability: document.getElementById('disability'),
        linkedin: document.getElementById('linkedin'),
        github: document.getElementById('github'),
        cert10th: document.getElementById('cert-10th'),
        certInter: document.getElementById('cert-inter'),
        certUg: document.getElementById('cert-ug'),
        certPg: document.getElementById('cert-pg'),
        branch: document.getElementById('branch'),
        skills: document.getElementById('skills'),
        roles: document.getElementById('roles'),
        resume: document.getElementById('resume'),
        resumeContent: document.getElementById('resume-content')
    };

    // Other Elements
    const generateResume = document.getElementById('generate-resume');
    const aiAssistant = document.getElementById('ai-assistant');
    const submitQuestion = document.getElementById('submit-question');
    const questionInput = document.getElementById('question-input');

    // State Management
    let userRole = null; // 'student' or 'admin'
    let studentPages = [studentProfilePage, studentDashboardPage, aboutUsPage];
    let adminPages = [adminDashboardPage, aboutUsPage];
    let currentPageIndex = -1;
    let selectedSection = null;

    // Sample Data
    const adminSlots = [
        '2025-05-01 10:00 AM',
        '2025-05-01 11:00 AM',
        '2025-05-02 10:00 AM'
    ];
    let bookedSlots = [];
    const adminMessages = [
        'New job posted: Software Developer - TechCorp (2025-05-10)',
        'Interview schedule updated for Data Analyst - DataInc'
    ];

    // Function to Show Specific Page
    const showPage = (page) => {
        [loginPage, registerPage, studentProfilePage, studentDashboardPage, adminDashboardPage, aboutUsPage].forEach(p => {
            p.style.display = 'none';
        });
        page.style.display = 'flex';
        // Hide login forms and toggle content when navigating
        studentLoginForm.style.display = 'none';
        adminLoginForm.style.display = 'none';
        toggleContentStudent.style.display = 'none';
        toggleContentAdmin.style.display = 'none';
        toggleDetailsStudent.style.display = 'none';
        toggleDetailsAdmin.style.display = 'none';
        if (page === studentDashboardPage || page === adminDashboardPage) {
            updateDashboardContent();
        }
    };

    // Function to Update Profile Progress
    const updateProfileProgress = () => {
        const totalFields = Object.keys(profileInputs).length;
        let filledFields = 0;

        Object.values(profileInputs).forEach(input => {
            if (input.type === 'file') {
                if (input.files.length > 0) filledFields++;
            } else if (input.value.trim() !== '') {
                filledFields++;
            }
        });

        const requiredFields = totalFields - 3; // linkedin, github, certPg are optional
        const filledRequired = filledFields - (profileInputs.linkedin.value ? 1 : 0) -
                             (profileInputs.github.value ? 1 : 0) -
                             (profileInputs.certPg.files.length > 0 ? 1 : 0);
        const progress = Math.min(100, Math.round((filledRequired / requiredFields) * 100));

        progressText.textContent = `${progress}%`;
        progressFill.style.width = `${progress}%`;

        const applyButtons = document.querySelectorAll('.job-card button');
        applyButtons.forEach(button => {
            button.disabled = progress < 100;
            button.style.opacity = progress < 100 ? '0.5' : '1';
        });
    };

    // Navigation Logic
    const navigate = (direction, pages) => {
        if (currentPageIndex === -1 && direction === 'next') {
            currentPageIndex = 0;
        } else if (direction === 'next') {
            currentPageIndex = (currentPageIndex + 1) % pages.length;
        } else if (direction === 'back') {
            currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
        }

        if (currentPageIndex >= 0) {
            showPage(pages[currentPageIndex]);
        } else {
            showPage(loginPage);
        }
    };

    // Update Dashboard Content Based on Selected Section
    const updateDashboardContent = () => {
        const dashboardContent = document.getElementById(userRole === 'student' ? 'dashboard-content' : 'admin-dashboard-content');
        const toggleDetails = document.getElementById(`toggle-details-${userRole}`);
        if (selectedSection) {
            dashboardContent.style.display = 'none';
            toggleDetails.style.display = 'block';
            switch (selectedSection) {
                case 'profile':
                    toggleDetails.innerHTML = '<h2>Profile</h2><p>Complete your profile details here. Progress: <span id="dashboard-progress"></span>%</p>';
                    document.getElementById('dashboard-progress').textContent = progressText.textContent;
                    break;
                case 'calendar':
                    toggleDetails.innerHTML = '<h2>Calendar</h2><p>Job Deadlines:<br>Software Developer - TechCorp: 2025-05-10<br>Data Analyst - DataInc: 2025-05-15</p>';
                    break;
                case 'applications':
                    toggleDetails.innerHTML = '<h2>My Applications</h2><p>Applications:<br>Software Developer - TechCorp: Applied</p>';
                    break;
                case 'messages':
                    toggleDetails.innerHTML = `<h2>Messages</h2><p>Messages from Admin:<br>${adminMessages.join('<br>')}</p>`;
                    break;
                case 'book-slots':
                    toggleDetails.innerHTML = `<h2>Book Slots</h2>${adminSlots.map(slot => `
                        <div class="slot-card">
                            <p>${slot} ${bookedSlots.includes(slot) ? '(Booked)' : '<button class="book-slot-btn" data-slot="${slot}">Book</button>'}</p>
                        </div>
                    `).join('')}`;
                    document.querySelectorAll('.book-slot-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const slot = btn.getAttribute('data-slot');
                            if (!bookedSlots.includes(slot)) {
                                bookedSlots.push(slot);
                                updateDashboardContent();
                                alert(`Slot ${slot} booked successfully!`);
                            }
                        });
                    });
                    break;
                case 'interview-experience':
                    toggleDetails.innerHTML = `
                        <h2>Interview Experience</h2>
                        <div class="experience-section">
                            <p><strong>Student 1:</strong> Interviewed at TechCorp - Great process, focused on coding skills.</p>
                            <p><strong>Student 2:</strong> DataInc was smooth, asked behavioral questions.</p>
                            <textarea id="question-input" placeholder="Ask a question..."></textarea>
                            <button id="submit-question">Submit</button>
                        </div>
                    `;
                    document.getElementById('submit-question').addEventListener('click', () => {
                        const question = document.getElementById('question-input').value.trim();
                        if (question) {
                            alert(`Question submitted: ${question}`);
                            document.getElementById('question-input').value = '';
                        } else {
                            alert('Please enter a question.');
                        }
                    });
                    break;
                case 'posted-jobs':
                    toggleDetails.innerHTML = '<h2>Posted Jobs</h2><p>Jobs:<br>TechCorp - Software Developer<br>Applicants: 25<br>Deadline: 2025-05-10</p>';
                    break;
                case 'analytics':
                    toggleDetails.innerHTML = '<h2>Analytics</h2><p>Placement Analytics:<br>Jobs Posted: 10<br>Applications: 150<br>Average CTC: 7 LPA</p>';
                    break;
                case 'notifications':
                    toggleDetails.innerHTML = `
                        <h2>Notifications</h2>
                        <p>Send Notification:</p>
                        <select id="notification-type">
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="call">Call</option>
                        </select>
                        <textarea id="notification-message" placeholder="Enter message..."></textarea>
                        <button id="send-notification">Send</button>
                    `;
                    document.getElementById('send-notification').addEventListener('click', () => {
                        const type = document.getElementById('notification-type').value;
                        const message = document.getElementById('notification-message').value.trim();
                        if (message) {
                            adminMessages.push(`Admin Notification (${type.toUpperCase()}): ${message}`);
                            document.getElementById('notification-message').value = '';
                            alert(`Notification sent via ${type} successfully!`);
                        } else {
                            alert('Please enter a message.');
                        }
                    });
                    break;
                case 'interview-scheduler':
                    toggleDetails.innerHTML = `
                        <h2>Interview Scheduler</h2>
                        <p>Available Slots:<br>${adminSlots.join('<br>')}</p>
                        <input type="datetime-local" id="new-slot">
                        <button id="add-slot">Add Slot</button>
                    `;
                    document.getElementById('add-slot').addEventListener('click', () => {
                        const slotTime = document.getElementById('new-slot').value;
                        if (slotTime) {
                            const slotText = new Date(slotTime).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });
                            adminSlots.push(slotText);
                            document.getElementById('new-slot').value = '';
                            updateDashboardContent();
                            alert(`Slot ${slotText} added successfully!`);
                        } else {
                            alert('Please select a slot time.');
                        }
                    });
                    break;
            }
        } else {
            dashboardContent.style.display = 'flex';
            toggleDetails.style.display = 'none';
        }
    };

    // Toggle Menu Handlers
    toggleMenuStudent.addEventListener('click', () => {
        toggleContentStudent.style.display = toggleContentStudent.style.display === 'block' ? 'none' : 'block';
    });

    toggleMenuAdmin.addEventListener('click', () => {
        toggleContentAdmin.style.display = toggleContentAdmin.style.display === 'block' ? 'none' : 'block';
    });

    // Login Flow
    showStudentLogin.addEventListener('click', () => {
        studentLoginForm.style.display = 'block';
        adminLoginForm.style.display = 'none';
    });

    showAdminLogin.addEventListener('click', () => {
        adminLoginForm.style.display = 'block';
        studentLoginForm.style.display = 'none';
    });

    // Registration and Login Handling
    showRegisterStudent.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(registerPage);
    });

    showRegisterAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(registerPage);
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(loginPage);
    });

    studentLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('student-login-email').value;
        if (email.match(/[a-zA-Z0-9._%+-]+@mits\.ac\.in/)) {
            userRole = 'student';
            currentPageIndex = 0;
            showPage(studentProfilePage);
        } else {
            alert('Please use a valid @mits.ac.in email address.');
        }
    });

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-login-email').value;
        if (email.match(/[a-zA-Z]+[0-9]*@mits\.ac\.in/)) {
            userRole = 'admin';
            currentPageIndex = 0;
            showPage(adminDashboardPage);
        } else {
            alert('Please use a valid admin email (e.g., jude123@mits.ac.in).');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        if (email.match(/[a-zA-Z0-9._%+-]+@mits\.ac\.in/)) {
            alert('Registration successful! Please login.');
            showPage(loginPage);
        } else {
            alert('Please use a valid @mits.ac.in email address.');
        }
    });

    // Profile Form Submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateProfileProgress();
        alert('Profile saved successfully!');
        navigate('next', studentPages);
    });

    // Real-time Profile Progress Update
    Object.values(profileInputs).forEach(input => {
        input.addEventListener('change', updateProfileProgress);
        input.addEventListener('input', updateProfileProgress);
    });

    // Generate Resume Button
    generateResume.addEventListener('click', () => {
        const content = profileInputs.resumeContent.value;
        if (content.trim()) {
            alert('Resume PDF generated successfully! (Simulated)');
        } else {
            alert('Please enter resume content.');
        }
    });

    // Job Apply Button Interaction
    document.querySelectorAll('.job-card button').forEach(button => {
        button.addEventListener('click', () => {
            if (!button.disabled) {
                alert('Application submitted successfully!');
            } else {
                alert('Complete your profile to apply for jobs.');
            }
        });
    });

    // Admin Job Post Form Submission
    jobPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Job posted successfully!');
    });

    // Toggle Menu Links for Student
    document.querySelectorAll('#toggle-content-student a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectedSection = link.getAttribute('data-section');
            updateDashboardContent();
            toggleContentStudent.style.display = 'none';
        });
    });

    // Toggle Menu Links for Admin
    document.querySelectorAll('#toggle-content-admin a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectedSection = link.getAttribute('data-section');
            updateDashboardContent();
            toggleContentAdmin.style.display = 'none';
        });
    });

    // About Us Link
    aboutUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (userRole === 'student') {
            currentPageIndex = 2;
            showPage(aboutUsPage);
        }
    });

    aboutUsLinkAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        if (userRole === 'admin') {
            currentPageIndex = 1;
            showPage(aboutUsPage);
        }
    });

    // AI Assistant Button
    aiAssistant.addEventListener('click', () => {
        alert('AI Assistant: How can I help you? (e.g., "Show me developer jobs")');
    });

    // Logout Functionality
    [logoutRegister, logoutProfile, logoutDashboard, logoutAdmin, logoutAbout].forEach(button => {
        button.addEventListener('click', () => {
            userRole = null;
            currentPageIndex = -1;
            selectedSection = null;
            showPage(loginPage);
        });
    });

    // Navigation for Student Pages
    backProfile.addEventListener('click', () => navigate('back', studentPages));
    nextProfile.addEventListener('click', () => navigate('next', studentPages));
    backDashboard.addEventListener('click', () => {
        selectedSection = null;
        updateDashboardContent();
        navigate('back', studentPages);
    });
    nextDashboard.addEventListener('click', () => navigate('next', studentPages));
    backAbout.addEventListener('click', () => navigate('back', userRole === 'student' ? studentPages : adminPages));
    nextAbout.addEventListener('click', () => navigate('next', userRole === 'student' ? studentPages : adminPages));

    // Navigation for Admin Pages
    backAdmin.addEventListener('click', () => {
        selectedSection = null;
        updateDashboardContent();
        navigate('back', adminPages);
    });
    nextAdmin.addEventListener('click', () => navigate('next', adminPages));

    // Navigation for Register Page
    backRegister.addEventListener('click', () => {
        currentPageIndex = -1;
        showPage(loginPage);
    });
    nextRegister.addEventListener('click', () => {
        currentPageIndex = -1;
        showPage(loginPage);
    });

    // Initialize Progress
    updateProfileProgress();
});
