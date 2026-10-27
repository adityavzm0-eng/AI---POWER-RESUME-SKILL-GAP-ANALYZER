"""
Portfolio Project Recommendation Engine: suggests hands-on portfolio projects
specifically mapped to candidate's missing or developing skills.
"""
from typing import Dict, Any, List

PROJECT_TEMPLATES = {
    "Docker": {
        "title": "Microservices Deployment Sandbox with Health Probes",
        "primary_skill": "Docker",
        "tech_stack": ["Docker", "Docker Compose", "FastAPI", "Redis", "Nginx"],
        "overview": "Architect a containerized multi-service web platform with reverse proxy routing, redis caching, and automated container health-check scripts.",
        "architecture_steps": [
            "Write multi-stage Dockerfiles optimizing image size to <150MB",
            "Configure docker-compose.yml with isolated bridge networks and persistent volume mounts",
            "Set up Nginx as a reverse proxy load balancer across duplicate backend instances",
            "Implement automated container restarts and container health probes"
        ],
        "resume_bullet_sample": "Engineered containerized microservices architecture with Docker Compose and Nginx, reducing deployment onboarding time from hours to under 3 minutes."
    },
    "Kubernetes": {
        "title": "High-Availability Cloud Microservices Cluster",
        "primary_skill": "Kubernetes",
        "tech_stack": ["Kubernetes", "Minikube", "Helm", "Prometheus", "Grafana"],
        "overview": "Deploy a resilient microservice architecture on Kubernetes with automated horizontal pod autoscaling, ingress routing, and Prometheus cluster monitoring.",
        "architecture_steps": [
            "Write declarative Kubernetes manifests for Deployments, Services, and Ingress",
            "Configure Horizontal Pod Autoscaler (HPA) targeting CPU & Memory metrics",
            "Deploy Prometheus Operator and configure Grafana dashboards for latency metrics",
            "Simulate node failures and verify automatic pod rescheduling with zero downtime"
        ],
        "resume_bullet_sample": "Orchestrated Kubernetes cluster with Helm and HPA, ensuring seamless auto-scaling under peak traffic and 99.95% service availability."
    },
    "PostgreSQL": {
        "title": "High-Throughput Analytics Database & Query Optimizer",
        "primary_skill": "PostgreSQL",
        "tech_stack": ["PostgreSQL", "SQL", "pgAdmin", "Python", "SQLAlchemy"],
        "overview": "Design an enterprise database schema for e-commerce transactions, optimize complex CTE analytical queries, and benchmark indexing strategies.",
        "architecture_steps": [
            "Model normalized relational schema with foreign keys, checks, and composite primary keys",
            "Generate 500,000 synthetic transaction records using Faker",
            "Profile slow analytical queries using EXPLAIN (ANALYZE, BUFFERS)",
            "Implement B-Tree, Hash, and Partial Indexes, cutting execution time by over 70%"
        ],
        "resume_bullet_sample": "Designed normalized PostgreSQL relational schema for 500K+ records, optimizing slow analytical queries by 72% via targeted indexing and CTE refactoring."
    },
    "PyTorch": {
        "title": "Real-Time Computer Vision & Model Inference Engine",
        "primary_skill": "PyTorch",
        "tech_stack": ["PyTorch", "Torchvision", "FastAPI", "ONNX Runtime", "Docker"],
        "overview": "Train and fine-tune a deep learning model for defect detection or classification, optimize inference with ONNX, and serve via REST API.",
        "architecture_steps": [
            "Construct custom PyTorch Dataset with data augmentation and normalization",
            "Fine-tune a pretrained ResNet-50 backbone using learning rate scheduling",
            "Quantize weights to FP16 and export to ONNX runtime format",
            "Deploy inference endpoint with batching support in FastAPI"
        ],
        "resume_bullet_sample": "Developed and fine-tuned PyTorch vision classification pipeline, boosting inference throughput 3.2x via ONNX quantization and asynchronous batching."
    },
    "Natural Language Processing (NLP)": {
        "title": "Intelligent Legal & Financial Document Analyzer",
        "primary_skill": "Natural Language Processing (NLP)",
        "tech_stack": ["Hugging Face", "Transformers", "spaCy", "PyMuPDF", "FastAPI"],
        "overview": "Build an NLP processing pipeline that extracts key clauses, entities, and risk factors from complex PDF contracts with confidence scores.",
        "architecture_steps": [
            "Extract structured layout text from PDF contracts using PyMuPDF",
            "Run Named Entity Recognition (NER) and custom entity ruler patterns with spaCy",
            "Implement zero-shot classification for clause risk assessment using Hugging Face",
            "Expose interactive analysis via REST endpoints and JSON schema output"
        ],
        "resume_bullet_sample": "Built automated contract analysis pipeline using Hugging Face transformers, reducing manual document review time by 65% with 92% extraction precision."
    },
    "Large Language Models (LLMs)": {
        "title": "Enterprise RAG Assistant with Hybrid Search & Citations",
        "primary_skill": "Large Language Models (LLMs)",
        "tech_stack": ["LangChain", "ChromaDB", "FastAPI", "Sentence Transformers", "Streamlit"],
        "overview": "Develop an enterprise knowledge assistant that answers complex technical documentation queries with exact page-level citations.",
        "architecture_steps": [
            "Implement semantic chunking with overlapping windows for technical manuals",
            "Generate vector embeddings and store in ChromaDB with metadata filtering",
            "Build hybrid keyword + semantic similarity retrieval with reciprocal rank fusion",
            "Integrate guardrails preventing out-of-domain hallucinations"
        ],
        "resume_bullet_sample": "Architected enterprise RAG assistant with hybrid vector search in ChromaDB, achieving 94% citation accuracy across 1,000+ technical documentation pages."
    }
}

def generate_project_recommendations(missing_skills: List[Dict[str, Any]], role_title: str) -> List[Dict[str, Any]]:
    """
    Returns 2-3 tailored portfolio project recommendations based on missing skills.
    """
    recommended_projects = []
    seen_skills = set()

    for s in missing_skills:
        name = s["skill"]
        if name in PROJECT_TEMPLATES and name not in seen_skills:
            seen_skills.add(name)
            recommended_projects.append(PROJECT_TEMPLATES[name])
            if len(recommended_projects) >= 3:
                break

    # If fewer than 2 found, add a universal modern project
    if len(recommended_projects) < 2:
        recommended_projects.append({
            "title": f"Production {role_title} Analytics & Monitoring Platform",
            "primary_skill": "Full-Stack System Architecture",
            "tech_stack": ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
            "overview": f"Construct an end-to-end cloud-ready analytics system specifically targeting key {role_title} responsibilities.",
            "architecture_steps": [
                "Implement asynchronous API endpoints with comprehensive Pydantic validation",
                "Integrate interactive dashboard visualizations and telemetry monitoring",
                "Package system with containerized multi-environment Docker configurations"
            ],
            "resume_bullet_sample": f"Built end-to-end data analytics web platform with automated CI/CD and containerized deployment, serving 1,000+ simulated requests per second."
        })

    return recommended_projects
