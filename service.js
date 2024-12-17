document.getElementById("claimForm").addEventListener("submit", function (event) {
    event.preventDefault();
    submitClaim();
});

let claims = [];

function showSection(sectionId) {
    document.querySelectorAll("main section").forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}

function submitClaim() {
    const policyNumber = document.getElementById("policyNumber").value;
    const incidentDate = document.getElementById("incidentDate").value;
    const incidentDescription = document.getElementById("incidentDescription").value;
    const fileUpload = document.getElementById("fileUpload").files;

    if (!policyNumber || !incidentDate || !incidentDescription) {
        document.getElementById("formMessage").textContent = "Please fill in all required fields.";
        document.getElementById("formMessage").style.color = "red";
        return;
    }

    const claimNumber = "CLM" + (claims.length + 1).toString().padStart(3, '0');
    const claim = {
        claimNumber,
        policyNumber,
        incidentDate,
        incidentDescription,
        files: fileUpload,
        status: "Submitted",
        submissionDate: new Date().toLocaleDateString()
    };

    claims.push(claim);
    document.getElementById("formMessage").textContent = "Claim submitted successfully!";
    document.getElementById("formMessage").style.color = "green";
    document.getElementById("claimForm").reset();
    updateClaimsTable();
}

function updateClaimsTable() {
    const claimsTableBody = document.getElementById("claimsTableBody");
    claimsTableBody.innerHTML = "";

    claims.forEach(claim => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${claim.claimNumber}</td>
            <td>${claim.status}</td>
            <td>${claim.submissionDate}</td>
            <td>
                <button onclick="editClaim('${claim.claimNumber}')">Edit</button>
                <button onclick="deleteClaim('${claim.claimNumber}')">Delete</button>
            </td>
        `;
        claimsTableBody.appendChild(row);
    });
}

function editClaim(claimNumber) {
    const claim = claims.find(c => c.claimNumber === claimNumber);
    if (claim) {
        document.getElementById("policyNumber").value = claim.policyNumber;
        document.getElementById("incidentDate").value = claim.incidentDate;
        document.getElementById("incidentDescription").value = claim.incidentDescription;
        showSection('fileClaim');
    }
}

function deleteClaim(claimNumber) {
    claims = claims.filter(c => c.claimNumber !== claimNumber);
    updateClaimsTable();
}



// Chatbot functionality
document.getElementById("sendMessage").addEventListener("click", async function () {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;

    // Display user message
    const chatMessages = document.getElementById("chatMessages");
    const userMessage = document.createElement("div");
    userMessage.textContent = `You: ${message}`;
    userMessage.className = "message user";
    chatMessages.appendChild(userMessage);

    // Clear input
    input.value = "";

    try {
        // Call the ChatGPT API backend
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        // Display ChatGPT's response
        const botMessage = document.createElement("div");
        botMessage.textContent = `ChatGPT: ${data.reply}`;
        botMessage.className = "message bot";
        chatMessages.appendChild(botMessage);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error communicating with ChatGPT. Please try again later.";
        errorMessage.className = "message error";
        chatMessages.appendChild(errorMessage);
    }
});
