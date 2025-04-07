// Made by Aydon
// No comments is just how I roll

const terminal = document.getElementById('terminal');
const terminalContent = document.getElementById('terminal-content');
const output = document.getElementById('output');
const input = document.getElementById('command-input');
const displayInput = document.getElementById('display-input');
const prompt = document.getElementById('prompt');
const inputLine = document.getElementById('input-line');
const cursor = document.querySelector('.cursor');

var disk = "ROOT";
var audio = null;
var audioPlaying = false;

input.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
        e.preventDefault();
        const currentText = input.value;
        if (currentText.length > 0) {
            input.value = currentText.substring(0, currentText.length - 1);
            updateDisplayInput();
        }
        positionCursor();
        return;
    }

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.value.trim();
        
        const commandOutput = document.createElement('div');
        commandOutput.className = 'output-text terminal-text';
        commandOutput.textContent = prompt.textContent + command.toUpperCase();
        output.appendChild(commandOutput);

        processCommand(command);
        input.value = '';
        updateDisplayInput();
        terminal.scrollTop = terminal.scrollHeight;
        positionCursor();
    }
});

input.addEventListener('input', function(e) {
    updateDisplayInput();
    positionCursor();
});

function updateDisplayInput() {
    displayInput.textContent = (input.value).toUpperCase();
}

function processCommand(cmd) {
    let response = '';
    const cmdLower = cmd.toLowerCase();
    
    if (cmd === '') {
        response = '';
    } else if (cmdLower === 'help') {
        response = 'AVAILABLE COMMANDS:\n\n' + 
        'HELP     - DISPLAY COMMANDS\n' + 
        'CLEAR    - CLEAR SCREEN\n' + 
        'CAT      - DISPLAY FILE CONTENTS\n' + 
        'SRC      - GO TO SOURCE\n' + 
        'DATE     - SHOW CURRENT DATE\n' + 
        'LIST     - LIST FILES\n' + 
        'VOL      - CHANGE DISK VOLUME\n' + 
        'PLAY     - PLAY AUDIO FILE\n' + 
        'PAUSE    - PAUSE AUDIO FILE\n' + 
        'VER      - DISPLAY VERSION';
    } else if (cmdLower === 'clear') {
        output.innerHTML = '';
        return;
    } else if (cmdLower === 'date') {
        const now = new Date();
        response = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }).toUpperCase();
    } else if (cmdLower === 'cat') {
        response = 'USAGE: CAT <FILENAME>\n'
            + 'FORMAT: FILE TYPE, FILE SIZE, FILE NAME';
    } else if (cmdLower === 'ver' || cmdLower === 'version') {
        response = 'APPLE DOS 3.3 ENHANCED  (C) 1979';
    } else if (cmdLower === 'list') {
        if (disk === "ROOT") {
            response = 'VIRTUAL DISK VOLUME 253\n\n'
                + ' B  013 MAIN.SYSTEM\n'
                + ' B  008 BASIC.SYSTEM\n'
                + ' T  001 README.MD\n'
        } else if (disk === "AUDIO") {
            response = 'VIRTUAL DISK VOLUME 254\n\n'
                + ' A  002 DISC1.MP3\n'
                + ' A  006 DISC2.MP3\n'
                + ' A  006 DISC3.MP3\n'
                + ' A  003 DISC4.MP3\n'
                + ' A  006 DISC5.MP3\n'
                + ' A  009 DISC6.MP3\n'
                + ' A  005 DISC7.MP3';
        } else if (disk === "POSTS") {
            response = 'VIRTUAL DISK VOLUME 255\n\n'
                + ' T  001 INTRODUCTION.MD\n';
        }
    } else if (cmdLower === 'src') {
        response = 'ROUTING TO SOURCE...';
        openSource();
    } else if (cmdLower.startsWith('cat ')) {
        const filename = cmd.substring(4).trim().toUpperCase();
        if (!filename.endsWith('.MD')) {
            response = `FILE ERROR: UNABLE TO CATALOG BINARY FILES`;
        } else {
            parseMarkdown(`./${((disk !== "ROOT" ? disk + "/" : "") + filename).toLowerCase()}`)
                .then(parsedContent => {
                    const responseOutput = document.createElement('div');
                    responseOutput.className = 'output-text terminal-text';
                    responseOutput.innerHTML = parsedContent.toUpperCase();
                    output.appendChild(responseOutput);
                })
                .catch(() => {
                    const responseOutput = document.createElement('div');
                    responseOutput.className = 'output-text terminal-text';
                    responseOutput.textContent = `FILE NOT FOUND: ${filename}`;
                    output.appendChild(responseOutput);
                });
            return;
        }
    } else if (cmdLower === 'vol') {
        response = 'USAGE: VOL <VOLUME NUMBER>\n'
            + 'ACTIVE VOLUMES: 253 (ROOT), 254 (AUDIO), 255 (POSTS)';
    } else if (cmdLower.startsWith('vol ')) {
        const volume = cmd.substring(4).trim();

        if (volume === '253') {
            disk = "ROOT";
            response = 'CURRENT VOLUME: 253';
        } else if (volume === '254') {
            disk = "AUDIO";
            response = 'CURRENT VOLUME: 254';
        } else if (volume === '255') {
            disk = "POSTS";
            response = 'CURRENT VOLUME: 255';
        } else {
            response = `VOLUME NOT FOUND: ${volume}`;
        }
    } else if (cmdLower.startsWith('play')) {
        if (audio && !audioPlaying) {
            audio.play();
            audioPlaying = true;
        } else if (cmdLower !== 'play') {
            const filename = cmd.substring(5).trim().toUpperCase();
            if (audio) {
                audio.pause();
                audio = null;
            }
            if (filename.endsWith('.MP3')) {
                const filePath = `./${((disk !== "ROOT" ? disk + "/" : "") + filename).toLowerCase()}`;
                fetch(filePath, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) throw new Error();
                        
                        audio = new Audio(filePath);
                        audio.volume = 0.5;
                        audio.play();
                        audioPlaying = true;

                        const responseOutput = document.createElement('div');
                        responseOutput.className = 'output-text terminal-text';
                        responseOutput.textContent = `PLAYING: ${filename}`;
                        output.appendChild(responseOutput);

                        audio.addEventListener('ended', () => {
                            audio = null;
                            audioPlaying = false;
                        });
                    })
                    .catch(() => {
                        const errorOutput = document.createElement('div');
                        errorOutput.className = 'output-text terminal-text';
                        errorOutput.textContent = `FILE ERROR: ${filename} NOT FOUND`;
                        output.appendChild(errorOutput);
                    });
            } else {
                response = `FILE ERROR: UNABLE TO PLAY NON-AUDIO FILES`;
            }
        } else {
            response = `USAGE: PLAY <FILENAME>`;
        }
    } else if (cmdLower === 'pause') {
        if (audio && audioPlaying) {
            audio.pause();
            audioPlaying = false;
            response = 'AUDIO PAUSED';
        } else {
            response = 'AUDIO ERROR: NO AUDIO PLAYING';
        }
    } else {
        response = `?SYNTAX ERROR\n\n] ${cmd.toUpperCase()}\n  ^\nCOMMAND NOT RECOGNIZED`;
    }
    
    if (response) {
        const responseOutput = document.createElement('div');
        responseOutput.className = 'output-text terminal-text';
        responseOutput.textContent = response;
        output.appendChild(responseOutput);
    }
}

function positionCursor() {
    const promptWidth = prompt.getBoundingClientRect().width;
    const textWidth = displayInput.getBoundingClientRect().width;
    
    cursor.style.left = `${promptWidth + textWidth}px`;
}

function openSource() {
    window.open('https://github.com/aydon14/aydon14.github.io', '_blank');
}

function parseMarkdown(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`File not found: ${filePath}`);
            }
            return response.text();
        })
        .then(text => {
            const wrappedText = wrapText(text, 80);
            const pre = document.createElement("pre");
            pre.textContent = wrappedText;
            return pre.outerHTML;
        })
        .catch(error => {
            console.error(error);
            throw new Error("FILE NOT FOUND");
        });
}

function wrapText(text, lineWidth) {
    const lines = text.split('\n');
    const wrappedLines = lines.map(line => {
        if (line.length <= lineWidth) {
            return line;
        }
        const words = line.split(' ');
        const wrapped = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length <= lineWidth) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                wrapped.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) {
            wrapped.push(currentLine);
        }

        return wrapped.join('\n');
    });

    return wrappedLines.join('\n');
}

function setupFlickerEffect() {
    const flickerElement = document.querySelector('.flicker');
    
    if (!flickerElement) {
        console.error("Flicker element not found!");
        return;
    }
    
    function subtleFlicker() {
        const baseOpacity = 0.01;
        const variation = Math.random() * 0.01;
        flickerElement.style.opacity = (baseOpacity + variation).toString();
        
        setTimeout(subtleFlicker, 150 + Math.random() * 200);
    }
    
    function occasionalFlicker() {
        if (Math.random() < 0.1) {
            const intensity = 0.02 + Math.random() * 0.05;
            flickerElement.style.opacity = intensity.toString();
            
            setTimeout(() => {
                flickerElement.style.opacity = '0.001';
            }, 50 + Math.random() * 100);
        }
        
        setTimeout(occasionalFlicker, 1000 + Math.random() * 3000);
    }
    
    function dramaticFlicker() {
        if (Math.random() < 0.02) {
            const steps = 2 + Math.floor(Math.random() * 2); // 2-3 steps
            let timeOffset = 0;
            
            for (let i = 0; i < steps; i++) {
                const isHighIntensity = i % 2 === 0;
                const intensity = isHighIntensity ? 
                    0.03 + Math.random() * 0.05 : 
                    0.005 + Math.random() * 0.01;
                
                const duration = isHighIntensity ? 
                    30 + Math.random() * 50 : 
                    50 + Math.random() * 100;
                
                setTimeout(() => {
                    flickerElement.style.opacity = intensity.toString();
                }, timeOffset);
                
                timeOffset += duration;
            }
            
            setTimeout(() => {
                flickerElement.style.opacity = '0.001';
            }, timeOffset);
        }
        
        setTimeout(dramaticFlicker, 7000 + Math.random() * 20000);
    }
    
    subtleFlicker();
    occasionalFlicker();
    dramaticFlicker();
}

window.onload = function() {
    input.focus();
    updateDisplayInput();
    positionCursor();
    setupFlickerEffect();
};

document.addEventListener('click', function() {
    input.focus();
});