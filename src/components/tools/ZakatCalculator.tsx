'use client';

import React, { useState, useMemo } from 'react';
import styles from './ZakatCalculator.module.css';

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  goldGramPrice: number;
  silverGramPrice: number;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', goldGramPrice: 85.5, silverGramPrice: 1.05 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', goldGramPrice: 78.8, silverGramPrice: 0.98 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', goldGramPrice: 67.2, silverGramPrice: 0.82 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', goldGramPrice: 115.0, silverGramPrice: 1.42 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', goldGramPrice: 130.5, silverGramPrice: 1.62 },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal (SAR)', goldGramPrice: 320.5, silverGramPrice: 3.95 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)', goldGramPrice: 314.0, silverGramPrice: 3.86 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', goldGramPrice: 7150.0, silverGramPrice: 88.0 },
  PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee (PKR)', goldGramPrice: 23800.0, silverGramPrice: 295.0 },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit (MYR)', goldGramPrice: 380.0, silverGramPrice: 4.70 },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah (IDR)', goldGramPrice: 1350000.0, silverGramPrice: 16500.0 },
};

export default function ZakatCalculator() {
  const [currency, setCurrency] = useState<string>('USD');
  const [nisabStandard, setNisabStandard] = useState<'silver' | 'gold'>('silver');
  const [copied, setCopied] = useState(false);

  // Asset inputs
  const [cash, setCash] = useState<string>('');
  const [goldGrams, setGoldGrams] = useState<string>('');
  const [silverGrams, setSilverGrams] = useState<string>('');
  const [businessStock, setBusinessStock] = useState<string>('');
  const [investments, setInvestments] = useState<string>('');
  const [moneyOwedToYou, setMoneyOwedToYou] = useState<string>('');

  // Liability inputs
  const [debtsDue, setDebtsDue] = useState<string>('');
  const [billsDue, setBillsDue] = useState<string>('');

  const currentCurr = CURRENCIES[currency] || CURRENCIES.USD;

  // Nisab threshold calculation: Gold = 85g, Silver = 595g
  const silverNisabValue = 595 * currentCurr.silverGramPrice;
  const goldNisabValue = 85 * currentCurr.goldGramPrice;

  const nisabThreshold = useMemo(() => {
    return nisabStandard === 'gold' ? goldNisabValue : silverNisabValue;
  }, [nisabStandard, goldNisabValue, silverNisabValue]);

  // Total Gross Assets
  const totalAssets = useMemo(() => {
    const c = parseFloat(cash) || 0;
    const g = (parseFloat(goldGrams) || 0) * currentCurr.goldGramPrice;
    const s = (parseFloat(silverGrams) || 0) * currentCurr.silverGramPrice;
    const b = parseFloat(businessStock) || 0;
    const inv = parseFloat(investments) || 0;
    const owed = parseFloat(moneyOwedToYou) || 0;
    return c + g + s + b + inv + owed;
  }, [cash, goldGrams, silverGrams, businessStock, investments, moneyOwedToYou, currentCurr]);

  // Total Liabilities
  const totalLiabilities = useMemo(() => {
    const d = parseFloat(debtsDue) || 0;
    const b = parseFloat(billsDue) || 0;
    return d + b;
  }, [debtsDue, billsDue]);

  // Net Zakatable Wealth
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  // Eligibility & Zakat Due (2.5%)
  const isEligible = netWealth >= nisabThreshold && netWealth > 0;
  const zakatDue = isEligible ? netWealth * 0.025 : 0;

  // Nisab Progress Percentage
  const nisabProgress = useMemo(() => {
    if (nisabThreshold <= 0) return 0;
    const pct = (netWealth / nisabThreshold) * 100;
    return Math.min(100, Math.round(pct));
  }, [netWealth, nisabThreshold]);

  const handleReset = () => {
    setCash('');
    setGoldGrams('');
    setSilverGrams('');
    setBusinessStock('');
    setInvestments('');
    setMoneyOwedToYou('');
    setDebtsDue('');
    setBillsDue('');
  };

  const handleCopySummary = () => {
    const summary = `🕌 WitrQuran Zakat Calculation Summary:\n` +
      `Currency: ${currentCurr.code} (${currentCurr.symbol})\n` +
      `Nisab Standard: ${nisabStandard.toUpperCase()} (${currentCurr.symbol}${formatNumber(nisabThreshold)})\n` +
      `Total Gross Assets: ${currentCurr.symbol}${formatNumber(totalAssets)}\n` +
      `Total Liabilities: ${currentCurr.symbol}${formatNumber(totalLiabilities)}\n` +
      `Net Zakatable Wealth: ${currentCurr.symbol}${formatNumber(netWealth)}\n` +
      `Zakat Payable (2.5%): ${currentCurr.symbol}${formatNumber(zakatDue)}\n` +
      `Status: ${isEligible ? 'Mandatory (Above Nisab)' : 'Below Nisab Threshold'}\n` +
      `Calculated on https://witrquran.vercel.app/tools/zakat-calculator`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatNumber = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={styles.calculatorCard}>
      {/* Top Configuration Controls */}
      <div className={styles.topRow}>
        <div className={styles.currencySelector}>
          <label htmlFor="currencySelect" className={styles.label}>
            <span>💱 Currency:</span>
          </label>
          <select
            id="currencySelect"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={styles.selectInput}
          >
            {Object.keys(CURRENCIES).map((code) => (
              <option key={code} value={code}>
                {CURRENCIES[code].name} ({CURRENCIES[code].symbol})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.nisabToggleGroup}>
          <span className={styles.label}>Nisab Standard:</span>
          <div className={styles.nisabButtons}>
            <button
              type="button"
              className={`${styles.nisabBtn} ${nisabStandard === 'silver' ? styles.nisabBtnActive : ''}`}
              onClick={() => setNisabStandard('silver')}
              title="Silver standard (595g) is recommended by major scholars"
            >
              🪙 Silver (595g) · {currentCurr.symbol}{formatNumber(silverNisabValue)}
            </button>
            <button
              type="button"
              className={`${styles.nisabBtn} ${nisabStandard === 'gold' ? styles.nisabBtnActive : ''}`}
              onClick={() => setNisabStandard('gold')}
              title="Gold standard (85g)"
            >
              👑 Gold (85g) · {currentCurr.symbol}{formatNumber(goldNisabValue)}
            </button>
          </div>
        </div>
      </div>

      {/* Nisab Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressTitle}>
            {isEligible ? '🎉 Nisab Threshold Met!' : '📊 Wealth vs. Nisab Threshold'}
          </span>
          <span className={styles.progressPercentage}>
            {nisabProgress}% of Nisab ({currentCurr.symbol}{formatNumber(netWealth)} / {currentCurr.symbol}{formatNumber(nisabThreshold)})
          </span>
        </div>
        <div className={styles.progressBarTrack}>
          <div
            className={`${styles.progressBarFill} ${isEligible ? styles.progressEligible : ''}`}
            style={{ width: `${nisabProgress}%` }}
          />
        </div>
      </div>

      {/* Inputs Grid */}
      <div className={styles.gridSections}>
        {/* Left: Zakatable Assets */}
        <div className={styles.sectionBox}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 className={styles.sectionTitle}>1. Your Zakatable Assets</h3>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="cashInput" className={styles.fieldLabel}>Cash in Hand &amp; Bank Accounts</label>
              <span className={styles.fieldHint}>Savings &amp; checking</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>{currentCurr.symbol}</span>
              <input
                id="cashInput"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="goldInput" className={styles.fieldLabel}>Gold Owned (Weight in Grams)</label>
              <span className={styles.fieldHint}>@{currentCurr.symbol}{currentCurr.goldGramPrice}/g</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>g</span>
              <input
                id="goldInput"
                type="number"
                min="0"
                step="any"
                placeholder="0 grams"
                value={goldGrams}
                onChange={(e) => setGoldGrams(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="silverInput" className={styles.fieldLabel}>Silver Owned (Weight in Grams)</label>
              <span className={styles.fieldHint}>@{currentCurr.symbol}{currentCurr.silverGramPrice}/g</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>g</span>
              <input
                id="silverInput"
                type="number"
                min="0"
                step="any"
                placeholder="0 grams"
                value={silverGrams}
                onChange={(e) => setSilverGrams(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="stockInput" className={styles.fieldLabel}>Business Stock &amp; Merchandise</label>
              <span className={styles.fieldHint}>Wholesale resale value</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>{currentCurr.symbol}</span>
              <input
                id="stockInput"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={businessStock}
                onChange={(e) => setBusinessStock(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="investmentsInput" className={styles.fieldLabel}>Stocks, Mutual Funds &amp; Crypto</label>
              <span className={styles.fieldHint}>Liquid zakatable portion</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>{currentCurr.symbol}</span>
              <input
                id="investmentsInput"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={investments}
                onChange={(e) => setInvestments(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="owedInput" className={styles.fieldLabel}>Loans Given (Expected Back)</label>
              <span className={styles.fieldHint}>Reliable receivables</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>{currentCurr.symbol}</span>
              <input
                id="owedInput"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={moneyOwedToYou}
                onChange={(e) => setMoneyOwedToYou(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>
        </div>

        {/* Right: Liabilities & Deductions */}
        <div className={styles.sectionBox}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconBoxRed}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className={styles.sectionTitle}>2. Deductible Short-Term Debts</h3>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="debtsInput" className={styles.fieldLabel}>Debts Due Immediately</label>
              <span className={styles.fieldHint}>Personal loans due now</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>{currentCurr.symbol}</span>
              <input
                id="debtsInput"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={debtsDue}
                onChange={(e) => setDebtsDue(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputLabelRow}>
              <label htmlFor="billsInput" className={styles.fieldLabel}>Unpaid Rent, Utility &amp; Living Bills</label>
              <span className={styles.fieldHint}>Due in current month</span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>{currentCurr.symbol}</span>
              <input
                id="billsInput"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={billsDue}
                onChange={(e) => setBillsDue(e.target.value)}
                className={styles.numInput}
              />
            </div>
          </div>

          {/* Educational Note Box */}
          <div className={styles.guidanceBox}>
            <span className={styles.guidanceIcon}>💡</span>
            <p className={styles.guidanceText}>
              <strong>Fiqh Note on Liabilities:</strong> Long-term mortgage balances or multi-year auto financing totals are not deducted in their entirety. Only the immediate overdue installment or current month's housing liability qualifies for deduction under standard Islamic jurisprudence.
            </p>
          </div>
        </div>
      </div>

      {/* Results Summary Box */}
      <div className={styles.resultsSummary}>
        <div className={styles.resultsGrid}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Gross Assets</span>
            <span className={styles.resultValue}>{currentCurr.symbol}{formatNumber(totalAssets)}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Liabilities</span>
            <span className={styles.resultValue}>{currentCurr.symbol}{formatNumber(totalLiabilities)}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Net Zakatable Wealth</span>
            <span className={styles.resultValue}>{currentCurr.symbol}{formatNumber(netWealth)}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Nisab Standard ({nisabStandard.toUpperCase()})</span>
            <span className={styles.resultValue}>{currentCurr.symbol}{formatNumber(nisabThreshold)}</span>
          </div>
        </div>

        <div className={styles.zakatDueBlock}>
          <div className={styles.zakatDueLeft}>
            <span className={styles.zakatDueTitle}>Total Zakat Payable (2.5%)</span>
            <span className={styles.zakatDueAmount}>
              {currentCurr.symbol}{formatNumber(zakatDue)}
            </span>
          </div>

          <div>
            {isEligible ? (
              <div className={`${styles.eligibilityBadge} ${styles.eligibleYes}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Zakat Is Obligatory (Above Nisab)</span>
              </div>
            ) : (
              <div className={`${styles.eligibilityBadge} ${styles.eligibleNo}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Below Nisab Threshold (No Zakat Due)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button type="button" onClick={handleCopySummary} className={styles.copyBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>{copied ? '✓ Copied Breakdown!' : '📋 Copy Breakdown'}</span>
        </button>
        <button type="button" onClick={handleReset} className={styles.resetBtn}>
          🔄 Clear All Values
        </button>
      </div>
    </div>
  );
}

