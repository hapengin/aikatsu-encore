// =====================================================
// アイカツ！アンコール カード管理
// =====================================================

const STORAGE_KEY = "aikatsuEncoreData";

let savedData =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};


// =====================================================
// フィルター状態
// =====================================================

let currentStatus = "all";
let currentType = "all";
let currentCategory = "all";
let currentBrand = "all";
let currentRarity = "all";


// =====================================================
// カードデータ初期化
// =====================================================

cards.forEach(card => {

    if (!savedData[card.id]) {

        savedData[card.id] = {
            quantity: 0,
            wish: false
        };

    }

});

saveData();


// =====================================================
// 保存
// =====================================================

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedData)
    );

}


// =====================================================
// フィルター作成
// =====================================================

function createFilterButtons(
    containerId,
    values,
    currentValue,
    callback
) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    values.forEach(item => {

        const button =
            document.createElement("button");

        button.className = "filter-btn";

        button.textContent = item.label;

        if (item.value === currentValue) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {

            callback(item.value);

        });

        container.appendChild(button);

    });

}


// =====================================================
// 状態フィルター
// =====================================================

function updateStatusFilter() {

    createFilterButtons(
        "status-filter",

        [
            {
                label: "すべて",
                value: "all"
            },
            {
                label: "♥ 所持",
                value: "owned"
            },
            {
                label: "♡ 未所持",
                value: "unowned"
            },
            {
                label: "☆ 欲しい",
                value: "wish"
            }
        ],

        currentStatus,

        value => {

            currentStatus = value;

            updateAllFilters();

            displayCards();

        }
    );

}


// =====================================================
// タイプ
// =====================================================

function updateTypeFilter() {

    const types =
        [...new Set(
            cards.map(card => card.type)
        )];

    createFilterButtons(

        "type-filter",

        [
            {
                label: "すべて",
                value: "all"
            },

            ...types.map(type => ({
                label: type,
                value: type
            }))
        ],

        currentType,

        value => {

            currentType = value;

            updateAllFilters();

            displayCards();

        }

    );

}


// =====================================================
// カテゴリ
// =====================================================

function updateCategoryFilter() {

    const categories =
        [...new Set(
            cards.map(card => card.category)
        )];

    createFilterButtons(

        "category-filter",

        [
            {
                label: "すべて",
                value: "all"
            },

            ...categories.map(category => ({
                label: category,
                value: category
            }))
        ],

        currentCategory,

        value => {

            currentCategory = value;

            updateAllFilters();

            displayCards();

        }

    );

}


// =====================================================
// ブランド
// =====================================================

function updateBrandFilter() {

    const brands =
        [...new Set(
            cards.map(card => card.brand)
        )];

    createFilterButtons(

        "brand-filter",

        [
            {
                label: "すべて",
                value: "all"
            },

            ...brands.map(brand => ({
                label: brand,
                value: brand
            }))
        ],

        currentBrand,

        value => {

            currentBrand = value;

            updateAllFilters();

            displayCards();

        }

    );

}


// =====================================================
// レアリティ
// =====================================================

function updateRarityFilter() {

    const rarities =
        [...new Set(
            cards.map(card => card.rarity)
        )];

    createFilterButtons(

        "rarity-filter",

        [
            {
                label: "すべて",
                value: "all"
            },

            ...rarities.map(rarity => ({
                label: rarity,
                value: rarity
            }))
        ],

        currentRarity,

        value => {

            currentRarity = value;

            updateAllFilters();

            displayCards();

        }

    );

}


// =====================================================
// フィルター全部更新
// =====================================================

function updateAllFilters() {

    updateStatusFilter();
    updateTypeFilter();
    updateCategoryFilter();
    updateBrandFilter();
    updateRarityFilter();

}


// =====================================================
// カード表示
// =====================================================

function displayCards() {

    const container =
        document.getElementById("card-list");

    container.innerHTML = "";


    const filteredCards =
        cards.filter(card => {

            const data =
                savedData[card.id];


            // 状態

            if (
                currentStatus === "owned" &&
                data.quantity <= 0
            ) {
                return false;
            }

            if (
                currentStatus === "unowned" &&
                data.quantity > 0
            ) {
                return false;
            }

            if (
                currentStatus === "wish" &&
                !data.wish
            ) {
                return false;
            }


            // タイプ

            if (
                currentType !== "all" &&
                card.type !== currentType
            ) {
                return false;
            }


            // カテゴリ

            if (
                currentCategory !== "all" &&
                card.category !== currentCategory
            ) {
                return false;
            }


            // ブランド

            if (
                currentBrand !== "all" &&
                card.brand !== currentBrand
            ) {
                return false;
            }


            // レアリティ

            if (
                currentRarity !== "all" &&
                card.rarity !== currentRarity
            ) {
                return false;
            }


            return true;

        });


    // 該当なし

    if (filteredCards.length === 0) {

        container.innerHTML = `
            <div class="empty">
                ✧ 条件に合うカードがないよ ✧
            </div>
        `;

        updateCollectionCount();

        return;

    }


    // カード作成

    filteredCards.forEach(card => {

        const data =
            savedData[card.id];

        const cardElement =
            document.createElement("div");


        // 基本クラス

        cardElement.className = "card";


        // レアリティクラス

        cardElement.classList.add(
            `rarity-${card.rarity.toLowerCase()}`
        );


        // 所持状態

        if (data.quantity > 0) {

            cardElement.classList.add("owned");

        }


        // 所持バッジ

        const ownedBadge =
            data.quantity > 0
                ? `<div class="owned-badge">♥ 所持</div>`
                : "";


        // 画像パス

        const imagePath =
            `images/${card.id}_${card.rarity}.webp`;


        cardElement.innerHTML = `

            ${ownedBadge}

            <img
                class="card-image"
                src="${imagePath}"
                alt="${card.name}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >

            <div
                class="no-image"
                style="display:none;"
            >
                ✧ 画像なし ✧
            </div>


            <div class="card-id">
                ${card.id}
            </div>


            <div class="card-name">
                ${card.name}
            </div>


            <div class="quantity-area">

                <button
                    class="quantity-btn minus"
                >
                    −
                </button>

                <span class="quantity">
                    ${data.quantity}
                </span>

                <button
                    class="quantity-btn plus"
                >
                    ＋
                </button>

            </div>


            <button
                class="wish-btn ${data.wish ? "wished" : ""}"
            >
                ${data.wish ? "★ 欲しい" : "☆ 欲しい"}
            </button>

        `;


        // =================================================
        // 数量 −
        // =================================================

        cardElement
            .querySelector(".minus")
            .addEventListener("click", event => {

                event.stopPropagation();

                if (data.quantity > 0) {

                    data.quantity--;

                    saveData();

                    displayCards();

                }

            });


        // =================================================
        // 数量 ＋
        // =================================================

        cardElement
            .querySelector(".plus")
            .addEventListener("click", event => {

                event.stopPropagation();

                data.quantity++;

                saveData();

                displayCards();

            });


        // =================================================
        // 欲しい
        // =================================================

        cardElement
            .querySelector(".wish-btn")
            .addEventListener("click", event => {

                event.stopPropagation();

                data.wish = !data.wish;

                saveData();

                displayCards();

            });


        // =================================================
        // 画像クリック
        // =================================================

        cardElement
            .querySelector(".card-image")
            .addEventListener("click", () => {

                showCardDetails(card);

            });


        container.appendChild(cardElement);

    });


    updateCollectionCount();

}


// =====================================================
// 所持枚数
// =====================================================

function updateCollectionCount() {

    let ownedCount = 0;
    let totalQuantity = 0;


    cards.forEach(card => {

        const data =
            savedData[card.id];

        if (data.quantity > 0) {

            ownedCount++;

        }

        totalQuantity +=
            data.quantity;

    });


    document.getElementById(
        "collection-count"
    ).textContent =

        `所持カード：${ownedCount} / ${cards.length} 枚　`
        + `（合計 ${totalQuantity} 枚）`;

}


// =====================================================
// 詳細モーダル
// =====================================================

function showCardDetails(card) {

    const modal =
        document.getElementById("modal");

    const title =
        document.getElementById("modal-title");

    const details =
        document.getElementById("modal-details");


    title.textContent =
        `✦ ${card.name} ✦`;


    details.innerHTML = `

        <div class="detail-row">

            <span class="detail-label">
                カード番号
            </span>

            <span class="detail-value">
                ${card.id}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                タイプ
            </span>

            <span class="detail-value">
                ${card.type}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                カテゴリ
            </span>

            <span class="detail-value">
                ${card.category}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                レアリティ
            </span>

            <span class="detail-value">
                ${card.rarity}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                ブランド
            </span>

            <span class="detail-value">
                ${card.brand}
            </span>

        </div>

    `;


    modal.classList.add("show");

}


// =====================================================
// モーダルを閉じる
// =====================================================

document
    .getElementById("modal-close")
    .addEventListener("click", () => {

        document
            .getElementById("modal")
            .classList.remove("show");

    });


document
    .getElementById("modal")
    .addEventListener("click", event => {

        if (
            event.target.id === "modal"
        ) {

            event.currentTarget
                .classList.remove("show");

        }

    });


// =====================================================
// 初期表示
// =====================================================

updateAllFilters();
displayCards();