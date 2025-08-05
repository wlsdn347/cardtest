class CardGame {
    constructor() {
        this.selectedDeck = null;
        this.selectedCards = [];
        this.maxCards = 5;
        this.isManualMode = false;
        this.deckNames = {
            fire: '불',
            water: '물',
            leaf: '풀'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.createSelectedCardSlots();
    }

    bindEvents() {
        // 덱 선택 이벤트
        document.querySelectorAll('.deck-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const deckType = e.currentTarget.dataset.deck;
                this.selectDeck(deckType);
            });
        });

        // 뒤로가기 버튼
        document.getElementById('back-btn').addEventListener('click', () => {
            this.goBackToDeckSelection();
        });

        // 다시 선택 버튼
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSelection();
        });

        // 내가 채우기 버튼
        document.getElementById('manual-fill-btn').addEventListener('click', () => {
            this.toggleManualMode();
        });
    }

    selectDeck(deckType) {
        this.selectedDeck = deckType;
        this.loadCards(deckType);
        this.showCardSelection();
    }

    async loadCards(deckType) {
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = '<div style="text-align: center; color: white;">카드를 불러오는 중...</div>';

        try {
            // 카드 이미지 파일들을 동적으로 로드
            const cards = await this.getCardImages(deckType);
            this.displayCards(cards);
        } catch (error) {
            console.error('카드 로딩 오류:', error);
            cardContainer.innerHTML = '<div style="text-align: center; color: white;">카드 로딩에 실패했습니다.</div>';
        }
    }

    async getCardImages(deckType) {
        const cards = [];
        const folderMap = {
            fire: 'img_fire',
            water: 'img_water',
            leaf: 'img_leaf'
        };

        const folder = folderMap[deckType];
        
        // 1부터 20까지의 카드 번호 (card.png 제외)
        for (let i = 1; i <= 20; i++) {
            const cardPath = `img/${folder}/card-${i}.png`;
            cards.push({
                id: i,
                path: cardPath,
                name: `카드 ${i}`
            });
        }

        // 카드를 랜덤하게 섞기
        return this.shuffleArray(cards);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayCards(cards) {
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = '';

        cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            cardContainer.appendChild(cardElement);
        });

        // 자동으로 랜덤하게 5장 선택
        this.autoSelectRandomCards(cards);
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.cardId = card.id;
        cardDiv.dataset.cardPath = card.path;

        const img = document.createElement('img');
        img.src = card.path;
        img.alt = card.name;
        img.onerror = () => {
            // 이미지 로드 실패 시 기본 카드 이미지 표시
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNBUkQge2NhcmQuaWR9PC90ZXh0Pjwvc3ZnPg==';
        };

        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = '<div class="check-icon">✓</div>';

        cardDiv.appendChild(img);
        cardDiv.appendChild(overlay);

        cardDiv.addEventListener('click', () => {
            this.toggleCardSelection(cardDiv, card);
        });

        return cardDiv;
    }

    toggleCardSelection(cardElement, card) {
        const isSelected = cardElement.classList.contains('selected');
        
        if (isSelected) {
            // 카드 선택 해제
            this.removeCardFromSelection(card);
            cardElement.classList.remove('selected');
        } else {
            // 카드 선택
            if (this.selectedCards.length >= this.maxCards) {
                alert('최대 5장까지만 선택할 수 있습니다.');
                return;
            }
            this.addCardToSelection(card);
            cardElement.classList.add('selected');
        }

        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
    }

    useCard(index) {
        // 선택된 카드 사용 (제거)
        this.selectedCards.splice(index, 1);
        
        // 모든 카드의 선택 상태 초기화
        document.querySelectorAll('.card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 선택된 카드들 다시 표시
        this.selectedCards.forEach(card => {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
                cardElement.classList.add('selected');
            }
        });
        
        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
    }

    addCardToSelection(card) {
        if (!this.selectedCards.find(c => c.id === card.id)) {
            this.selectedCards.push(card);
        }
    }

    removeCardFromSelection(card) {
        this.selectedCards = this.selectedCards.filter(c => c.id !== card.id);
    }

    updateSelectedCount() {
        document.getElementById('selected-count').textContent = this.selectedCards.length;
    }

    updateSelectedCardsDisplay() {
        const container = document.getElementById('selected-cards-container');
        const slots = container.querySelectorAll('.selected-card-slot');

        slots.forEach((slot, index) => {
            if (index < this.selectedCards.length) {
                const card = this.selectedCards[index];
                slot.classList.add('filled');
                slot.innerHTML = `<img src="${card.path}" alt="${card.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNBUkQge2NhcmQuaWR9PC90ZXh0Pjwvc3ZnPg=='">`;
                
                // 사용하기 클릭 이벤트 추가
                slot.onclick = () => {
                    this.useCard(index);
                };
            } else {
                slot.classList.remove('filled');
                slot.innerHTML = `${index + 1}`;
                slot.onclick = null;
            }
        });
    }

    createSelectedCardSlots() {
        const container = document.getElementById('selected-cards-container');
        container.innerHTML = '';

        for (let i = 0; i < this.maxCards; i++) {
            const slot = document.createElement('div');
            slot.className = 'selected-card-slot';
            slot.textContent = i + 1;
            container.appendChild(slot);
        }
    }

    showCardSelection() {
        document.getElementById('deck-selection').classList.remove('active');
        document.getElementById('card-selection').classList.add('active');
        
        document.getElementById('selected-deck-name').textContent = this.deckNames[this.selectedDeck];
        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
    }

    goBackToDeckSelection() {
        document.getElementById('card-selection').classList.remove('active');
        document.getElementById('deck-selection').classList.add('active');
        
        this.selectedDeck = null;
        this.selectedCards = [];
        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
    }

    resetSelection() {
        this.selectedCards = [];
        
        // 선택된 카드들의 시각적 표시 제거
        document.querySelectorAll('.card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
        
        // 다시 랜덤하게 5장 선택
        this.loadCards(this.selectedDeck);
    }

    autoSelectRandomCards(cards) {
        // 수동 모드가 아닐 때만 자동 선택
        if (this.isManualMode) return;
        
        // 랜덤하게 5장 선택
        const shuffledCards = this.shuffleArray([...cards]);
        const selectedCards = shuffledCards.slice(0, this.maxCards);
        
        // 선택된 카드들을 배열에 추가
        this.selectedCards = selectedCards;
        
        // 선택된 카드들에 시각적 표시 추가
        selectedCards.forEach(card => {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
                cardElement.classList.add('selected');
            }
        });
        
        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
    }

    toggleManualMode() {
        this.isManualMode = !this.isManualMode;
        const manualBtn = document.getElementById('manual-fill-btn');
        
        if (this.isManualMode) {
            // 수동 모드 활성화
            manualBtn.classList.add('active');
            manualBtn.textContent = '자동 선택';
            
            // 선택된 카드들 모두 제거
            this.selectedCards = [];
            document.querySelectorAll('.card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            
            // 모든 카드를 선택 가능하게 표시
            document.querySelectorAll('.card').forEach(card => {
                card.classList.add('selectable');
            });
        } else {
            // 자동 모드로 전환
            manualBtn.classList.remove('active');
            manualBtn.textContent = '내가 채우기';
            
            // 선택 가능 표시 제거
            document.querySelectorAll('.card.selectable').forEach(card => {
                card.classList.remove('selectable');
            });
            
            // 자동으로 랜덤 선택
            this.loadCards(this.selectedDeck);
        }
        
        this.updateSelectedCount();
        this.updateSelectedCardsDisplay();
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CardGame();
}); 