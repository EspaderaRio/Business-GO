        // Enhanced game state with all new features
        let gameState = {
            cash: 100,
            level: 1,
            experience: 0,
            prestige: 0,
            prestigePoints: 0,
            currentCity: 'new_york',
            unlockedCities: ['new_york'],
            businesses: {},
            upgrades: {},
            achievements: new Set(),
            skills: {},
            stocks: {},
            loans: [],
            research: {},
            dailyProgress: {},
            statistics: {
                totalEarned: 0,
                businessesBought: 0,
                stockTrades: 0,
                prestigeCount: 0,
                citiesUnlocked: 1
            },
            settings: {
                theme: 'dark',
                soundEnabled: true,
                notifications: true
            },
            lastDailyReset: new Date().toDateString()
        };

        let currentRecordCount = 0;
        let isLoading = false;
        let currentEvent = null;
        let stockPrices = {};

        // City system with unique characteristics
        const cities = {
            new_york: {
                name: 'New York',
                icon: '🗽',
                unlockCost: 0,
                unlockLevel: 1,
                description: 'The Big Apple - Financial capital',
                bonuses: { finance: 1.2, tech: 1.1 },
                specialBusinesses: ['bank', 'tech'],
                marketMultiplier: 1.0,
                population: 8400000
            },
            los_angeles: {
                name: 'Los Angeles',
                icon: '🌴',
                unlockCost: 100000,
                unlockLevel: 10,
                description: 'City of Angels - Entertainment hub',
                bonuses: { entertainment: 1.5, media: 1.3 },
                specialBusinesses: ['arcade', 'restaurant'],
                marketMultiplier: 1.1,
                population: 4000000
            },
            london: {
                name: 'London',
                icon: '🇬🇧',
                unlockCost: 500000,
                unlockLevel: 15,
                description: 'Historic financial center',
                bonuses: { finance: 1.4, hospitality: 1.2 },
                specialBusinesses: ['bank', 'hotel'],
                marketMultiplier: 1.2,
                population: 9000000
            },
            tokyo: {
                name: 'Tokyo',
                icon: '🗾',
                unlockCost: 1000000,
                unlockLevel: 20,
                description: 'Technology and innovation capital',
                bonuses: { technology: 1.6, transport: 1.3 },
                specialBusinesses: ['tech', 'airline'],
                marketMultiplier: 1.3,
                population: 14000000
            },
            dubai: {
                name: 'Dubai',
                icon: '🏜️',
                unlockCost: 2500000,
                unlockLevel: 25,
                description: 'Luxury and business paradise',
                bonuses: { hospitality: 1.8, transport: 1.4 },
                specialBusinesses: ['hotel', 'airline'],
                marketMultiplier: 1.4,
                population: 3500000
            },
            singapore: {
                name: 'Singapore',
                icon: '🏙️',
                unlockCost: 5000000,
                unlockLevel: 30,
                description: 'Global business hub',
                bonuses: { finance: 1.5, technology: 1.4, transport: 1.3 },
                specialBusinesses: ['bank', 'tech', 'airline'],
                marketMultiplier: 1.5,
                population: 6000000
            }
        };

        // Enhanced business types with upgrade paths
        const businessTypes = [
            { id: 'lemonade', name: 'Lemonade Stand', icon: '🍋', basePrice: 50, baseIncome: 1, multiplier: 1.15, category: 'food' },
            { id: 'newspaper', name: 'Newspaper Route', icon: '📰', basePrice: 200, baseIncome: 4, multiplier: 1.18, category: 'media' },
            { id: 'carwash', name: 'Car Wash', icon: '🚗', basePrice: 800, baseIncome: 15, multiplier: 1.20, category: 'service' },
            { id: 'pizza', name: 'Pizza Shop', icon: '🍕', basePrice: 3200, baseIncome: 60, multiplier: 1.22, category: 'food' },
            { id: 'arcade', name: 'Arcade', icon: '🕹️', basePrice: 12800, baseIncome: 240, multiplier: 1.25, category: 'entertainment' },
            { id: 'gym', name: 'Fitness Gym', icon: '💪', basePrice: 51200, baseIncome: 960, multiplier: 1.28, category: 'health' },
            { id: 'restaurant', name: 'Restaurant', icon: '🍽️', basePrice: 204800, baseIncome: 3840, multiplier: 1.30, category: 'food' },
            { id: 'hotel', name: 'Luxury Hotel', icon: '🏨', basePrice: 819200, baseIncome: 15360, multiplier: 1.32, category: 'hospitality' },
            { id: 'bank', name: 'Investment Bank', icon: '🏦', basePrice: 3276800, baseIncome: 61440, multiplier: 1.35, category: 'finance' },
            { id: 'tech', name: 'Tech Startup', icon: '💻', basePrice: 13107200, baseIncome: 245760, multiplier: 1.38, category: 'technology' },
            { id: 'airline', name: 'Airline Company', icon: '✈️', basePrice: 52428800, baseIncome: 983040, multiplier: 1.40, category: 'transport' },
            { id: 'space', name: 'Space Tourism', icon: '🚀', basePrice: 209715200, baseIncome: 3932160, multiplier: 1.45, category: 'technology' }
        ];

        // Business upgrades
        const upgradeTypes = [
            { id: 'efficiency', name: 'Efficiency Boost', description: '+50% income for all businesses', price: 10000, effect: 1.5 },
            { id: 'automation', name: 'Automation', description: '+25% income, -10% costs', price: 50000, effect: 1.25 },
            { id: 'marketing', name: 'Marketing Campaign', description: '+100% income for 10 minutes', price: 25000, duration: 600 },
            { id: 'research', name: 'R&D Investment', description: 'Unlock new business types', price: 100000 },
            { id: 'synergy', name: 'Business Synergy', description: '+10% per business type owned', price: 200000 }
        ];

        // Stock market data
        const stockTypes = [
            { id: 'tech_corp', name: 'TechCorp', basePrice: 100, volatility: 0.15 },
            { id: 'food_inc', name: 'Food Inc', basePrice: 50, volatility: 0.10 },
            { id: 'energy_co', name: 'Energy Co', basePrice: 200, volatility: 0.20 },
            { id: 'health_sys', name: 'Health Systems', basePrice: 150, volatility: 0.12 },
            { id: 'transport', name: 'Transport Ltd', basePrice: 80, volatility: 0.18 }
        ];

        // Enhanced achievements
        const achievements = [
            { id: 'first_business', name: 'First Steps', description: 'Buy your first business', icon: '🎯', condition: () => gameState.statistics.businessesBought >= 1 },
            { id: 'millionaire', name: 'Millionaire', description: 'Earn $1,000,000', icon: '💎', condition: () => gameState.statistics.totalEarned >= 1000000 },
            { id: 'business_mogul', name: 'Business Mogul', description: 'Own 5 different businesses', icon: '👑', condition: () => Object.keys(gameState.businesses).length >= 5 },
            { id: 'level_10', name: 'Experienced', description: 'Reach level 10', icon: '⭐', condition: () => gameState.level >= 10 },
            { id: 'pizza_empire', name: 'Pizza Empire', description: 'Own 10 Pizza Shops', icon: '🍕', condition: () => (gameState.businesses.pizza || 0) >= 10 },
            { id: 'tech_giant', name: 'Tech Giant', description: 'Own a Tech Startup', icon: '💻', condition: () => (gameState.businesses.tech || 0) >= 1 },
            { id: 'space_pioneer', name: 'Space Pioneer', description: 'Launch Space Tourism', icon: '🚀', condition: () => (gameState.businesses.space || 0) >= 1 },
            { id: 'stock_trader', name: 'Stock Trader', description: 'Make 10 stock trades', icon: '📈', condition: () => gameState.statistics.stockTrades >= 10 },
            { id: 'prestige_master', name: 'Prestige Master', description: 'Prestige for the first time', icon: '✨', condition: () => gameState.statistics.prestigeCount >= 1 },
            { id: 'skill_master', name: 'Skill Master', description: 'Unlock 5 skills', icon: '🎓', condition: () => Object.keys(gameState.skills).length >= 5 },
            { id: 'world_traveler', name: 'World Traveler', description: 'Unlock 3 cities', icon: '🌍', condition: () => gameState.statistics.citiesUnlocked >= 3 },
            { id: 'global_empire', name: 'Global Empire', description: 'Unlock all cities', icon: '🌐', condition: () => gameState.statistics.citiesUnlocked >= Object.keys(cities).length }
        ];

        // Skill tree
        const skillCategories = {
            business: {
                name: 'Business Management',
                skills: [
                    { id: 'negotiation', name: 'Negotiation', description: '-10% business costs', cost: 5, effect: 0.9 },
                    { id: 'leadership', name: 'Leadership', description: '+20% income', cost: 10, effect: 1.2 },
                    { id: 'expansion', name: 'Expansion', description: 'Unlock new markets', cost: 15 },
                    { id: 'optimization', name: 'Optimization', description: '+50% efficiency', cost: 20, effect: 1.5 }
                ]
            },
            finance: {
                name: 'Financial Expertise',
                skills: [
                    { id: 'investing', name: 'Smart Investing', description: '+25% stock returns', cost: 8, effect: 1.25 },
                    { id: 'banking', name: 'Banking Relations', description: 'Better loan terms', cost: 12 },
                    { id: 'accounting', name: 'Accounting', description: '+10% all income', cost: 18, effect: 1.1 },
                    { id: 'economics', name: 'Economics', description: 'Predict market trends', cost: 25 }
                ]
            },
            technology: {
                name: 'Technology Innovation',
                skills: [
                    { id: 'automation_skill', name: 'Automation', description: 'Passive income boost', cost: 15, effect: 1.3 },
                    { id: 'ai_integration', name: 'AI Integration', description: 'Smart business decisions', cost: 30 },
                    { id: 'data_analysis', name: 'Data Analysis', description: 'Better predictions', cost: 20 },
                    { id: 'innovation', name: 'Innovation', description: 'Unlock future tech', cost: 50 }
                ]
            }
        };

        // Daily challenges
        const dailyChallenges = [
            { id: 'earn_money', name: 'Money Maker', description: 'Earn $10,000', target: 10000, reward: 1000, type: 'earn' },
            { id: 'buy_businesses', name: 'Expansion', description: 'Buy 5 businesses', target: 5, reward: 2000, type: 'buy_businesses' },
            { id: 'stock_trades', name: 'Trader', description: 'Make 3 stock trades', target: 3, reward: 1500, type: 'trade' },
            { id: 'level_up', name: 'Growth', description: 'Gain 1 level', target: 1, reward: 3000, type: 'level' }
        ];

        // Random events
        const randomEvents = [
            { id: 'market_boom', name: 'Market Boom!', description: 'All income +100% for 5 minutes', effect: 2.0, duration: 300 },
            { id: 'tax_break', name: 'Tax Break', description: 'All purchases -25% for 10 minutes', effect: 0.75, duration: 600 },
            { id: 'investor_meeting', name: 'Investor Meeting', description: 'Gain instant $50,000', effect: 50000, instant: true },
            { id: 'market_crash', name: 'Market Crash', description: 'All income -50% for 3 minutes', effect: 0.5, duration: 180 },
            { id: 'innovation_grant', name: 'Innovation Grant', description: 'Free business upgrade', effect: 'upgrade', instant: true }
        ];

   
// ---------- Utility helpers ----------
function formatNumber(num) {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

function getCurrencySymbol() {
  return (window.elementSdk && window.elementSdk.config && window.elementSdk.config.currency_symbol) || "$";
}

function showNotification(message, type = 'success') {
  // Basic notification logic; if element missing, fallback to console
  const notification = document.getElementById('notification');
  if (notification) {
    if (String(message).includes('<')) notification.innerHTML = message;
    else notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 4000);
  } else {
    console.log("[NOTIF]", message);
  }
}

// ---------- Data handler called by dataSdk ----------
const dataHandler = {
  onDataChanged(data) {
    try {
      if (!data || data.length === 0) {
        currentSaveRecord = null;
        currentRecordCount = 0;
        return;
      }

      const savedData = data[0];
      currentSaveRecord = savedData;
      currentRecordCount = data.length;

      // Merge saved data into gameState safely
      gameState.cash = savedData.cash ?? gameState.cash;
      gameState.level = savedData.level ?? gameState.level;
      gameState.experience = savedData.experience ?? gameState.experience;
      gameState.prestige = savedData.prestige ?? gameState.prestige;
      gameState.prestigePoints = savedData.prestigePoints ?? gameState.prestigePoints;
      gameState.currentCity = savedData.currentCity || gameState.currentCity;

      try {
        gameState.unlockedCities = savedData.unlockedCities ? JSON.parse(savedData.unlockedCities) : gameState.unlockedCities;
      } catch (e) { console.warn("unlockedCities parse failed", e); }

      try { gameState.businesses = savedData.businesses ? JSON.parse(savedData.businesses) : gameState.businesses; } catch (e) { console.warn("businesses parse failed", e); }
      try { gameState.upgrades = savedData.upgrades ? JSON.parse(savedData.upgrades) : gameState.upgrades; } catch (e) { console.warn("upgrades parse failed", e); }
      try { gameState.achievements = new Set(savedData.achievements ? JSON.parse(savedData.achievements) : [...gameState.achievements]); } catch (e) { console.warn("achievements parse failed", e); }
      try { gameState.skills = savedData.skills ? JSON.parse(savedData.skills) : gameState.skills; } catch (e) { console.warn("skills parse failed", e); }
      try { gameState.stocks = savedData.stocks ? JSON.parse(savedData.stocks) : gameState.stocks; } catch (e) { console.warn("stocks parse failed", e); }
      try { gameState.loans = savedData.loans ? JSON.parse(savedData.loans) : gameState.loans; } catch (e) { console.warn("loans parse failed", e); }
      try { gameState.research = savedData.research ? JSON.parse(savedData.research) : gameState.research; } catch (e) { console.warn("research parse failed", e); }
      try { gameState.dailyProgress = savedData.dailyProgress ? JSON.parse(savedData.dailyProgress) : gameState.dailyProgress; } catch (e) { console.warn("dailyProgress parse failed", e); }
      try { gameState.statistics = savedData.statistics ? JSON.parse(savedData.statistics) : gameState.statistics; } catch (e) { console.warn("statistics parse failed", e); }
      try { gameState.settings = savedData.settings ? JSON.parse(savedData.settings) : gameState.settings; } catch (e) { console.warn("settings parse failed", e); }

      // lastDailyReset check
      const lastReset = savedData.lastDailyReset || gameState.lastDailyReset;
      if (lastReset !== new Date().toDateString()) resetDailyChallenges();

      // offline earnings calculation (safe)
      if (savedData.lastSaveTime) {
        const offlineSeconds = Math.min((Date.now() - new Date(savedData.lastSaveTime).getTime()) / 1000, 3600);
        if (offlineSeconds > 60) {
          const offlineEarnings = Math.floor(calculateTotalIncome() * offlineSeconds);
          if (offlineEarnings > 0) {
            gameState.cash += offlineEarnings;
            showNotification(`Welcome back! You earned ${getCurrencySymbol()}${formatNumber(offlineEarnings)} while away!`);
          }
        }
      }

      updateDisplay();
      renderAllContent();
      applyTheme();

    } catch (err) {
      console.error("onDataChanged ERROR:", err);
    }
  }
};

// ---------- Element SDK defaults & hook ----------
const defaultConfig = {
  game_title: "Business Empire Mobile",
  currency_symbol: "$",
  company_name: "Your Empire Inc.",
  theme: 'dark'
};

async function onConfigChange(config) {
  try {
    const title = config.game_title || defaultConfig.game_title;
    const el = document.getElementById('gameTitle');
    if (el) el.textContent = title;
    document.title = title;

    // copy config to elementSdk.config for game access safety
    if (window.elementSdk) window.elementSdk.config = config;

    updateDisplay();
  } catch (e) {
    console.error("onConfigChange error:", e);
  }
}

function mapToCapabilities(config) {
  return {
    recolorables: [],
    borderables: [],
    fontEditable: undefined,
    fontSizeable: undefined
  };
}

function mapToEditPanelValues(config) {
  return new Map([
    ["game_title", config.game_title || defaultConfig.game_title],
    ["currency_symbol", config.currency_symbol || defaultConfig.currency_symbol],
    ["company_name", config.company_name || defaultConfig.company_name]
  ]);
}

// ---------- Initialization ----------
async function initializeGame() {
  try {
    if (window.elementSdk && typeof window.elementSdk.init === 'function') {
      await window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
      });
    }

    if (window.dataSdk && typeof window.dataSdk.init === 'function') {
      const initResult = await window.dataSdk.init(dataHandler);
      if (!initResult || !initResult.isOk) {
        console.error("Failed to initialize data SDK");
      }
    }
  } catch (error) {
    console.error("Failed to initialize SDKs:", error);
  }

  initializeStockPrices();
  startGameLoops();
  renderAllContent();
  updateDisplay();
}

// ---------- Pricing & Income ----------
function calculateBusinessPrice(business, owned) {
  if (!business) return Infinity; // defensive
  const basePrice = business.basePrice * Math.pow(business.multiplier || 1, owned || 0);
  const skillDiscount = gameState.skills && gameState.skills.negotiation ? 0.9 : 1.0;
  const eventMultiplier = currentEvent && currentEvent.id === 'tax_break' ? currentEvent.effect : 1.0;
  const price = Math.floor(basePrice * skillDiscount * eventMultiplier);
  return isNaN(price) ? Infinity : price;
}

function calculateBusinessIncome(business, owned) {
  if (!business) return 0;
  let income = business.baseIncome * (owned || 0);
  const currentCityData = cities[gameState.currentCity];
  if (currentCityData && currentCityData.bonuses && currentCityData.bonuses[business.category]) {
    income *= currentCityData.bonuses[business.category];
  }
  if (currentCityData) income *= currentCityData.marketMultiplier || 1;
  if (gameState.skills.leadership) income *= 1.2;
  if (gameState.skills.accounting) income *= 1.1;
  if (gameState.skills.optimization) income *= 1.5;
  if (gameState.upgrades.efficiency) income *= 1.5;
  if (gameState.upgrades.automation) income *= 1.25;
  income *= (1 + (gameState.prestigePoints || 0) * 0.1);
  if (currentEvent && (currentEvent.id === 'market_boom' || currentEvent.id === 'market_crash')) income *= currentEvent.effect;
  return income || 0;
}

function calculateTotalIncome() {
  return businessTypes.reduce((total, b) => {
    const owned = gameState.businesses[b.id] || 0;
    return total + calculateBusinessIncome(b, owned);
  }, 0);
}

// ---------- City ops ----------
async function unlockCity(cityId) {
  if (isLoading) return;
  const city = cities[cityId];
  if (!city || gameState.unlockedCities.includes(cityId)) return;
  if (gameState.cash >= city.unlockCost && gameState.level >= city.unlockLevel) {
    isLoading = true;
    try {
      gameState.cash -= city.unlockCost;
      gameState.unlockedCities.push(cityId);
      gameState.statistics.citiesUnlocked++;
      updateDisplay();
      renderAllContent();
      await autoSave();
      showNotification(`🌍 ${city.name} unlocked! New business opportunities await!`);
      playSound('achievement');
    } catch (e) {
      console.error("unlockCity error:", e);
    } finally {
      isLoading = false;
    }
  }
}

async function switchCity(cityId) {
  if (isLoading || !gameState.unlockedCities.includes(cityId)) return;
  gameState.currentCity = cityId;
  updateDisplay();
  renderAllContent();
  updateCityInfo();
  await autoSave();
  const city = cities[cityId];
  showNotification(`✈️ Moved to ${city.name}! ${city.description}`);
  playSound('click');
}

function updateCityInfo() {
  const city = cities[gameState.currentCity] || {};
  const nameEl = document.getElementById('currentCityName');
  const descEl = document.getElementById('currentCityDesc');
  if (nameEl) nameEl.textContent = `${city.icon || ''} ${city.name || 'Unknown'}`;
  if (descEl) descEl.textContent = city.description || '';
}

// ---------- Business operations (FIXED buyBusiness) ----------
async function buyBusiness(businessId) {
  console.log("buyBusiness called:", businessId, "isLoading:", isLoading);
  if (isLoading) return;

  const business = businessTypes.find(b => b.id === businessId);
  if (!business) {
    console.error("ERROR: businessId not found:", businessId);
    return;
  }

  const owned = gameState.businesses[businessId] || 0;
  const price = calculateBusinessPrice(business, owned);

  if (isNaN(price) || !isFinite(price)) {
    console.error("ERROR: calculateBusinessPrice returned invalid value for:", businessId, price);
    return;
  }

  if (gameState.cash < price) {
    console.log("Not enough cash to buy:", business.name, "need", price, "have", gameState.cash);
    return;
  }

  isLoading = true;
  try {
    gameState.cash -= price;
    gameState.businesses[businessId] = owned + 1;
    gameState.statistics.businessesBought++;
    gameState.statistics.totalEarned += price;

    const expGain = Math.floor(price / 100);
    gameState.experience += expGain;
    const newLevel = Math.floor(gameState.experience / 1000) + 1;
    if (newLevel > gameState.level) {
      gameState.level = newLevel;
      showNotification(`🎉 Level Up! You are now level ${gameState.level}!`);
      playSound('levelup');
    }

    updateDailyProgress('buy_businesses', 1);
    updateDisplay();
    renderAllContent();
    checkAchievements();

    await autoSave();

    showNotification(`🎉 Bought ${business.name} for ${getCurrencySymbol()}${formatNumber(price)}! +${getCurrencySymbol()}${formatNumber(business.baseIncome)}/sec`);
    playSound('purchase');

  } catch (err) {
    console.error("buyBusiness ERROR:", err);
  } finally {
    isLoading = false;
  }
}

// ---------- Upgrades ----------
async function buyUpgrade(upgradeId) {
  if (isLoading) return;
  const upgrade = upgradeTypes.find(u => u.id === upgradeId);
  if (!upgrade) return;
  if (gameState.upgrades[upgradeId] || gameState.cash < upgrade.price) return;
  isLoading = true;
  try {
    gameState.cash -= upgrade.price;
    gameState.upgrades[upgradeId] = true;
    if (upgrade.duration) {
      setTimeout(() => {
        delete gameState.upgrades[upgradeId];
        showNotification(`${upgrade.name} effect has expired!`);
      }, upgrade.duration * 1000);
    }
    updateDisplay();
    renderAllContent();
    await autoSave();
    showNotification(`🚀 Purchased ${upgrade.name}!`);
    playSound('upgrade');
  } catch (e) {
    console.error("buyUpgrade error:", e);
  } finally {
    isLoading = false;
  }
}

// ---------- Stocks ----------
function initializeStockPrices() {
  stockTypes.forEach(stock => {
    stockPrices[stock.id] = {
      current: stock.basePrice || 10,
      previous: stock.basePrice || 10,
      owned: gameState.stocks[stock.id] || 0
    };
  });
}

function updateStockPrices() {
  stockTypes.forEach(stock => {
    const price = stockPrices[stock.id];
    if (!price) {
      stockPrices[stock.id] = { current: stock.basePrice || 10, previous: stock.basePrice || 10 };
    }
    const p = stockPrices[stock.id];
    p.previous = p.current;
    const change = (Math.random() - 0.5) * 2 * (stock.volatility || 0.1);
    p.current = Math.max(1, p.current * (1 + change));
  });
  renderStocks();
}

async function buyStock(stockId, amount = 1) {
  if (isLoading) return;
  const priceObj = stockPrices[stockId];
  if (!priceObj) {
    console.error("buyStock: missing price for", stockId);
    return;
  }
  const cost = priceObj.current * amount;
  if (gameState.cash < cost) return;
  isLoading = true;
  try {
    gameState.cash -= cost;
    gameState.stocks[stockId] = (gameState.stocks[stockId] || 0) + amount;
    gameState.statistics.stockTrades++;
    updateDailyProgress('stock_trades', 1);
    updateDisplay();
    renderStocks();
    await autoSave();
    showNotification(`📈 Bought ${amount} shares!`);
    playSound('purchase');
  } catch (e) {
    console.error("buyStock error:", e);
  } finally {
    isLoading = false;
  }
}

async function sellStock(stockId, amount = 1) {
  if (isLoading) return;
  const owned = gameState.stocks[stockId] || 0;
  if (owned < amount) return;
  isLoading = true;
  try {
    const priceObj = stockPrices[stockId];
    if (!priceObj) { console.error("sellStock: missing price for", stockId); return; }
    const earnings = priceObj.current * amount;
    const bonus = gameState.skills.investing ? 1.25 : 1.0;
    const finalEarnings = earnings * bonus;
    gameState.cash += finalEarnings;
    gameState.stocks[stockId] -= amount;
    gameState.statistics.stockTrades++;
    gameState.statistics.totalEarned += finalEarnings;
    updateDailyProgress('stock_trades', 1);
    updateDisplay();
    renderStocks();
    await autoSave();
    showNotification(`💰 Sold ${amount} shares for ${getCurrencySymbol()}${formatNumber(finalEarnings)}!`);
    playSound('sell');
  } catch (e) {
    console.error("sellStock error:", e);
  } finally {
    isLoading = false;
  }
}

// ---------- Skill system ----------
async function unlockSkill(categoryId, skillId) {
  if (isLoading) return;
  const category = skillCategories[categoryId];
  if (!category) return;
  const skill = category.skills.find(s => s.id === skillId);
  if (!skill || gameState.skills[skillId] || (gameState.prestigePoints || 0) < skill.cost) return;
  isLoading = true;
  try {
    gameState.prestigePoints -= skill.cost;
    gameState.skills[skillId] = true;
    updateDisplay();
    renderAllContent();
    await autoSave();
    showNotification(`🎓 Unlocked ${skill.name}!`);
    playSound('skill');
  } catch (e) {
    console.error("unlockSkill error:", e);
  } finally {
    isLoading = false;
  }
}

// ---------- Prestige ----------
function canPrestige() {
  return gameState.level >= 25 && (gameState.statistics.totalEarned || 0) >= 1000000;
}
function calculatePrestigePoints() {
  return Math.floor(Math.sqrt((gameState.statistics.totalEarned || 0) / 1000000));
}
async function performPrestige() {
  if (!canPrestige()) return;
  const points = calculatePrestigePoints();
  isLoading = true;
  try {
    gameState.cash = 100;
    gameState.level = 1;
    gameState.experience = 0;
    gameState.businesses = {};
    gameState.upgrades = {};
    gameState.stocks = {};
    gameState.statistics.totalEarned = 0;
    gameState.statistics.businessesBought = 0;
    gameState.prestige++;
    gameState.prestigePoints += points;
    gameState.statistics.prestigeCount++;
    updateDisplay();
    renderAllContent();
    await autoSave();
    showNotification(`✨ Prestiged! Gained ${points} prestige points!`);
    playSound('prestige');
    closeModal('prestigeModal');
  } catch (e) {
    console.error("performPrestige error:", e);
  } finally {
    isLoading = false;
  }
}

// ---------- Daily challenges ----------
function resetDailyChallenges() {
  gameState.dailyProgress = {};
  gameState.lastDailyReset = new Date().toDateString();
}
function updateDailyProgress(type, amount) {
  if (!gameState.dailyProgress[type]) gameState.dailyProgress[type] = 0;
  gameState.dailyProgress[type] += amount;
  const challenge = dailyChallenges.find(c => c.type === type);
  if (challenge && gameState.dailyProgress[type] >= challenge.target && !gameState.dailyProgress[type + '_completed']) {
    gameState.dailyProgress[type + '_completed'] = true;
    gameState.cash += challenge.reward;
    showNotification(`🎯 Daily Challenge Complete! +${getCurrencySymbol()}${formatNumber(challenge.reward)}`);
    playSound('achievement');
  }
}

// ---------- Random events ----------
function triggerRandomEvent() {
  if (Math.random() < 0.05) {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    currentEvent = { ...event, endTime: Date.now() + (event.duration || 0) * 1000 };
    if (event.instant) {
      if (event.effect === 'upgrade') {
        const availableUpgrades = upgradeTypes.filter(u => !gameState.upgrades[u.id]);
        if (availableUpgrades.length > 0) {
          const randomUpgrade = availableUpgrades[Math.floor(Math.random() * availableUpgrades.length)];
          gameState.upgrades[randomUpgrade.id] = true;
        }
      } else if (typeof event.effect === 'number') {
        gameState.cash += event.effect;
        gameState.statistics.totalEarned += event.effect;
      }
      currentEvent = null;
    }
    showEventBanner(event);
    showNotification(`🎲 ${event.name}: ${event.description}`);
    playSound('event');
  }
}
function showEventBanner(event) {
  const banner = document.getElementById('eventBanner');
  const title = document.getElementById('eventTitle');
  const description = document.getElementById('eventDescription');
  if (!banner || !title || !description) return;
  title.textContent = event.name;
  description.textContent = event.description;
  banner.style.display = 'block';
  setTimeout(() => banner.style.display = 'none', 10000);
}

// ---------- UI: tabs, display, rendering ----------
// Use event listeners (no inline onclick) to avoid scope issues
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  const content = document.getElementById(tabName);
  if (content) content.classList.add('active');
  playSound('tab');
}

function updateDisplay() {
  const currencySymbol = getCurrencySymbol();
  const cashEl = document.getElementById('cashDisplay');
  const incomeEl = document.getElementById('incomeDisplay');
  const levelEl = document.getElementById('levelDisplay');
  const prestigeEl = document.getElementById('prestigeDisplay');
  if (cashEl) cashEl.textContent = currencySymbol + formatNumber(gameState.cash);
  if (incomeEl) incomeEl.textContent = currencySymbol + formatNumber(calculateTotalIncome()) + '/s';
  if (levelEl) levelEl.textContent = gameState.level;
  if (prestigeEl) prestigeEl.textContent = gameState.prestige;
  const prestigeSection = document.getElementById('prestigeSection');
  if (prestigeSection) prestigeSection.style.display = canPrestige() ? 'block' : 'none';
}

function renderAllContent() {
  renderBusinesses();
  renderCities();
  renderUpgrades();
  renderStocks();
  renderAchievements();
  renderSkills();
  renderDailyChallenges();
  updateCityInfo();
}

// Businesses rendering using event listeners
function renderBusinesses() {
  const grid = document.getElementById('businessGrid');
  if (!grid) return;
  grid.innerHTML = '';

  businessTypes.forEach(business => {
    const owned = gameState.businesses[business.id] || 0;
    const price = calculateBusinessPrice(business, owned);
    const canAfford = gameState.cash >= price;

    const card = document.createElement('div');
    card.className = `business-card ${owned > 0 ? 'owned' : ''}`;
    card.innerHTML = `
      <div class="business-header">
        <div class="business-icon">${business.icon || ''}</div>
        <div class="business-info">
          <div class="business-name">${business.name}</div>
          <div class="business-income">+${getCurrencySymbol()}${formatNumber(business.baseIncome)}/s each</div>
        </div>
      </div>
      <div class="business-stats">
        <div class="business-price">${getCurrencySymbol()}${formatNumber(price)}</div>
        <div class="business-owned">Owned: ${owned}</div>
      </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'business-btn buy-btn';
    btn.textContent = owned > 0 ? 'Buy Another' : 'Buy Business';
    btn.disabled = !canAfford || isLoading;
    btn.addEventListener('click', () => buyBusiness(business.id));

    card.appendChild(btn);
    grid.appendChild(card);
  });
}

// Cities rendering (keeps original behavior)
function renderCities() {
  const grid = document.getElementById('cityGrid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(cities).forEach(([cityId, city]) => {
    const isUnlocked = gameState.unlockedCities.includes(cityId);
    const isCurrent = gameState.currentCity === cityId;
    const canUnlock = gameState.cash >= city.unlockCost && gameState.level >= city.unlockLevel;

    const card = document.createElement('div');
    card.className = `business-card ${isUnlocked ? 'owned' : ''} ${isCurrent ? 'current-city' : ''}`;

    const bonusText = Object.entries(city.bonuses || {}).map(([cat, mult]) => `${cat}: +${Math.round((mult - 1) * 100)}%`).join(', ');

    card.innerHTML = `
      <div class="business-header">
        <div class="business-icon" style="font-size: 2.5rem;">${city.icon || ''}</div>
        <div class="business-info">
          <div class="business-name">${city.name}</div>
          <div class="business-income">${city.description}</div>
        </div>
      </div>
      <div class="business-stats">
        <div class="business-price">${city.unlockCost > 0 ? getCurrencySymbol() + formatNumber(city.unlockCost) : 'Free'}</div>
        <div class="business-owned">Level ${city.unlockLevel}+ required</div>
      </div>
      <div style="font-size: 0.8rem; margin: 8px 0; opacity: 0.9;">
        <strong>Bonuses:</strong> ${bonusText}<br>
        <strong>Market:</strong> +${Math.round((city.marketMultiplier - 1) * 100)}% base income<br>
        <strong>Population:</strong> ${(city.population / 1000000).toFixed(1)}M
      </div>
    `;

    const button = document.createElement('button');
    button.className = `business-btn ${isCurrent ? 'upgrade-btn' : 'buy-btn'}`;
    button.disabled = isLoading || (isUnlocked ? isCurrent : (!canUnlock && gameState.level < city.unlockLevel));
    button.textContent = isUnlocked ? (isCurrent ? 'Current City' : 'Move Here') : (gameState.level < city.unlockLevel ? `Requires Level ${city.unlockLevel}` : 'Unlock City');
    if (isUnlocked && !isCurrent) button.addEventListener('click', () => switchCity(cityId));
    if (!isUnlocked && (gameState.level >= city.unlockLevel)) button.addEventListener('click', () => unlockCity(cityId));

    card.appendChild(button);
    grid.appendChild(card);
  });
}

// Upgrades
function renderUpgrades() {
  const grid = document.getElementById('upgradeGrid');
  if (!grid) return;
  grid.innerHTML = '';
  upgradeTypes.forEach(upgrade => {
    const owned = !!gameState.upgrades[upgrade.id];
    const canAfford = gameState.cash >= (upgrade.price || 0);
    const card = document.createElement('div');
    card.className = `business-card ${owned ? 'owned' : ''}`;
    card.innerHTML = `
      <div class="business-header">
        <div class="business-icon">⚡</div>
        <div class="business-info">
          <div class="business-name">${upgrade.name}</div>
          <div class="business-income">${upgrade.description}</div>
        </div>
      </div>
      <div class="business-stats">
        <div class="business-price">${getCurrencySymbol()}${formatNumber(upgrade.price || 0)}</div>
        <div class="business-owned">${owned ? 'Owned' : 'Available'}</div>
      </div>
    `;
    const btn = document.createElement('button');
    btn.className = 'business-btn upgrade-btn';
    btn.textContent = owned ? 'Purchased' : 'Buy Upgrade';
    btn.disabled = !canAfford || owned || isLoading;
    btn.addEventListener('click', () => buyUpgrade(upgrade.id));
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

// Stocks (HARDENED)
function renderStocks() {
  const grid = document.getElementById('stockGrid');
  if (!grid) return;
  grid.innerHTML = '';

  stockTypes.forEach(stock => {
    const price = stockPrices[stock.id];
    if (!price || price.current === undefined) {
      console.warn(`Stock price missing for ${stock.id} — initializing default`);
      stockPrices[stock.id] = { current: stock.basePrice || 10, previous: stock.basePrice || 10 };
    }

    const p = stockPrices[stock.id];
    const owned = (gameState.stocks && gameState.stocks[stock.id]) || 0;
    const previous = (p.previous === 0 || p.previous === undefined) ? p.current : p.previous;
    const change = previous === 0 ? 0 : ((p.current - previous) / previous) * 100;
    const canBuy = gameState.cash >= p.current;

    const item = document.createElement('div');
    item.className = 'stock-item';

    item.innerHTML = `
      <div class="stock-info">
        <div class="stock-name">${stock.name}</div>
        <div class="stock-price">${getCurrencySymbol()}${formatNumber(p.current)}</div>
        <div class="stock-change ${change >= 0 ? 'positive' : 'negative'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>
        <div style="font-size: 0.8rem; opacity: 0.8;">Owned: ${owned}</div>
      </div>
      <div class="stock-actions">
        <button class="stock-btn buy-stock-btn" ${(!canBuy || isLoading) ? 'disabled' : ''}>Buy</button>
        <button class="stock-btn sell-stock-btn" ${(owned === 0 || isLoading) ? 'disabled' : ''}>Sell</button>
      </div>
    `;

    // attach listeners
    const buyBtn = item.querySelector('.buy-stock-btn');
    const sellBtn = item.querySelector('.sell-stock-btn');
    if (buyBtn) buyBtn.addEventListener('click', () => buyStock(stock.id, 1));
    if (sellBtn) sellBtn.addEventListener('click', () => sellStock(stock.id, 1));

    grid.appendChild(item);
  });
}

// Achievements / Skills / Daily / Render helpers
function renderAchievements() {
  const grid = document.getElementById('achievementGrid');
  if (!grid) return;
  grid.innerHTML = '';
  achievements.forEach(ach => {
    const unlocked = gameState.achievements.has(ach.id);
    const item = document.createElement('div');
    item.className = `achievement-item ${unlocked ? 'unlocked' : ''}`;
    item.innerHTML = `
      <div class="achievement-icon">${unlocked ? ach.icon : '🔒'}</div>
      <div class="achievement-text">
        <div class="achievement-name">${ach.name}</div>
        <div class="achievement-desc">${ach.description}</div>
      </div>
    `;
    grid.appendChild(item);
  });
}

function renderSkills() {
  const tree = document.getElementById('skillTree');
  if (!tree) return;
  tree.innerHTML = '';
  Object.entries(skillCategories).forEach(([categoryId, category]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';
    categoryDiv.innerHTML = `<div class="skill-category-title">${category.name}</div>`;
    const skillsGrid = document.createElement('div');
    skillsGrid.className = 'skill-grid';
    category.skills.forEach(skill => {
      const unlocked = gameState.skills[skill.id];
      const canAfford = (gameState.prestigePoints || 0) >= skill.cost;
      const skillDiv = document.createElement('div');
      skillDiv.className = `skill-item ${unlocked ? 'unlocked' : canAfford ? 'available' : ''}`;
      skillDiv.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 5px;">${skill.name}</div>
        <div style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 5px;">${skill.description}</div>
        <div style="color: #ffd700; font-size: 0.8rem;">${skill.cost} PP</div>
      `;
      skillDiv.addEventListener('click', () => unlockSkill(categoryId, skill.id));
      skillsGrid.appendChild(skillDiv);
    });
    categoryDiv.appendChild(skillsGrid);
    tree.appendChild(categoryDiv);
  });
}

function renderDailyChallenges() {
  const container = document.getElementById('dailyChallenges');
  if (!container) return;
  container.innerHTML = '';
  dailyChallenges.forEach(challenge => {
    const progress = gameState.dailyProgress[challenge.type] || 0;
    const completed = gameState.dailyProgress[challenge.type + '_completed'] || false;
    const progressPercent = Math.min((progress / challenge.target) * 100, 100);
    const item = document.createElement('div');
    item.className = `challenge-item ${completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="challenge-title">${challenge.name}</div>
      <div class="challenge-progress">${progress}/${challenge.target} - ${challenge.description}</div>
      <div class="progress-bar"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
      <div class="challenge-reward">Reward: ${getCurrencySymbol()}${formatNumber(challenge.reward)}</div>
    `;
    container.appendChild(item);
  });
}

function checkAchievements() {
  achievements.forEach(ach => {
    if (!gameState.achievements.has(ach.id) && ach.condition && ach.condition()) {
      gameState.achievements.add(ach.id);
      showNotification(`🏆 Achievement Unlocked: ${ach.name}!`);
      playSound('achievement');
      renderAchievements();
    }
  });
}

// ---------- Game loops ----------
function startGameLoops() {
  setInterval(() => {
    const income = calculateTotalIncome();
    if (income > 0) {
      gameState.cash += income;
      gameState.statistics.totalEarned += income;
      updateDailyProgress('earn', income);
      updateDisplay();
    }
    if (currentEvent && Date.now() > currentEvent.endTime) {
      currentEvent = null;
      const banner = document.getElementById('eventBanner');
      if (banner) banner.style.display = 'none';
    }
  }, 1000);

  setInterval(updateStockPrices, 10000);
  setInterval(triggerRandomEvent, 60000);
  setInterval(autoSave, 30000);
}

// ---------- Auto-save ----------
async function autoSave() {
  if (isLoading || currentRecordCount >= 999) return;
  try {
    isLoading = true;
    const saveData = {
      id: currentSaveRecord?.id || ("save-" + Date.now()),
      cash: gameState.cash,
      level: gameState.level,
      experience: gameState.experience,
      prestige: gameState.prestige,
      prestigePoints: gameState.prestigePoints,
      currentCity: gameState.currentCity,
      unlockedCities: JSON.stringify(gameState.unlockedCities),
      businesses: JSON.stringify(gameState.businesses),
      upgrades: JSON.stringify(gameState.upgrades),
      achievements: JSON.stringify([...gameState.achievements]),
      skills: JSON.stringify(gameState.skills),
      stocks: JSON.stringify(gameState.stocks),
      loans: JSON.stringify(gameState.loans),
      research: JSON.stringify(gameState.research),
      dailyProgress: JSON.stringify(gameState.dailyProgress),
      statistics: JSON.stringify(gameState.statistics),
      settings: JSON.stringify(gameState.settings),
      lastSaveTime: new Date().toISOString(),
      lastDailyReset: gameState.lastDailyReset
    };

    if (!currentSaveRecord) {
      if (window.dataSdk && typeof window.dataSdk.create === 'function') {
        const result = await window.dataSdk.create(saveData);
        if (!result || !result.isOk) console.error("Failed to create save via dataSdk", result);
        currentSaveRecord = saveData;
        currentRecordCount = 1;
      } else {
        console.warn("dataSdk.create not available; falling back to localStorage");
        localStorage.setItem("business_empire_save", JSON.stringify(saveData));
        currentSaveRecord = saveData;
        currentRecordCount = 1;
      }
    } else {
      // update existing
      const updatedRecord = { ...currentSaveRecord, ...saveData };
      if (window.dataSdk && typeof window.dataSdk.update === 'function') {
        const result = await window.dataSdk.update(updatedRecord);
        if (!result || !result.isOk) console.error("Failed to update save via dataSdk", result);
        currentSaveRecord = updatedRecord;
      } else if (window.dataSdk && typeof window.dataSdk.updateRecord === 'function') {
        const result = await window.dataSdk.updateRecord(updatedRecord);
        if (!result || !result.isOk) console.error("Failed to updateRecord via dataSdk", result);
        currentSaveRecord = updatedRecord;
      } else {
        console.warn("dataSdk.update not available; falling back to localStorage");
        localStorage.setItem("business_empire_save", JSON.stringify(updatedRecord));
        currentSaveRecord = updatedRecord;
      }
    }
  } catch (err) {
    console.error("Save error:", err);
  } finally {
    isLoading = false;
  }
}

// ---------- Modals / Settings / Theme ----------
function openSettings() { const modal = document.getElementById('settingsModal'); if (modal) modal.classList.add('show'); playSound('click'); }
function closeModal(id) { const modal = document.getElementById(id); if (modal) modal.classList.remove('show'); playSound('click'); }
function showPrestigeModal() {
  const modal = document.getElementById('prestigeModal');
  const info = document.getElementById('prestigeInfo');
  if (!modal || !info) return;
  const points = calculatePrestigePoints();
  info.innerHTML = `<p>You will gain <strong>${points}</strong> prestige points.</p><p>Prestige points provide permanent bonuses:</p><ul><li>+10% income per prestige point</li><li>Unlock powerful skills</li><li>Keep achievements and research</li></ul>`;
  modal.classList.add('show');
  playSound('click');
}

function toggleTheme() {
  gameState.settings.theme = gameState.settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  showNotification(`Theme changed to ${gameState.settings.theme} mode!`);
  playSound('click');
}
function applyTheme() {
  const theme = (window.elementSdk && window.elementSdk.config && window.elementSdk.config.theme) || gameState.settings.theme || 'dark';
  document.body.classList.toggle('light-theme', theme === 'light');
  document.body.classList.toggle('dark-theme', theme !== 'light');
}

// ---------- Sound ----------
function toggleSound() {
  gameState.settings.soundEnabled = !gameState.settings.soundEnabled;
  document.body.classList.toggle('sound-enabled', gameState.settings.soundEnabled);
  showNotification(`Sound effects ${gameState.settings.soundEnabled ? 'enabled' : 'disabled'}!`);
  if (gameState.settings.soundEnabled) playSound('click');
}
function playSound(type) {
  if (!gameState.settings.soundEnabled) return;
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    const sounds = { click: { frequency: 800, duration: 0.1 }, purchase: { frequency: 1200, duration: 0.2 }, sell: { frequency: 600, duration: 0.2 }, levelup: { frequency: 1500, duration: 0.5 }, achievement: { frequency: 2000, duration: 0.3 }, collect: { frequency: 1000, duration: 0.15 }, upgrade: { frequency: 1800, duration: 0.25 }, skill: { frequency: 1600, duration: 0.2 }, prestige: { frequency: 2500, duration: 0.8 }, event: { frequency: 1400, duration: 0.3 }, tab: { frequency: 700, duration: 0.1 } };
    const sound = sounds[type] || sounds.click;
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + sound.duration);
  } catch (e) { /* fail silently */ }
}

// ---------- Export / Stats ----------
function exportProgress() {
  const exportData = { gameState, timestamp: new Date().toISOString(), version: "1.0" };
  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `business-empire-save-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showNotification('Progress exported successfully!');
  playSound('click');
}

function showStats() {
  const totalBusinesses = Object.values(gameState.businesses).reduce((s, c) => s + (c || 0), 0);
  const totalStocks = Object.values(gameState.stocks || {}).reduce((s, c) => s + (c || 0), 0);
  const statsHtml = `
    <div style="text-align: left;">
      <h3>📊 Empire Statistics</h3>
      <p><strong>💰 Total Earned:</strong> ${getCurrencySymbol()}${formatNumber(gameState.statistics.totalEarned || 0)}</p>
      <p><strong>🏢 Total Businesses:</strong> ${totalBusinesses}</p>
      <p><strong>📈 Stock Holdings:</strong> ${totalStocks}</p>
      <p><strong>🏆 Achievements:</strong> ${gameState.achievements.size}/${achievements.length}</p>
      <p><strong>⭐ Level:</strong> ${gameState.level}</p>
      <p><strong>✨ Prestige:</strong> ${gameState.prestige}</p>
      <p><strong>🎯 Skills Unlocked:</strong> ${Object.keys(gameState.skills || {}).length}</p>
      <p><strong>📊 Stock Trades:</strong> ${gameState.statistics.stockTrades}</p>
    </div>`;
  showNotification(statsHtml);
  playSound('click');
}

// ---------- Init on DOM ready ----------
document.addEventListener('DOMContentLoaded', initializeGame);

// clicks outside modals
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
    playSound('click');
  }
});

// prevent zoom on double-tap mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, false);
