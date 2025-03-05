## **Deploying the Project on a Local Machine**

### **1. Obtain API Keys**
   - **YH Finance API Key:**
     - Visit [YH Finance](https://financeapi.net/).
     - Sign up or log in to your account and generate an API key. This key is necessary for accessing financial data.
   - **Kaggle API Key:**
     - Visit [Kaggle](https://www.kaggle.com/).
     - Log in and navigate to your account settings to generate an API key.

---

### **2. Clone the Repository**
   - Open a terminal or Git Bash on your local machine.
   - Clone the project repository using the following command:
     ```bash
     git clone <repository_link>
     ```
   - Replace `<repository_link>` with the actual URL of the project repository.

---

### **3. Review Directory Structure**
   - Refer to the **README.md** file in the cloned repository to understand the directory structure.
   - Ensure all files and folders are in their correct locations as specified.

---

### **4. Set Up the Environment**
   - Create a Python virtual environment for the project to keep dependencies organized:
     ```bash
     python3 -m venv env
     source env/bin/activate   # On Windows, use `env\Scripts\activate`
     ```
   - Install the required Python packages specified in `requirements.txt`:
     ```bash
     pip3 install -r requirements.txt
     ```
   - Ensure the following packages are installed if not already listed in `requirements.txt`:
     ```bash
     pip3 install Kaggle pandas sqlalchemy psycopg2-binary yfinance
     pip3 install pandas_datareader requests beautifulsoup4 flask flask_cors
     pip3 install python-dateutil==2.8.2 notebook nbconvert
     ```

---

### **5. Create `.Kaggle` Folder**
   - On your local machine:
     - Create a folder named `.Kaggle`.
     - Place the **Kaggle API key** file (named `kaggle.json`) in this folder.
   - Follow the advised directory path shown on the directory structure.

---

### **6. Add Configuration File**
   - Create a file named `config.js` .
   - Add any required configuration details, such as API keys or project settings, to this file.
   - Follow the advised directory path shown on the directory structure.

---

### **7. Run the Jupyter Notebook**
   - Open the **`Stocks_dashboard_ETL.ipynb`** file in Jupyter Notebook or Jupyter Lab.
   - Run all the cells in the notebook sequentially to process and extract the required data.
     - *Note*: Install Jupyter before running the notebook:
       ```bash
       pip3 install jupyterlab
       jupyter-lab
       ```

---

### **8. Run the Application Locally**
   - Open a terminal on your local machine.
   - Navigate to the project directory where the backend script is located.
   - Run the local backend application:
     ```bash
     python3 appLocal.py
     ```
   - To ensure the script runs in the background:
     ```bash
     nohup python3 appLocal.py &
     ```
    - You may uncomment the baseUrl and use the one that fetches json form EC2 endpoint if its up and running. In that case there is no need to run this file

---

### **9. View the HTML Files**
   - Locate the `index_p1.html` and `index_p2.html` files in the project directory.
   - Open these files in your default browser to view the user interface of the application.

---