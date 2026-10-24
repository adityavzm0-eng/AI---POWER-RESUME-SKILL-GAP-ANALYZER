"""
InsightAI Sample Datasets Generator
Generates realistic, rich data for testing all analytics & dashboard capabilities immediately.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_ecommerce_data(n_rows: int = 380) -> pd.DataFrame:
    np.random.seed(42)
    start_date = datetime(2024, 1, 1)
    
    categories = {
        "Technology": ["Laptops", "Smartphones", "Monitors", "Accessories"],
        "Furniture": ["Ergonomic Chairs", "Standing Desks", "Bookcases", "Filing Cabinets"],
        "Office Supplies": ["Paper & Stationery", "Binders", "Storage Boxes", "Pens & Markers"],
        "Audio & Gadgets": ["Noise-Cancelling Headphones", "Conference Speakers", "Webcams", "Microphones"]
    }
    
    cat_keys = list(categories.keys())
    segments = ["Consumer", "Corporate", "Home Office", "Enterprise"]
    regions = ["North America", "Europe", "Asia Pacific", "Latin America"]
    countries = {
        "North America": ["United States", "Canada", "Mexico"],
        "Europe": ["Germany", "United Kingdom", "France", "Netherlands"],
        "Asia Pacific": ["Japan", "Singapore", "Australia", "India"],
        "Latin America": ["Brazil", "Argentina", "Chile", "Colombia"]
    }
    
    data = []
    for i in range(1, n_rows + 1):
        order_id = f"ORD-{2024000 + i}"
        days_offset = np.random.randint(0, 365)
        order_date = start_date + timedelta(days=days_offset)
        
        region = np.random.choice(regions, p=[0.40, 0.30, 0.20, 0.10])
        country = np.random.choice(countries[region])
        segment = np.random.choice(segments, p=[0.45, 0.30, 0.15, 0.10])
        
        cat = np.random.choice(cat_keys, p=[0.35, 0.25, 0.25, 0.15])
        sub_cat = np.random.choice(categories[cat])
        
        quantity = int(np.random.choice([1, 2, 3, 4, 5, 8, 10], p=[0.35, 0.25, 0.15, 0.10, 0.08, 0.04, 0.03]))
        base_price = {
            "Technology": np.random.uniform(300, 1500),
            "Furniture": np.random.uniform(150, 800),
            "Office Supplies": np.random.uniform(15, 120),
            "Audio & Gadgets": np.random.uniform(80, 450)
        }[cat]
        
        discount = round(float(np.random.choice([0.0, 0.05, 0.10, 0.15, 0.20, 0.25], p=[0.40, 0.20, 0.18, 0.12, 0.07, 0.03])), 2)
        sales = round(float(base_price * quantity * (1 - discount)), 2)
        
        # Margin varies by category
        margin_factor = {
            "Technology": np.random.uniform(0.18, 0.35),
            "Furniture": np.random.uniform(0.12, 0.28),
            "Office Supplies": np.random.uniform(0.25, 0.45),
            "Audio & Gadgets": np.random.uniform(0.20, 0.40)
        }[cat]
        # Occasional negative profit when discount is high
        profit = round(float(sales * margin_factor - (sales * discount * 0.8)), 2)
        
        shipping_days = int(np.random.choice([1, 2, 3, 4, 5, 7], p=[0.15, 0.30, 0.30, 0.15, 0.07, 0.03]))
        returned = "Yes" if np.random.random() < 0.04 else "No"
        
        data.append({
            "Order_ID": order_id,
            "Order_Date": order_date.strftime("%Y-%m-%d"),
            "Customer_Segment": segment,
            "Region": region,
            "Country": country,
            "Category": cat,
            "Sub_Category": sub_cat,
            "Sales": sales,
            "Profit": profit,
            "Discount": discount,
            "Quantity": quantity,
            "Shipping_Days": shipping_days,
            "Returned": returned
        })
        
    return pd.DataFrame(data)

def generate_saas_data(n_rows: int = 260) -> pd.DataFrame:
    np.random.seed(101)
    start_date = datetime(2023, 1, 1)
    
    tiers = ["Starter", "Growth", "Professional", "Enterprise"]
    tier_base_mrr = {"Starter": 99, "Growth": 349, "Professional": 899, "Enterprise": 2499}
    tier_seats = {"Starter": (3, 10), "Growth": (10, 30), "Professional": (25, 100), "Enterprise": (80, 500)}
    industries = ["Fintech", "HealthTech", "E-Commerce", "SaaS & Cloud", "Logistics", "EdTech"]
    
    data = []
    for i in range(1, n_rows + 1):
        account_id = f"ACC-{1000 + i}"
        company_name = f"Company {chr(65 + (i % 26))}{i}"
        tier = np.random.choice(tiers, p=[0.35, 0.30, 0.23, 0.12])
        industry = np.random.choice(industries)
        
        base = tier_base_mrr[tier]
        mrr = round(float(base * np.random.uniform(0.85, 1.40)), 2)
        arr = round(float(mrr * 12), 2)
        
        min_s, max_s = tier_seats[tier]
        seats = int(np.random.randint(min_s, max_s))
        active_users = int(max(1, int(seats * np.random.uniform(0.60, 0.98))))
        
        nps = int(np.clip(int(np.random.normal(72, 18)), 10, 100))
        support_tickets = int(np.random.poisson(lam=2.8))
        
        # Churn risk model
        churn_risk = round(float(np.clip(
            (100 - nps) * 0.4 + (support_tickets * 4.5) - (active_users / seats * 20) + np.random.uniform(-5, 10),
            2.0, 95.0
        )), 1)
        
        days_ago = np.random.randint(30, 700)
        signup_date = (start_date + timedelta(days=days_ago)).strftime("%Y-%m-%d")
        contract_months = int(np.random.choice([1, 12, 24, 36], p=[0.20, 0.55, 0.18, 0.07]))
        
        data.append({
            "Account_ID": account_id,
            "Company_Name": company_name,
            "Plan_Tier": tier,
            "Industry": industry,
            "MRR_USD": mrr,
            "ARR_USD": arr,
            "Licensed_Seats": seats,
            "Active_Users": active_users,
            "Churn_Risk_Pct": churn_risk,
            "NPS_Score": nps,
            "Support_Tickets": support_tickets,
            "Contract_Months": contract_months,
            "Signup_Date": signup_date
        })
        
    return pd.DataFrame(data)

def generate_hr_data(n_rows: int = 280) -> pd.DataFrame:
    np.random.seed(202)
    departments = ["Engineering", "Product", "Sales", "Marketing", "People & HR", "Finance", "Customer Support"]
    dept_salary_base = {
        "Engineering": 125000, "Product": 115000, "Sales": 95000,
        "Marketing": 88000, "People & HR": 82000, "Finance": 105000, "Customer Support": 62000
    }
    work_modes = ["Remote", "Hybrid", "Onsite"]
    education = ["Bachelor's", "Master's", "PhD", "Associate / Other"]
    
    data = []
    for i in range(1, n_rows + 1):
        emp_id = f"EMP-{5000 + i}"
        dept = np.random.choice(departments, p=[0.30, 0.12, 0.20, 0.12, 0.08, 0.10, 0.08])
        years = round(float(np.random.exponential(scale=3.5) + 0.5), 1)
        years = min(years, 22.0)
        
        base = dept_salary_base[dept]
        salary = round(float(base * (1 + 0.05 * min(years, 10)) * np.random.uniform(0.85, 1.30)), 2)
        bonus_pct = float(np.random.choice([0.05, 0.10, 0.15, 0.20, 0.25], p=[0.30, 0.35, 0.20, 0.10, 0.05]))
        bonus = round(float(salary * bonus_pct), 2)
        
        perf = round(float(np.clip(np.random.normal(3.7, 0.7), 1.0, 5.0)), 1)
        overtime = int(np.random.choice([0, 5, 10, 15, 25, 40], p=[0.45, 0.25, 0.15, 0.08, 0.05, 0.02]))
        
        attrition_prob = 0.08 + (0.15 if overtime > 15 else 0.0) + (0.12 if perf < 2.5 else 0.0) - (0.04 if salary > base * 1.1 else 0.0)
        attrition_risk = "High" if np.random.random() < attrition_prob else ("Medium" if np.random.random() < 0.25 else "Low")
        
        mode = np.random.choice(work_modes, p=[0.45, 0.40, 0.15])
        edu = np.random.choice(education, p=[0.55, 0.32, 0.06, 0.07])
        age = int(22 + years + np.random.randint(0, 15))
        
        data.append({
            "Employee_ID": emp_id,
            "Department": dept,
            "Years_At_Company": years,
            "Salary_USD": salary,
            "Bonus_USD": bonus,
            "Performance_Score": perf,
            "Overtime_Hours_Monthly": overtime,
            "Attrition_Risk": attrition_risk,
            "Work_Mode": mode,
            "Education": edu,
            "Age": age
        })
        
    return pd.DataFrame(data)

def generate_healthcare_data(n_rows: int = 250) -> pd.DataFrame:
    np.random.seed(303)
    start_date = datetime(2024, 1, 1)
    
    depts = ["Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Oncology", "Emergency Medicine"]
    dept_cost_base = {
        "Cardiology": 14500, "Orthopedics": 16200, "Neurology": 18500,
        "Pediatrics": 6500, "Oncology": 24000, "Emergency Medicine": 5200
    }
    insurances = ["BlueCross BlueShield", "Aetna", "UnitedHealthcare", "Medicare", "Medicaid", "Self-Pay"]
    
    data = []
    for i in range(1, n_rows + 1):
        pt_id = f"PAT-{8000 + i}"
        dept = np.random.choice(depts, p=[0.24, 0.20, 0.16, 0.14, 0.14, 0.12])
        days_stay = int(np.clip(int(np.random.exponential(scale=3.8) + 1), 1, 24))
        
        adm_days = np.random.randint(0, 360)
        adm_date = start_date + timedelta(days=adm_days)
        dis_date = adm_date + timedelta(days=days_stay)
        
        base_c = dept_cost_base[dept]
        billing = round(float((base_c + days_stay * 1800) * np.random.uniform(0.9, 1.25)), 2)
        
        ins = np.random.choice(insurances, p=[0.30, 0.22, 0.20, 0.15, 0.08, 0.05])
        age = int(np.clip(int(np.random.normal(54, 19)), 3, 94))
        
        readmit_prob = 0.06 + (0.08 if days_stay > 7 else 0) + (0.05 if age > 65 else 0)
        readmitted = "Yes" if np.random.random() < readmit_prob else "No"
        rating = round(float(np.clip(np.random.normal(4.3, 0.6), 1.0, 5.0)), 1)
        
        data.append({
            "Patient_ID": pt_id,
            "Department": dept,
            "Admission_Date": adm_date.strftime("%Y-%m-%d"),
            "Discharge_Date": dis_date.strftime("%Y-%m-%d"),
            "Length_Of_Stay_Days": days_stay,
            "Billing_Amount_USD": billing,
            "Insurance_Provider": ins,
            "Patient_Age": age,
            "Readmitted_30Days": readmitted,
            "Satisfaction_Score": rating
        })
        
    return pd.DataFrame(data)

SAMPLE_CATALOG = {
    "ecommerce": {
        "title": "Global E-Commerce Sales & Profit",
        "description": "Multi-region retail order transactions with product categories, discount rates, profit margins, and return tracking.",
        "generator": generate_ecommerce_data,
        "default_filename": "ecommerce_sales_dataset.csv"
    },
    "saas": {
        "title": "SaaS Cloud ARR, Churn & Usage",
        "description": "B2B SaaS subscription accounts with MRR/ARR, seat utilization, churn probabilities, and NPS scores.",
        "generator": generate_saas_data,
        "default_filename": "saas_subscriptions_dataset.csv"
    },
    "hr": {
        "title": "HR Workforce & Compensation",
        "description": "Talent management metrics covering departmental salaries, bonus structures, performance reviews, and attrition risk.",
        "generator": generate_hr_data,
        "default_filename": "hr_workforce_dataset.csv"
    },
    "healthcare": {
        "title": "Hospital Admissions & Clinical Operations",
        "description": "Inpatient admissions, department lengths of stay, billing totals, insurance carriers, and readmission indicators.",
        "generator": generate_healthcare_data,
        "default_filename": "hospital_operations_dataset.csv"
    }
}
