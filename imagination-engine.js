#!/usr/bin/env node

const readline = require('readline');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 영어 키워드 풀 (7개 카테고리, 총 210개)
const concepts = {
  physical: ['atom', 'cell', 'organism', 'city', 'planet', 'galaxy', 'universe', 'quantum', 'molecule', 'tissue', 'organ', 'ecosystem', 'continent', 'solar-system', 'cluster', 'void', 'particle', 'nucleus', 'membrane', 'forest', 'ocean', 'mountain', 'river', 'cloud', 'storm', 'earthquake', 'volcano', 'meteor', 'black-hole', 'star'],
  temporal: ['nanosecond', 'moment', 'hour', 'day', 'week', 'month', 'year', 'decade', 'century', 'millennium', 'eon', 'eternity', 'planck-time', 'heartbeat', 'blink', 'breath', 'season', 'generation', 'era', 'epoch', 'cycle', 'rhythm', 'pulse', 'duration', 'interval', 'sequence', 'timeline', 'period', 'phase', 'transition'],
  abstract: ['consciousness', 'information', 'pattern', 'chaos', 'entropy', 'symmetry', 'harmony', 'discord', 'truth', 'beauty', 'justice', 'freedom', 'love', 'fear', 'hope', 'memory', 'dream', 'reality', 'illusion', 'paradox', 'infinity', 'void', 'essence', 'meaning', 'purpose', 'identity', 'soul', 'spirit', 'mind', 'thought'],
  sensory: ['touch', 'synergy', 'déjà-vu', 'synesthesia', 'intuition', 'hallucination', 'vision', 'sound', 'taste', 'smell', 'texture', 'temperature', 'pressure', 'vibration', 'resonance', 'echo', 'reflection', 'glow', 'shadow', 'color', 'brightness', 'darkness', 'silence', 'noise', 'music', 'harmony', 'discord', 'rhythm', 'melody', 'tone'],
  biological: ['gene', 'immunity', 'evolution', 'symbiosis', 'extinction', 'mutation', 'adaptation', 'reproduction', 'metabolism', 'photosynthesis', 'respiration', 'circulation', 'digestion', 'neural-network', 'hormone', 'enzyme', 'protein', 'DNA', 'RNA', 'chromosome', 'mitosis', 'meiosis', 'fertilization', 'embryo', 'stem-cell', 'organ', 'tissue', 'blood', 'bone', 'muscle'],
  social: ['community', 'relationship', 'communication', 'language', 'culture', 'tradition', 'ritual', 'ceremony', 'celebration', 'festival', 'competition', 'cooperation', 'conflict', 'peace', 'war', 'politics', 'economy', 'trade', 'money', 'power', 'authority', 'leadership', 'democracy', 'freedom', 'justice', 'equality', 'diversity', 'unity', 'identity', 'belonging'],
  technological: ['algorithm', 'network', 'system', 'interface', 'protocol', 'encryption', 'database', 'server', 'cloud', 'blockchain', 'AI', 'machine-learning', 'robotics', 'automation', 'sensor', 'actuator', 'processor', 'memory', 'storage', 'bandwidth', 'latency', 'throughput', 'scalability', 'interoperability', 'security', 'privacy', 'authentication', 'authorization', 'virtualization', 'simulation']
};

class ImaginationEngineV3 {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.sessionDir = path.join(__dirname, 'sessions');
    this.currentSession = null;
    this.currentCombination = null;
    this.phase = 1; // 1: 자유상상, 2: 현실화검토, 3: 로드맵작성
    this.conversationHistory = [];
    this.stateSnapshots = []; // 되돌리기용 상태 저장
    this.turnCount = 1;
  }

  // 한국어 번역 사전
  translateToKorean(englishWords) {
    const translations = {
      // Physical
      'atom': '원자', 'cell': '세포', 'organism': '유기체', 'city': '도시', 'planet': '행성',
      'galaxy': '은하', 'universe': '우주', 'quantum': '양자', 'molecule': '분자', 'tissue': '조직',
      'organ': '기관', 'ecosystem': '생태계', 'continent': '대륙', 'solar-system': '태양계',
      'cluster': '군집', 'void': '공허', 'particle': '입자', 'nucleus': '핵', 'membrane': '막',
      'forest': '숲', 'ocean': '바다', 'mountain': '산', 'river': '강', 'cloud': '구름',
      'storm': '폭풍', 'earthquake': '지진', 'volcano': '화산', 'meteor': '유성',
      'black-hole': '블랙홀', 'star': '별',

      // Temporal
      'nanosecond': '나노초', 'moment': '순간', 'hour': '시간', 'day': '하루', 'week': '주',
      'month': '달', 'year': '년', 'decade': '십년', 'century': '세기', 'millennium': '천년',
      'eon': '영겁', 'eternity': '영원', 'planck-time': '플랑크시간', 'heartbeat': '심장박동',
      'blink': '눈깜빡임', 'breath': '호흡', 'season': '계절', 'generation': '세대',
      'era': '시대', 'epoch': '시기', 'cycle': '순환', 'rhythm': '리듬', 'pulse': '맥박',
      'duration': '지속시간', 'interval': '간격', 'sequence': '연속', 'timeline': '시간선',
      'period': '기간', 'phase': '단계', 'transition': '전환',

      // Abstract
      'consciousness': '의식', 'information': '정보', 'pattern': '패턴', 'chaos': '카오스',
      'entropy': '엔트로피', 'symmetry': '대칭', 'harmony': '조화', 'discord': '불화',
      'truth': '진실', 'beauty': '아름다움', 'justice': '정의', 'freedom': '자유',
      'love': '사랑', 'fear': '두려움', 'hope': '희망', 'memory': '기억', 'dream': '꿈',
      'reality': '현실', 'illusion': '환상', 'paradox': '역설', 'infinity': '무한',
      'essence': '본질', 'meaning': '의미', 'purpose': '목적', 'identity': '정체성',
      'soul': '영혼', 'spirit': '정신', 'mind': '마음', 'thought': '생각',

      // Sensory
      'touch': '촉감', 'synergy': '시너지', 'déjà-vu': '데자뷰', 'synesthesia': '공감각',
      'intuition': '직관', 'hallucination': '환각', 'vision': '시각', 'sound': '소리',
      'taste': '맛', 'smell': '냄새', 'texture': '질감', 'temperature': '온도',
      'pressure': '압력', 'vibration': '진동', 'resonance': '공명', 'echo': '메아리',
      'reflection': '반사', 'glow': '빛남', 'shadow': '그림자', 'color': '색깔',
      'brightness': '밝기', 'darkness': '어둠', 'silence': '침묵', 'noise': '소음',
      'music': '음악', 'melody': '멜로디', 'tone': '음조',

      // Biological
      'gene': '유전자', 'immunity': '면역', 'evolution': '진화', 'symbiosis': '공생',
      'extinction': '멸종', 'mutation': '돌연변이', 'adaptation': '적응', 'reproduction': '번식',
      'metabolism': '신진대사', 'photosynthesis': '광합성', 'respiration': '호흡',
      'circulation': '순환', 'digestion': '소화', 'neural-network': '신경망', 'hormone': '호르몬',
      'enzyme': '효소', 'protein': '단백질', 'DNA': 'DNA', 'RNA': 'RNA',
      'chromosome': '염색체', 'mitosis': '체세포분열', 'meiosis': '감수분열',
      'fertilization': '수정', 'embryo': '배아', 'stem-cell': '줄기세포',
      'blood': '혈액', 'bone': '뼈', 'muscle': '근육',

      // Social
      'community': '공동체', 'relationship': '관계', 'communication': '소통', 'language': '언어',
      'culture': '문화', 'tradition': '전통', 'ritual': '의식', 'ceremony': '의례',
      'celebration': '축제', 'festival': '축제', 'competition': '경쟁', 'cooperation': '협력',
      'conflict': '갈등', 'peace': '평화', 'war': '전쟁', 'politics': '정치',
      'economy': '경제', 'trade': '무역', 'money': '돈', 'power': '권력',
      'authority': '권위', 'leadership': '리더십', 'democracy': '민주주의',
      'equality': '평등', 'diversity': '다양성', 'unity': '통합', 'belonging': '소속감',

      // Technological
      'algorithm': '알고리즘', 'network': '네트워크', 'system': '시스템', 'interface': '인터페이스',
      'protocol': '프로토콜', 'encryption': '암호화', 'database': '데이터베이스', 'server': '서버',
      'cloud': '클라우드', 'blockchain': '블록체인', 'AI': 'AI', 'machine-learning': '머신러닝',
      'robotics': '로봇공학', 'automation': '자동화', 'sensor': '센서', 'actuator': '액추에이터',
      'processor': '프로세서', 'memory': '메모리', 'storage': '저장소', 'bandwidth': '대역폭',
      'latency': '지연시간', 'throughput': '처리량', 'scalability': '확장성',
      'interoperability': '상호운용성', 'security': '보안', 'privacy': '개인정보보호',
      'authentication': '인증', 'authorization': '인가', 'virtualization': '가상화',
      'simulation': '시뮬레이션'
    };

    return englishWords.map(word => translations[word] || word);
  }

  // 한국어 조사 처리
  addParticle(word, particle) {
    if (!word) return word;

    const lastChar = word.charAt(word.length - 1);
    const lastCharCode = lastChar.charCodeAt(0);

    // 한글 범위인지 확인
    if (lastCharCode >= 0xAC00 && lastCharCode <= 0xD7A3) {
      // 받침 있는지 확인 (한글 유니코드 계산)
      const hasFinalConsonant = (lastCharCode - 0xAC00) % 28 !== 0;

      switch (particle) {
        case '이/가':
          return word + (hasFinalConsonant ? '이' : '가');
        case '을/를':
          return word + (hasFinalConsonant ? '을' : '를');
        case '과/와':
          return word + (hasFinalConsonant ? '과' : '와');
        case '은/는':
          return word + (hasFinalConsonant ? '은' : '는');
        case '아/야':
          return word + (hasFinalConsonant ? '아' : '야');
        default:
          return word;
      }
    }

    // 한글이 아닌 경우 기본값 사용
    const defaultParticles = {
      '이/가': '가', '을/를': '를', '과/와': '와', '은/는': '는', '아/야': '야'
    };
    return word + (defaultParticles[particle] || '');
  }

  // 현재 상태를 스냅샷으로 저장
  saveStateSnapshot(description = '') {
    const snapshot = {
      timestamp: new Date().toISOString(),
      description: description,
      phase: this.phase,
      turnCount: this.turnCount,
      currentCombination: [...this.currentCombination],
      conversationHistory: JSON.parse(JSON.stringify(this.conversationHistory)),
      currentSession: this.currentSession
    };
    this.stateSnapshots.push(snapshot);

    // 최대 10개까지만 보관
    if (this.stateSnapshots.length > 10) {
      this.stateSnapshots.shift();
    }

    // 자동 저장
    this.autoSave();
  }

  // 이전 상태로 되돌리기
  restorePreviousState() {
    if (this.stateSnapshots.length === 0) {
      console.log('\n❌ 되돌릴 수 있는 이전 상태가 없습니다.');
      return false;
    }

    const snapshot = this.stateSnapshots.pop();
    this.phase = snapshot.phase;
    this.turnCount = snapshot.turnCount;
    this.currentCombination = snapshot.currentCombination;
    this.conversationHistory = snapshot.conversationHistory;
    this.currentSession = snapshot.currentSession;

    console.log(`\n🔄 ${snapshot.description || '이전 상태'}로 되돌렸습니다.`);
    console.log(`   Phase ${this.phase}, Turn ${this.turnCount}`);
    return true;
  }

  // 자동 저장
  autoSave() {
    if (!this.currentSession) return;

    const state = {
      currentCombination: this.currentCombination,
      phase: this.phase,
      turnCount: this.turnCount,
      conversationHistory: this.conversationHistory,
      stateSnapshots: this.stateSnapshots,
      timestamp: new Date().toISOString()
    };

    const stateFile = path.join(this.currentSession, 'autosave.json');
    try {
      fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.log(`자동 저장 실패: ${error.message}`);
    }
  }

  // 자동 저장된 상태 복구
  loadAutoSave() {
    const stateFile = path.join(this.currentSession, 'autosave.json');
    if (fs.existsSync(stateFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        return state;
      } catch (error) {
        console.log(`자동 저장 파일 로드 실패: ${error.message}`);
      }
    }
    return null;
  }

  // 랜덤 조합 생성
  generateRandomCombination() {
    const categories = Object.keys(concepts);
    const combo = [];
    const usedCategories = new Set();

    while (combo.length < 3) {
      const category = categories[Math.floor(Math.random() * categories.length)];

      // 같은 카테고리에서 2개 이상 선택하지 않음
      if (usedCategories.has(category) && usedCategories.size < categories.length) {
        continue;
      }

      const concept = concepts[category][Math.floor(Math.random() * concepts[category].length)];
      if (!combo.includes(concept)) {
        combo.push(concept);
        usedCategories.add(category);
      }
    }

    return combo;
  }

  // 세션 디렉토리 생성
  createSession() {
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.currentSession = path.join(this.sessionDir, `session-${timestamp}`);
    fs.mkdirSync(this.currentSession);

    console.log(`\n새 세션 시작: ${path.basename(this.currentSession)}`);
  }

  // 단일 마스터 파일에 누적 저장
  appendToMasterFile(participant, turnCount, content) {
    const timestamp = new Date().toLocaleTimeString('ko-KR');
    const entry = `\n\n=== ${participant.toUpperCase()} - Turn ${turnCount} (${timestamp}) ===\n${content}`;

    const masterFile = path.join(this.currentSession, 'conversation.md');

    // 첫 저장시 헤더 생성 및 VS Code에서 파일 열기
    if (!fs.existsSync(masterFile)) {
      const header = `# 상상 세션: ${this.currentCombination.join(' + ')}\n\n시작: ${new Date().toLocaleString('ko-KR')}\n조합: ${this.translateToKorean(this.currentCombination).join(' + ')}`;
      fs.writeFileSync(masterFile, header);

      // VS Code에서 이 파일을 열도록 시도
      exec(`code "${masterFile}"`, (error) => {
        if (error) {
          console.log(`\n💡 팁: VS Code에서 다음 파일을 열면 실시간으로 내용을 볼 수 있습니다:\n   ${masterFile}`);
        }
      });
    }

    fs.appendFileSync(masterFile, entry);
  }

  // 레거시 호환용 (기존 코드에서 사용)
  saveToSession(filename, content) {
    // 더 이상 개별 파일 생성하지 않음
  }

  // Phase 1: 한 턴의 창의적 상상 실행
  async runPhase1Turn() {
    // 1. 사용자 상상
    const userIdea = await this.getUserImagination(this.turnCount);
    this.conversationHistory.push({ participant: 'user', content: userIdea, turn: this.turnCount });

    // 2. Claude 상상 (철학적, 시스템적)
    const claudeIdea = await this.getClaudeImagination(1); // phase 1
    this.conversationHistory.push({ participant: 'claude', content: claudeIdea, turn: this.turnCount });

    // 3. Gemini 상상 (시적, 서사적)
    const geminiIdea = await this.getGeminiImagination(1); // phase 1
    this.conversationHistory.push({ participant: 'gemini', content: geminiIdea, turn: this.turnCount });
  }

  // Phase 2: 한 턴의 앱 개발 상상 실행
  async runPhase2Turn() {
    // 1. 사용자 상상 (앱 개발 방향)
    const userIdea = await this.getUserImagination(this.turnCount, 2); // phase 2
    this.conversationHistory.push({ participant: 'user', content: userIdea, turn: this.turnCount });

    // 2. Claude 상상 (실용적, 기술적)
    const claudeIdea = await this.getClaudeImagination(2); // phase 2
    this.conversationHistory.push({ participant: 'claude', content: claudeIdea, turn: this.turnCount });

    // 3. Gemini 상상 (혁신적, UX 중심)
    const geminiIdea = await this.getGeminiImagination(2); // phase 2
    this.conversationHistory.push({ participant: 'gemini', content: geminiIdea, turn: this.turnCount });
  }

  // Claude 상상 생성 (Phase에 따라 역할 변경)
  async getClaudeImagination(phase) {
    console.log('\n[Claude] 아이디어 발전 중...');
    const conversationSummary = this.conversationHistory.map(h => `[${h.participant}] ${h.content}`).join('\n\n');
    let prompt;

    if (phase === 1) {
      console.log('>> Phase 1: 자유 상상 (철학적 접근)');
      prompt = `Act as a philosopher and systems thinker. Your goal is to expand on an initial idea.
Keywords: "${this.currentCombination.join(' + ')}"
Conversation so far:
${conversationSummary}

Analyze the user's idea and the keywords. Explore the underlying principles, historical parallels, and systemic connections.
What are the deeper questions this idea raises?
Do NOT mention apps, technology, or software. Focus on the 'why' and the 'what if'.
Your response must be in Korean.`;
    } else { // phase 2
      console.log('>> Phase 2: 앱 아이디어 구체화 (실용적 접근)');
      prompt = `Act as a practical product manager and systems architect. The free-form ideation is done.
Keywords: "${this.currentCombination.join(' + ')}"
Conversation so far:
${conversationSummary}

Based on the ENTIRE conversation, propose a concrete app concept.
Define the core user, the problem it solves, and the key features.
Suggest a high-level technical architecture (frontend, backend, data).
Your response must be in Korean.`;
    }

    try {
      const claudeResponse = await this.tryGeminiCLI(prompt);
      console.log('\n- [Claude 상상]');
      console.log('-'.repeat(30));
      console.log(claudeResponse);
      this.appendToMasterFile('claude', this.turnCount, claudeResponse);
      return claudeResponse;
    } catch (error) {
      console.log(`\n[Claude-Gemini CLI 오류 - 시뮬레이션 사용] Error: ${error.message}`);
      const fallbackIdea = `(시뮬레이션) Phase ${phase}에서 Claude는 현재 대화의 맥락을 분석하여, 아이디어를 ${phase === 1 ? '철학적으로 심화시키거나' : '기술적으로 구체화합니다'}.`;
      console.log('\n- [Claude 상상]');
      console.log('-'.repeat(30));
      console.log(fallbackIdea);
      this.appendToMasterFile('claude', this.turnCount, fallbackIdea);
      return fallbackIdea;
    }
  }

  // Gemini 상상 생성 (Phase에 따라 역할 변경)
  async getGeminiImagination(phase) {
    console.log('\n[Gemini] 아이디어 종합 및 확장 중...');
    const conversationSummary = this.conversationHistory.map(h => `[${h.participant}] ${h.content}`).join('\n\n');
    let prompt;

    if (phase === 1) {
      console.log('>> Phase 1: 자유 상상 (과학적 접근)');
      prompt = `Act as a futurist and a scientist specializing in both natural and social sciences. Your goal is to explore an idea from a scientific and societal perspective.
Keywords: "${this.currentCombination.join(' + ')}"
Conversation so far:
${conversationSummary}

Analyze the user's idea and the keywords. How would this concept manifest in the natural world? What physical laws or ecological models could describe it?
What would be the societal implications? What new social structures, economic systems, or forms of communication might emerge?
Your thinking should be analytical and speculative, grounded in scientific and social principles.
Do NOT mention apps, technology, or software. Focus on the fundamental principles and their consequences.
Your response must be in Korean.`;
    } else { // phase 2
      console.log('>> Phase 2: 앱 아이디어 구체화 (혁신적 접근)');
      prompt = `Act as a UX visionary and product strategist. The free-form ideation is done.
Keywords: "${this.currentCombination.join(' + ')}"
Conversation so far:
${conversationSummary}

Based on the ENTIRE conversation, brainstorm a unique and compelling user experience for the proposed app concept.
How can we make it delightful, insightful, and different from anything else?
Describe the user journey and the 'magic moments' that will make users love it.
Your response must be in Korean.`;
    }

    try {
      const geminiResponse = await this.tryGeminiCLI(prompt);
      console.log('\n- [Gemini 상상]');
      console.log('-'.repeat(30));
      console.log(geminiResponse);
      this.appendToMasterFile('gemini', this.turnCount, geminiResponse);
      return geminiResponse;
    } catch (error) {
      console.log(`\n[Gemini CLI 오류 - 시뮬레이션 사용] Error: ${error.message}`);
      const fallbackIdea = `(시뮬레이션) Phase ${phase}에서 Gemini는 대화 전체를 종합하여, ${phase === 1 ? '예상치 못한 새로운 관점을 제시하거나' : '사용자 경험을 극대화할 혁신적인 아이디어를 더합니다'}.`;
      console.log('\n- [Gemini 상상]');
      console.log('-'.repeat(30));
      console.log(fallbackIdea);
      this.appendToMasterFile('gemini', this.turnCount, fallbackIdea);
      return fallbackIdea;
    }
  }

  // 사용자 상상 입력
  async getUserImagination(turnCount, phase = 1) {
    const koreanDisplay = this.translateToKorean(this.currentCombination);
    const displayText = koreanDisplay.map((korean, index) =>
      `${korean}(${this.currentCombination[index]})`
    ).join(' + ');

    if (turnCount === 1 && phase === 1) {
      console.log('\n' + '='.repeat(50));
      console.log('Phase 1: 자유 상상');
      console.log('='.repeat(50));
      console.log(`\n조합: ${displayText}`);
      console.log('\n이 세 키워드에서 어떤 연결고리나 가능성을 발견하시나요?');
      console.log('앱 개발은 잠시 잊고, 자유롭게 상상해보세요.');
    } else if (phase === 2) {
        console.log('\n' + '='.repeat(50));
        console.log('Phase 2: 앱 개발 구체화');
        console.log('='.repeat(50));
        console.log('지금까지의 상상을 바탕으로, 어떤 앱을 만들 수 있을까요?');
        console.log('자유롭게 아이디어를 내주세요.');
    }
    else {
      console.log('\n=== 사용자 턴 ===');
      console.log('지금까지의 대화를 바탕으로 상상을 더 발전시켜보세요.');
      const prevHistory = this.conversationHistory.slice(-2).map(h =>
        `${h.participant}: ${h.content.substring(0, 50)}...`
      ).join('\n');
      console.log(`\n최근 대화:\n${prevHistory}`);
    }

    // 사용자 힌트 표시
    console.log('\n💡 명령어: quit(종료), back(이전으로), save(저장)');

    return new Promise((resolve) => {
      if (this.rl.closed) {
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      }

      const askInput = () => {
        this.rl.question('\n> 사용자 상상: ', (answer) => {
          const userInput = answer.trim();

          // 명령어 처리
          switch (userInput.toLowerCase()) {
            case 'quit':
            case 'exit':
              console.log('\n👋 세션을 종료합니다.');
              this.rl.close();
              process.exit(0);
              break;

            case 'back':
              if (this.restorePreviousState()) {
                // 이전 상태로 돌아가서 다시 물어보기
                setTimeout(() => askInput(), 100);
                return;
              } else {
                // 되돌릴 상태가 없으면 다시 입력 받기
                setTimeout(() => askInput(), 100);
                return;
              }

            case 'save':
              this.autoSave();
              console.log('\n💾 현재 상태가 저장되었습니다.');
              setTimeout(() => askInput(), 100);
              return;

            case '':
              console.log('\n❌ 빈 입력입니다. 다시 입력해주세요.');
              setTimeout(() => askInput(), 100);
              return;

            default:
              // 정상적인 상상 입력
              this.saveStateSnapshot(`Turn ${turnCount} 사용자 입력 전`);
              console.log('\n- [사용자 상상]');
              console.log('-'.repeat(30));
              console.log(userInput);
              this.appendToMasterFile('user', turnCount, userInput);
              resolve(userInput);
          }
        });
      };

      askInput();
    });
  }

  // Phase 1 이후 사용자 결정
  async askAfterPhase1() {
    console.log('\n' + '='.repeat(50));
    console.log(`Phase 1 (Turn ${this.turnCount}) 완료`);
    console.log('='.repeat(50));
    console.log('\n다음 단계를 선택하세요:');
    console.log('1. 상상 발전시키기 (Phase 1 반복)');
    console.log('2. 앱 개발 아이디어로 전환 (Phase 2 진행)');
    console.log('3. 새로운 조합으로 시작');
    console.log('4. 종료');

    return new Promise((resolve) => {
      if (this.rl.closed) {
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      }
      this.rl.question('\n선택 (1/2/3/4): ', (answer) => {
        const choice = answer.trim();
        switch (choice) {
          case '1': resolve('repeat'); break;
          case '2': resolve('develop'); break;
          case '3': resolve('new'); break;
          case '4': resolve('exit'); break;
          default:
            console.log('잘못된 선택입니다. 다시 시도하세요.');
            resolve(this.askAfterPhase1());
        }
      });
    });
  }

    // Phase 2 이후 사용자 결정
    async askAfterPhase2() {
        console.log('\n' + '='.repeat(60));
        console.log('Phase 2 완료: 앱 개발 계획이 수립되었습니다.');
        console.log('='.repeat(60));
        console.log(`\n📁 모든 내용이 저장되었습니다: ${this.currentSession}/conversation.md`);
        console.log('\n다음 단계를 선택하세요:');
        console.log('1. 새로운 조합으로 시작');
        console.log('2. 종료');

        return new Promise((resolve) => {
            if (this.rl.closed) {
                this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            }
            this.rl.question('\n선택 (1/2): ', (answer) => {
                resolve(answer.trim() === '1' ? 'new' : 'exit');
            });
        });
    }


  // Gemini CLI 호출
  async tryGeminiCLI(prompt) {
    this.rl.close(); // 사용자 입력 인터페이스를 닫아 자원 충돌 방지
    return new Promise((resolve, reject) => {
      const gemini = spawn('gemini', [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: '/Users/manta/Dev',
        detached: false
      });

      let output = '';
      let error = '';

      gemini.stdout.on('data', (data) => {
        output += data.toString();
      });

      gemini.stderr.on('data', (data) => {
        const errorText = data.toString();
        if (!errorText.includes('Loaded cached credentials') &&
            !errorText.includes('Loading') &&
            errorText.trim()) {
          error += errorText;
        }
      });

      gemini.on('close', (code) => {
        setTimeout(() => {
          const cleanOutput = output
            .replace(/Loaded cached credentials\./g, '')
            .replace(/Loading\.\.\./g, '')
            .trim();

          if (cleanOutput) {
            resolve(cleanOutput);
          } else {
            reject(new Error(error || `Gemini CLI failed with code ${code}`));
          }
        }, 100);
      });

      gemini.on('error', (err) => {
        reject(err);
      });

      try {
        gemini.stdin.write(prompt);
        gemini.stdin.end();
      } catch (err) {
        reject(err);
      }

      setTimeout(() => {
        try {
          gemini.kill('SIGTERM');
        } catch (err) {
          // 이미 종료된 경우 무시
        }
        reject(new Error('Gemini CLI timeout'));
      }, 90000);
    });
  }

  // 앱 개발 계획 수립
  async createAppDevelopmentPlan() {
    console.log('\n' + '='.repeat(60));
    console.log('앱 개발 계획 수립');
    console.log('='.repeat(60));

    const allIdeas = this.conversationHistory.map(h => h.content).join('\n\n');
    const planPrompt = `Based on the entire conversation history, create a concise development plan for the app.
Conversation:
${allIdeas}

The plan should include:
1. App Concept: A brief, one-paragraph summary.
2. Core Features: A bulleted list of 3-5 key features.
3. Tech Stack: A suggested tech stack (Frontend, Backend, Database).
4. Development Roadmap: A simple 4-step roadmap (e.g., Prototype -> MVP -> Beta -> Launch).
5. Key Challenges: 2-3 potential challenges.

The entire response must be in Korean.`;

    console.log('\n[System] 앱 개발 계획 생성 중...');
    try {
        const developmentPlan = await this.tryGeminiCLI(planPrompt);
        console.log(developmentPlan);
        this.appendToMasterFile('system', 'final', developmentPlan);
    } catch (error) {
        console.log(`\n[CLI 오류 - 계획 생성 실패] Error: ${error.message}`);
        const fallbackPlan = '# 앱 개발 계획 (대체)\n\nAI 모델 호출에 실패하여 기본 계획을 생성합니다.\n\n' +
                             `## 1. 핵심 아이디어: ${this.currentCombination.join(' + ')} 키워드를 활용한 앱\n` +
                             '## 2. 주요 기능: ...\n' + 
                             '## 3. 기술 스택: ...';
        console.log(fallbackPlan);
        this.appendToMasterFile('system', 'final', fallbackPlan);
    }
  }

  // 이전 세션 찾기 및 복구 옵션 제공
  async checkForPreviousSessions() {
    if (!fs.existsSync(this.sessionDir)) {
      return false;
    }

    const sessions = fs.readdirSync(this.sessionDir)
      .filter(item => fs.statSync(path.join(this.sessionDir, item)).isDirectory())
      .map(sessionName => {
        const sessionPath = path.join(this.sessionDir, sessionName);
        const autosaveFile = path.join(sessionPath, 'autosave.json');

        if (fs.existsSync(autosaveFile)) {
          try {
            const state = JSON.parse(fs.readFileSync(autosaveFile, 'utf8'));
            return {
              name: sessionName,
              path: sessionPath,
              timestamp: state.timestamp,
              phase: state.phase,
              turnCount: state.turnCount,
              combination: state.currentCombination
            };
          } catch (error) {
            return null;
          }
        }
        return null;
      })
      .filter(session => session !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (sessions.length === 0) {
      return false;
    }

    console.log('\n💾 이전 세션을 발견했습니다:');
    sessions.slice(0, 3).forEach((session, index) => {
      const koreanDisplay = this.translateToKorean(session.combination);
      const displayText = koreanDisplay.join(' + ');
      const timeAgo = new Date(session.timestamp).toLocaleString('ko-KR');
      console.log(`${index + 1}. ${displayText} (Phase ${session.phase}, Turn ${session.turnCount}) - ${timeAgo}`);
    });

    console.log('\n선택하세요:');
    console.log('1-3: 해당 세션 복구');
    console.log('n: 새로운 세션 시작');

    return new Promise((resolve) => {
      this.rl.question('\n선택: ', (answer) => {
        const choice = answer.trim().toLowerCase();

        if (choice === 'n' || choice === 'new') {
          resolve(false);
        } else {
          const sessionIndex = parseInt(choice) - 1;
          if (sessionIndex >= 0 && sessionIndex < sessions.length) {
            const selectedSession = sessions[sessionIndex];
            this.currentSession = selectedSession.path;

            try {
              const state = this.loadAutoSave();
              if (state) {
                this.currentCombination = state.currentCombination;
                this.phase = state.phase;
                this.turnCount = state.turnCount;
                this.conversationHistory = state.conversationHistory || [];
                this.stateSnapshots = state.stateSnapshots || [];

                console.log(`\n🔄 세션이 복구되었습니다: Phase ${this.phase}, Turn ${this.turnCount}`);
                resolve(true);
              } else {
                console.log('\n❌ 세션 복구에 실패했습니다. 새로운 세션을 시작합니다.');
                resolve(false);
              }
            } catch (error) {
              console.log('\n❌ 세션 복구 중 오류가 발생했습니다. 새로운 세션을 시작합니다.');
              resolve(false);
            }
          } else {
            console.log('\n❌ 잘못된 선택입니다. 새로운 세션을 시작합니다.');
            resolve(false);
          }
        }
      });
    });
  }

  // 메인 루프
  async start() {
    console.log('🌟 상상 엔진 V3');
    console.log('Phase 1 (자유 상상)과 Phase 2 (앱 개발)가 분리되었습니다.\n');

    // 이전 세션 복구 확인
    const sessionRestored = await this.checkForPreviousSessions();

    mainLoop: while (true) {
      if (!sessionRestored) {
        this.createSession();
        this.conversationHistory = [];
        this.stateSnapshots = [];
        this.currentCombination = this.generateRandomCombination();
        this.phase = 1;
        this.turnCount = 1;
      }

      const koreanDisplay = this.translateToKorean(this.currentCombination);
      const displayText = koreanDisplay.map((korean, index) =>
        `${korean}(${this.currentCombination[index]})`
      ).join(' + ');

      if (!sessionRestored) {
        console.log(`\n🎲 새로운 조합: ${displayText}`);
      } else {
        console.log(`\n🔄 복구된 조합: ${displayText}`);
      }

      // --- Phase 1 Loop ---
      while (this.phase === 1) {
        await this.runPhase1Turn();
        const decision = await this.askAfterPhase1();

        switch (decision) {
          case 'repeat':
            this.turnCount++;
            console.log('\n🔄 아이디어를 더 발전시킵니다...');
            continue;
          case 'develop':
            this.phase = 2;
            console.log('\n🚀 앱 개발 단계로 전환합니다...');
            break;
          case 'new':
            console.log('\n🎲 새로운 조합으로 다시 시작합니다...');
            sessionRestored = false; // 새로운 세션을 위해 리셋
            continue mainLoop;
          case 'exit':
            console.log('\n세션을 종료합니다.');
            this.rl.close();
            return;
        }
      }

      // --- Phase 2 ---
      if (this.phase === 2) {
        this.turnCount++;
        await this.runPhase2Turn();
        await this.createAppDevelopmentPlan();
        
        const finalDecision = await this.askAfterPhase2();
        if (finalDecision === 'new') {
          console.log('\n🎲 새로운 조합으로 다시 시작합니다...');
          sessionRestored = false; // 새로운 세션을 위해 리셋
          continue mainLoop;
        } else {
          console.log('\n세션을 종료합니다.');
          this.rl.close();
          return;
        }
      }

      // 루프가 반복될 때 sessionRestored 리셋
      sessionRestored = false;
    }
  }
}

// 실행
if (require.main === module) {
  const engine = new ImaginationEngineV3();
  engine.start();
}

module.exports = ImaginationEngineV3;