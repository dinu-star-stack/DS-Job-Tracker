// ========================================
// DS JOB TRACKER
// ========================================


// Get applications from localStorage

let applications =
    JSON.parse(
        localStorage.getItem("dsJobApplications")
    ) || [];

let currentGuidanceJobId = null;

// ========================================
// OPEN MODAL
// ========================================

function openAddJob() {

    const form = document.getElementById("jobForm");

    if (!form.dataset.editingId) {
        document.getElementById("jobModalTitle").textContent =
            "Add Job Application";
    }

    document.getElementById("jobModal").style.display = "flex";
}


// ========================================
// CLOSE MODAL
// ========================================

function closeAddJob() {

    const modal =
        document.getElementById("jobModal");

    if (modal) {

        modal.style.display = "none";

    }

}



// ========================================
// SAVE APPLICATION
// ========================================

const jobForm =
    document.getElementById("jobForm");


if (jobForm) {


    jobForm.addEventListener(
        "submit",
        function (event) {


            event.preventDefault();



            const company =
                document
                    .getElementById("company")
                    .value
                    .trim();



            const position =
                document
                    .getElementById("position")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const appliedDate =
                document
                    .getElementById("appliedDate")
                    .value;



            const status =
                document
                    .getElementById("status")
                    .value;



            const jobLink =
                document
                    .getElementById("jobLink")
                    .value
                    .trim();



            const applicationEmail =
                document
                    .getElementById("applicationEmail")
                    .value
                    .trim();



            const imageFile =
                document
                    .getElementById("jobImage")
                    .files[0];


                    const editingId = jobForm.dataset.editingId;

            const newApplication = {

                id: Date.now(),

                company: company,

                position: position,

                description: description,

                appliedDate: appliedDate,

                status: status,

                interviewDate: document.getElementById("interviewDate").value,
                
                interviewTime: document.getElementById("interviewTime").value,

                interviewType: document.getElementById("interviewType").value,

                notes: document.getElementById("notes").value,

                nextAction: document.getElementById("nextAction").value,

                jobLink: jobLink,

                applicationEmail: applicationEmail,

                image: ""

            };


            if (editingId) {

                const index = applications.findIndex(
                    app => app.id === Number(editingId)
                );

                if (index !== -1) {

                    newApplication.id =
                        Number(editingId);

                    applications[index] =
                        newApplication;

                    localStorage.setItem(
                        "dsJobApplications",
                        JSON.stringify(applications)
                    );

                    jobForm.reset();
                    delete jobForm.dataset.editingId;

                    closeAddJob();
                    displayApplications();
                    updateStatistics();

                    return;
                }
            }

            // If image exists

            if (imageFile) {


                const reader =
                    new FileReader();



                reader.onload =
                    function (event) {


                        newApplication.image =
                            event.target.result;


                        saveApplication(
                            newApplication
                        );


                    };



                reader.readAsDataURL(
                    imageFile
                );


            }

            // No image

            else {


                saveApplication(
                    newApplication
                );


            }


        }
    );

}



// ========================================
// SAVE TO LOCAL STORAGE
// ========================================

function saveApplication(application) {


    applications.push(
        application
    );


    localStorage.setItem(
        "dsJobApplications",
        JSON.stringify(applications)
    );


    jobForm.reset();


    closeAddJob();


    displayApplications();


    updateStatistics();


}



// ========================================
// DISPLAY APPLICATIONS
// ========================================

function displayApplications() {
 
    console.log("Applications:", applications);

    const table =
        document.getElementById(
            "applicationTable"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    if (!table) {

        return;

    }



    table.innerHTML = "";



    if (applications.length === 0) {


        emptyMessage.style.display =
            "block";


        return;


    }


    else {


        emptyMessage.style.display =
            "none";


    }



    applications.forEach(
        function (application) {


            const row =
                document.createElement("tr");



            // Status class

            let statusClass =
                "status-applied";



            if (
                application.status ===
                "Saved"
            ) {

                statusClass =
                    "status-saved";

            }


            else if (
                application.status ===
                "Interview"
            ) {

                statusClass =
                    "status-interview";

            }


            else if (
                application.status ===
                "Selected"
            ) {

                statusClass =
                    "status-selected";

            }


            else if (
                application.status ===
                "Rejected"
            ) {

                statusClass =
                    "status-rejected";

            }



            // Image

            const imageHTML =
                application.image

                    ? `
                        <img
                            src="${application.image}"
                            class="job-image"
                            alt="Job Poster"
                        >
                      `

                    : `
                        <div class="no-image">
                            💼
                        </div>
                      `;



            // Apply option

            let applyHTML =
                `<span class="no-apply">
                    No link
                 </span>`;



            if (application.jobLink) {


                applyHTML =
                    `
                    <a
                        href="${application.jobLink}"
                        target="_blank"
                        class="apply-btn"
                    >
                        🔗 Apply Online
                    </a>
                    `;


            }


            else if (
                application.applicationEmail
            ) {


                applyHTML =
                    `
                    <a
                        href="mailto:${application.applicationEmail}"
                        class="apply-email-btn"
                    >
                        ✉️ Apply via Email
                    </a>
                    `;


            }



            // Table row

            row.innerHTML = `

                <td>

                    ${imageHTML}

                </td>


                <td>
                    <span class="job-click"
                        onclick="viewJobDetails(${application.id})">
                        ${escapeHTML(application.company)}
                    </span>
                </td>

                <td>
                    <span class="job-click"
                        onclick="viewJobDetails(${application.id})">
                        ${escapeHTML(application.position)}
                    </span>
                </td>   


                <td>

                    ${application.appliedDate}

                </td>


                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${application.status}

                    </span>

                </td>


                <td>

                    ${applyHTML}

                </td>



                <td>
                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editApplication(${application.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="guidance-btn"
                            onclick="viewGuidance(${application.id})"
                        >
                            Guidance
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteApplication(${application.id})"
                        >
                            Delete
                        </button>

                    </div>
                </td>


            `;



            table.appendChild(row);


        }
    );

}



// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {


    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}



// ========================================
// UPDATE STATISTICS
// ========================================

function updateStatistics() {


    const total =
        applications.length;



    const applied =
        applications.filter(
            app =>
                app.status ===
                "Applied"
        ).length;



    const interviews =
        applications.filter(
            app =>
                app.status ===
                "Interview"
        ).length;



    const selected =
        applications.filter(
            app =>
                app.status ===
                "Selected"
        ).length;



    const totalElement =
        document.getElementById(
            "totalApplications"
        );


    const appliedElement =
        document.getElementById(
            "appliedCount"
        );


    const interviewElement =
        document.getElementById(
            "interviewCount"
        );


    const selectedElement =
        document.getElementById(
            "selectedCount"
        );



    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (appliedElement) {

        appliedElement.textContent =
            applied;

    }


    if (interviewElement) {

        interviewElement.textContent =
            interviews;

    }


    if (selectedElement) {

        selectedElement.textContent =
            selected;

    }

}

// ========================================
// EDIT APPLICATION
// ========================================

function editApplication(id) {

    const application = applications.find(
        app => app.id === id
    );

    if (!application) {
        return;
    }

    document.getElementById("company").value =
        application.company;

    document.getElementById("position").value =
        application.position;

    document.getElementById("description").value =
        application.description || "";

    document.getElementById("appliedDate").value =
        application.appliedDate;

    document.getElementById("interviewDate").value =
        application.interviewDate || "";

    document.getElementById("interviewTime").value =
        application.interviewTime || "";

    document.getElementById("interviewType").value =
        application.interviewType || "";

    document.getElementById("notes").value =
        application.notes || "";

    document.getElementById("nextAction").value =
        application.nextAction || "";

    document.getElementById("status").value =
        application.status;

    document.getElementById("jobLink").value =
        application.jobLink || "";

    document.getElementById("applicationEmail").value =
        application.applicationEmail || "";

    document.getElementById("jobForm").dataset.editingId = id;    

    document.getElementById("jobModalTitle").textContent =
    "Edit Job Application";
    
    openAddJob();

}


// ========================================
// DELETE APPLICATION
// ========================================
// DELETE APPLICATION
// ========================================

function deleteApplication(id) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );



    if (!confirmDelete) {

        return;

    }



    applications =
        applications.filter(
            application =>
                application.id !== id
        );



    localStorage.setItem(
        "dsJobApplications",
        JSON.stringify(
            applications
        )
    );



    displayApplications();


    updateStatistics();


}



// ========================================
// SEARCH + FILTER
// ========================================

function filterApplications() {


    const searchInput =
        document.getElementById(
            "searchJob"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );



    if (!searchInput || !statusFilter) {

        return;

    }



    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();



    const selectedStatus =
        statusFilter.value;



    const rows =
        document.querySelectorAll(
            "#applicationTable tr"
        );



    rows.forEach(
        function (row) {


            const rowText =
                row.textContent
                    .toLowerCase();



            const statusElement =
                row.querySelector(
                    ".status"
                );



            const rowStatus =
                statusElement
                    ? statusElement.textContent.trim()
                    : "";



            const matchesSearch =
                rowText.includes(
                    searchValue
                );



            const matchesStatus =
                selectedStatus === "all" ||
                rowStatus === selectedStatus;



            if (
                matchesSearch &&
                matchesStatus
            ) {

                row.style.display =
                    "";

            }

            else {

                row.style.display =
                    "none";

            }


        }
    );

}



// ========================================
// LOGOUT
// ========================================

function logout() {


    window.location.href =
        "index.html";


}



// ========================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ========================================

window.addEventListener(
    "click",
    function (event) {


        const modal =
            document.getElementById(
                "jobModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeAddJob();

        }


    }
);



// ========================================
// LOAD DASHBOARD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        displayApplications();


        updateStatistics();


    }
);

function viewJobDetails(id) {

    const job = applications.find(app => app.id === id);

    if (!job) return;

    const jobDetails = document.getElementById("jobDetails");

    jobDetails.innerHTML = `
        <div class="job-details">

            ${
                job.image
                ? `<img src="${job.image}" class="job-details-image">`
                : `<div class="job-details-no-image">💼</div>`
            }

            <h2>${escapeHTML(job.position)}</h2>

            <h3>${escapeHTML(job.company)}</h3>

            <p>
                <strong>Application Date:</strong>
                ${job.appliedDate}
            </p>

            <p>
                <strong>Status:</strong>
                ${job.status}
            </p>

            <div class="description-box">

                    <strong>Application Timeline</strong>

                    <div class="timeline">

                        <div class="timeline-item">
                            <div class="timeline-dot">✓</div>
                            <div class="timeline-content">
                                <strong>Application Submitted</strong>
                                <p>${job.appliedDate}</p>
                            </div>
                        </div>

                        ${
                            job.interviewDate
                            ? `
                                <div class="timeline-item">
                                    <div class="timeline-dot">✓</div>
                                    <div class="timeline-content">
                                        <strong>Interview</strong>
                                        <p>
                                            ${job.interviewDate}
                                            ${
                                                job.interviewTime
                                                ? ` at ${job.interviewTime}`
                                                : ""
                                            }
                                        </p>
                                    </div>
                                </div>
                            `
                            : ""
                        }

                        <div class="timeline-item">
                            <div class="timeline-dot">●</div>
                            <div class="timeline-content">
                                <strong>Current Status</strong>
                                <p>${escapeHTML(job.status)}</p>
                            </div>
                        
                        </div>

                    </div>
            </div>

                                ${
                        job.interviewDate
                        ? `
                            <p>
                                <strong>Interview Date:</strong>
                                ${job.interviewDate}
                            </p>
                        `
                        : ""
                    }

                    ${
                        job.interviewTime
                        ? `
                            <p>
                                <strong>Interview Time:</strong>
                                ${job.interviewTime}
                            </p>
                        `
                        : ""
                    }

                    ${
                        job.interviewType
                        ? `
                            <p>
                                <strong>Interview Type:</strong>
                                ${job.interviewType}
                            </p>
                        `
                        : ""
                    }

                    ${
                        job.notes
                        ? `
                            <div class="description-box">
                                <strong>Notes</strong>
                                <p>${escapeHTML(job.notes)}</p>
                            </div>
                        `
                        : ""
                    }

                    ${
                        job.nextAction
                        ? `
                            <div class="description-box">
                                <strong>Next Action</strong>
                                <p>${escapeHTML(job.nextAction)}</p>
                            </div>
                        `
                        : ""
                    }


            <div class="description-box">
                <strong>Job Description</strong>
                <p>
                    ${job.description
                        ? escapeHTML(job.description)
                        : "No description added."}
                </p>
            </div>

            ${
                job.jobLink
                ? `<a href="${job.jobLink}" target="_blank"
                     class="apply-btn">
                     🔗 Apply Online
                   </a>`
                : ""
            }

            ${
                job.applicationEmail
                ? `<a href="mailto:${job.applicationEmail}"
                     class="apply-email-btn">
                     ✉️ Apply via Email
                   </a>`
                : ""
            }

        </div>
    `;

    document.getElementById("jobDetailsModal").style.display = "flex";
}

function closeJobDetails() {
    document.getElementById("jobDetailsModal").style.display = "none";
}

const roleGuidance = {

    "qa": {
        skills: [
            "Manual Testing",
            "Test Cases",
            "Bug Reporting",
            "SQL",
            "Selenium",
            "API Testing",
            "SDLC"
        ],
        learn: [
            "Selenium",
            "Playwright",
            "API Testing",
            "Test Automation"
        ],
        interview: [
            "Software Testing fundamentals",
            "Test cases and test scenarios",
            "Bug life cycle",
            "SQL basics",
            "Automation testing"
        ]
    },

    "software engineer": {
        skills: [
            "Java",
            "Object-Oriented Programming",
            "Data Structures",
            "SQL",
            "Git",
            "REST APIs",
            "Spring Boot"
        ],
        learn: [
            "Data Structures",
            "REST API development",
            "Spring Boot",
            "Git and GitHub"
        ],
        interview: [
            "OOP concepts",
            "Java fundamentals",
            "SQL",
            "REST APIs",
            "Git",
            "Project discussion"
        ]
    },

    "business analyst": {
        skills: [
            "Requirements Gathering",
            "Requirement Analysis",
            "SDLC",
            "UML",
            "SQL",
            "Documentation",
            "Communication"
        ],
        learn: [
            "Business Requirements",
            "UML",
            "SQL basics",
            "Power BI",
            "Stakeholder Management"
        ],
        interview: [
            "Requirements gathering",
            "Functional and non-functional requirements",
            "SDLC",
            "Use case diagrams",
            "Stakeholder management"
        ]
    },

    "frontend": {
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Responsive Design",
            "Git",
            "React"
        ],
        learn: [
            "JavaScript",
            "React",
            "Responsive Web Design",
            "Git"
        ],
        interview: [
            "HTML fundamentals",
            "CSS",
            "JavaScript",
            "DOM",
            "Responsive design"
        ]
    },

    "data analyst": {
        skills: [
            "Excel",
            "SQL",
            "Power BI",
            "Data Analysis",
            "Data Visualization",
            "Statistics"
        ],
        learn: [
            "SQL",
            "Power BI",
            "Excel",
            "Data Visualization"
        ],
        interview: [
            "SQL queries",
            "Data cleaning",
            "Excel",
            "Power BI",
            "Data visualization"
        ]
    }

};


function viewGuidance(id) {

    const job = applications.find(
        app => app.id === id
    );

    if (!job) {
        return;
    }

            currentGuidanceJobId = id;

            const position = job.position.toLowerCase();

            let guidance = null;

            if (
                position.includes("qa") ||
                position.includes("quality assurance") ||
                position.includes("quality engineer") ||
                position.includes("software tester") ||
                position.includes("tester")
            ) {
                guidance = roleGuidance["qa"];
            }
            else if (
                position.includes("software engineer") ||
                position.includes("software developer") ||
                position.includes("backend developer")
            ) {
                guidance = roleGuidance["software engineer"];
            }
            else if (
                position.includes("business analyst") ||
                position.includes("business analysis")
            ) {
                guidance = roleGuidance["business analyst"];
            }
            else if (
                position.includes("frontend") ||
                position.includes("front-end") ||
                position.includes("web developer")
            ) {
                guidance = roleGuidance["frontend"];
            }
            else if (
                position.includes("data analyst") ||
                position.includes("data analytics")
            ) {
                guidance = roleGuidance["data analyst"];
            }

    const guidanceContent =
        document.getElementById("guidanceContent");

        guidanceContent.innerHTML = `

            <h2>🎯 Job Preparation Guide</h2>

            <h3>${escapeHTML(job.position)}</h3>

            <p>
                <strong>Company:</strong>
                ${escapeHTML(job.company)}
            </p>

            ${
                guidance
                ? `
                    <div class="guidance-section">

                        <h3>🎯 Recommended CV Focus</h3>

                        <ul>
                            ${guidance.skills.map(skill =>
                                `<li>${skill}</li>`
                            ).join("")}
                        </ul>

                    </div>

                    <div class="guidance-section">

                        <h3>🧠 What to Learn</h3>

                        <ul>
                            ${guidance.learn.map(item =>
                                `<li>${item}</li>`
                            ).join("")}
                        </ul>

                    </div>

                    <div class="guidance-section">

                        <h3>🎤 Interview Preparation</h3>

                        <ul>
                            ${guidance.interview.map(topic =>
                                `<li>${topic}</li>`
                            ).join("")}
                        </ul>

                    </div>
                `
                : `
                    <div class="guidance-section">

                        <h3>💡 General IT Guidance</h3>

                        <p>
                            No specific guidance is available
                            for this job position yet.
                        </p>

                        <p>
                            Review the job description and focus
                            on the required technical and soft skills.
                        </p>

                    </div>
                `
            }

            <div class="guidance-section">

                <h3>📋 Application Checklist</h3>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.cv ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'cv')"
                    >
                    CV tailored for this job

                </label>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.coverLetter ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'coverLetter')"
                    >
                    Cover letter prepared

                </label>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.portfolio ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'portfolio')"
                    >
                    Portfolio updated

                </label>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.certificates ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'certificates')"
                    >
                    Required certificates ready

                </label>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.requirements ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'requirements')"
                    >
                    Job requirements reviewed

                </label>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.skills ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'skills')"
                    >
                    Required skills checked

                </label>

                <label class="checklist-item">
                    <input
                        type="checkbox"
                        ${job.checklist?.interview ? "checked" : ""}
                        onchange="saveChecklist(${job.id}, 'interview')"
                    >
                    Interview preparation completed

                </label>

            </div>

        `;

    document.getElementById("guidanceModal").style.display = "flex";
}

function saveChecklist(jobId, item) {

    const job = applications.find(
        app => app.id === jobId
    );

    if (!job) {
        return;
    }

    if (!job.checklist) {
        job.checklist = {};
    }

    job.checklist[item] =
        !job.checklist[item];

    localStorage.setItem(
        "dsJobApplications",
        JSON.stringify(applications)
    );
}

function closeGuidance() {
    document.getElementById("guidanceModal").style.display = "none";
}

window.onclick = function(event) {
            if (event.target === document.getElementById("guidanceModal")) {
            closeGuidance();
        }
}

function updateHomeOverview() {

    const applications =
        JSON.parse(
            localStorage.getItem("dsJobApplications")
        ) || [];

    const total =
        applications.length;

    const applied =
        applications.filter(
            app => app.status === "Applied"
        ).length;

    const interviews =
        applications.filter(
            app => app.status === "Interview"
        ).length;

    const selected =
        applications.filter(
            app => app.status === "Selected"
        ).length;


    const totalElement =
        document.getElementById(
            "homeTotalApplications"
        );

    const appliedElement =
        document.getElementById(
            "homeAppliedCount"
        );

    const interviewElement =
        document.getElementById(
            "homeInterviewCount"
        );

    const selectedElement =
        document.getElementById(
            "homeSelectedCount"
        );


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (appliedElement) {
        appliedElement.textContent = applied;
    }

    if (interviewElement) {
        interviewElement.textContent = interviews;
    }

    if (selectedElement) {
        selectedElement.textContent = selected;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    updateHomeOverview
);

function updateHomeHero() {

    const applications =
        JSON.parse(
            localStorage.getItem("dsJobApplications")
        ) || [];

    const total =
        applications.length;

    const interviews =
        applications.filter(
            app => app.status === "Interview"
        ).length;

    const selected =
        applications.filter(
            app => app.status === "Selected"
        ).length;

    const progressValues = {
        "Saved": 25,
        "Applied": 50,
        "Interview": 75,
        "Selected": 100,
        "Rejected": 0
    };

    let progress = 0;

    if (applications.length > 0) {

        const totalProgress =
            applications.reduce(
                (sum, app) =>
                    sum + (progressValues[app.status] || 0),
                0
            );

        progress =
            Math.round(
                totalProgress / applications.length
            );
    }

    const applicationsElement =
        document.getElementById("homeApplications");

    const interviewsElement =
        document.getElementById("homeInterviews");

    const selectedElement =
        document.getElementById("homeSelected");

    const yearElement =
        document.getElementById("homeYear");

    const progressElement =
    document.getElementById(
        "homeProgressText"
    );

    if (progressElement) {
        progressElement.textContent =
            progress + "% organized";
    }

    if (applicationsElement) {
        applicationsElement.textContent = total;
    }

    if (interviewsElement) {
        interviewsElement.textContent = interviews;
    }

    if (selectedElement) {
        selectedElement.textContent = selected;
    }

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }
}

document.addEventListener(
    "DOMContentLoaded",
    updateHomeHero
);

async function analyzeCV() {

    const fileInput =
        document.getElementById("cvFile");

    const result =
        document.getElementById("cvMatchResult");

    if (!fileInput.files.length) {

        result.innerHTML = `
            <div class="cv-result error">
                Please select your CV first.
            </div>
        `;

        return;
    }

    const file =
        fileInput.files[0];

    result.innerHTML = `
        <div class="cv-result">
            Reading your CV...
        </div>
    `;

    try {

        let cvText = "";

        if (file.type === "text/plain") {

            cvText =
                await file.text();

        }

        else if (file.type === "application/pdf") {

            const arrayBuffer =
                await file.arrayBuffer();

            const pdf =
                await window.pdfjsLib
                    .getDocument({
                        data: arrayBuffer
                    })
                    .promise;

            for (
                let pageNumber = 1;
                pageNumber <= pdf.numPages;
                pageNumber++
            ) {

                const page =
                    await pdf.getPage(pageNumber);

                const textContent =
                    await page.getTextContent();

                const pageText =
                    textContent.items
                        .map(item => item.str)
                        .join(" ");

                cvText +=
                    pageText + " ";
            }

        }

        else {

            result.innerHTML = `
                <div class="cv-result error">
                    Please upload a PDF or TXT CV.
                </div>
            `;

            return;
        }

        if (!cvText.trim()) {

            result.innerHTML = `
                <div class="cv-result error">
                    Could not read text from this CV.
                </div>
            `;

            return;
        }

        matchCVWithJob(cvText);

    }

    catch (error) {

        console.error(error);

        result.innerHTML = `
            <div class="cv-result error">
                Something went wrong while reading the CV.
            </div>
        `;
    }
}

function matchCVWithJob(cvText) {

    const job =
        applications.find(
            app => app.id === currentGuidanceJobId
        );

    const result =
        document.getElementById("cvMatchResult");

    if (!job) {
        result.innerHTML = `
            <div class="cv-result error">
                Job information not found.
            </div>
        `;
        return;
    }

    let roleKey = "";

    const position =
        job.position.toLowerCase();

    if (
        position.includes("qa") ||
        position.includes("quality assurance") ||
        position.includes("quality engineer") ||
        position.includes("software tester") ||
        position.includes("tester")
    ) {
        roleKey = "qa";
    }

    else if (
        position.includes("software engineer") ||
        position.includes("software developer") ||
        position.includes("backend developer")
    ) {
        roleKey = "software engineer";
    }

    else if (
        position.includes("business analyst") ||
        position.includes("business analysis")
    ) {
        roleKey = "business analyst";
    }

    else if (
        position.includes("frontend") ||
        position.includes("front-end") ||
        position.includes("web developer")
    ) {
        roleKey = "frontend";
    }

    else if (
        position.includes("data analyst") ||
        position.includes("data analytics")
    ) {
        roleKey = "data analyst";
    }

    else {
        result.innerHTML = `
            <div class="cv-result error">
                CV matching is not available for this job role yet.
            </div>
        `;
        return;
    }

    const skills =
        roleGuidance[roleKey].skills;

    // Normalize CV text
    const normalizedCV =
        cvText
            .toLowerCase()
            .replace(/[\r\n]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    const matchedSkills = [];
    const missingSkills = [];

    skills.forEach(skill => {

        const normalizedSkill =
            skill
                .toLowerCase()
                .replace(/[\r\n]+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        if (normalizedCV.includes(normalizedSkill)) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    });

    const matchPercentage =
        Math.round(
            (matchedSkills.length / skills.length) * 100
        );

    result.innerHTML = `
    <div class="cv-result">

        <h3>📄 CV Match Result</h3>

        <p>
            <strong>Job:</strong>
            ${escapeHTML(job.position)}
        </p>

        <div class="cv-match-score">

            <div class="percentage">
                ${matchPercentage}%
            </div>

            <div class="label">
                Overall CV Match
            </div>

            <div class="cv-progress">
                <div
                    class="cv-progress-bar"
                    style="width: ${matchPercentage}%"
                ></div>
            </div>

        </div>

        <div class="cv-skill-section">

            <h4>✅ Matched Skills</h4>

            <div class="cv-skill-list">

                ${
                    matchedSkills.length
                        ? matchedSkills
                            .map(
                                skill =>
                                `<span class="cv-skill matched">
                                    ${escapeHTML(skill)}
                                </span>`
                            )
                            .join("")
                        : `<span class="cv-skill missing">
                            No matching skills
                           </span>`
                }

            </div>

        </div>

        <div class="cv-skill-section">

            <h4>📚 Skills to Improve</h4>

            <div class="cv-skill-list">

                ${
                    missingSkills.length
                        ? missingSkills
                            .map(
                                skill =>
                                `<span class="cv-skill missing">
                                    ${escapeHTML(skill)}
                                </span>`
                            )
                            .join("")
                        : `<span class="cv-skill matched">
                            All listed skills matched
                           </span>`
                }

            </div>

        </div>

    </div>
`;

}

function openLearnMore() {

    const modal =
        document.getElementById("learnMoreModal");

    if (modal) {
        modal.style.display = "flex";
    }
}


function closeLearnMore() {

    const modal =
        document.getElementById("learnMoreModal");

    if (modal) {
        modal.style.display = "none";
    }
}