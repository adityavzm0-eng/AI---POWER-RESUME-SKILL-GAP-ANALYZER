"""
InsightAI Comprehensive Automated Test Suite
Uses Python standard library unittest to run without extra runner dependencies.
Covers all requirements from Section 15 of project specification.
"""

import os
import sys
import io
import asyncio
import unittest
import pandas as pd
import numpy as np

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from backend.main import app
from backend.data_store import store
from backend.profiler import profile_dataset, infer_column_type
from backend.dashboard_engine import generate_dashboard, compute_chart_data, format_number
from backend.ai_engine import generate_deterministic_insights, generate_ai_insights
from backend.copilot import ask_copilot, CopilotQueryRequest

class TestInsightAISuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_normal_sales_dataset(self):
        """Test normal sales dataset profiling and dynamic chart generation"""
        df = pd.DataFrame({
            "order_id": [f"ORD-{i:04d}" for i in range(100)],
            "order_date": pd.date_range("2024-01-01", periods=100, freq="D").strftime("%Y-%m-%d"),
            "region": np.random.choice(["North", "South", "East", "West"], 100),
            "category": np.random.choice(["Electronics", "Furniture", "Clothing"], 100),
            "sales": np.random.uniform(50.0, 1200.0, 100),
            "profit": np.random.uniform(-50.0, 400.0, 100),
            "quantity": np.random.randint(1, 15, 100)
        })
        
        prof = profile_dataset(df)
        self.assertEqual(prof["overview"]["total_rows"], 100)
        self.assertIn("sales", prof["column_types"]["numerical"])
        self.assertIn("region", prof["column_types"]["categorical"])
        self.assertIn("order_date", prof["column_types"]["date"])
        self.assertIn("order_id", prof["column_types"]["id"])
        
        dash = generate_dashboard(df, prof)
        self.assertGreaterEqual(len(dash["kpis"]), 3)
        self.assertGreaterEqual(len(dash["charts"]), 3)
        
        chart_types = [c["type"] for c in dash["charts"]]
        self.assertTrue("area" in chart_types or "line" in chart_types)
        self.assertIn("bar", chart_types)

    def test_02_missing_values_dataset(self):
        """Test dataset containing missing values and data quality calculation"""
        df = pd.DataFrame({
            "item": ["A", "B", None, "D", "E", None],
            "score": [10.5, None, 30.0, None, 50.0, 60.0],
            "status": ["Active", "Inactive", "Active", None, "Active", "Inactive"]
        })
        
        prof = profile_dataset(df)
        self.assertGreater(prof["overview"]["missing_cells"], 0)
        self.assertLess(prof["dataset_health"]["completeness_pct"], 100.0)
        self.assertEqual(prof["columns"]["score"]["missing_count"], 2)
        
        dash = generate_dashboard(df, prof)
        self.assertGreater(len(dash["kpis"]), 0)

    def test_03_duplicate_rows_dataset(self):
        """Test dataset containing duplicate rows detection"""
        df = pd.DataFrame({
            "id": [1, 2, 2, 3, 3, 3],
            "name": ["Alpha", "Beta", "Beta", "Gamma", "Gamma", "Gamma"],
            "val": [100, 200, 200, 300, 300, 300]
        })
        
        prof = profile_dataset(df)
        self.assertEqual(prof["overview"]["duplicate_rows"], 3)
        self.assertEqual(prof["overview"]["duplicate_pct"], 50.0)

    def test_04_date_columns_dataset(self):
        """Test dataset with date columns and temporal trend computation"""
        dates = pd.date_range("2023-01-01", periods=12, freq="ME").strftime("%Y-%m-%d")
        df = pd.DataFrame({
            "transaction_date": dates,
            "revenue": [1000, 1500, 1200, 1800, 2200, 2100, 2500, 2800, 3000, 3200, 3100, 3500]
        })
        
        prof = profile_dataset(df)
        self.assertIn("transaction_date", prof["column_types"]["date"])
        
        chart_data = compute_chart_data(df, "transaction_date", "revenue", aggregation="sum")
        self.assertGreater(len(chart_data), 0)
        self.assertIn("value", chart_data[0])

    def test_05_only_numerical_columns(self):
        """Test dataset with only numerical columns"""
        df = pd.DataFrame({
            "sensor_a": [1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 10.0],
            "sensor_b": [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0],
            "sensor_c": [5, 4, 3, 2, 1, 2, 3, 4, 5]
        })
        
        prof = profile_dataset(df)
        self.assertEqual(len(prof["column_types"]["numerical"]), 3)
        self.assertEqual(len(prof["column_types"]["categorical"]), 0)
        
        dash = generate_dashboard(df, prof)
        self.assertGreater(len(dash["kpis"]), 0)

    def test_06_mostly_categorical_columns(self):
        """Test dataset with mostly categorical columns and mode statistics"""
        df = pd.DataFrame({
            "color": ["Red", "Blue", "Green", "Red", "Blue", "Red"],
            "size": ["S", "M", "L", "M", "L", "S"],
            "feedback": ["Great", "Good", "Poor", "Great", "Good", "Great"]
        })
        
        prof = profile_dataset(df)
        self.assertEqual(len(prof["column_types"]["categorical"]), 3)
        self.assertEqual(prof["columns"]["color"]["stats"]["mode"], "Red")
        
        dash = generate_dashboard(df, prof)
        self.assertGreater(len(dash["charts"]), 0)

    def test_07_empty_or_malformed_csv_upload(self):
        """Test rejection of empty files and invalid file extensions"""
        # Empty file
        res = self.client.post("/api/upload", files={"file": ("empty.csv", b"", "text/csv")})
        self.assertEqual(res.status_code, 400)
        self.assertIn("empty", res.json()["detail"].lower())
        
        # Unsupported extension
        res2 = self.client.post("/api/upload", files={"file": ("document.pdf", b"%PDF-1.4", "application/pdf")})
        self.assertEqual(res2.status_code, 400)
        self.assertIn("unsupported", res2.json()["detail"].lower())

    def test_08_unavailable_ai_provider_fallback(self):
        """Test guaranteed deterministic statistical fallback when AI provider is unavailable"""
        df = pd.DataFrame({
            "department": ["Sales", "Engineering", "Marketing", "HR"],
            "headcount": [25, 40, 15, 8],
            "budget": [500000, 1200000, 300000, 150000]
        })
        prof = profile_dataset(df)
        dash = generate_dashboard(df, prof)
        
        insights = generate_deterministic_insights(prof, dash["kpis"])
        self.assertIsNotNone(insights.executive_summary)
        self.assertGreater(len(insights.insights), 0)
        self.assertTrue(any(i.category == "key_finding" for i in insights.insights))

    def test_09_invalid_chart_configurations(self):
        """Test graceful handling of invalid column names in chart computation"""
        df = pd.DataFrame({"x": [1, 2, 3], "y": [4, 5, 6]})
        res = compute_chart_data(df, "nonexistent_x_col", "y")
        self.assertEqual(res, [])

    def test_10_nonexistent_dataset_access(self):
        """Test unauthorized / 404 responses for missing dataset IDs"""
        res = self.client.get("/api/dataset/fake_dataset_id_12345")
        self.assertEqual(res.status_code, 404)
        
        res2 = self.client.get("/api/datasets/fake_dataset_id_12345/profile")
        self.assertEqual(res2.status_code, 404)

    def test_11_export_after_applying_filters(self):
        """Test filtered CSV export reflects active filter criteria"""
        csv_content = b"city,population\nNew York,8800000\nLondon,8900000\nTokyo,14000000\nParis,2100000\nBerlin,3600000"
        up_res = self.client.post("/api/datasets/upload", files={"file": ("cities.csv", csv_content, "text/csv")})
        self.assertEqual(up_res.status_code, 200)
        ds_id = up_res.json()["dataset_id"]
        
        payload = {
            "numeric": {
                "population": {"min": 5000000}
            }
        }
        res = self.client.post(f"/api/datasets/{ds_id}/export", json=payload)
        self.assertEqual(res.status_code, 200)
        lines = [line.strip() for line in res.text.strip().splitlines() if line.strip()]
        # Header + 3 filtered cities (New York, London, Tokyo) = 4 lines
        self.assertEqual(len(lines), 4)

    def test_12_copilot_natural_language_queries(self):
        """Test InsightAI Copilot natural language processing and factual accuracy"""
        df = pd.DataFrame({
            "product": ["Widget A", "Widget B", "Widget C", "Widget D"],
            "revenue": [5000, 12000, 3000, 9500],
            "units": [50, 120, 30, 95]
        })
        prof = profile_dataset(df)
        
        async def run_copilot_tests():
            # Test average calculation
            req1 = CopilotQueryRequest(query="What is the average revenue?", dataset_id="test")
            res1 = await ask_copilot(req1, df, prof)
            self.assertTrue("mean" in res1.computed_facts or "Average Analysis" in res1.answer)
            
            # Test top performer leaderboard and chart generation
            req2 = CopilotQueryRequest(query="Which product performed best?", dataset_id="test")
            res2 = await ask_copilot(req2, df, prof)
            self.assertIn("Widget B", res2.answer)
            self.assertIsNotNone(res2.chart_suggestion)
            self.assertEqual(res2.chart_suggestion["x_column"], "product")
            
            # Test missing values check
            req3 = CopilotQueryRequest(query="Are there missing values?", dataset_id="test")
            res3 = await ask_copilot(req3, df, prof)
            self.assertTrue("0 missing" in res3.answer or "Clean Dataset" in res3.answer)

        asyncio.run(run_copilot_tests())

if __name__ == "__main__":
    unittest.main()
