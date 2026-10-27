"""
Interview Preparation Generator: synthesizes tailored technical theory,
coding challenges, and architecture questions based on candidate skill gaps.
"""
from typing import Dict, Any, List

INTERVIEW_QUESTION_BANK = {
    "Docker": {
        "theory": "What is the difference between a Docker image layer and a running container? How does Copy-on-Write (CoW) work?",
        "theory_answer": "Docker images are composed of immutable read-only layers resulting from Dockerfile instructions. When a container runs, Docker mounts a thin read-write container layer on top. CoW ensures modified files are copied to the top layer without modifying the underlying base image.",
        "coding": "Write a multi-stage Dockerfile for a Python FastAPI application using non-root user security and minimal distroless/alpine image.",
        "project_q": "How do you handle secrets and sensitive environment variables in production Docker builds without leaking them into git history?"
    },
    "Kubernetes": {
        "theory": "Explain the role of Kube-Proxy and how Kubernetes Services route traffic to individual Pods.",
        "theory_answer": "Kube-Proxy runs on each node and maintains network rules using iptables or IPVS. When a Service receives traffic on its ClusterIP, Kube-Proxy routes packets to healthy endpoint Pods matched by label selectors.",
        "coding": "Write a Kubernetes YAML manifest defining a Deployment with 3 replicas, liveness/readiness probes, and resource requests/limits.",
        "project_q": "Describe a scenario where a Pod was trapped in CrashLoopBackOff. What diagnostic commands and logs did you inspect to resolve it?"
    },
    "PostgreSQL": {
        "theory": "Compare B-Tree indexes versus GIN indexes in PostgreSQL. When would you choose one over the other?",
        "theory_answer": "B-Tree indexes are ideal for scalar equality and range comparisons (=, <, >, BETWEEN). GIN (Generalized Inverted Index) is suited for composite items like JSONB, full-text search, and array containment operations.",
        "coding": "Write a SQL query utilizing Window Functions (ROW_NUMBER or DENSE_RANK) to calculate the top 3 highest revenue orders per customer.",
        "project_q": "How do you optimize a query taking 15+ seconds? Walk through using EXPLAIN ANALYZE and buffer cache analysis."
    },
    "PyTorch": {
        "theory": "Explain how torch.autograd computes gradients using computational graphs. What is the effect of torch.no_grad()?",
        "theory_answer": "torch.autograd constructs a Directed Acyclic Graph (DAG) during the forward pass where nodes are operations and leaves are tensors. Calling .backward() applies the chain rule backward. torch.no_grad() disables gradient tracking, drastically saving VRAM during evaluation.",
        "coding": "Implement a custom PyTorch Dataset class that overrides __len__ and __getitem__ to load image tensors on-the-fly.",
        "project_q": "How do you diagnose and remediate vanishing or exploding gradients during deep network training?"
    },
    "Natural Language Processing (NLP)": {
        "theory": "How does self-attention in Transformers differ from recurrent mechanisms in LSTMs?",
        "theory_answer": "LSTMs process sequences sequentially (O(N) sequential steps), leading to information bottlenecks over long distances. Self-attention computes pairwise relationship weights across all tokens in parallel (O(1) sequential steps), enabling global context capture.",
        "coding": "Implement tokenization and compute TF-IDF cosine similarity between two sentences using pure Python or Scikit-learn.",
        "project_q": "When fine-tuning a transformer model for domain-specific text classification, how do you handle class imbalance?"
    },
    "Large Language Models (LLMs)": {
        "theory": "What is the difference between RAG (Retrieval-Augmented Generation) and Model Fine-Tuning? When should each be applied?",
        "theory_answer": "RAG supplies external dynamic facts and domain knowledge at inference time without modifying model weights. Fine-tuning adjusts model weights to adopt specific tone, style, or task formats. RAG is best for frequently updated knowledge, while fine-tuning is best for specialized formatting.",
        "coding": "Implement a semantic chunking utility that splits long Markdown documents by header sections and ensures token window constraints.",
        "project_q": "How do you evaluate and minimize hallucinations in production RAG systems?"
    }
}

def generate_interview_prep(missing_skills: List[Dict[str, Any]], role_title: str) -> List[Dict[str, Any]]:
    """
    Generates tailored interview questions mapped to missing skills and role expectations.
    """
    questions: List[Dict[str, Any]] = []
    seen = set()

    for s in missing_skills:
        name = s["skill"]
        if name in INTERVIEW_QUESTION_BANK and name not in seen:
            seen.add(name)
            bank = INTERVIEW_QUESTION_BANK[name]
            questions.append({
                "skill": name,
                "category": s.get("category", "Technical Competency"),
                "theory_question": bank["theory"],
                "model_answer": bank["theory_answer"],
                "coding_challenge": bank["coding"],
                "behavioral_project_question": bank["project_q"]
            })
            if len(questions) >= 4:
                break

    # If few found, supply foundational engineering questions
    if len(questions) < 2:
        questions.append({
            "skill": f"System Design for {role_title}",
            "category": "Architecture & Scalability",
            "theory_question": f"How would you design a scalable microservices architecture handling 10,000 concurrent users for a {role_title} platform?",
            "model_answer": "Utilize stateless API gateways, horizontal container scaling via Kubernetes, asynchronous message queuing (Kafka/RabbitMQ) for decoupled workloads, and read-replica database caching with Redis.",
            "coding_challenge": "Write a clean Python function implementing rate-limiting token bucket algorithm with unit tests.",
            "behavioral_project_question": "Describe a difficult technical bug you encountered in production. How did you isolate root cause and verify resolution?"
        })

    return questions
