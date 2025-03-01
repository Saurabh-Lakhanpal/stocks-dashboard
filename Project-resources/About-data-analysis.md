### **1. Historical Price Trends (Closing Price)**

- **What it shows:**
  - This plot visualizes how the stock’s closing price has changed over time. It is the most direct representation of the stock's historical performance.

- **Why it’s useful:**
  - The historical price trend allows investors to observe long-term patterns in stock movement.
  - It identifies trends (upward or downward), peaks, troughs, and fluctuations that help investors make informed decisions.
  - By viewing this chart, investors can understand how the stock reacts to market events.

- **How it's calculated:**
  - For each date, the **closing price** of the stock is plotted on the graph.
  - The X-axis represents the **date** (timeline), while the Y-axis represents the **stock’s closing price** in USD.
  - This plot uses historical market data (close prices), showing a smooth line connecting data points over time.

---

### **2. Relative Strength Index (RSI)**

- **What it shows:**
  - The RSI is a momentum oscillator that measures the speed and magnitude of recent price changes. It helps determine whether a stock is overbought or oversold.
  - It is plotted on a scale of 0 to 100.

- **Why it’s useful:**
  - An **RSI above 70** usually indicates that the stock is overbought (potentially overvalued). This may signal a selling opportunity.
  - An **RSI below 30** indicates that the stock is oversold (potentially undervalued). This may signal a buying opportunity.
  - RSI helps investors gauge stock momentum and identify reversal points, providing actionable signals for timing trades.

- **How it's calculated:**
  - RSI is calculated using **average gains** and **average losses** over a 14-day period:
    \[
    RSI = 100 - \frac{100}{1 + \frac{\text{Average Gain}}{\text{Average Loss}}}
    \]
  - **Average Gain:** The mean of positive price changes during the period.
  - **Average Loss:** The mean of negative price changes during the period.
  - RSI values are plotted on the Y-axis, with thresholds at 30 (oversold) and 70 (overbought). The X-axis represents time (dates).

---

### **3. Bollinger Bands**

- **What it shows:**
  - Bollinger Bands provide a visual indicator of stock price volatility.
  - They consist of three lines:
    - A **Middle Band** representing the 20-day simple moving average (SMA).
    - An **Upper Band**, which is the SMA plus 2 standard deviations.
    - A **Lower Band**, which is the SMA minus 2 standard deviations.
  - The price movements occur within these bands, and the width of the bands reflects the stock’s volatility.

- **Why it’s useful:**
  - If the stock price nears the **upper band**, the stock may be overbought (potential sell signal).
  - If the stock price nears the **lower band**, the stock may be oversold (potential buy signal).
  - Bollinger Bands help investors identify potential price breakouts or reversals by analyzing volatility.

- **How it's calculated:**
  - **Middle Band (Moving Average):**
    \[
    \text{Middle Band} = \text{SMA of closing prices over 20 periods}
    \]
  - **Upper Band:**
    \[
    \text{Upper Band} = \text{Middle Band} + (2 \times \text{Standard Deviation of Closing Prices})
    \]
  - **Lower Band:**
    \[
    \text{Lower Band} = \text{Middle Band} - (2 \times \text{Standard Deviation of Closing Prices})
    \]
  - The X-axis represents dates, and the Y-axis represents stock price in USD.

---

### **4. Drawdown Chart**

- **What it shows:**
  - A drawdown chart visualizes the percentage decline of the stock price from its previous peak over a specific period of time.
  - Drawdowns are shown as negative values, helping investors understand risk and potential recovery.

- **Why it’s useful:**
  - Helps in analyzing the **risk level** of a stock.
  - Identifies the stock’s worst declines, which is crucial for risk assessment.
  - Shows how long it takes for the stock to recover from major price drops, highlighting market resilience.

- **How it's calculated:**
  - Calculate the **cumulative maximum price** over time.
  - Subtract the current price from the maximum price and divide by the maximum price:
    \[
    \text{Drawdown} = \frac{\text{Current Price} - \text{Maximum Price}}{\text{Maximum Price}}
    \]
  - The X-axis represents time (dates), and the Y-axis shows the drawdown as a percentage (negative values indicate declines).

---

### **5. Ratios (Financial Data)**

#### **P/E Ratio (Price-to-Earnings Ratio):**
- **What it shows:**
  - The ratio compares the stock's price to its earnings per share (EPS).
  - It evaluates whether a company is overvalued or undervalued relative to its earnings.
  
- **Why it’s useful:**
  - A lower P/E ratio suggests the stock is undervalued, while a higher P/E may indicate overvaluation.
  - It’s a key metric for value investors.

- **How it's calculated:**
  - Divide the stock price by the earnings per share (EPS):
    \[
    \text{P/E Ratio} = \frac{\text{Stock Price}}{\text{Earnings Per Share (EPS)}}
    \]

---

#### **Current Ratio:**
- **What it shows:**
  - A liquidity ratio measuring a company's ability to pay off short-term liabilities using short-term assets.

- **Why it’s useful:**
  - A ratio above 1.0 generally indicates sufficient liquidity to cover liabilities.
  - It provides insights into a company’s financial health and stability.

- **How it's calculated:**
  - Divide current assets by current liabilities:
    \[
    \text{Current Ratio} = \frac{\text{Current Assets}}{\text{Current Liabilities}}
    \]

---

#### **Debt-to-Equity Ratio:**
- **What it shows:**
  - The ratio measures how much debt a company uses to finance its assets relative to shareholder equity.

- **Why it’s useful:**
  - A lower ratio indicates less reliance on debt, which is often preferred for long-term stability.
  - It highlights the financial structure and risk exposure of a company.

- **How it's calculated:**
  - Divide total debt by shareholder equity:
    \[
    \text{Debt-to-Equity Ratio} = \frac{\text{Total Debt}}{\text{Shareholder Equity}}
    \]

---