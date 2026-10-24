#!/usr/bin/env python3
"""
================================================================================
🗳️  VOTEHUB - COMPLETE ONLINE VOTING SYSTEM
================================================================================

ONE FILE - EVERYTHING INCLUDED

INSTALLATION:
    pip install Flask Flask-SQLAlchemy

RUN:
    python voting_app.py

VISIT:
    http://localhost:5000

FEATURES:
    ✅ Create & manage polls
    ✅ Real-time voting
    ✅ Live results
    ✅ Admin dashboard
    ✅ Beautiful UI
    ✅ RESTful API
    ✅ Database included

================================================================================
"""

from flask import Flask, render_template_string, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import json

# ============================================================================
# APPLICATION SETUP
# ============================================================================

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///voting_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'voting-system-2024-secret'

db = SQLAlchemy(app)

# ============================================================================
# DATABASE MODELS
# ============================================================================

class Poll(db.Model):
    __tablename__ = 'polls'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    options = db.relationship('Option', backref='poll', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'options': [o.to_dict() for o in self.options],
            'total_votes': sum(o.get_vote_count() for o in self.options)
        }

class Option(db.Model):
    __tablename__ = 'options'
    id = db.Column(db.Integer, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey('polls.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    color = db.Column(db.String(7), default='#3498db')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    votes = db.relationship('Vote', backref='option', lazy=True, cascade='all, delete-orphan')
    
    def get_vote_count(self):
        return len(self.votes)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'color': self.color,
            'votes': self.get_vote_count()
        }

class Vote(db.Model):
    __tablename__ = 'votes'
    id = db.Column(db.Integer, primary_key=True)
    option_id = db.Column(db.Integer, db.ForeignKey('options.id'), nullable=False)
    voter_ip = db.Column(db.String(45))
    voted_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================================================
# HTML & CSS & JAVASCRIPT - ALL TEMPLATES
# ============================================================================

BASE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}VoteHub - Online Voting{% endblock %}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --primary: #3498db;
            --success: #2ecc71;
            --danger: #e74c3c;
            --warning: #f39c12;
            --info: #9b59b6;
            --light: #ecf0f1;
            --dark: #2c3e50;
            --text: #333;
        }
        
        html, body { height: 100%; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: var(--text);
        }
        
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            width: 100%;
        }
        
        .navbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo h1 {
            font-size: 28px;
            color: var(--primary);
            font-weight: 700;
        }
        
        .nav-links {
            list-style: none;
            display: flex;
            gap: 30px;
        }
        
        .nav-links a {
            text-decoration: none;
            color: var(--text);
            font-weight: 600;
            transition: color 0.3s;
        }
        
        .nav-links a:hover { color: var(--primary); }
        
        main { flex: 1; }
        
        .content {
            background: white;
            border-radius: 12px;
            margin: 30px auto;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 1100px;
            width: 100%;
        }
        
        .hero {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            border-radius: 12px;
            margin-bottom: 40px;
        }
        
        .hero h2 { font-size: 48px; margin-bottom: 20px; }
        .hero p { font-size: 20px; opacity: 0.9; }
        
        .polls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }
        
        .poll-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 25px;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .poll-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        
        .poll-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .poll-header h3 { font-size: 20px; flex: 1; }
        .poll-status {
            background: var(--success);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .poll-desc { color: #666; font-size: 14px; margin-bottom: 15px; }
        
        .poll-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }
        
        .stat-item strong { color: var(--primary); }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }
        
        .btn-primary {
            background: var(--primary);
            color: white;
            width: 100%;
        }
        
        .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }
        
        .btn-secondary {
            background: var(--light);
            color: var(--text);
            margin-right: 10px;
        }
        
        .btn-success {
            background: var(--success);
            color: white;
            width: auto;
        }
        
        .btn-danger {
            background: var(--danger);
            color: white;
            width: auto;
        }
        
        .btn-info {
            background: var(--info);
            color: white;
            width: auto;
        }
        
        .poll-container { max-width: 700px; margin: 40px auto; }
        
        .voting-section {
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .option-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px;
            border: 2px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .option-item:hover {
            border-color: var(--primary);
            background: #f8f9fa;
        }
        
        .option-content {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
        }
        
        .option-content input { width: 20px; height: 20px; cursor: pointer; }
        .option-content label { cursor: pointer; font-size: 16px; font-weight: 500; }
        
        .results-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            margin-top: 30px;
        }
        
        .results-section h3 { margin-bottom: 25px; }
        
        .result-item { margin-bottom: 25px; }
        .result-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .progress-bar {
            height: 25px;
            background: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-fill {
            height: 100%;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }
        
        .admin-container { max-width: 900px; margin: 40px auto; }
        .admin-actions { margin: 30px 0; }
        
        .form-section {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .form-group { margin-bottom: 20px; }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .form-group input[type="text"],
        .form-group textarea,
        .form-group input[type="datetime-local"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .option-input {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .polls-list { margin-top: 40px; }
        
        .admin-poll-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            border: 1px solid #e0e0e0;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 8px;
        }
        
        .poll-info h4 { margin: 0 0 10px 0; }
        .poll-info p { margin: 0; color: #666; font-size: 14px; }
        
        .poll-actions { display: flex; gap: 10px; }
        
        .footer {
            background: var(--dark);
            color: white;
            text-align: center;
            padding: 30px 0;
            margin-top: 40px;
        }
        
        .error-page {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
        }
        
        .error-content h1 { font-size: 120px; font-weight: 700; color: var(--primary); margin: 0; }
        .error-content h2 { font-size: 36px; margin: 10px 0 20px 0; }
        .error-content p { font-size: 18px; color: #666; margin-bottom: 30px; }
        
        @media (max-width: 768px) {
            .hero h2 { font-size: 36px; }
            .nav-links { gap: 15px; }
            .polls-grid { grid-template-columns: 1fr; }
            .poll-header { flex-direction: column; }
            .option-item { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="navbar-content">
                <div class="logo">
                    <h1>🗳️ VoteHub</h1>
                </div>
                <ul class="nav-links">
                    <li><a href="/">Polls</a></li>
                    <li><a href="/admin">Admin</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <main>
        <div class="container">
            {% block content %}{% endblock %}
        </div>
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 VoteHub - Online Voting System</p>
    </footer>
    
    <script>
        async function apiCall(url, options = {}) {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            return response.json();
        }
    </script>
    {% block scripts %}{% endblock %}
</body>
</html>
"""

HOME_HTML = """
{% extends base_html %}

{% block title %}Home - VoteHub{% endblock %}

{% block content %}
<div class="content">
    <div class="hero">
        <h2>Welcome to VoteHub</h2>
        <p>Your voice matters. Cast your vote now!</p>
    </div>
    
    <div class="polls-grid">
        {% if polls %}
            {% for poll in polls %}
                <div class="poll-card">
                    <div class="poll-header">
                        <h3>{{ poll.title }}</h3>
                        <span class="poll-status">Active</span>
                    </div>
                    {% if poll.description %}
                        <p class="poll-desc">{{ poll.description }}</p>
                    {% endif %}
                    <div class="poll-stats">
                        <div class="stat-item"><strong>{{ poll.options|length }}</strong> Options</div>
                        <div class="stat-item"><strong>{{ poll.options|map(attribute='votes')|map('length')|sum }}</strong> Votes</div>
                    </div>
                    <a href="/poll/{{ poll.id }}" class="btn btn-primary">Vote Now →</a>
                </div>
            {% endfor %}
        {% else %}
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 40px; color: #666;">
                <h3>No polls yet</h3>
                <p>Create one in the admin panel!</p>
            </div>
        {% endif %}
    </div>
</div>
{% endblock %}
"""

POLL_HTML = """
{% extends base_html %}

{% block title %}Vote - {{ poll.title }}{% endblock %}

{% block content %}
<div class="content">
    <div class="poll-container">
        <h2>{{ poll.title }}</h2>
        {% if poll.description %}<p style="color: #666; margin-bottom: 20px;">{{ poll.description }}</p>{% endif %}
        
        <div class="voting-section">
            <div id="options">
                {% for option in poll.options %}
                    <div class="option-item">
                        <div class="option-content">
                            <input type="radio" name="vote" id="opt{{ option.id }}" value="{{ option.id }}">
                            <label for="opt{{ option.id }}">{{ option.text }}</label>
                        </div>
                        <div>{{ option.votes }} votes</div>
                    </div>
                {% endfor %}
            </div>
            <button class="btn btn-primary" onclick="vote()">Cast Your Vote</button>
        </div>
        
        <div class="results-section">
            <h3>Live Results</h3>
            <div id="results"></div>
        </div>
    </div>
</div>

{% endblock %}

{% block scripts %}
<script>
function vote() {
    const sel = document.querySelector('input[name="vote"]:checked');
    if (!sel) { alert('Select an option'); return; }
    
    fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: parseInt(sel.value) })
    })
    .then(r => {
        if (r.ok) {
            alert('Vote recorded!');
            loadResults();
            document.querySelector('.btn-primary').disabled = true;
            document.querySelector('.btn-primary').textContent = 'Vote Submitted';
        } else return r.json().then(d => alert('Error: ' + d.error));
    })
    .catch(e => console.error(e));
}

function loadResults() {
    fetch('/api/results/{{ poll.id }}')
    .then(r => r.json())
    .then(data => {
        const html = data.options.map(o => {
            const pct = o.percentage.toFixed(1);
            return `
                <div class="result-item">
                    <div class="result-header">
                        <span>${o.text}</span>
                        <span>${pct}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${pct}%; background-color: ${o.color}"></div>
                    </div>
                    <div style="font-size: 13px; color: #666;">${o.votes} votes</div>
                </div>
            `;
        }).join('');
        document.getElementById('results').innerHTML = html;
    });
}

document.addEventListener('DOMContentLoaded', loadResults);
setInterval(loadResults, 2000);
</script>
{% endblock %}
"""

ADMIN_HTML = """
{% extends base_html %}

{% block title %}Admin - VoteHub{% endblock %}

{% block content %}
<div class="content">
    <div class="admin-container">
        <h2>Admin Dashboard</h2>
        <div class="admin-actions">
            <button class="btn btn-success" onclick="showForm()">+ Create Poll</button>
        </div>
        
        <div id="form" class="form-section" style="display:none;">
            <h3>Create Poll</h3>
            <form onsubmit="createPoll(event)">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" id="title" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="desc"></textarea>
                </div>
                <div class="form-group">
                    <label>Options *</label>
                    <div id="opts">
                        <input class="option-input" required placeholder="Option 1">
                        <input class="option-input" required placeholder="Option 2">
                    </div>
                    <button type="button" class="btn btn-secondary" onclick="addOpt()">+ Add</button>
                </div>
                <button type="submit" class="btn btn-primary">Create</button>
                <button type="button" class="btn btn-secondary" onclick="hideForm()">Cancel</button>
            </form>
        </div>
        
        <div class="polls-list">
            <h3>All Polls</h3>
            {% if polls %}
                {% for p in polls %}
                    <div class="admin-poll-item">
                        <div class="poll-info">
                            <h4>{{ p.title }}</h4>
                            <p>{{ p.options|length }} options | {{ p.options|map(attribute='votes')|map('length')|sum }} votes</p>
                        </div>
                        <div class="poll-actions">
                            <a href="/poll/{{ p.id }}" class="btn btn-info">View</a>
                            <button class="btn btn-danger" onclick="delPoll({{ p.id }})">Delete</button>
                        </div>
                    </div>
                {% endfor %}
            {% else %}
                <p style="text-align: center; color: #999; padding: 40px;">No polls</p>
            {% endif %}
        </div>
    </div>
</div>
{% endblock %}

{% block scripts %}
<script>
function showForm() { document.getElementById('form').style.display = 'block'; }
function hideForm() { document.getElementById('form').style.display = 'none'; }
function addOpt() {
    const i = document.createElement('input');
    i.className = 'option-input';
    i.placeholder = `Option ${document.querySelectorAll('.option-input').length + 1}`;
    document.getElementById('opts').appendChild(i);
}

function createPoll(e) {
    e.preventDefault();
    const opts = Array.from(document.querySelectorAll('.option-input')).map(x => x.value).filter(x => x);
    if (opts.length < 2) { alert('Need 2+ options'); return; }
    
    fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: document.getElementById('title').value,
            description: document.getElementById('desc').value,
            options: opts
        })
    }).then(r => {
        if (r.ok) { alert('Created!'); location.reload(); }
        else alert('Error');
    });
}

function delPoll(id) {
    if (!confirm('Delete?')) return;
    fetch(`/api/admin/polls/${id}`, { method: 'DELETE' })
    .then(r => { if (r.ok) location.reload(); });
}
</script>
{% endblock %}
"""

ERROR_HTML = """
{% extends base_html %}

{% block title %}Error{% endblock %}

{% block content %}
<div class="content">
    <div class="error-page">
        <div class="error-content">
            <h1>{{ code }}</h1>
            <h2>{{ msg }}</h2>
            <p>{{ desc }}</p>
            <a href="/" class="btn btn-primary" style="width: auto;">Back to Home</a>
        </div>
    </div>
</div>
{% endblock %}
"""

# ============================================================================
# TEMPLATE LOADER SETUP
# ============================================================================
from jinja2 import ChoiceLoader, DictLoader
app.jinja_loader = ChoiceLoader([
    DictLoader({'base.html': BASE_HTML}),
    app.jinja_loader
])
# ============================================================================
# ROUTES
# ============================================================================

def get_ip():
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ.get('HTTP_X_FORWARDED_FOR').split(',')[0]
    return request.remote_addr

@app.route('/')
def index():
    polls = Poll.query.filter_by(is_active=True).all()
    return render_template_string(HOME_HTML, polls=polls, base_html='base.html')

@app.route('/poll/<int:pid>')
def poll(pid):
    p = Poll.query.get_or_404(pid)
    return render_template_string(POLL_HTML, poll=p, base_html='base.html')

@app.route('/admin')
def admin():
    polls = Poll.query.all()
    return render_template_string(ADMIN_HTML, polls=polls, base_html='base.html')

# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/api/polls', methods=['GET', 'POST'])
def api_polls():
    if request.method == 'POST':
        data = request.get_json()
        if not data.get('title') or not data.get('options'):
            return jsonify({'error': 'Need title and options'}), 400
        
        p = Poll(title=data['title'], description=data.get('description', ''))
        db.session.add(p)
        db.session.flush()
        
        for opt in data['options']:
            db.session.add(Option(poll_id=p.id, text=opt))
        
        db.session.commit()
        return jsonify({'id': p.id}), 201
    
    return jsonify([p.to_dict() for p in Poll.query.filter_by(is_active=True).all()])

@app.route('/api/vote', methods=['POST'])
def api_vote():
    data = request.get_json()
    if not data.get('option_id'):
        return jsonify({'error': 'Need option_id'}), 400
    
    opt = Option.query.get_or_404(data['option_id'])
    p = Poll.query.get(opt.poll_id)
    ip = get_ip()
    
    if Vote.query.join(Option).filter(Option.poll_id == p.id, Vote.voter_ip == ip).first():
        return jsonify({'error': 'Already voted'}), 400
    
    db.session.add(Vote(option_id=opt.id, voter_ip=ip))
    db.session.commit()
    return jsonify({'msg': 'Voted!'}), 201

@app.route('/api/results/<int:pid>')
def api_results(pid):
    p = Poll.query.get_or_404(pid)
    total = sum(o.get_vote_count() for o in p.options)
    
    return jsonify({
        'poll_id': p.id,
        'title': p.title,
        'total_votes': total,
        'options': [{
            'id': o.id,
            'text': o.text,
            'color': o.color,
            'votes': o.get_vote_count(),
            'percentage': (o.get_vote_count() / total * 100) if total > 0 else 0
        } for o in p.options]
    })

@app.route('/api/admin/polls/<int:pid>', methods=['DELETE'])
def api_delete(pid):
    p = Poll.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'msg': 'Deleted'}), 200

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def err404(e):
    return render_template_string(ERROR_HTML, code='404', msg='Not Found', 
                                  desc='Page not found', base_html='base.html'), 404

@app.errorhandler(500)
def err500(e):
    db.session.rollback()
    return render_template_string(ERROR_HTML, code='500', msg='Server Error', 
                                  desc='Something went wrong', base_html='base.html'), 500

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("\n" + "="*70)
        print("VOTEHUB - ONLINE VOTING SYSTEM")
        print("="*70)
        print("Database initialized")
        print("Starting Flask server...")
        print("Visit: http://localhost:5000")
        print("Admin: http://localhost:5000/admin")
        print("Press Ctrl+C to stop")
        print("="*70 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)