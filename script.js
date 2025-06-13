let walletAddress = null;

window.onload = function () {
    // 1. Рендерим виджет TON Connect (кнопка авторизации)
    const tonConnectScript = document.createElement('script');
    tonConnectScript.src = "https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js";
    tonConnectScript.onload = () => {
        const tonConnectUI = new window.TonConnectUI.TonConnectUI({
            manifestUrl: 'https://mrcartonix.github.io/chfhf/tonconnect-manifest.json'
        });
        tonConnectUI.renderWalletConnectionButton(document.getElementById('ton-connect'));

        tonConnectUI.onStatusChange(wallet => {
            if (wallet && wallet.account) {
                walletAddress = wallet.account.address;
                document.getElementById('wallet-address').textContent = 'Адрес: ' + walletAddress;
            } else {
                walletAddress = null;
                document.getElementById('wallet-address').textContent = '';
            }
        });
    };
    document.head.appendChild(tonConnectScript);

    // Marketplace
    if (window.pageType === "market") {
        renderPacks();
    }

    // Создать объявление
    if (window.pageType === "create") {
        const packForm = document.getElementById("pack-form");
        packForm.onsubmit = function (e) {
            e.preventDefault();
            const data = new FormData(packForm);
            const file = data.get('sticker');
            const reader = new FileReader();
            reader.onload = function () {
                const pack = {
                    name: data.get('packName'),
                    tgLink: data.get('tgLink'),
                    supply: data.get('supply'),
                    price: data.get('price'),
                    imgUrl: reader.result,
                };
                let packs = JSON.parse(localStorage.getItem("packs") || "[]");
                packs.push(pack);
                localStorage.setItem("packs", JSON.stringify(packs));
                packForm.reset();
                alert('Объявление добавлено!');
            };
            reader.readAsDataURL(file);
        };
    }
};

function renderPacks() {
    let packs = JSON.parse(localStorage.getItem("packs") || "[]");
    const packsList = document.getElementById("packs-list");
    if (!packsList) return;
    packsList.innerHTML = '';
    if (packs.length === 0) {
        packsList.innerHTML = '<div>Нет объявлений.</div>';
        return;
    }
    packs.forEach((pack, i) => {
        const card = document.createElement('div');
        card.className = 'pack-card';
        card.innerHTML = `
            <img src="${pack.imgUrl}" alt="">
            <div class="pack-info">
                <div class="pack-title">${pack.name} (${pack.supply} NFT)</div>
                <a class="pack-link" href="${pack.tgLink}" target="_blank">Telegram pack</a>
                <div>Цена: <b>${pack.price} TON</b></div>
            </div>
            <div class="pack-actions">
                <button onclick="buyPack(${i})">Купить</button>
            </div>
        `;
        packsList.appendChild(card);
    });
}

window.buyPack = function (i) {
    if (!walletAddress) {
        alert('Сначала подключите TON кошелек!');
        return;
    }
    let packs = JSON.parse(localStorage.getItem("packs") || "[]");
    const pack = packs[i];
    alert(`Покупка пака ${pack.name} за ${pack.price} TON (здесь будет mint NFT через контракт).`);
    // Здесь интеграция с TON смарт-контрактом
};
