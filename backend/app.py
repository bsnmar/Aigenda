# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

# Initialize the app and database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
CORS(app)

db = SQLAlchemy(app)

# Area model
class Area(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    projects = db.relationship('Project', backref='area', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f"<{self.title}>"

# Project model
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    area_id = db.Column(db.Integer, db.ForeignKey('area.id'), nullable=True)
    tasks = db.relationship('Task', backref='project', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f"<{self.title}>"

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(50), nullable=True)
    priority = db.Column(db.String(10), default='Medium')
    due_date = db.Column(db.DateTime, nullable=True)
    tags = db.Column(db.String(200), nullable=True)
    created = db.Column(db.DateTime, default=datetime.now)
    updated = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    subtasks = db.relationship('Subtask', backref='task', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f"<{self.title}>"
    
class Subtask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<{self.title}>"


# Create the database tables
with app.app_context():
    db.create_all()

#--------------------------
#      AREA ROUTES
#--------------------------

# Create a new area (CREATE - POST) 
@app.route('/areas', methods=['POST'])
def add_area():
    data = request.get_json()
    new_area = Area(name=data['name'])
    db.session.add(new_area)
    db.session.commit()
    return jsonify({"message":"Area created!"}), 201

# Get all areas (READ - GET)
@app.route('/areas', methods=['GET'])
def get_areas():
    areas = Area.query.all()
    return jsonify([{"id": area.id, "name": area.name} for area in areas]), 200

# Get a specific area (READ - GET)
@app.route('/areas/<id>', methods=['GET'])
def get_area(id):
    area = Area.query.get_or_404(id)
    return jsonify({"id": area.id, "name": area.name}), 200

# Update an area (UPDATE - PUT)
@app.route('/areas/<id>', methods=['PUT'])
def update_area(id):
    area = Area.query.get_or_404(id)
    data = request.get_json()
    area.name = data.get('name', area.name)
    db.session.commit()
    return jsonify({"message": "Area updated!"})

# Delete an area (DELETE - DELETE)
@app.route('/areas/<id>', methods=['DELETE'])
def delete_area(id):
    area = Area.query.get_or_404(id)
    db.session.delete(area)
    db.session.commit()
    return jsonify({"message": "Area deleted!"})

# -------------------------
#      PROJECT ROUTES
# -------------------------

# Create a new project (CREATE - POST)
@app.route('/projects', methods=['POST'])
def add_project():
    data = request.get_json()
    new_project = Project(name=data['name'], area_id=data.get('area_id'))
    db.session.add(new_project)
    db.session.commit()
    return jsonify({"message": "Project created!"}), 201

# Get all projects (READ - GET)
@app.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    project_data = []

    for project in projects:
        # Count the total number of tasks for this project
        total_tasks = Task.query.filter_by(project_id=project.id).count()
        # Count the number of completed tasks
        completed_tasks = Task.query.filter_by(project_id=project.id, completed=True).count()

        # Calculate the completion percentage
        if total_tasks > 0:
            completion_percentage = (completed_tasks / total_tasks) * 100
        else:
            completion_percentage = 100  # No tasks, 0% complete

        # Add project data with completion percentage to the response
        project_data.append({
            "id": project.id,
            "name": project.name,
            "area_id": project.area_id,
            "completion": completion_percentage
        })

    return jsonify(project_data), 200

# Get projects for a specific area (READ - GET)
@app.route('/areas/<int:area_id>/projects', methods=['GET'])
def get_projects_by_area(area_id):
    projects = Project.query.filter_by(area_id=area_id).all()
    return jsonify([{"id": p.id, "name": p.name} for p in projects]), 200

# Get a specific project (READ - GET)
@app.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = Project.query.get_or_404(id)
    return jsonify({"id": project.id, "name": project.name, "area_id": project.area_id}), 200

# Update a project (UPDATE - PUT)
@app.route('/projects/<int:id>', methods=['PUT'])
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    project.name = data.get('name', project.name)
    project.area_id = data.get('area_id', project.area_id)
    db.session.commit()
    return jsonify({"message": "Project updated!"})

# Delete a project (DELETE - DELETE)
@app.route('/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted!"})

#--------------------------
#       TASK ROUTES
#--------------------------

# Create new task (CREATE - POST)
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    category = data.get('category')
    if not data.get('project_id') and not category:
        category = "Inbox"

    new_task = Task(title=data['title'], description=data.get('description', ''), project_id=data.get('project_id'), category = category)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added!"}), 201

# View all tasks (READ - GET)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_list = [{"id": task.id, "title": task.title, "description": task.description,"priority": task.priority, "due_date":task.due_date, "tags":task.tags, "completed": task.completed, "created": task.created, "updated": task.updated, "subtask": task.subtasks, "category": task.category} for task in tasks]
    return jsonify(tasks_list), 200

# Get specific task
@app.route('/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    task_return = ({"id": task.id, "title": task.title, "description": task.description,"priority": task.priority, "due_date":task.due_date, "tags":task.tags, "completed": task.completed, "created": task.created, "updated": task.updated, "subtask": task.subtask})
    return jsonify(task_return)

# Get all tasks for a specific project
@app.route('/projects/<int:project_id>/tasks', methods=['GET'])
def get_tasks_by_project(project_id):
    tasks = Task.query.filter_by(project_id=project_id).all()
    tasks_list = [{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "due_date": task.due_date,
        "tags": task.tags,
        "completed": task.completed,
        "created": task.created,
        "updated": task.updated,
        "subtasks": task.subtasks
    } for task in tasks]
    return jsonify(tasks_list), 200

# Update task
@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if task:
        data = request.get_json()
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.completed = data.get('completed', task.completed)
        task.project_id = data.get('project_id', task.project_id)
        db.session.commit()
        return jsonify({"message": "Task updated!"})
    return jsonify({"message": "Task not found!"}), 404

# Update task status to completed (UPDATE - PUT)
@app.route('/tasks/<int:id>/complete', methods=['PUT'])
def complete_task(id):
    task = Task.query.get(id)
    if task:
        task.completed = True  # Set the task's status to completed
        db.session.commit()
        return jsonify({"message": "Task marked as completed!"}), 200
    return jsonify({"message": "Task not found!"}), 404

# Update task status to completed (UPDATE - PUT)
@app.route('/tasks/<int:id>/not_complete', methods=['PUT'])
def not_complete_task(id):
    task = Task.query.get(id)
    if task:
        task.completed = False  # Set the task's status to completed
        db.session.commit()
        return jsonify({"message": "Task marked as not completed!"}), 200
    return jsonify({"message": "Task not found!"}), 404

# Delete task
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted!"})
    return jsonify({"message": "Task not found!"}), 404

#--------------------------
#     SUBTASK ROUTES
#--------------------------

# Create a subtask (CREATE - POST)
@app.route('/tasks/<task_id>/subtasks', methods=['POST'])
def add_subtask(task_id):
    task = Task.query.get(task_id)
    data = request.get_json()
    new_subtask = Subtask(title=data['title'], task_id=task.id, completed=data.get('completed', False))
    db.session.add(new_subtask)
    db.session.commit()
    return jsonify({"message": "Subtask added"}), 201

# Get subtasks for a task (READ - GET)
@app.route('/tasks/<task_id>/subtasks', methods=['GET'])
def get_subtasks(task_id):
    task = Task.query.get_or_404(task_id)
    subtasks = Subtask.query.filter_by(task_id=task.id).all()
    subtasks_list = [{"id": sub.id, "title": sub.title, "completed": sub.completed} for sub in subtasks]
    return jsonify(subtasks_list), 200

# Update subtasks (UPDATE - POST)
@app.route('/subtasks/<subtask_id>', methods=['POST'])
def update_subtask(subtask_id):
    subtask = Subtask.query.get(subtask_id)
    if subtask:
        data = request.get_json()
        subtask.title = data.get('title', subtask.title)
        subtask.completed = data.get('completed', subtask.completed)
        db.session.commit()
        return jsonify({"message":"Subtask updated!"}), 200
    return jsonify({"message":"Subtask not found!"}), 404

# Delete subtasks (DELETE - DELETE)
@app.route('/subtask/<subtask_id>', methods=['DELETE'])
def delete_subtask(subtask_id):
    subtask = Subtask.query.get(subtask_id)
    if subtask:
        db.session.delete(subtask)
        db.session.commit()
        return jsonify({"message": "Subtask deleted!"})
    return jsonify({"message": "Subtask not found!"}), 404

# Run app
if __name__ == "__main__":
    app.run(debug=True)
