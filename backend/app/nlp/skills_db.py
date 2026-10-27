"""
Extensive skills database with categories, synonyms, and canonical mappings.
"""
from typing import Dict, List, Set, Tuple

SKILL_TAXONOMY: Dict[str, Dict[str, List[str]]] = {
    "Programming Languages": {
        "Python": ["python", "python3", "py"],
        "JavaScript": ["javascript", "js", "ecmascript"],
        "TypeScript": ["typescript", "ts"],
        "Java": ["java", "jvm"],
        "C++": ["c++", "cpp"],
        "C#": ["c#", "csharp", "dotnet c#"],
        "C": ["c programming", "c lang"],
        "Go": ["go", "golang"],
        "Rust": ["rust", "rustlang"],
        "SQL": ["sql", "structured query language", "transact-sql", "t-sql", "pl/sql"],
        "R": ["r programming", "r language", "r stats"],
        "Ruby": ["ruby"],
        "PHP": ["php"],
        "Swift": ["swift", "swiftui"],
        "Kotlin": ["kotlin"],
        "Scala": ["scala"],
        "Bash/Shell": ["bash", "shell scripting", "powershell", "zsh", "sh"],
        "HTML/CSS": ["html", "html5", "css", "css3"]
    },
    "Frameworks & Web Development": {
        "React": ["react", "react.js", "reactjs"],
        "Next.js": ["next.js", "nextjs", "next"],
        "Vue.js": ["vue", "vue.js", "vuejs"],
        "Angular": ["angular", "angularjs", "angular 2+"],
        "Node.js": ["node.js", "nodejs", "node"],
        "Express.js": ["express", "express.js", "expressjs"],
        "Django": ["django", "django rest framework", "drf"],
        "FastAPI": ["fastapi", "fast-api"],
        "Flask": ["flask"],
        "Spring Boot": ["spring boot", "springboot", "spring framework"],
        ".NET": [".net", "dotnet", ".net core", "asp.net"],
        "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind-css"],
        "GraphQL": ["graphql", "apollo graphql"],
        "REST API": ["rest", "restful api", "rest api", "web apis", "restful web services"],
        "WebSockets": ["websockets", "websocket", "socket.io"]
    },
    "AI, Machine Learning & Data Science": {
        "Machine Learning": ["machine learning", "ml", "statistical learning"],
        "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
        "XGBoost": ["xgboost", "xgb"],
        "LightGBM": ["lightgbm", "lgb"],
        "Pandas": ["pandas"],
        "NumPy": ["numpy"],
        "Feature Engineering": ["feature engineering", "feature selection", "feature extraction"],
        "Model Evaluation": ["model evaluation", "cross-validation", "hyperparameter tuning", "grid search", "roc-auc"],
        "Supervised Learning": ["supervised learning", "regression", "classification"],
        "Unsupervised Learning": ["unsupervised learning", "clustering", "kmeans", "pca", "dimensionality reduction"],
        "MLOps": ["mlops", "machine learning operations", "model deployment", "model monitoring", "mlflow", "dvc", "wandb"]
    },
    "Deep Learning & Computer Vision": {
        "Deep Learning": ["deep learning", "dl", "neural networks", "artificial neural networks"],
        "PyTorch": ["pytorch", "torch"],
        "TensorFlow": ["tensorflow", "tf"],
        "Keras": ["keras"],
        "Convolutional Neural Networks (CNN)": ["cnn", "convolutional neural networks", "convnet"],
        "Recurrent Neural Networks (RNN)": ["rnn", "lstm", "gru", "recurrent neural networks"],
        "Transformers": ["transformers", "transformer architecture", "attention mechanism"],
        "Computer Vision": ["computer vision", "cv", "image processing"],
        "OpenCV": ["opencv", "cv2"],
        "Object Detection": ["object detection", "yolo", "faster r-cnn", "image segmentation"]
    },
    "NLP & Large Language Models": {
        "Natural Language Processing (NLP)": ["natural language processing", "nlp", "text mining", "computational linguistics"],
        "Large Language Models (LLMs)": ["large language models", "llm", "llms", "gpt", "generative ai", "genai", "foundation models"],
        "Hugging Face": ["hugging face", "huggingface", "transformers library", "datasets"],
        "spaCy": ["spacy"],
        "NLTK": ["nltk"],
        "Sentence Transformers": ["sentence-transformers", "sentence transformers", "text embeddings"],
        "Retrieval-Augmented Generation (RAG)": ["rag", "retrieval augmented generation", "retrieval-augmented generation"],
        "Vector Databases": ["vector database", "vector db", "chromadb", "pinecone", "faiss", "weaviate", "qdrant", "milvus"],
        "LangChain": ["langchain", "langsmith", "langgraph"],
        "LlamaIndex": ["llamaindex", "llama-index"],
        "Prompt Engineering": ["prompt engineering", "few-shot learning", "chain-of-thought"],
        "Named Entity Recognition (NER)": ["ner", "named entity recognition"],
        "Sentiment Analysis": ["sentiment analysis", "text classification"]
    },
    "Databases & Data Engineering": {
        "PostgreSQL": ["postgresql", "postgres", "psql"],
        "MySQL": ["mysql"],
        "SQLite": ["sqlite", "sqlite3"],
        "MongoDB": ["mongodb", "mongo"],
        "Redis": ["redis"],
        "Elasticsearch": ["elasticsearch", "elastic search", "opensearch"],
        "Apache Spark": ["apache spark", "spark", "pyspark"],
        "Apache Kafka": ["apache kafka", "kafka", "event streaming"],
        "Snowflake": ["snowflake", "snowflake data warehouse"],
        "Databricks": ["databricks"],
        "Google BigQuery": ["bigquery", "google bigquery"],
        "ETL/ELT": ["etl", "elt", "data pipeline", "data warehousing", "airbyte", "dbt"],
        "Airflow": ["airflow", "apache airflow"]
    },
    "Cloud & DevOps": {
        "Amazon Web Services (AWS)": ["aws", "amazon web services", "ec2", "s3", "lambda", "rds", "sagemaker"],
        "Google Cloud Platform (GCP)": ["gcp", "google cloud", "google cloud platform", "vertex ai", "gcs"],
        "Microsoft Azure": ["azure", "microsoft azure", "azure devops", "azure ml"],
        "Docker": ["docker", "containerization", "containers", "docker-compose"],
        "Kubernetes": ["kubernetes", "k8s"],
        "CI/CD": ["ci/cd", "continuous integration", "continuous deployment", "github actions", "gitlab ci", "jenkins"],
        "Terraform": ["terraform", "infrastructure as code", "iac"],
        "Linux": ["linux", "unix", "ubuntu", "centos", "debian"],
        "Microservices": ["microservices", "microservice architecture", "distributed systems"]
    },
    "Data Visualization & BI": {
        "Data Visualization": ["data visualization", "data viz"],
        "Tableau": ["tableau"],
        "Power BI": ["power bi", "powerbi"],
        "Matplotlib": ["matplotlib"],
        "Seaborn": ["seaborn"],
        "Plotly": ["plotly"],
        "Excel": ["excel", "microsoft excel", "vlookup", "pivot tables"]
    },
    "Software Engineering & Methodologies": {
        "Git": ["git", "version control", "github", "gitlab", "bitbucket"],
        "Data Structures & Algorithms": ["data structures", "algorithms", "dsa", "leetcode", "problem solving"],
        "System Design": ["system design", "software architecture", "scalability", "high availability"],
        "Object-Oriented Programming (OOP)": ["oop", "object-oriented programming", "design patterns"],
        "Unit Testing": ["unit testing", "pytest", "jest", "mocking", "test driven development", "tdd"],
        "Agile/Scrum": ["agile", "scrum", "kanban", "sprint planning", "jira"]
    },
    "Soft Skills & Leadership": {
        "Problem Solving": ["problem solving", "analytical skills", "critical thinking"],
        "Communication": ["communication", "technical communication", "presentation skills", "writing documentation"],
        "Team Leadership": ["team leadership", "mentorship", "tech lead", "code reviews", "cross-functional collaboration"],
        "Project Management": ["project management", "time management", "stakeholder management"]
    }
}

# Reverse lookup: synonym -> (canonical_name, category)
CANONICAL_LOOKUP: Dict[str, Tuple[str, str]] = {}
ALL_SKILL_NAMES: Set[str] = set()

for category, skills in SKILL_TAXONOMY.items():
    for canonical, synonyms in skills.items():
        ALL_SKILL_NAMES.add(canonical)
        # register canonical lowercased
        CANONICAL_LOOKUP[canonical.lower()] = (canonical, category)
        for syn in synonyms:
            CANONICAL_LOOKUP[syn.lower()] = (canonical, category)

# Transferable/related skill mapping for partial matches
TRANSFERABLE_SKILLS: Dict[str, Dict[str, float]] = {
    "PyTorch": {"TensorFlow": 0.85, "Keras": 0.80, "Deep Learning": 0.90},
    "TensorFlow": {"PyTorch": 0.85, "Keras": 0.90, "Deep Learning": 0.90},
    "React": {"Vue.js": 0.80, "Angular": 0.70, "Next.js": 0.90, "JavaScript": 0.85},
    "Vue.js": {"React": 0.80, "Angular": 0.70, "JavaScript": 0.85},
    "Angular": {"React": 0.70, "Vue.js": 0.70, "TypeScript": 0.85},
    "FastAPI": {"Flask": 0.85, "Django": 0.75, "Python": 0.90},
    "Flask": {"FastAPI": 0.85, "Django": 0.75, "Python": 0.90},
    "Django": {"FastAPI": 0.75, "Flask": 0.80, "Python": 0.90},
    "PostgreSQL": {"MySQL": 0.85, "SQLite": 0.80, "SQL": 0.95},
    "MySQL": {"PostgreSQL": 0.85, "SQLite": 0.80, "SQL": 0.95},
    "Amazon Web Services (AWS)": {"Google Cloud Platform (GCP)": 0.80, "Microsoft Azure": 0.80, "Cloud & DevOps": 0.85},
    "Google Cloud Platform (GCP)": {"Amazon Web Services (AWS)": 0.80, "Microsoft Azure": 0.80, "Cloud & DevOps": 0.85},
    "Microsoft Azure": {"Amazon Web Services (AWS)": 0.80, "Google Cloud Platform (GCP)": 0.80, "Cloud & DevOps": 0.85},
    "Docker": {"Kubernetes": 0.80, "CI/CD": 0.75},
    "Kubernetes": {"Docker": 0.85, "Cloud & DevOps": 0.85},
    "spaCy": {"NLTK": 0.80, "Hugging Face": 0.75, "Natural Language Processing (NLP)": 0.90},
    "Hugging Face": {"Transformers": 0.95, "PyTorch": 0.85, "Natural Language Processing (NLP)": 0.90},
    "Pandas": {"NumPy": 0.85, "SQL": 0.75, "Apache Spark": 0.70},
    "Apache Spark": {"Pandas": 0.75, "SQL": 0.80, "Databricks": 0.85},
    "Tableau": {"Power BI": 0.85, "Data Visualization": 0.90},
    "Power BI": {"Tableau": 0.85, "Data Visualization": 0.90},
}

def resolve_skill(raw_skill: str) -> Tuple[str, str]:
    """
    Resolves a raw skill term to its canonical name and category.
    Returns (canonical_name, category).
    If unknown, returns (title_cased_raw, 'Other Technical Skills').
    """
    cleaned = raw_skill.strip().lower()
    if cleaned in CANONICAL_LOOKUP:
        return CANONICAL_LOOKUP[cleaned]
    # Check if exact skill without punctuation exists
    simplified = "".join(c for c in cleaned if c.isalnum() or c in (" ", "+", "#", ".", "-")).strip()
    if simplified in CANONICAL_LOOKUP:
        return CANONICAL_LOOKUP[simplified]
    return (raw_skill.strip().title(), "General Technical Skills")
