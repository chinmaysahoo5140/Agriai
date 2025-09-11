from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import random
import string

# Initialize app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    aadhaar = db.Column(db.String(12), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(200), nullable=False)  # hashed password

# Create DB
with app.app_context():
    db.create_all()

# Aadhaar validation (dummy: only checks length & digits)
def validate_aadhaar(aadhaar):
    return aadhaar.isdigit() and len(aadhaar) == 12

# In-memory stores for demo OTP / pending registrations
OTP_STORE = {}         # aadhaar -> otp
PENDING_REG = {}       # aadhaar -> { name, phone }

# Signup API
from flask import render_template

@app.route('/')
def home():
    return render_template('signup.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    # Expecting OTP verification flow: { aadhaarNumber, otp }
    aadhaar = data.get('aadhaarNumber') or data.get('aadhaar')
    otp = data.get('otp')

    if not validate_aadhaar(aadhaar):
        return jsonify({"error": "Invalid Aadhaar number"}), 400

    if User.query.filter_by(aadhaar=aadhaar).first():
        return jsonify({"error": "User already exists"}), 400

    pending = PENDING_REG.get(aadhaar)
    if not pending:
        return jsonify({"error": "No pending registration found. Please request OTP first."}), 400

    expected = OTP_STORE.get(aadhaar)
    if not expected or str(expected) != str(otp):
        return jsonify({"error": "Invalid or expired OTP"}), 400

    # Create user (password auto-generated for demo)
    name = pending.get('name')
    random_pw = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
    hashed_pw = generate_password_hash(random_pw, method='sha256')
    new_user = User(aadhaar=aadhaar, name=name or 'User', password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    # cleanup
    OTP_STORE.pop(aadhaar, None)
    PENDING_REG.pop(aadhaar, None)

    return jsonify({"message": "Signup successful", "generatedPassword": random_pw}), 201


@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json or {}
    name = data.get('fullName') or data.get('name')
    aadhaar = data.get('aadhaarNumber') or data.get('aadhaar')
    phone = data.get('phoneNumber') or data.get('phone')

    if not validate_aadhaar(aadhaar):
        return jsonify({"error": "Invalid Aadhaar number"}), 400

    if User.query.filter_by(aadhaar=aadhaar).first():
        return jsonify({"error": "User already exists"}), 400

    # generate 6-digit OTP
    otp = random.randint(100000, 999999)
    OTP_STORE[aadhaar] = otp
    PENDING_REG[aadhaar] = { 'name': name, 'phone': phone }

    # In a real app you'd send SMS. For local testing we return the OTP in the response.
    return jsonify({"message": "OTP generated", "otp": otp}), 200

# Login API
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    aadhaar = data.get('aadhaar')
    password = data.get('password')

    user = User.query.filter_by(aadhaar=aadhaar).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": f"Welcome {user.name}!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
