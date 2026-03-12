// Function to decrypt AES-256-ECB with MD5
function aes256Decrypt(ciphertextWordArray) {
    const keyAscii = current_flag;
    const md5Hex = CryptoJS.MD5(keyAscii).toString(CryptoJS.enc.Hex);
    const doubledHex = md5Hex + md5Hex;
    const key = CryptoJS.enc.Hex.parse(doubledHex);
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertextWordArray },
        key,
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Latin1);
}

async function downloadFile(fileKey) {
    // Fetch encrypted file
    const cData = await loadChallenges();
    const challenge = cData.challenges[
        parseInt(current_challenge, 10) - 1];
    const fileObj = challenge.files.find(f => f.hash === fileKey);
    const response = await fetch(`challengeFiles/${fileObj.hash}.locked`);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: challengeFiles/${fileObj.hash}.locked`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
    // Decrypt
    const plaintext = aes256Decrypt(wordArray);
    // Download as file
    const byteArray = new Uint8Array([...plaintext].map(c => c.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileObj.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Function to hash data using SHA-256
async function sha256Hash(data) {
    const encodedData = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Function to parse a challenge file
async function processMdFile(filePath) {
    try {
        // Fetch the file content
        const response = await fetch("challenges/" + filePath + ".locked");
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));

        decryptedText = aes256Decrypt(wordArray);
        
        const processedContent = decryptedText
            .split("\n")
            .join("\n");

        document.querySelector(".main-content").innerHTML += processedContent;
    } catch (error) {
        throw new Error(`Error processing challenge file:${error}`);
    }
}

// Process and load innerHTML
async function processChallenge(c) {
    const data = await loadChallenges();
    const challenge = data.challenges[parseInt(c, 10) - 1];
    var main_content = document.querySelector(".main-content");
    if (current_challenge <= parseInt(data.total)){
        main_content.innerHTML = `Current Challenge: ${current_challenge}/${data.total} - ${challenge.title}<br><br>`;
    } else {
        main_content.innerHTML = ``;
    }
    await processMdFile(challenge.hash);
}

// Load challenges JSON
async function loadChallenges() {
    try {
        const response = await fetch("challenges.json");
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to load JSON. Please refresh!`);
    }
}

function loadLeaderboard() {
    const leaderboardDiv = document.getElementById("leaderboard");

    leaderboardDiv.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>RANK + AGENT ID</th>
                    <th>Challenges Complete</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;

    // Query the top 100 public users
    db.collection("publicUsers")
      .orderBy("challenge", "desc")
      .orderBy("completedAt", "asc")
      .limit(100)
      .get()
      .then(snapshot => {
          const entries = snapshot.docs.map(doc => {
              const data = doc.data() || {};
              return {
                  username: data.username || doc.id,
                  uid: doc.id,
                  challenge: Number(data.challenge) || 0,
                  completedAt: data.completedAt ? data.completedAt.toMillis() : Number.POSITIVE_INFINITY
              };
          });

          const tbody = leaderboardDiv.querySelector("tbody");
          if (!entries.length) {
              tbody.innerHTML = `<tr><td class="user" colspan="2">No leaderboard data yet.</td></tr>`;
              return;
          }

          tbody.innerHTML = "";
          entries.forEach((entry, index) => {
              const row = document.createElement("tr");
              const isCurrentUser = entry.uid === currentUser.uid;
              row.innerHTML = `
                  <td class="user" ${isCurrentUser ? 'style="color: rgb(0, 255, 0);"' : ''}>${index + 1}. ${entry.username}</td>
                  <td class="score" ${isCurrentUser ? 'style="color: rgb(0, 255, 0);"' : ''}>${entry.challenge}</td>
              `;
              tbody.appendChild(row);
          });
      })
      .catch(error => {
          console.error("Leaderboard error:", error);
          leaderboardDiv.querySelector("tbody").innerHTML =
              `<tr><td class="user" colspan="2">Unable to load leaderboard.</td></tr>`;
      });
}

// Initialize Firestore
const db = firebase.firestore();
var currentUser = null;
var current_flag = null;
var current_challenge = null;

// DOMCL event listener
document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged(async user => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;
        const main_content = document.querySelector(".main-content");

        main_content.textContent = "Loading challenge material...";

        const privateRef = db.collection("users").doc(user.uid).collection("private").doc("info");
        const doc = await privateRef.get();
        if (doc.exists) {
            const data = doc.data();
            current_flag = data.flag;
            current_challenge = data.challenge;
        } else {
            console.log("ERR: No document for user.");
        }

        const username = currentUser.displayName;
        const cData = await loadChallenges();
        const challenge = cData.challenges[parseInt(current_challenge, 10) - 1];
        if(parseInt(current_challenge) <= cData.total) main_content.style.textAlign = "left";
        if (cData.total == "0") {
            main_content.innerHTML += "No challenges available at the moment. Please check back later.";
            return;
        } else await processChallenge(current_challenge);
        if(parseInt(current_challenge) <= cData.total) { 
            main_content.style.textAlign = "left";
            if (challenge.files && challenge.files.length > 0) {
                let tableHTML = `<div class="challenge-files"><table>`;
                challenge.files.forEach(file => {
                    tableHTML += `<tr>
                        <td class="filename-col">${file.filename}</td>
                        <td class="hash-col" title="Click to copy MD5 hash" data-hash="${file.hash}">Hash</td>
                        <td class="download-col"><button onclick="downloadFile('${file.hash}')">Download</button></td>
                    </tr>`;
                });
                tableHTML += `</table></div>`;
                main_content.innerHTML += tableHTML;
                setTimeout(() => {
                    document.querySelectorAll('.hash-col').forEach(cell => {
                        cell.addEventListener('click', function() {
                        const hash = this.getAttribute('data-hash');
                        if (hash) {
                            navigator.clipboard.writeText(hash);
                            this.title = "Copied!";
                            setTimeout(() => { this.title = "Click to copy MD5 hash"; }, 1000);
                        }
                        });
                    });
                }, 0);
            }
            main_content.innerHTML += `<div class="flag-box"><input class="text-box" type="text" 
                placeholder="Enter flag here"><button class="submit">Submit</button></div>
                <div class="flag-message"></div>`;
            
            document.querySelector(".submit").addEventListener("click", async () => {
                if (!currentUser) return;
                var text = document.querySelector('input').value.replace(/^flag\{(.+)\}$/, "$1");
                var sha256 = await sha256Hash(text);
                const msg = document.querySelector('.flag-message');

                if (sha256 == challenge.hash) {
                    let ccn = parseInt(current_challenge);
                    db.collection("users")
                        .doc(currentUser.uid)
                        .collection("private")
                        .doc("info")
                        .set({ challenge: ccn + 1, flag: text }, { merge: true });
                    db.collection("users")
                        .doc(currentUser.uid)
                        .collection("public")
                        .doc("info")
                        .set({ 
                            challenge: ccn,
                            completedAt: firebase.firestore.FieldValue.serverTimestamp()
                        }, { merge: true });
                    db.collection("publicUsers")
                        .doc(currentUser.uid)
                        .set({
                            challenge: ccn,
                            completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            username: username
                        }, { merge: true });
                    msg.innerHTML = `<b>Correct! Will reload in 3 seconds.</b>`;
                    setTimeout(() => { location.reload(); }, 3000);
                } else {
                    msg.innerHTML = `<b>Incorrect flag.</b>`;
                }
            });

            document.querySelector('input').addEventListener('keydown', async function(event) {
                if (event.key === 'Enter' && currentUser) {
                    var text = document.querySelector('input').value.replace(/^flag\{(.+)\}$/, "$1");
                    var sha256 = await sha256Hash(text);
                    const msg = document.querySelector('.flag-message');

                    if (sha256 == challenge.hash) {
                        let ccn = parseInt(current_challenge);
                        db.collection("users")
                            .doc(currentUser.uid)
                            .collection("private")
                            .doc("info")
                            .set({ challenge: ccn + 1, flag: text }, { merge: true });
                        db.collection("users")
                            .doc(currentUser.uid)
                            .collection("public")
                            .doc("info")
                            .set({ 
                                challenge: ccn,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp()
                            }, { merge: true });
                        db.collection("publicUsers")
                            .doc(currentUser.uid)
                            .set({
                                challenge: ccn,
                                completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                                username: username
                            }, { merge: true });
                        msg.innerHTML = `<b>Correct! Will reload in 3 seconds.</b>`;
                        setTimeout(() => { location.reload(); }, 3000);
                    } else {
                        msg.innerHTML = `<b>Incorrect flag.</b>`;
                    }
                }
            });
        } else main_content.style.textAlign = "center";

        loadLeaderboard();
    });
});
