// AnatoSketch 3D - JavaScript Principal
class AnatoSketch3D {
    constructor() {
        this.canvas = document.getElementById('anatomyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.strokeColor = '#00ff88';
        this.strokeWidth = 2;
        this.paths = [];
        this.currentPath = [];
        this.isGuidedStudy = false;
        this.studyStep = 0;
        this.studySteps = [
            'Estrutura básica do crânio',
            'Coluna vertebral',
            'Caixa torácica',
            'Braços e mãos',
            'Pelve',
            'Pernas e pés',
            'Sistema muscular',
            'Sistema nervoso',
            'Sistema cardiovascular',
            'Revisão completa'
        ];

        // Configuração da API Gemini
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
        this.apiKey = 'AIzaSyDNSDXAocB4YPm4kY6v9L9C9OtJkQ1y-Uk';

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.displayWelcomeMessage();
        this.drawGrid();
    }

    setupCanvas() {
        // Configurar canvas responsivo
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Configurar contexto de desenho
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.drawGrid();
    }

    drawGrid() {
        const gridSize = 20;
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    setupEventListeners() {
        // Canvas drawing events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
            });
        });

        // Drawing controls
        document.getElementById('strokeColor').addEventListener('change', (e) => {
            this.strokeColor = e.target.value;
        });

        document.getElementById('strokeWidth').addEventListener('input', (e) => {
            this.strokeWidth = e.target.value;
        });

        // Canvas controls
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('exportSVG').addEventListener('click', () => this.exportSVG());
        document.getElementById('exportPNG').addEventListener('click', () => this.exportPNG());

        // Anatomical part buttons
        document.querySelectorAll('.anatomy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const part = e.target.dataset.part || e.target.closest('.anatomy-btn').dataset.part;
                this.drawAnatomicalPart(part);
            });
        });

        // Chat functionality
        document.getElementById('sendCommand').addEventListener('click', () => this.sendCommand());
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendCommand();
            }
        });

        // Guided study
        document.getElementById('startGuidedStudy').addEventListener('click', () => this.startGuidedStudy());
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.currentPath = [{x, y}];
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.strokeStyle = this.currentTool === 'erase' ? '#000000' : this.strokeColor;
        this.ctx.lineWidth = this.currentTool === 'erase' ? this.strokeWidth * 3 : this.strokeWidth;
        this.ctx.globalCompositeOperation = this.currentTool === 'erase' ? 'destination-out' : 'source-over';
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.currentPath.push({x, y});
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        if (this.currentPath.length > 0) {
            this.paths.push({
                path: [...this.currentPath],
                color: this.strokeColor,
                width: this.strokeWidth,
                tool: this.currentTool
            });
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paths = [];
        this.drawGrid();
    }

    async drawAnatomicalPart(part) {
        this.showLoading(true);
        
        try {
            const prompt = this.getAnatomicalPrompt(part);
            const aiResponse = await this.callGeminiAPI(prompt);
            
            // Simular desenho da estrutura anatômica
            await this.animateWireframeDrawing(part);
            
            // Mostrar resposta da IA
            this.displayAIResponse(aiResponse);
            
            // Atualizar painel de informações
            this.updateAnatomicalInfo(part, aiResponse);
            
        } catch (error) {
            console.error('Erro ao desenhar parte anatômica:', error);
            this.displayError('Erro ao processar comando. Tente novamente.');
        } finally {
            this.showLoading(false);
        }
    }

    getAnatomicalPrompt(part) {
        const prompts = {
            skull: "Como desenhista anatômico especialista, explique como desenhar o crânio humano em wireframe, incluindo caixa craniana, cavidades oculares, mandíbula e proporções. Seja técnico e educativo.",
            torax: "Explique como desenhar a caixa torácica em estilo wireframe, incluindo costelas, esterno e estruturas principais. Foque nas proporções anatômicas corretas.",
            arms: "Descreva o desenho dos braços em wireframe, desde o úmero até os dedos, incluindo articulações e proporções anatômicas.",
            legs: "Explique como desenhar as pernas em wireframe, do fêmur aos dedos dos pés, incluindo articulações principais.",
            skeleton: "Descreva como desenhar o esqueleto humano completo em wireframe, seguindo proporções clássicas da anatomia.",
            muscles: "Explique como representar o sistema muscular principal em wireframe, focando nos grupos musculares mais importantes.",
            nervous: "Descreva como desenhar o sistema nervoso central em wireframe, incluindo cérebro, medula espinhal e principais nervos.",
            cardiovascular: "Explique como representar o sistema cardiovascular em wireframe, incluindo coração, artérias e veias principais.",
            lymphatic: "Descreva como desenhar o sistema linfático em wireframe, incluindo vasos linfáticos e linfonodos principais."
        };
        
        return prompts[part] || "Explique como desenhar esta estrutura anatômica em estilo wireframe.";
    }

    async callGeminiAPI(prompt) {
        const requestBody = {
            contents: [{
                role: "user",
                parts: [{
                    text: `Você é AnatoSketch, uma IA desenhista especialista em anatomia humana. Foque em criar explicações técnicas precisas para desenho anatômico em wireframe. ${prompt}`
                }]
            }]
        };

        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async animateWireframeDrawing(part) {
        const structures = this.getAnatomicalStructure(part);
        
        for (const structure of structures) {
            await this.drawWireframeStructure(structure);
            await this.delay(500);
        }
    }

    getAnatomicalStructure(part) {
        const structures = {
            skull: [
                { type: 'ellipse', x: 400, y: 200, w: 120, h: 140, label: 'Caixa craniana' },
                { type: 'ellipse', x: 370, y: 180, w: 15, h: 20, label: 'Cavidade ocular esquerda' },
                { type: 'ellipse', x: 430, y: 180, w: 15, h: 20, label: 'Cavidade ocular direita' },
                { type: 'rect', x: 380, y: 280, w: 40, h: 30, label: 'Mandíbula' },
                { type: 'line', x1: 400, y1: 130, x2: 400, y2: 320, label: 'Linha de simetria' }
            ],
            torax: [
                { type: 'ellipse', x: 400, y: 300, w: 100, h: 120, label: 'Caixa torácica' },
                { type: 'rect', x: 390, y: 280, w: 20, h: 60, label: 'Esterno' },
                ...Array.from({length: 12}, (_, i) => ({
                    type: 'arc', x: 400, y: 260 + i * 10, w: 80 + i * 5, h: 20, label: `Costela ${i + 1}`
                }))
            ],
            skeleton: [
                { type: 'ellipse', x: 400, y: 150, w: 80, h: 100, label: 'Crânio' },
                { type: 'line', x1: 400, y1: 200, x2: 400, y2: 500, label: 'Coluna vertebral' },
                { type: 'ellipse', x: 400, y: 300, w: 100, h: 80, label: 'Caixa torácica' },
                { type: 'line', x1: 350, y1: 280, x2: 300, y2: 450, label: 'Braço esquerdo' },
                { type: 'line', x1: 450, y1: 280, x2: 500, y2: 450, label: 'Braço direito' },
                { type: 'line', x1: 380, y1: 500, x2: 350, y2: 650, label: 'Perna esquerda' },
                { type: 'line', x1: 420, y1: 500, x2: 450, y2: 650, label: 'Perna direita' }
            ]
        };

        return structures[part] || [
            { type: 'ellipse', x: 400, y: 300, w: 100, h: 100, label: 'Estrutura básica' }
        ];
    }

    async drawWireframeStructure(structure) {
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        switch (structure.type) {
            case 'ellipse':
                this.drawAnimatedEllipse(structure);
                break;
            case 'rect':
                this.drawAnimatedRect(structure);
                break;
            case 'line':
                this.drawAnimatedLine(structure);
                break;
            case 'arc':
                this.drawAnimatedArc(structure);
                break;
        }

        this.ctx.setLineDash([]);
    }

    drawAnimatedEllipse(structure) {
        this.ctx.beginPath();
        this.ctx.ellipse(structure.x, structure.y, structure.w/2, structure.h/2, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Adicionar pontos de conexão
        this.drawConnectionPoints(structure);
    }

    drawAnimatedRect(structure) {
        this.ctx.strokeRect(structure.x, structure.y, structure.w, structure.h);
        this.drawConnectionPoints(structure);
    }

    drawAnimatedLine(structure) {
        this.ctx.beginPath();
        this.ctx.moveTo(structure.x1, structure.y1);
        this.ctx.lineTo(structure.x2, structure.y2);
        this.ctx.stroke();
    }

    drawAnimatedArc(structure) {
        this.ctx.beginPath();
        this.ctx.ellipse(structure.x, structure.y, structure.w/2, structure.h/2, 0, 0, Math.PI);
        this.ctx.stroke();
    }

    drawConnectionPoints(structure) {
        this.ctx.fillStyle = this.strokeColor;
        const points = this.getConnectionPoints(structure);
        
        points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    getConnectionPoints(structure) {
        switch (structure.type) {
            case 'ellipse':
                return [
                    {x: structure.x, y: structure.y - structure.h/2},
                    {x: structure.x + structure.w/2, y: structure.y},
                    {x: structure.x, y: structure.y + structure.h/2},
                    {x: structure.x - structure.w/2, y: structure.y}
                ];
            case 'rect':
                return [
                    {x: structure.x, y: structure.y},
                    {x: structure.x + structure.w, y: structure.y},
                    {x: structure.x + structure.w, y: structure.y + structure.h},
                    {x: structure.x, y: structure.y + structure.h}
                ];
            default:
                return [];
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sendCommand() {
        const input = document.getElementById('userInput');
        const command = input.value.trim();
        
        if (!command) return;

        this.showLoading(true);
        input.value = '';

        try {
            const response = await this.callGeminiAPI(command);
            this.displayAIResponse(response);
            
            // Processar comando para desenho automático
            this.processDrawingCommand(command);
            
        } catch (error) {
            console.error('Erro ao processar comando:', error);
            this.displayError('Erro ao processar comando. Verifique sua conexão.');
        } finally {
            this.showLoading(false);
        }
    }

    processDrawingCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('crânio') || lowerCommand.includes('cranio') || lowerCommand.includes('skull')) {
            this.drawAnatomicalPart('skull');
        } else if (lowerCommand.includes('esqueleto') || lowerCommand.includes('skeleton')) {
            this.drawAnatomicalPart('skeleton');
        } else if (lowerCommand.includes('tórax') || lowerCommand.includes('torax') || lowerCommand.includes('peito')) {
            this.drawAnatomicalPart('torax');
        } else if (lowerCommand.includes('braço') || lowerCommand.includes('braco') || lowerCommand.includes('arm')) {
            this.drawAnatomicalPart('arms');
        } else if (lowerCommand.includes('perna') || lowerCommand.includes('leg')) {
            this.drawAnatomicalPart('legs');
        } else if (lowerCommand.includes('músculo') || lowerCommand.includes('musculo') || lowerCommand.includes('muscle')) {
            this.drawAnatomicalPart('muscles');
        }
    }

    displayAIResponse(response) {
        const aiResponseDiv = document.getElementById('aiResponse');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        messageDiv.innerHTML = `
            <i class="fas fa-brain"></i>
            <p>${response}</p>
        `;
        
        aiResponseDiv.appendChild(messageDiv);
        aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;
    }

    displayError(message) {
        const aiResponseDiv = document.getElementById('aiResponse');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message error';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
        
        aiResponseDiv.appendChild(messageDiv);
        aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;
    }

    displayWelcomeMessage() {
        const welcomeMessage = `
            Bem-vindo ao AnatoSketch 3D! Sou sua IA especialista em desenho anatômico.

            **Como usar:**
            • Digite comandos como "desenhe o esqueleto humano"
            • Clique nos botões das partes do corpo
            • Use as ferramentas de desenho para criar suas próprias estruturas
            • Inicie o modo "Estudo Guiado" para um tour completo

            **Comandos sugeridos:**
            • "Desenhe o crânio em wireframe"
            • "Mostre o sistema cardiovascular"
            • "Explique a estrutura óssea do tórax"

            Pronto para começar? Digite seu primeiro comando!
        `;
        
        this.displayAIResponse(welcomeMessage);
    }

    updateAnatomicalInfo(part, aiResponse) {
        const detailsDiv = document.getElementById('anatomicalDetails');
        
        const partNames = {
            skull: 'Crânio',
            torax: 'Tórax',
            arms: 'Braços',
            legs: 'Pernas',
            skeleton: 'Esqueleto',
            muscles: 'Sistema Muscular',
            nervous: 'Sistema Nervoso',
            cardiovascular: 'Sistema Cardiovascular',
            lymphatic: 'Sistema Linfático'
        };

        detailsDiv.innerHTML = `
            <h5>${partNames[part]}</h5>
            <p>${aiResponse.substring(0, 200)}...</p>
            <small><em>Informações detalhadas disponíveis no chat da IA.</em></small>
        `;
    }

    async startGuidedStudy() {
        this.isGuidedStudy = true;
        this.studyStep = 0;
        
        const startBtn = document.getElementById('startGuidedStudy');
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar Tour';
        startBtn.onclick = () => this.stopGuidedStudy();
        
        await this.nextStudyStep();
    }

    stopGuidedStudy() {
        this.isGuidedStudy = false;
        
        const startBtn = document.getElementById('startGuidedStudy');
        startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar Tour';
        startBtn.onclick = () => this.startGuidedStudy();
        
        this.updateStudyProgress(0);
    }

    async nextStudyStep() {
        if (!this.isGuidedStudy || this.studyStep >= this.studySteps.length) {
            this.stopGuidedStudy();
            return;
        }

        const currentStep = this.studySteps[this.studyStep];
        this.updateStudyProgress(this.studyStep + 1);
        
        const stepPrompt = `Como parte do estudo guiado de anatomia, explique e descreva como desenhar: ${currentStep}. Seja educativo e passo-a-passo.`;
        
        try {
            const response = await this.callGeminiAPI(stepPrompt);
            this.displayAIResponse(`**Etapa ${this.studyStep + 1}: ${currentStep}**\n\n${response}`);
            
            // Desenhar automaticamente a estrutura
            const partMap = {
                0: 'skull', 1: 'skeleton', 2: 'torax', 3: 'arms', 
                4: 'skeleton', 5: 'legs', 6: 'muscles', 7: 'nervous', 
                8: 'cardiovascular', 9: 'skeleton'
            };
            
            if (partMap[this.studyStep]) {
                await this.drawAnatomicalPart(partMap[this.studyStep]);
            }
            
            this.studyStep++;
            
            // Continuar automaticamente após 10 segundos
            setTimeout(() => {
                if (this.isGuidedStudy) {
                    this.nextStudyStep();
                }
            }, 10000);
            
        } catch (error) {
            console.error('Erro no estudo guiado:', error);
            this.stopGuidedStudy();
        }
    }

    updateStudyProgress(step) {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        const percentage = (step / this.studySteps.length) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${step}/${this.studySteps.length} etapas`;
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    exportSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.canvas.width);
        svg.setAttribute('height', this.canvas.height);
        svg.setAttribute('viewBox', `0 0 ${this.canvas.width} ${this.canvas.height}`);

        this.paths.forEach(pathData => {
            if (pathData.tool === 'erase') return;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            let d = '';
            
            pathData.path.forEach((point, index) => {
                d += index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`;
            });
            
            path.setAttribute('d', d);
            path.setAttribute('stroke', pathData.color);
            path.setAttribute('stroke-width', pathData.width);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            
            svg.appendChild(path);
        });

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anatosketch_drawing.svg';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    exportPNG() {
        const link = document.createElement('a');
        link.download = 'anatosketch_drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new AnatoSketch3D();
});

// Adicionar funcionalidades extras
document.addEventListener('keydown', (e) => {
    // Atalhos de teclado
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'z':
                e.preventDefault();
                // Implementar undo
                break;
            case 's':
                e.preventDefault();
                document.getElementById('exportPNG').click();
                break;
        }
    }
});
