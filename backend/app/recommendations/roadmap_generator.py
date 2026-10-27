"""
Personalized AI Learning Roadmap Generator: creates evidence-based learning paths,
weekly milestones, and capstone mini-projects tailored to candidate skill gaps.
"""
from typing import Dict, Any, List

SKILL_CURRICULUM_DATA: Dict[str, Dict[str, Any]] = {
    "Docker": {
        "topics": ["Containerization Fundamentals", "Dockerfile Optimization & Multi-stage Builds", "Docker Compose Multi-Container Networking", "Volume Persistence & Secrets"],
        "mini_project": "Containerize a full-stack REST API and database with Docker Compose and production health checks.",
        "hours": "10-14 hours",
        "outcome": "Ability to package and deploy isolated, reproducible production microservices."
    },
    "Kubernetes": {
        "topics": ["Pod Lifecycle, Deployments & ReplicaSets", "Services, Ingress & Cluster Networking", "ConfigMaps, Secrets & Persistent Volumes", "Helm Charts & Rolling Updates"],
        "mini_project": "Deploy a multi-tier web application to a local Minikube cluster with auto-scaling and zero-downtime updates.",
        "hours": "15-20 hours",
        "outcome": "Confidence managing container orchestration, declarative manifests, and cluster workloads."
    },
    "PyTorch": {
        "topics": ["Tensors, Autograd & Dynamic Computation Graphs", "Custom Dataset & DataLoader Pipelines", "CNN & Transfer Learning with torchvision", "Model Checkpointing & ONNX Export"],
        "mini_project": "Build and fine-tune a vision classifier using ResNet-50 and export to ONNX runtime for low-latency inference.",
        "hours": "16-22 hours",
        "outcome": "Hands-on mastery of dynamic neural network training, evaluation, and inference deployment."
    },
    "TensorFlow": {
        "topics": ["Keras Functional API & Sequential Models", "TensorFlow Data (tf.data) ETL Pipeline", "Custom Callbacks & TensorBoard Profiling", "TF Serving & Model Optimization"],
        "mini_project": "Develop an end-to-end sentiment classification model trained on review datasets and served via TF Serving.",
        "hours": "14-18 hours",
        "outcome": "Skill in constructing scalable deep learning models and serving pipelines."
    },
    "Natural Language Processing (NLP)": {
        "topics": ["Tokenization, Lemmatization & POS Tagging", "TF-IDF & Word2Vec Vector Embeddings", "Transformer Self-Attention & BERT Fine-tuning", "Evaluation Metrics (BLEU, ROUGE, F1)"],
        "mini_project": "Build an intelligent document summarizer and keyword extractor using Hugging Face Transformers and FastAPI.",
        "hours": "18-24 hours",
        "outcome": "Capability to solve real-world unstructured text challenges using modern transformer architectures."
    },
    "Large Language Models (LLMs)": {
        "topics": ["Prompt Engineering & System Prompt Design", "Retrieval-Augmented Generation (RAG) Architecture", "Vector Embeddings & Similarity Search", "LangChain / LlamaIndex Orchestration"],
        "mini_project": "Develop a multi-source RAG query agent with vector search, contextual chunking, and source attribution.",
        "hours": "15-20 hours",
        "outcome": "Proficiency architecting production LLM agents and enterprise RAG applications."
    },
    "Retrieval-Augmented Generation (RAG)": {
        "topics": ["Document Chunking & Hybrid Search", "Embedding Generation & Vector Indexing", "Reranking & Context Compression", "Hallucination Evaluation & Guardrails"],
        "mini_project": "Implement a PDF conversational assistant with ChromaDB vector store, semantic caching, and source citations.",
        "hours": "12-16 hours",
        "outcome": "Deep knowledge of enterprise retrieval techniques and contextual grounding for generative AI."
    },
    "PostgreSQL": {
        "topics": ["Relational Schema Design & Constraints", "Advanced SQL Joins, CTEs & Window Functions", "Indexing Strategies (B-tree, GIN) & Query EXPLAIN", "Transactions & ACID Concurrency Isolation"],
        "mini_project": "Design a high-volume financial transaction ledger database with partitioned tables and optimized indexing.",
        "hours": "10-14 hours",
        "outcome": "Mastery of enterprise SQL, query execution planning, and database optimization."
    },
    "Amazon Web Services (AWS)": {
        "topics": ["IAM Policies & Cloud Security", "EC2, S3 Storage & VPC Networking", "AWS Lambda & API Gateway Serverless", "CloudWatch Monitoring & RDS"],
        "mini_project": "Deploy a serverless microservice using AWS Lambda, S3 event triggers, and DynamoDB.",
        "hours": "14-18 hours",
        "outcome": "Practical ability to architect secure, scalable cloud services on AWS."
    },
    "FastAPI": {
        "topics": ["Pydantic Data Validation & Typing", "Asynchronous Endpoint Handlers (async/await)", "Dependency Injection & Authentication", "OpenAPI Documentation & Background Tasks"],
        "mini_project": "Create a high-performance asynchronous API for streaming AI analytics with JWT authentication.",
        "hours": "8-12 hours",
        "outcome": "Skill in developing fast, type-safe Python web services with automated Swagger documentation."
    },
    "React": {
        "topics": ["Functional Components & Custom Hooks", "State Management & Context API", "Performance Optimization (useMemo, useCallback)", "API Integration & Responsive Layouts"],
        "mini_project": "Develop an interactive real-time dashboard with chart visualization, dark mode, and state persistence.",
        "hours": "12-16 hours",
        "outcome": "Proficiency building clean, modern, interactive web interfaces with React."
    },
    "Scikit-learn": {
        "topics": ["Data Preprocessing & ColumnTransformers", "Ensemble Methods (Random Forest, Gradient Boosting)", "Pipelines & Cross-Validation Strategies", "Model Interpretability (SHAP, Permutation Importance)"],
        "mini_project": "Build an end-to-end customer churn prediction pipeline with automated feature engineering and hyperparameter tuning.",
        "hours": "10-14 hours",
        "outcome": "Capability to develop robust, modular machine learning pipelines ready for production."
    },
    "CI/CD": {
        "topics": ["GitHub Actions Workflow Syntax", "Automated Testing & Linting Gates", "Docker Build & Push Automation", "Environment Secrets & Staging Deployments"],
        "mini_project": "Configure a complete CI/CD pipeline that runs tests, builds container images, and deploys to a test server.",
        "hours": "8-12 hours",
        "outcome": "Mastery of automated software delivery, continuous integration, and safe release practices."
    }
}

def generate_personalized_roadmap(
    comparison_results: Dict[str, Any],
    role_title: str = "Target Position",
    experience_level: str = "Mid-Level"
) -> Dict[str, Any]:
    """
    Constructs a 4-week timeline and 3-priority learning roadmap based on missing skills.
    """
    missing_skills = comparison_results.get("missing_skills", [])
    partially_matched = comparison_results.get("partially_matched_skills", [])
    matched_skills = comparison_results.get("matched_skills", [])

    # Group into 3 priorities
    p1_essential: List[Dict[str, Any]] = []
    p2_practical: List[Dict[str, Any]] = []
    p3_advanced: List[Dict[str, Any]] = []

    for s in missing_skills:
        name = s["skill"]
        curriculum = SKILL_CURRICULUM_DATA.get(name, {
            "topics": [f"{name} Core Architecture", f"{name} Best Practices & Patterns", f"{name} Integration with Python/JS", "Production Debugging"],
            "mini_project": f"Build a practical working module incorporating {name} to solve a realistic domain task.",
            "hours": "10-14 hours",
            "outcome": f"Demonstrated competency in {name} with verified portfolio code."
        })

        item = {
            "skill": name,
            "category": s["category"],
            "why_it_matters": s.get("why_it_matters", f"Direct requirement for the {role_title} role"),
            "resume_status": "Missing from resume",
            "topics": curriculum["topics"],
            "mini_project": curriculum["mini_project"],
            "estimated_hours": curriculum["hours"],
            "outcome": curriculum["outcome"]
        }

        if s.get("tier") == "required":
            p1_essential.append(item)
        else:
            p2_practical.append(item)

    # For partial skills, add to practical or advanced
    for s in partially_matched:
        name = s["skill"]
        curriculum = SKILL_CURRICULUM_DATA.get(name, {
            "topics": [f"Transitioning from {s.get('related_skill_found', 'related tools')} to {name}", "Deep Dive into Specific API Syntax", "Performance & Production Gotchas"],
            "mini_project": f"Port an existing project feature to {name} to demonstrate cross-framework versatility.",
            "hours": "6-10 hours",
            "outcome": f"Bridge theoretical familiarity in {name} into practical production experience."
        })
        p2_practical.append({
            "skill": name,
            "category": s["category"],
            "why_it_matters": f"Elevate transferable knowledge from {s.get('related_skill_found', 'related skill')}",
            "resume_status": f"Partially matched ({s.get('related_skill_found', 'related')})",
            "topics": curriculum["topics"],
            "mini_project": curriculum["mini_project"],
            "estimated_hours": curriculum["hours"],
            "outcome": curriculum["outcome"]
        })

    # Advanced skills (from additional domains or modern tooling)
    advanced_pool = ["Retrieval-Augmented Generation (RAG)", "MLOps", "Kubernetes", "System Design", "CI/CD"]
    for adv in advanced_pool:
        if not any(item["skill"] == adv for item in p1_essential + p2_practical):
            curriculum = SKILL_CURRICULUM_DATA.get(adv, {
                "topics": [f"{adv} Design Principles", f"{adv} Architecture Patterns", "Enterprise Best Practices"],
                "mini_project": f"Create a demonstration architecture for {adv}.",
                "hours": "12-16 hours",
                "outcome": f"Advanced architectural understanding of {adv}."
            })
            p3_advanced.append({
                "skill": adv,
                "category": "Advanced Architecture",
                "why_it_matters": f"Differentiating edge for senior {role_title} candidates",
                "resume_status": "High-value differentiator",
                "topics": curriculum["topics"],
                "mini_project": curriculum["mini_project"],
                "estimated_hours": curriculum["hours"],
                "outcome": curriculum["outcome"]
            })
            if len(p3_advanced) >= 2:
                break

    # Build 4-Week Timeline
    p1_names = [item["skill"] for item in p1_essential[:3]]
    primary_focus = ", ".join(p1_names) if p1_names else "Core Engineering Competencies"

    timeline = [
        {
            "week": "Week 1",
            "phase": "Fundamentals & Environment Setup",
            "focus": f"Master core syntax, conceptual foundations, and environment setup for {primary_focus}.",
            "milestones": [
                f"Complete foundational tutorials and documentation deep dive for {p1_names[0] if p1_names else 'primary skills'}",
                "Set up local development container and testing environment",
                "Implement 5 targeted coding exercises testing edge cases"
            ],
            "deliverable": "Working development workspace with unit-tested sample scripts."
        },
        {
            "week": "Week 2",
            "phase": "Hands-On Practical Exercises & Integration",
            "focus": "Transition from syntax to building modular features and integrating APIs.",
            "milestones": [
                f"Build intermediate data or backend pipelines utilizing {primary_focus}",
                "Integrate error handling, logging, and validation schemas",
                "Perform benchmarking and analyze performance trade-offs"
            ],
            "deliverable": "Modular code repository with documented APIs and clean abstractions."
        },
        {
            "week": "Week 3",
            "phase": "End-to-End Capstone Project Implementation",
            "focus": "Construct a realistic, portfolio-worthy project directly solving a target business challenge.",
            "milestones": [
                f"Implement capstone project addressing: {p1_essential[0]['mini_project'] if p1_essential else 'Production REST Service'}",
                "Containerize application using Docker with reproducible build steps",
                "Write comprehensive test coverage (>80%) with PyTest or Jest"
            ],
            "deliverable": "Fully functioning open-source repository with README, architecture diagram, and deployment instructions."
        },
        {
            "week": "Week 4",
            "phase": "Portfolio Packaging & Interview Readiness",
            "focus": "Transform newly acquired technical abilities into ATS-optimized resume bullet points and interview responses.",
            "milestones": [
                "Deploy capstone project live or record an engaging 2-minute video walkthrough",
                "Incorporate newly built projects into resume using quantifiable metrics",
                "Conduct mock technical interview sessions rehearsing system design and theory questions"
            ],
            "deliverable": "Polished resume revision, live portfolio project link, and technical interview question bank."
        }
    ]

    return {
        "role_title": role_title,
        "experience_level": experience_level,
        "essential_skills": p1_essential,
        "practical_skills": p2_practical,
        "advanced_skills": p3_advanced,
        "timeline": timeline,
        "total_estimated_weeks": 4,
        "total_estimated_hours": "45-65 hours across 4 weeks"
    }
